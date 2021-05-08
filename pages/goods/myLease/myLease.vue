<template>
	<view>
		<view class="lease_list">
			<view class="item flex-between" v-for="(item, index) in mylease" :key="index">
				<view class="img"><image :src="item.DevicePic"></image></view>
				<view class="txtbox flex1">
					<view class="flex-between">
						<view class="tit uni-ellipsis2">{{ item.DeviceName }}</view>
						<view class="num">{{ item.Number }}次</view>
					</view>
					<view class="price">￥{{ item.UnitPrice * item.Number }}</view>
					<view class="time">租赁日期：{{ item.AddTime }}</view>
				</view>
			</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
		<noData :isShow="noDataIsShow"></noData>
	</view>
</template>

<script>
import { post, toLogin } from '@/common/util.js';
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
import noData from '@/components/noData.vue'; //暂无数据
export default {
	data() {
		return {
			userId: '',
			token: '',
			PageSize: 10,
			Page: 1,
			mylease: {},
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false
		};
	},
	components: {
		uniLoadMore,
		noData
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getMyLease();
	},
	methods: {
		//跳转
		goLink(url) {
			uni.navigateTo({
				url: url
			});
		},
		//我的租赁
		async getMyLease() {
			let result = await post('Device/MyLeaseDeviceList', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.data.length > 0) {
				this.hasData = true;
				this.noDataIsShow = false;
			}
			if (result.data.length == 0 && this.Page == 1) {
				this.noDataIsShow = true;
				this.hasData = false;
			}
			if (this.Page === 1) {
				this.mylease = result.data;
			}
			if (this.Page > 1) {
				this.mylease = this.mylease.concat(result.data);
			}
			if (result.data.length < this.PageSize) {
				this.isLoad = false;
				this.loadingType = 2;
			} else {
				this.isLoad = true;
				this.loadingType = 0;
			}
		}
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Page = 1;
		this.RechargeList = [];
		this.init();
		uni.stopPullDownRefresh();
	},
	// 上拉加载
	onReachBottom() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.Page++;
			this.init();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss" scoped>
.lease_list {
	padding: 30upx;
	.item {
		margin-bottom: 20upx;
		background: #fff;
		padding: 20upx;
		border-radius: 16upx;
		.img {
			image {
				background: #f2f2f2;
				width: 160upx;
				height: 160upx;
				border-radius: 12upx;
			}
		}
		.txtbox {
			padding-left: 20upx;
			.tit {
				font-size: 30upx;
				line-height: 1.2;
				flex: 1;
			}
			.num {
				font-size: 28upx;
			}
			.price {
				color: #ff0000;
			}
			.time {
				color: #999;
				font-size: 24upx;
			}
		}
	}
}
</style>
