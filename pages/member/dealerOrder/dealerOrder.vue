<template>
	<view>
		<view class="Dealer" v-for="(item,index) in orderList" :key="index">
			<view class="dealerTitle">
				<view>{{item.ContactName}}</view>
				<text>{{item.OrderTime}}</text>
			</view>
			<view class="dealerProduct" v-for="(ite,ind) in item.OrderDetails" :key="ind">
				<image :src="ite.PicNo"></image>
				<view class="product">
					<view class="name">{{ite.ProductName}}</view>
					<text class="parameter">{{ite.SpecText}}</text>
					<view class="num">
						<text>X{{ite.Number}}</text>
						<view class="price"><text>¥</text>{{ite.ActualPay}}</view>
					</view>
				</view>
			</view>
			<view class="sum">
				总计：<text>¥</text>{{item.Total}}
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
				orderList:[],
				userId: "",
				token: "",
				Page:1,
				PageSize:12,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
			}
		},
		components:{
			uniLoadMore,
			noData
		},
		onLoad(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.getOrderList()
		},
		methods: {
			async getOrderList(){
				let res = await post('Order/DealerOrderList',{
					UserId: this.userId,
					Token: this.token,
					Page:this.Page,
					PageSize:this.PageSize
				})
				// this.orderList=res.data
				let _this=this;
				if (res.count > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
				}
				if (res.count == 0 && this.Page == 1) {
					this.noDataIsShow = true;
					this.hasData = false;
				}
				if (this.Page === 1) {
					this.orderList = res.data;
				}
				if (this.Page > 1) {
					this.orderList = this.orderList.concat(
						res.data
					);
				}
				if (res.data.length <this.PageSize) {
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
			this.orderList=[]
			this.getOrderList(); 
			uni.stopPullDownRefresh();
		},
		// 上拉加载
		onReachBottom() {
			if (this.isLoad) {
				this.loadingType = 1;
				this.Page++;
				this.getOrderList();
			} else {
				this.loadingType = 2;
			}
		}
	}
</script>

<style lang="scss" scoped>
.Dealer{
	background-color: #fff;
	border-radius: 20rpx;
	margin: 20rpx;
	padding: 30rpx 30rpx;
	.dealerTitle{
		display: flex;
		align-items: center;
		justify-content: space-between;
		view{
			font-weight: 600;
		}
		text{
			font-size: 22rpx;
			color: #999;
		}
	}
	.dealerProduct{
		display: flex;
		align-items: center;
		margin: 20rpx 0;
		image{
			width: 160rpx;
			height: 160rpx;
			border-radius: 20rpx;
			margin-right: 20rpx;
		}
		.product{
			flex: 1;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
		}
		.name{
			font-size: 28rpx;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
			
		}
		.parameter{
			font-size: 26rpx;
			color: #999;
		}
		.num{
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 26rpx;
			text{
				color: #999;
				font-size: 22rpx;
			}
			.price{
				text{
					color: #333;
					font-size: 22rpx;
				}
			}
		}
	}
	.sum{
		text-align: right;
		font-size: 32rpx;
		text{
			font-size: 24rpx;
		}
	}
}
</style>
