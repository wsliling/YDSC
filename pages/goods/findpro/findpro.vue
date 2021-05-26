<template>
	<view style="overflow: hidden;">
		<!-- 导航 -->
		<view class="classifytab" v-if="keyword == ''">
			<scroll-view id="tab-bar" v-if="!isshowAll" class="index-swiper-tab" scroll-x :scroll-left="scrollLeft">
				<view
					v-for="(tab, index) in categoryList"
					:key="index"
					:class="['item', tabIndex == index ? 'active' : '']"
					:id="'tabNum' + index"
					:data-current="index"
					@click="tapTab(index, tab.Id)"
					style="width: auto; padding: 0 20upx;"
				>
					{{ tab.Name }}
				</view>
			</scroll-view>
			<view :class="['flex-column menuIco', isshowAll ? 'widter' : '']" id="allbtn" @click="isshowAll = !isshowAll">
				<block v-if="!isshowAll">
					<view class="line1"></view>
					<view class="line2"></view>
					<view class="line3"></view>
				</block>
				<text v-if="isshowAll" class="iconfont icon-close"></text>
			</view>
			<view class="showClassify" v-if="isshowAll">
				<view class="allhd">全部分类</view>
				<view v-for="(tab, index) in categoryList" :key="index" :class="['btn', tabIndex == index ? 'active' : '']" @click="tapTab(index, tab.Id)">{{ tab.Name }}</view>
			</view>
		</view>
		<view style="height: 80upx;" v-if="keyword == ''"></view>
		<view class="p_re">
			<view class="boxradius"></view>
			<view class="pp3" style="position: relative; z-index: 2;">
				<view class="product-list-level uni-bg-white b_radius" v-if="hasData">
					<block v-for="(item, index) in prolist" :key="index">
						<view class="outside" @click="tolink('/pages/goods/productDetail/productDetail?proId=' + item.Id)">
							<view class="pictrue"><image :src="item.PicNo || 'http://via.placeholder.com/800x800'" mode="aspectFill"></image></view>
							<view class="txtBox">
								<view>
									<view class="title uni-ellipsis2">{{ item.Name }}</view>
									<view class="flex"><view class="tag tag-zy">自营</view></view>
								</view>
								<view class="pronumber flex-between">
									<view>
										<text class="price">
											<text class="fz12">￥</text>
											{{ item.Price }}
										</text>
									</view>
									<view class="opentuan">立即查看</view>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view class="uni-bg-white b_radius" v-if="noDataIsShow"><noData :isShow="noDataIsShow"></noData></view>
				<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
			</view>
		</view>
	</view>
</template>

<script>
import { post, get, toLogin } from '@/common/util.js';
import noData from '@/components/noData.vue'; //暂无数据
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
export default {
	components: {
		noData,
		uniLoadMore
	},
	data() {
		return {
			userId: '',
			token: '',
			prolist: [],
			page: 1,
			pageSize: 8,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			scrollLeft: 0,
			tabIndex: 0,
			categoryList: [], //分类
			typeId: 0, //类型id
			isshowAll: false,
			keyword: ''
		};
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.keyword = e.keys;
		this.getTypeList();
	},
	methods: {
		//跳转
		tolink(Url) {
			uni.navigateTo({
				url: Url
			});
		},
		tapTab(index, id) {
			//点击tab-bar
			if (this.tabIndex === index) {
				return false;
			} else {
				this.tabIndex = index;
				this.setScrollLeft(index);
				this.typeId = id;
				this.page = 1;
				this.getprolist();
			}
		},
		setScrollLeft: async function(tabIndex) {
			let leftWidthSum = 0;
			let btnElement = await this.getWidth('allbtn');
			for (var i = 0; i <= tabIndex; i++) {
				let nowElement = await this.getWidth('tabNum' + i);
				leftWidthSum = leftWidthSum + nowElement.width + btnElement.width + 10; //10是margin值
			}
			let winWidth = uni.getSystemInfoSync().windowWidth;
			this.scrollLeft = leftWidthSum > winWidth ? leftWidthSum - winWidth : 0;
			console.log('scrollLeft' + this.scrollLeft);
		},
		getWidth(id) {
			//得到元素的宽
			return new Promise((res, rej) => {
				uni.createSelectorQuery()
					.select('#' + id)
					.fields(
						{
							size: true,
							scrollOffset: true
						},
						data => {
							res(data);
						}
					)
					.exec();
			});
		},
		// 产品类型
		getTypeList() {
			post('Goods/TypeList', {}).then(res => {
				if (res.code == 0) {
					let json = {
						Id: 0,
						Name: '推荐'
					};
					this.categoryList = res.data;
					this.categoryList.unshift(json);
					this.getprolist();
				}
			});
		},
		//分类商品列表
		async getprolist() {
			let isRec = 0;
			if (this.typeId == 0) {
				isRec = 1;
			} else {
				isRec = 0;
			}
			let result = await post('Goods/GoodsList', {
				page: this.page,
				pageSize: this.pageSize,
				typeId: this.typeId,
				recommend: isRec,
				Keywords: this.keyword
			});
			if (result.code == 0) {
				if (result.data.length > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
				}
			}
			if (result.data.length == 0 && this.page == 1) {
				this.noDataIsShow = true;
				this.hasData = false;
			}
			if (this.page === 1) {
				this.prolist = result.data;
			}
			if (this.page > 1) {
				this.prolist = this.prolist.concat(result.data);
			}
			if (result.data.length < this.pageSize) {
				this.isLoad = false;
				this.loadingType = 2;
			} else {
				this.isLoad = true;
				this.loadingType = 0;
			}
		}
	},
	onPullDownRefresh() {
		this.page = 1;
		this.getprolist();
		uni.stopPullDownRefresh();
	},
	// 上拉加载
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.page++;
			this.getprolist();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss" scoped>
.boxradius {
	width: 120%;
	border-bottom-left-radius: 100%;
	border-bottom-right-radius: 100%;
	background-color: #74c2dc;
	height: 160upx;
	position: absolute;
	left: -10%;
	top: 0;
}
.classifytab {
	position: fixed;
	width: 100%;
	min-height: 80upx;
	top: 44px;
	/* #ifndef H5 */
	top: 0;
	/* #endif */
	z-index: 4;
	.index-swiper-tab::before {
		display: none;
	}
	.index-swiper-tab {
		height: 80upx;
		line-height: 80upx;
		padding-left: 20upx;
		padding-right: 106upx;
		background: #74c2dc;
	}
	.item {
		font-size: 28upx;
		color: #fff;
		&.active {
			font-size: 36upx;
			position: relative;
		}
		&.active::before {
			display: block;
			content: '';
			height: 8upx;
			width: 50upx;
			background: #fd624c;
			border-radius: 100px;
			position: absolute;
			left: 50%;
			bottom: 0;
			margin-left: -25upx;
		}
	}
	.btn {
		display: inline-block;
		line-height: 1.1;
		color: #666;
		font-size: 28upx;
		background: #eee;
		border-radius: 100px;
		margin: 0 16upx;
		padding: 10upx 20upx;
		&.active {
			color: $primary;
			background-color: #f9eae9;
		}
	}
	.menuIco {
		position: absolute;
		height: 80upx;
		right: 0;
		top: 0;
		background: #74c2dc;
		padding: 0 30upx 0 20upx;
		overflow: hidden;
		z-index: 10;
		align-items: flex-end;
		&.widter {
			background: #fff;
		}
		view {
			height: 4upx;
			width: 40upx;
			background: #fff;
			margin: 6upx 0;
			border-radius: 4upx;
		}
		.line2 {
			width: 34upx;
		}
		&::before {
			content: '';
			display: block;
			width: 12upx;
			height: 60upx;
			box-shadow: 0 0 30upx rgba(0, 0, 0, 0.3);
			position: absolute;
			top: 50%;
			margin-top: -30upx;
			left: -12upx;
		}
	}
	.allbtn {
		position: absolute;
		line-height: 80upx;
		right: 0;
		top: 0;
		background: #fff;
		color: $primary;
		padding: 0 30upx 0 20upx;
		overflow: hidden;
		z-index: 3;
		&::before {
			content: '';
			display: block;
			width: 12upx;
			height: 60upx;
			box-shadow: 0 0 30upx rgba(0, 0, 0, 0.3);
			position: absolute;
			top: 50%;
			margin-top: -30upx;
			left: -12upx;
		}
	}
	.showClassify {
		width: 100%;
		background: #fff;
		position: absolute;
		left: 0;
		top: 0;
		padding: 0 30upx 30upx 20upx;
		z-index: 9;
		.allhd {
			line-height: 80upx;
			font-size: 30upx;
			padding: 0 10upx;
		}
		.btn {
			margin-bottom: 30upx;
		}
	}
}
</style>
