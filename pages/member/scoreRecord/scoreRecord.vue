<template>
	<view class="scoreRecord">
		<view class="sec" v-for="(item, index) in changelist" :key="index">
			<view class="sec_1"><image :src="item.Pro_Logo"></image></view>
			<view class="sec_2">
				<view class="title">{{ item.Pro_Name }}</view>
				<view class="title_1">积分：{{ item.Score }}</view>
				<view class="title_2">兑换日期: {{ item.AddTime }}</view>
			</view>
			<view class="sec_3">×{{ item.CashNum }}</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
		<noData :isShow="noDataIsShow"></noData>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
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
			PageSize: 10,
			Page: 1,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			changelist: [],
			Id: 0
		};
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Id = e.prosId;
		this.getChangeList();
	},
	methods: {
		// 兑换记录
		async getChangeList() {
			let result = await post('Productjf/GetExchangeList', {
				UserId: this.userId,
				Token: this.token,
				Pro_Id: this.Id
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
				this.changelist = result.data;
			}
			if (this.Page > 1) {
				this.changelist = this.changelist.concat(result.data);
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
		this.getChangeList();
		uni.stopPullDownRefresh();
	},
	// 上拉加载
	onReachBottom() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.Page++;
			this.getChangeList();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss">
.scoreRecord {
	margin-top: 22upx;
	background-color: white;
	height: 100vh;
	.sec {
		padding: 25upx;
		line-height: 60upx;
		display: flex;
		align-items: flex-start;
		border-bottom: 1px solid #f5f5f5;
		.sec_1 {
			flex: 1;
			image {
				width: 180upx;
				height: 180upx;
			}
		}
		.sec_2 {
			flex: 6;
			padding-left: 20upx;
			.title {
				font-size: 35upx;
				font-weight: bold;
				width: 198px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.title_1 {
			}
			.title_2 {
				color: gray;
				font-size: 26upx;
			}
		}
		.sec_3 {
			flex: 1;
			text-align: right;
			font-size: 30upx;
			font-weight: bold;
		}
	}
}
</style>
