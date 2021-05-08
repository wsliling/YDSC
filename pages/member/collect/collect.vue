<template>
	<!-- 我的收藏 -->
	<view class="collect">
		<view class="head" :style="{ 'padding-top': barHeight + 'px' }">
			<view class="tab_head flex-between">
				<!-- #ifndef MP-WEIXIN -->
				<view class="head_l" @click="toback"><text class="uni-icon uni-icon-arrowleft"></text></view>
				<view class="mine">我的收藏</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view></view>
				<view></view>
				<!-- #endif -->
				<view class="redact" v-if="tabIndex == 0" @click="ShowDel">{{ isShowDel ? '完成' : '管理' }}</view>
				<view class="redact" v-else style="width: 40px;"></view>
			</view>
			<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x>
				<view
					style="width: 50%;"
					v-for="(tab, index) in tabnav"
					:key="index"
					:class="['item', tabIndex == index ? 'active' : '']"
					:id="'tabNum' + index"
					:data-current="index"
					@click="tapTab(index, tab.Id)"
				>
					{{ tab.TypeName }}
				</view>
				<view class="bb_line" :style="'left:' + tabStyle + 'rpx'"></view>
			</scroll-view>
		</view>
		<view :style="{ height: 85 + barHeight + 'px' }"></view>

		<view class="bb_pt uni-bg-white" v-if="tabIndex == 0 && hasData">
			<view class="listbox" v-for="(item, index) in datalist" :key="index">
				<view class="choose" v-if="isShowDel" @click.stop="shiftChecked(index)"><view class="IconsCK IconsCK-radio" :class="{ checked: item.checked }"></view></view>
				<view class="drawing flex with-100" @click.stop="tolink('/pages/goods/productDetail/productDetail?proId=' + item.ProId, item.Status)">
					<view class="p_re">
						<text class="dis" v-if="item.Status != 0">已失效</text>
						<image class="imgs" :src="item.PicNo || 'http://via.placeholder.com/800x800'" mode="aspectFill"></image>
					</view>
					<view class="brace">
						<view class="being uni-ellipsis2">{{ item.Name }}</view>
						<view class="fz12 c_999" v-if="item.SalesVolume">{{ item.SalesVolume }}人购买</view>
						<view class="correct">
							<span class="spanl">¥</span>
							{{ item.Price }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="followList" v-if="tabIndex == 1 && hasData">
			<block v-for="(item, index) in datalist" :key="index">
				<!-- <view class="followItem" @click="tolink('/pages/goods/storeIndex/storeIndex?id=' + item.ShopId, item.Status)">
					<view class="itemLeft">
						<image :src="item.Logo"></image>
						<view class="name">
							<view>{{ item.Name }}</view>
							<text>粉丝{{ item.FollowNum }}</text>
						</view>
					</view>
					<view :class="['flowbtn', item.IsCollect ? 'ed' : '']" @click.stop="flowFn(index, item.ShopId, item.IsCollect)">{{ item.IsCollect ? '已关注' : '关注' }}</view>
				</view> -->
				<view class="list" @click="tolinkClassDetails('/pages/course/classDetails/classDetails?detailId=' + item.Id)">
					<view class="leftImg"><image class="img" :src="item.PicImg"></image></view>
					<view class="rightContent">
						<view class="titledetail">{{ item.Name }}</view>
						<view class="time">{{ item.Difficulty }}.{{ item.Target }}</view>
						<view class="userinfo">
							<view class="user">
								<view class="header"><image class="headerImg" :src="item.StoreLogo || 'http://yd.wtanvxin.com/static/default.png'"></image></view>
								<view class="name">{{ item.StoreNick }}</view>
							</view>
							<view class="price">￥{{ item.Price }}</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		<view class="lect" v-if="isShowDel">
			<view class="lects" @click="cancelDel()"><view class="IconsCK IconsCK-radio" :class="{ checked }"></view></view>
			<view class="cancel">
				<view class="cover">全选</view>
				<view class="covers" @click="btnDel">删除</view>
			</view>
		</view>
		<noData :isShow="noDataIsShow"></noData>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType" v-if="noDataIsShow == false"></uni-load-more></view>
	</view>
</template>

<script>
import { post, get } from '@/common/util.js';
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
import noData from '@/components/noData.vue'; //暂无数据
export default {
	data() {
		return {
			barHeight: 0,
			isShowDel: false, //编辑完成
			userId: '',
			token: '',
			tabIndex: 0,
			tabnav: [
				{
					Id: 0,
					TypeName: '商品'
				},
				{
					Id: 3,
					TypeName: '课程'
				}
			],
			page: 1,
			pageSize: 10,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			datalist: [], //列表
			datalength: 0,
			Ids: [], //保存要删除数据
			checked: false,
			Type: 0 //0-产品  1-商家 3-课程
		};
	},
	components: {
		uniLoadMore,
		noData
	},
	computed: {
		tabStyle() {
			return (750 / this.tabnav.length) * this.tabIndex + (750 / this.tabnav.length - 68) / 2;
		}
	},
	onLoad() {
		// #ifdef APP-PLUS
		var height = plus.navigator.getStatusbarHeight();
		this.barHeight = height;
		// #endif
		// #ifdef H5
		this.barHeight = 0;
		// #endif
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.workeslist();
	},
	methods: {
		//跳转
		tolink(url, dis) {
			if (dis != 0) {
				uni.showToast({
					title: '该商品或课程已失效！',
					icon: 'none'
				});
			} else {
				uni.navigateTo({
					url: url
				});
			}
		},
		tolinkClassDetails(url) {
			uni.navigateTo({
				url: url
			});
		},
		toback() {
			uni.switchTab({
				url: '/pages/tabBar/my/my'
			});
		},
		//点击编辑 完成
		ShowDel() {
			this.isShowDel = !this.isShowDel;
		},
		//点击tab-bar
		tapTab(index, id) {
			if (this.tabIndex === index) {
				return false;
			} else {
				this.tabIndex = index;
				this.Type = id;
				this.page = 1;
				this.datalist = [];
				this.workeslist();
			}
		},
		// 全选
		cancelDel() {
			this.checked = !this.checked;
			if (this.checked) {
				this.datalist.forEach(function(item) {
					item.checked = true;
				});
			} else {
				this.datalist.forEach(function(item) {
					item.checked = false;
				});
			}
		},
		//选择
		shiftChecked(key) {
			console.log(key, 'key');
			this.datalist[key].checked = !this.datalist[key].checked;
			let _this = this;
			let sum = 0;
			_this.datalist.forEach(function(item) {
				if (item.checked !== _this.checked) {
					sum += 1;
				}
			});
			if (sum == this.datalist.length) {
				_this.checked = this.datalist[0].checked;
			} else {
				_this.checked = false;
			}
		},
		/*获取列表*/
		async workeslist() {
			let result = await post('User/MemberCollections', {
				UserId: this.userId,
				Token: this.token,
				Page: this.page,
				pageSize: this.pageSize,
				Type: this.Type
			});
			if (result.code === 0) {
				let _this = this;
				if (result.data.length > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
					result.data.forEach(function(item) {
						if (_this.Type == 0) {
							_this.$set(item, 'txt', '');
							_this.$set(item, 'checked', false);
						} else if (_this.Type == 1) {
							_this.$set(item, 'IsCollect', 1);
						}
					});
				}
				if (result.data.length == 0 && this.page == 1) {
					this.noDataIsShow = true;
					this.hasData = false;
				}
				if (this.page === 1) {
					this.datalist = result.data;
				}
				if (this.page > 1) {
					this.datalist = this.datalist.concat(result.data);
				}
				if (result.data.length < this.pageSize) {
					this.isLoad = false;
					this.loadingType = 2;
				} else {
					this.isLoad = true;
					this.loadingType = 0;
				}
				this.datalength = this.datalist.length;
			}
		},
		// 删除
		btnDel() {
			let _this = this;
			this.datalist.forEach(function(item) {
				if (item.checked == true) {
					_this.Ids.push(item.Id);
				}
				console.log(_this.Ids, '_this.Ids');
			});
			if (this.Ids.length > 0) {
				//#ifndef APP-PLUS
				uni.showModal({
					content: '您确定要删除所选项吗？',
					confirmColor: '#FF3333',
					success: function(res) {
						if (res.confirm) {
							_this.DeleteMyFootprint();
						} else if (res.cancel) {
						}
					}
				});
				//#endif
				//#ifdef APP-PLUS
				this.$showModal({
					content: '您确定要删除所选项吗？'
				})
					.then(res => {
						_this.DeleteMyFootprint();
						//确认
					})
					.catch(res => {
						//取消
					});
				//#endif
			} else {
				uni.showToast({
					title: '请选择需要删除的项！',
					icon: 'none',
					duration: 1500
				});
			}
		},
		async DeleteMyFootprint() {
			let result = await post('User/DelCollections', {
				UserId: this.userId,
				Token: this.token,
				IdArr: this.Ids.join(',')
			});
			if (result.code === 0) {
				let _this = this;
				for (let j = 0; j < _this.Ids.length; j++) {
					for (let i = 0; i < _this.datalength; i++) {
						if (_this.datalist[i]) {
							if (_this.Ids[j] == _this.datalist[i].Id) {
								_this.datalist.splice(i, 1);
							}
						}
					}
				}
				_this.datalength = _this.datalist.length;
				_this.Ids = [];
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 2000
				});
			} else {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 2000
				});
			}
		},
		//关注、取消
		async flowFn(index, shopId, IsCollect) {
			let objUrl = '';
			if (IsCollect) {
				objUrl = 'User/ReCollections';
			} else {
				objUrl = 'User/AddCollections';
			}
			let result = await post(objUrl, {
				ShopId: shopId,
				userId: this.userId,
				token: this.token,
				Type: 1
			});
			if (result.code == 0) {
				let _this = this;
				if (IsCollect) {
					uni.showToast({
						title: '已取消关注！',
						icon: 'none',
						duration: 1500
					});
					_this.$set(_this.datalist[index], 'IsCollect', 0);
				} else {
					uni.showToast({
						title: '添加关注成功！',
						icon: 'none',
						duration: 1500
					});
					_this.$set(_this.datalist[index], 'IsCollect', 1);
				}
			}
		}
	},
	// 上拉加载
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.page++;
			this.workeslist();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style scoped lang="scss">
.collect {
	background-color: white;
	height: 100vh;
	.head {
		.tab_head {
			height: 44px;
		}
		.head_l {
			.uni-icon {
				font-size: 26px;
				margin: 0 5px;
			}
		}
		.mine {
			font-size: 16px;
			font-family: PingFang;
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
		}
		.redact {
			font-size: 14px;
			font-family: PingFang;
			font-weight: 500;
			color: #999;
			padding-right: 12px;
		}
	}
	.index-swiper-tab {
		padding-bottom: 1px;
		.item {
			font-size: 32upx;
		}
		.item.active {
			font-size: 32upx;
			color: #fa6008;
			border-bottom: 1px solid #fa6008;
		}
	}
	.uni-bg-white {
		.listbox {
			padding: 30upx;
			display: flex;
			border-bottom: 1upx solid #f5f5f5;
			.choose {
				width: 70upx;
				display: flex;
				align-items: center;
			}
			.with-100 {
				width: 100%;
			}
			.imgs {
				width: 180upx;
				height: 180upx;
				display: block;
				border-radius: 10upx;
				background: #eee;
			}
			.dis {
				color: #fff;
				background: #c9c9c9;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 2;
				font-size: 24upx;
				padding: 4upx 10upx;
			}
			.brace {
				font-family: PingFang;
				font-weight: 500;
				padding-left: 20upx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				width: 80%;
			}
			.being {
				line-height: 1.4;
			}
			.correct {
				font-size: 30upx;
				color: $primary;
			}
			.spanl {
				font-size: 20upx;
				color: $primary;
			}
			.spanr {
				font-size: 22upx;
				text-decoration: line-through;
				color: #999;
			}
		}
	}

	.lect {
		height: 120upx;
		width: 100%;
		background: #f5f5f5;
		position: fixed;
		color: #999;
		bottom: 0;
		display: flex;
		padding-left: 30upx;
		.lects {
			display: flex;
			align-items: center;
		}
		.cancel {
			display: flex;
			align-items: center;
			width: 100%;
			.cover {
				width: 70%;
				height: 100upx;
				display: flex;
				align-items: center;
				font-size: 30upx;
				color: #999;
			}
			.covers {
				width: 30%;
				margin-right: 30upx;
				height: 80upx;
				line-height: 80upx;
				border-radius: 70upx;
				background: $primary;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 32upx;
				color: #fff;
			}
		}
	}
	.followList {
		background-color: #fff;
		padding: 0 20rpx;
		// 列表
		.list {
			border-bottom: solid 2upx #f5f5f5;
			display: flex;
			background-color: #ffffff;
			padding: 30upx 0;
			margin: 0 20upx;
			&:last-child {
				border-bottom: 0;
			}
			.leftImg {
				width: 246upx;
				height: 152upx;
				border-radius: 8upx;
				overflow: hidden;
				margin-right: 10upx;
				.img {
					width: 100%;
					height: 100%;
				}
			}
			.rightContent {
				.titledetail {
					font-size: 30upx;
					font-weight: 500;
					color: #333333;
					width: 444upx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.time {
					font-size: 26upx;
					font-weight: 500;
					color: #999999;
				}
				.userinfo {
					display: flex;
					justify-content: space-between;
					.user {
						display: flex;
						.header {
							width: 40upx;
							height: 40upx;
							border-radius: 50%;
							overflow: hidden;
							margin-right: 18upx;
							.headerImg {
								width: 100%;
								height: 100%;
							}
						}
						.name {
							font-size: 22upx;
							color: #999999;
						}
					}
					.price {
						color: #fa6008;
						font-size: 24upx;
					}
				}
			}
		}
		// .followItem {
		// 	height: 150rpx;
		// 	display: flex;
		// 	align-items: center;
		// 	justify-content: space-between;
		// 	border-bottom: 1rpx solid #ececec;
		// 	.itemLeft {
		// 		display: flex;
		// 		align-items: center;
		// 		image {
		// 			width: 88rpx;
		// 			height: 88rpx;
		// 			border-radius: 100%;
		// 			border: 1rpx solid #ececec;
		// 			margin-right: 20rpx;
		// 		}
		// 		.name {
		// 			font-size: 32rpx;
		// 		}
		// 		text {
		// 			font-size: 24rpx;
		// 			color: #999;
		// 		}
		// 	}
		// 	.flowbtn {
		// 		color: #fff;
		// 		background: $primary;
		// 		border-radius: 100px;
		// 		width: 128upx;
		// 		height: 52upx;
		// 		line-height: 1;
		// 		display: flex;
		// 		flex-direction: column;
		// 		align-items: center;
		// 		justify-content: center;
		// 		font-size: 26upx;
		// 		&.ed {
		// 			color: #999;
		// 			background: #f6f7fb;
		// 		}
		// 	}
		// }
	}
}
</style>
