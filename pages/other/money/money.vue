<template>
	<view>
		<view class="moneyList pd15">
			<view class="moneyTiem flex-between" v-for="(item,index) in RechargeList" :key="index">
				<view class="reason flex1">
					<view class="title">{{item.Remark}}</view>
					<text>{{item.AddTime}}</text>
				</view>
				<view class="money">{{item.Change}}</view>
			</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<noData :isShow="noDataIsShow"></noData>
	</view>
</template>

<script>
	import {post} from '@/common/util.js'
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import noData from '@/components/noData.vue'; //暂无数据
	export default {
		data() {
			return {
				userId:'',
				token:'',
				PageSize:10,
				Page:1,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				RechargeList:[],
			}
		},
		components:{
			uniLoadMore,
			noData
		},
		onLoad() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.init()
		},
		methods: {
			async init(){
				let res = await post('Recharge/GetRechargeList',{
					UserId:this.userId,
					Token:this.token,
					Page:this.Page,
					PageSize:this.PageSize,
					Type:1
				})
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
					this.RechargeList = this.RechargeList.concat(
						res.data.list
					);
				}
				if (res.data.list.length <this.PageSize) {
					this.isLoad = false;
					this.loadingType = 2;
				} else {
					this.isLoad = true;
					this.loadingType = 0
				}
			}
		},
		// 下拉刷新
		onPullDownRefresh(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.Page=1;
			this.RechargeList=[]
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
	}
</script>

<style lang="scss" scoped>
	.moneyList{
		margin-top: 20rpx;
		background-color: #fff;
		.moneyTiem{
			padding: 30rpx 0;
			border-bottom: 1rpx solid #f5f5f5 ;
			.reason{
				.title{
					font-size: 28rpx;
					line-height: 1.4;
				}
				text{
					font-size: 24rpx;
					color:#999;
				}
			}
			.money{
				font-size: 32rpx;
				width: 160rpx;
				text-align: right;
			}
			&:last-child{
				border-bottom: none;
			}
		}
	}
</style>
