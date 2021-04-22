<template>
	<view>
		<view class="lease_list">
			<view class="item flex-between">
				<view class="img">
					<image src="/static/lease/1.png" mode="aspectFill"></image>
				</view>
				<view class="txtbox flex1">
					<view class="flex-between">
						<view class="tit uni-ellipsis2">训练服</view>
						<view class="num">1次</view>
					</view>
					<view class="price">￥128</view>
					<view class="time">租赁日期：2020-03-08 15:28</view>
				</view>
			</view>
			<view class="item flex-between">
				<view class="img">
					<image src="/static/lease/1.png" mode="aspectFill"></image>
				</view>
				<view class="txtbox flex1">
					<view class="flex-between">
						<view class="tit uni-ellipsis2">训练服</view>
						<view class="num">6次</view>
					</view>
					<view class="price">￥1288</view>
					<view class="time">租赁日期：2020-03-08 15:28</view>
				</view>
			</view>
			<view class="item flex-between">
				<view class="img">
					<image src="/static/lease/2.png" mode="aspectFill"></image>
				</view>
				<view class="txtbox flex1">
					<view class="flex-between">
						<view class="tit uni-ellipsis2">裤子</view>
						<view class="num">1次</view>
					</view>
					<view class="price">￥99</view>
					<view class="time">租赁日期：2020-03-08 15:28</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {post,toLogin} from '@/common/util.js';
	export default {
		data() {
			return {
				userId: "",
				token: "",
			}
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		methods: {
			//跳转
			goLink(url){
				uni.navigateTo({
					url:url
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.lease_list{
	padding: 30upx;
	.item{
		margin-bottom: 20upx;
		background: #fff;
		padding: 20upx;
		border-radius: 16upx;
		.img{
			image{
				background: #f2f2f2;
				width: 160upx;
				height: 160upx;
				border-radius: 12upx;
			}
		}
		.txtbox{
			padding-left: 20upx;
			.tit{font-size: 30upx;
			line-height: 1.2;
			flex: 1;}
			.num{font-size: 28upx;}
			.price{color: #FF0000;}
			.time{
				color: #999;
				font-size: 24upx;
			}
		}
	}
}
</style>
