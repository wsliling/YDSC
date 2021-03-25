<template>
	<view>
		<view class="acount">
			<image class="acountbg" mode="widthFix" src="http://xcx.yixijiu19.com/static/myAcount.png"></image>
			<view class="acountBox">
				<view class="allmoney">
					<text>￥</text>{{Amount.LJAmount}}
					<view class="text">收益总额(元)</view>
				</view>
				<view class="acountInfo">
					<text>昨日收益：¥{{Amount.ZTAmount}}</text>
					<text>可提现：¥{{Amount.KTAmount}}</text>
				</view>
				<view class="acountNav">
					<view @click="getAcountNav(index)" :class="acountIndex==index?'active':''" v-for="(item,index) in acountNav" :key="index">{{item}}</view>
				</view>
			</view>
		</view>
		<view class="acountList">
			<view class="acountItem" @click="golink('/pages/other/getCome/getCome')">
				<view>收益明细</view>
				<text class="iconfont icon-arrow_r"></text>
			</view>
			<view class="acountItem" @click="golink('/pages/other/withdrawrecord/withdrawrecord?type=1')">
				<view>提现记录</view>
				<text class="iconfont icon-arrow_r"></text>
			</view>
			<view class="acountItem" @click="golink('/pages/other/rebate/rebate')">
				<view>佣金明细</view>
				<text class="iconfont icon-arrow_r"></text>
			</view>
		</view>
		<view class="withdraw" @click="golink('/pages/Wallet/withdraw/withdraw?type=1')">提现</view>
	</view>
</template>

<script>
	import {post} from '@/common/util.js'
	export default {
		data() {
			return {
				acountNav:['直播收益','带货收益','经销商收益'],
				acountIndex:0,
				Amount:{},
				userId:'',
				token:'',
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.getAmount()
		},
		methods: {
			golink(url) {
				uni.navigateTo({
					url:url
				})
			},
			getAcountNav(index){
				this.acountIndex=index
				this.getAmount()
			},
			async getAmount(){
				let res = await post('Recharge/IncomeDetailsTZ',{
					UserId:this.userId,
					Token:this.token,
					Type:this.acountIndex+1
				})
				if(res.code==0){
					this.Amount=res.data
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.acount{
	margin-top: 20rpx;
	padding: 40rpx 20rpx;
	background-color: #fff;
	position: relative;
	.acountbg{
		width: 700rpx;
		height: auto;
		// height: 336rpx;
		position: absolute;
		left: 50%;
		top: 40rpx;
		transform: translate(-50%);
	}
	.acountBox{
		position: relative;
		z-index: 2;
		
		color: #fff;
		.allmoney{
			margin-top: 20rpx;
			text-align: center;
			font-size: 60rpx;
			text{font-size: 40rpx;}
			.text{font-size: 24rpx;}
		}
		.acountInfo{
			// text-align: center;
			font-size: 28rpx;
			text{
				display:inline-block;
				width: 50%;
				text-align: center;
			}
		}
		.acountNav{
			display: flex;
			align-items: center;
			margin: 30rpx;
			border: 1rpx solid #fff;
			border-radius: 40rpx;
			view{
				width: 33.33%;
				text-align: center;
				&:first-of-type{
					border-radius: 40rpx 0 0 40rpx;
				}
				&:last-of-type{
					border-radius: 0 40rpx 40rpx 0 ;
				}
				&.active{
					background-color: #fff;
					color: #ff3333;
				}
			}
		}
	}
}
.acountList{
	background-color: #fff;
	padding: 0 20rpx;
	margin-top: 20rpx;
	.acountItem{
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100rpx;
		border-bottom: 1rpx solid #f5f5f5;
		text{
			font-size: 26rpx;
		}
		&:last-of-type{
			border: none;
		}
	}
}
.withdraw{
	margin: 300rpx 20rpx 50rpx;
	background-color: #FF3333;
	color: #fff;
	font-size: 32rpx;
	border-radius: 40rpx;
	height: 90rpx;
	line-height: 90rpx;
	text-align: center;
}
</style>
