<template>
	<view>
		<view class="nav flex-between" :style="{ 'padding-top': barHeight + 'px' }">
			<view class="nav-left">
				<view :class="[tabNav == 4 ? 'active' : '']" @click="tapNav(4)">最新</view>
				<view :class="[tabNav == 2 ? 'active' : '']" @click="tapNav(2)">推荐</view>
				<view :class="[tabNav == 6 ? 'active' : '']" @click="tapNav(6)">关注</view>
				<view :class="[tabNav == 3 ? 'active' : '']" @click="tapNav(3)">附近</view>
			</view>
		</view>
		<view :style="{ height: barHeight + 44 + 'px' }"></view>
		<view class="list-2" v-if="tabNav == 4 && bannerList.length">
			<view class="list-2-1"><image class="b_radius" :src="bannerList[0].Pic" mode="widthFix" @click="tolink('/pages/personal/topic/topic')"></image></view>
			<block v-for="(item, index) in datalist" :key="index"><mediaList :datajson="item" Grid="3" @click="goDetail" @previewImg="previewImg"></mediaList></block>
		</view>
		<view class="list" v-if="hasData && tabNav == 2">
			<block v-for="(item, index) in datalist" :key="index"><mediaList :datajson="item" Grid="3" @click="goDetail" @previewImg="previewImg"></mediaList></block>
		</view>
		<view class="list" v-if="hasData && tabNav == 6">
			<block v-for="(item, index) in datalist" :key="index"><mediaList :datajson="item" Grid="3" @click="goDetail" @previewImg="previewImg"></mediaList></block>
		</view>
		<view class="list-1" v-if="tabNav == 3">
			<view class="list-cell" v-for="(item, index) in gymlist" :key="index">
				<view class="hd flex-start" @click="tolink('/pages/personal/VenueDetail/VenueDetail?gymId=' + item.Id)">
					<view class="author"><image :src="item.Logo"></image></view>
					<view class="flex1">
						<view class="name flex-start">
							<text class="txt uni-ellipsis">{{ item.StoreNick }}</text>
							<text class="uni-icon uni-icon-arrowright fz14"></text>
						</view>
						<view class="fz12 c_999" v-if="item.IsShowDistance">距离您{{ item.Distance }}</view>
					</view>
				</view>
				<view class="bd">
					<scroll-view class="image-list" scroll-x="true">
						<view class="img" v-for="(items, index) in item.PicData" :key="index"><image :src="items.PicUrl"></image></view>
					</scroll-view>
				</view>
			</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
		<noData :isShow="noDataIsShow"></noData>
		<view @click="tolink('/pages/personal/artPost/artPost', 'login')" class="uploadbtn flex-column"><text class="uni-icon uni-icon-plusempty"></text></view>
	</view>
</template>

<script>
import { post, get, toLogin, dateUtils } from '@/common/util.js';
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
			barHeight: 0,
			tabNav: 4,
			datalist: [],
			page: 1,
			pageSize: 8,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			gymlist: [],
			bannerList: []
		};
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		if (this.tabNav == 3){
			this.getGymList();
		}else{
			this.FindList();
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
		this.getBanner(11);
	},
	methods: {
		//跳转
		tolink(Url, islogin) {
			if (islogin == 'login') {
				if (toLogin()) {
					uni.navigateTo({
						url: Url
					});
				}
			} else {
				uni.navigateTo({
					url: Url
				});
			}
		},
		tapNav(type) {
			this.tabNav = type;
			this.hasData = false;
			this.noDataIsShow = false;
			this.page = 1;
			if (this.tabNav == 3) {
				this.gymlist = [];
				this.getGymList();
			} else {
				this.datalist = [];
				this.FindList();
			}
		},
		// 获取banner图
		async getBanner(type) {
			//顶级分类
			let result = await post('Banner/BannerList', {
				Cid: type
			});
			if (result.code === 0) {
				this.bannerList = result.data;
			}
		},
		/*获取动态列表*/
		async FindList() {
			let result = await post('Find/FindList', {
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token'),
				Page: this.page,
				PageSize: this.pageSize,
				myType: this.tabNav
			});
			if (result.code === 0) {
				let _this = this;
				if (result.data.length > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
					result.data.forEach(function(item) {
						item.Addtime = dateUtils.format(item.Addtime);
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
			}
		},
		//预览图片
		previewImg(obj) {
			uni.previewImage({
				current: obj.imgurls[obj.index],
				urls: obj.imgurls,
				indicator: obj.imgurls.length
			});
		},
		//链接动态详情页
		goDetail(e) {
			uni.navigateTo({
				url: '/pages/personal/replylist/replylist?id=' + e.id
			});
		},
		//场馆列表
		async getGymList() {
			let result = await post('Store/GetStoreList', {
				page: this.page,
				pageSize: this.pageSize,
				UserId: this.userId,
				Token: this.token,
				IsNewPeopleVip: 0,
				Lat: 0,
				Lng: 0,
				AreaSite: ''
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
				this.gymlist = result.data;
			}
			if (this.page > 1) {
				this.gymlist = this.gymlist.concat(result.data);
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
		if (this.tabNav == 3) {
			this.gymlist = [];
			this.getGymList();
		} else {
			this.datalist = [];
			this.FindList();
		}
		uni.stopPullDownRefresh();
	},
	// 上拉加载
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.page++;
			if (this.tabNav == 3) {
				this.getGymList();
			} else {
				this.FindList();
			}
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss">
.nav {
	width: 100%;
	padding: 0 20upx;
	position: fixed;
	top: 0;
	z-index: 12;
	background: #ffffff;
	.redact {
		height: 88upx;
		line-height: 88upx;
		view {
			font-size: 50upx;
		}
	}
	.nav-left {
		display: flex;
		align-items: center;
		height: 88upx;
		view {
			font-family: PingFangSC-Regular, sans-serif;
			width: 110upx;
			color: #999999;
			font-size: 30upx;
			height: 100%;
			line-height: 88upx;
			text-align: center;
			&.active {
				font-size: 38upx;
				color: #000;
				font-weight: 600;
				position: relative;
			}
			&.active::before {
				content: '';
				width: 50upx;
				height: 4upx;
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translate(-50%, 50%);
				border-radius: 20upx;
				background-color: #000;
			}
		}
	}
}
.list-2 {
	background-color: white;
	.list-2-1 {
		display: flex;
		.b_radius {
			flex: 1;
			padding: 20upx;
			border-radius: 80upx;
		}
	}
	image {
		border-radius: 50%;
	}
}
.uploadbtn {
	position: fixed;
	right: 20upx;
	bottom: 20upx;
	/* #ifdef H5 */
	bottom: 160upx;
	/* #endif */
	width: 100upx;
	height: 100upx;
	line-height: 1;
	color: #fff;
	font-size: 22upx;
	background: $primary;
	border-radius: 50%;
	box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.2);
	z-index: 9;
	.uni-icon {
		font-weight: bold;
		font-size: 64upx;
		line-height: 0.8;
	}
	.icon {
		display: block;
		height: 40upx;
		width: 40upx;
		margin-bottom: 8upx;
	}
}
/*附近列表*/
.list-1 {
	padding-top: 20upx;
	.list-cell {
		padding: 24upx 0 24upx 20upx;
		margin-bottom: 16upx !important;
		background: #fff;
		.hd {
			margin-bottom: 20upx;
			.author {
				height: 90upx;
				width: 90upx;
				margin-right: 20upx;
				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
					border: 1upx solid #ddd;
				}
			}
			.name {
				.txt {
					font-size: 32upx;
					font-weight: bold;
					max-width: 300upx;
				}
			}
		}
		.image-list {
			white-space: nowrap;
			width: 100%;
			.img {
				display: inline-block;
				width: 180upx;
				height: 180upx;
				margin-right: 10upx;
				image {
					width: 100%;
					height: 100%;
					border-radius: 6px;
					overflow: hidden;
				}
			}
		}
	}
}
</style>
