<template>
	<view>
		<view class="lease_list">
			<view class="item flex-between" @click="goLink('/pages/goods/submitLease/submitLease')">
				<view class="img">
					<image src="/static/lease/1.png" mode="aspectFill"></image>
				</view>
				<view class="txt flex1">训练服</view>
				<view class="iconfont icon-arrow_r"></view>
			</view>
			<view class="item flex-between">
				<view class="img">
					<image src="/static/lease/2.png" mode="aspectFill"></image>
				</view>
				<view class="txt flex1">裤子</view>
				<view class="iconfont icon-arrow_r"></view>
			</view>
			<view class="item flex-between">
				<view class="img">
					<image src="/static/lease/3.png" mode="aspectFill"></image>
				</view>
				<view class="txt flex1">腰带</view>
				<view class="iconfont icon-arrow_r"></view>
			</view>
		</view>
		<view class="fixedbtn">
			<view class="btn_mylease flex-center" @click="goLink('/pages/goods/myLease/myLease')">
				<image class="iconimg" src="/static/lease.png" mode=""></image>我的租赁
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
			margin-bottom: 30upx;
			background-image: linear-gradient(left,#4c444f, #392f39);
			color: #FFFFFF;
			padding: 20upx;
			border-radius: 16upx;
			.img{
				image{
					width: 160upx;
					height: 160upx;
				}
			}
			.txt{
				text-align: right;
				padding: 0 20upx;
				font-size: 32upx;
			}
			.icon-arrow_r{
				font-size: 28upx;
			}
		}
	}
	.fixedbtn{
		padding: 0;
		.btn_mylease{
			background: #fff;
			padding: 20upx 30upx;
			font-size: 32upx;
			color: $primary;
			.iconimg{
				width: 48upx;
				height: 48upx;
				margin-right: 10upx;
			}
		}
	}
</style>
