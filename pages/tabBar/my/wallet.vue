<template>
	<view>
		<view class="walletBox">
			<view class="bg">
				<view class="bgImg"></view>
				<view class="wallet">
					<view class="reveal">
						<view class="revealTitle">账户余额 (元)</view>
						<view class="allMoney">{{ userInfo.Wallet }}</view>
					</view>
					<view class="present">
						<view class="present_1" @click="golink('/pages/tabBar/my/topup')">
							<text class="iconfont icon-qianbao"></text>
							充值
							<text class="iconfont icon-arrow_r"></text>
						</view>
						<view class="reflesh" @click="reflesh"><image src="http://yd.wtanvxin.com/static/wallet/reflesh.png" mode=""></image></view>
					</view>
				</view>
			</view>
			<view class="wallerList">
				<view class="item" @click="golink('/pages/Wallet/withdraw/withdraw?type=2')">
					<view>
						<text class="iconfont icon-qianbao tiX"></text>
						提现
					</view>
					<view class="iconfont icon-arrow_r"></view>
				</view>
				<view class="item" @click="golink('/pages/other/withdrawrecord/withdrawrecord')">
					<view>
						<image src="http://yd.wtanvxin.com/static/wallet/jiL.png" class="jiL" mode=""></image>
						提现充值记录
					</view>
					<view class="iconfont icon-arrow_r"></view>
				</view>
				<view class="item" @click="golink('/pages/other/money/money')">
					<view>
						<image src="http://yd.wtanvxin.com/static/wallet/mingX.png" class="mingX" mode=""></image>
						收支明细
					</view>
					<view class="iconfont icon-arrow_r"></view>
				</view>
				<view class="item" @click="golink('/pages/Wallet/bankList/bankList')">
					<view>
						<text class="iconfont icon-bandCar card"></text>
						银行卡管理
					</view>
					<view class="iconfont icon-arrow_r"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
export default {
	data() {
		return {
			userId: '',
			token: '',
			userInfo: {}
		};
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getUserInfo();
	},
	methods: {
		golink(url) {
			uni.navigateTo({
				url: url
			});
		},
		reflesh() {
			this.getUserInfo();
		},
		async getUserInfo() {
			let res = await post('User/GetMemInfo', {
				UserId: this.userId,
				Token: this.token
			});
			if (res.code == 0) {
				this.userInfo = res.data;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.walletBox {
	// margin-top: 30rpx;
	background-color: #fff;
	// padding: 30rpx 30rpx 0;
	.bg {
		height: 400rpx;
		width: 100%;
		position: relative;
		.bgImg {
			background: linear-gradient(to bottom right, #fe833c, #fc5d07);
			height: 400rpx;
			width: 100%;
			border-radius: 10rpx;
			position: absolute;
			z-index: 1;
		}
		.wallet {
			position: relative;
			z-index: 2;
			display: flex;
			// align-items: center;
			// justify-content: space-between;
			padding: 70rpx 30rpx 0 30rpx;
			.reveal {
				flex: 1;
				color: #fff;
				.revealTitle {
					font-size: 36rpx;
					color: #fee8df;
					margin-top: 50rpx;
				}
				.allMoney {
					font-size: 120rpx;
				}
				text {
					font-size: 28rpx;
				}
			}
			.present {
				.present_1 {
					flex: 1;
					color: #ff3333;
					font-size: 28rpx;
					margin-top: 50rpx;
					background-color: #ef5400;
					float: right;
					margin-right: -30rpx;
					color: white;
					width: 180rpx;
					height: 70rpx;
					line-height: 70rpx;
					text-align: center;
					border-radius: 70rpx 0 0 70rpx;
					text {
						padding: 0 10rpx;
					}
					text:nth-of-type(2) {
						font-size: 20rpx;
					}
				}
				.reflesh {
					position: absolute;
					bottom: 42px;
					right: 12px;
					image {
						width: 50rpx;
						height: 50rpx;
					}
				}
			}
		}
	}
	.wallerList {
		font-size: 30rpx;
		margin-top: 20rpx;
		padding: 10rpx 30rpx;
		.item {
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #f5f5f5;
			text {
				font-size: 50rpx;
				padding-right: 20rpx;
				vertical-align: sub;
			}
			.tiX {
				color: #ffcd49;
			}
			.jiL {
				width: 50rpx;
				height: 50rpx;
				margin-right: 18rpx;
			}
			.mingX {
				width: 45rpx;
				height: 45rpx;
				margin: 0 18rpx 0 6rpx;
			}
			.card {
				color: #fec124;
			}
			.icon-arrow_r {
				font-size: 28rpx;
				color: #999;
			}
			image {
				width: 35rpx;
				height: 35rpx;
				margin-right: 10rpx;
			}
		}
		.item:last-of-type {
			border: none;
		}
	}
}
</style>
