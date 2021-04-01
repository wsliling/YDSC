<template>
	<view>
		<view class="acount">
			<view class="bg">
				<view class="acount-num">
					<view>当前可提佣金（元）</view>
					<text>{{KTAmount}}</text>
				</view>
			</view>
			<view class="btn" @click="goLink('/pages/member/withdraw/withdraw')">
				<view>提现</view>
			</view>
		</view>
		<view class="acount-list">
			<view class="list-item" @click="goLink('/pages/member/getCome/getCome')">
				<view class="left">
					<image src="@/static/acount-detail.png"></image>
					<text>佣金明细</text>
				</view>
				<image src="@/static/right-arrows.png"></image>
			</view>
			<view class="list-item"  @click="goLink('/pages/member/bankList/bankList')">
				<view class="left">
					<image src="@/static/acount-bank.png"></image>
					<text>银行卡</text>
				</view>	
				<image src="@/static/right-arrows.png"></image>
			</view>
			<view class="list-item"  @click="goLink('/pages/member/money/money')">
				<view class="left">
					<image src="@/static/acount-record.png"></image>
					<text>提现记录</text>
				</view>
				<image src="@/static/right-arrows.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {post} from '@/common/util.js'
	export default {
		data() {
			return {
				KTAmount:''
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.init()
		},
		methods: {
			goLink(url){
				uni.navigateTo({
					url:url
				})
			},
			async init(){
				let result= await post('Recharge/IncomeDetailsTZ',{
					"UserId":this.userId,
					"Token":this.token
				})
				if(result.code==0){
					this.KTAmount=result.data.KTAmount
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f2f2f2;
	}
	.acount{
		height: 500upx;
		padding-top: 50upx;
		background-color: #ff3333;
		position: relative;
		margin-bottom: 66upx;
		.bg{
			margin: 0 150upx;
			// margin-top: 50upx;
			background: url(../../../static/acount.png);
			height: 340upx;
			background-size: 100% 100%;
			
			color: #fff;
			position: relative;
			.acount-num{
				margin-top: 50upx;
				text-align: center;
				position: absolute;
				bottom: 0;
				width: 100%;
				font-size: 28upx;
				text{
					font-size: 98upx;
				}
			}
		}
		.btn{
			width: 100%;
			display: flex;
			justify-content: center;
			position: absolute;
			bottom: -37.5upx;
			left: 0;
			view{
				width: 375upx;
				height: 75upx;
				text-align: center;
				line-height: 75upx;
				border-radius: 40upx;
				background-color: #ffa800;
				color: #fff;
				font-size: 30upx;
			}
		}
	}
	.acount-list{
		margin: 0 30upx;
		border-radius: 20upx;
		background-color: #fff;
		.list-item{
			height: 100upx;
			border-bottom: 1px solid #ececec;
			padding: 0 30upx;
			display: flex;
			align-items: center;
			font-size: 28upx;
			justify-content: space-between;
			image{
				width: 12upx;
				height: 24upx;
			}
			
			.left{
				display: flex;
				align-items: center;
				image{
					width: 50upx;
					height: 50upx;
					margin-right: 20upx;
					display: inline-block;
				}
			}
		}
		.list-item:last-of-type{
			border: none;
		}
	}
</style>
