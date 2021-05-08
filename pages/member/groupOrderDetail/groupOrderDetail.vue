<template>
	<view>
		<view class="timeBox">
			<view class="time">
				<view><text>下单时间：</text>{{orderDetail.OrderTime}}</view>
				<view><text>拼团编号：</text>{{orderDetail.OrderNumber}}</view>
			</view>
			<view class="status">{{orderDetail.StatusName}}</view>
		</view>
		<view class="order_item bg_fff mt2" >
			<!-- <view class="flex justifyContentBetween flexAlignCenter">
				<view class="shopbox flex flex-start" @click="tolink('/pages/goods/storeIndex/storeIndex?id='+orderDetail.ShopId)">
					<view class="iconfont icon-shop" style="margin-right: 20rpx;"></view>
					<text class="shopName uni-ellipsis">{{orderDetail.ShopName}}</text>
				</view>
			</view> -->
			<block v-for="(item,index) in orderDetail.OrderDetails" :key="index">
			<view class="flex justifyContentBetween mt2" @click="tolink('/pages/goods/productDetail/productDetail?proId='+item.ProductId)">
				<image :src="item.PicNo" mode="aspectFit" class="img mr2"></image>
				<view class="flex1 order_info">
					<view>{{item.ProductName}}</view> 
					<view class="color_gray font18">{{item.SpecText}}</view> 
					<view class="flex flex-between flexAlignCenter mt1">
						<view class="color_red">¥
							<text style="font-size: 40rpx;margin-right: 20rpx;">{{item.ActualPay}}</text>
						</view>
						<view>X{{item.Number}}</view>
						<!-- <text class="color_gray" style="text-decoration:line-through;">¥699.00</text> -->
					</view>
				</view>
			</view>
			</block>
			<view class="flex flex-between flexAlignCenter">
				<view class="btn flex justifyContentEnd" style="margin-left: auto;">
					<!-- <view class="btn_g " >订单详情</view> -->
					<view class="btn_g" @click="tolink('/pages/member/groupDetail/groupDetail?Id='+orderDetail.GroupRecordId)">拼团详情</view>
				</view>
			</view>
		</view>
		<view class="payDetail">
			<view class="addressBox">
				<view class="name">
					<text>{{orderDetail.ContactName}}</text>
					<text>{{orderDetail.Tel}}</text>
				</view>
				<view class="addr">{{orderDetail.Addr}}</view>
			</view>
			<view class="pay">
				<view><text>支付方式：</text>{{orderDetail.Payment}}</view>
				<view><text>商品合计：</text>¥{{orderDetail.TotalAmount}}</view>
				<view><text>运费：</text>¥{{orderDetail.ExpressPrice}}</view>
			</view>
			<view class="pay color_red" style="border: none;"><text class="color_gray">实付：</text>¥{{orderDetail.Total}}</view>
		</view>
	</view>
</template>

<script>
	import {post} from '@/common/util.js'
	export default {
		data() {
			return {
				orderDetail:{},
				userId: "",
				token: "",
				OrderNo:''
			}
		},
		onLoad(e){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.OrderNo=e.Id
			this.getOrder()
		},
		methods: {
			//跳转
			tolink(Url,islogin) {
			 	if(islogin=="login"){
			 		if(toLogin()){
			 			uni.navigateTo({
			 				url: Url
			 			})
			 		}
			 	}else{
			 		uni.navigateTo({
			 			url: Url
			 		})
			 	}
			},
			async getOrder(){
				let res = await post('Order/OrderDetails',{
					UserId:this.userId,
					Token:this.token,
					OrderNo:this.OrderNo
				})
				if(res.code==0){
					this.orderDetail=res.data
					this.orderDetail.StatusName=this.orderDetail.StatusName.split(' ')[0]
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
@import './style';
</style>
