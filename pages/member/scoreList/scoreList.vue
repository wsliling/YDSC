<template>
	<view class="scoreList">
		<view class="sec" v-for="(item, index) in RechargeList" :key="index">
			<view class="sec_2">
				<view class="title">{{ item.Title }}</view>
				<view class="title_2">{{ item.AddTime }}</view>
			</view>
			<view class="sec_3">{{ item.Change }}</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
		<noData :isShow="noDataIsShow"></noData>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
import noData from '@/components/noData.vue'; //暂无数据
export default {
	data() {
		return {
			userId: '',
			token: '',
			PageSize: 10,
			Page: 1,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			RechargeList: []
		};
	},
	components: {
		uniLoadMore,
		noData
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.init();
	},
	methods: {
		async init() {
			let res = await post('Recharge/GetRechargeList', {
				UserId: this.userId,
				Token: this.token,
				Page: this.Page,
				PageSize: this.PageSize,
				Type: 5
			});
			if (res.data.list.length > 0) {
				this.hasData = true;
				this.noDataIsShow = false;
			}
			if (res.data.list.length == 0 && this.Page == 1) {
				this.noDataIsShow = true;
				this.hasData = false;
			}
			if (this.Page === 1) {
				this.RechargeList = res.data.list;
			}
			if (this.Page > 1) {
				this.RechargeList = this.RechargeList.concat(res.data.list);
			}
			if (res.data.list.length < this.PageSize) {
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

<style lang="scss">
.scoreList {
	margin-top: 22upx;
	background-color: white;
	height: 100vh;
	.sec {
		padding: 25upx;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #f5f5f5;
		.sec_2 {
			flex: 6;
			padding-left: 20upx;
			.title {
				font-size: 30upx;
				font-weight: bold;
			}
			.title_2 {
				color: gray;
				font-size: 26upx;
			}
		}
		.sec_1 {
			flex: 1;
			text-align: right;
			font-size: 30upx;
			color: #ff4545;
		}
		.sec_3 {
			flex: 1;
			text-align: right;
			font-size: 30upx;
			color: #fe8441;
		}
	}
}
</style>
