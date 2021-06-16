<template>
	<view class="content">
		<view class="memberTop uni-mb10">
			<view class="conBox">
				<view class="tx_info flex" @click="golink('/pages/homepage/homepage?id=' + userId)">
					<view><image class="tx" :src="memberInfo.Avatar || 'https://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image></view>
					<view class="info flex flex1">
						<view class="info-item" style="width: 100%;">
							<view class="name">
								<text class="txt" style="max-width: 100%;">{{ memberInfo.NickName || '立即登录' }}</text>
							</view>
							<view class="perId c_999">
								ID:
								<text id="MemberID">{{ memberInfo.Id || '00000' }}</text>
							</view>
						</view>
					</view>
					<text class="uni-icon uni-icon-arrowright fz12"></text>
				</view>
				<view class="u_data flex center">
					<view class="item" @click="golink('/pages/member/follow/follow?type=0')">
						<view class="num">{{ memberInfo.Follow || 0 }}</view>
						<view class="txt">关注</view>
					</view>
					<view class="item" @click="golink('/pages/member/follow/follow?type=1')">
						<view class="num">{{ memberInfo.Fans > 9999 ? (memberInfo.Fans / 9999).toFixed(1) + 'W' : memberInfo.Fans || 0 }}</view>
						<view class="txt">粉丝</view>
					</view>
					<view class="item">
						<!-- <view class="item" @click="golink('/pages/message/messageClass/messageClass?type=2')"> -->
						<view class="num">{{ memberInfo.TotalLikeNum || 0 }}</view>
						<view class="txt">获赞</view>
					</view>
					<view class="item" @click="golink('/pages/member/collect/collect?type=3')">
						<view class="num">{{ memberInfo.CollectNum || 0 }}</view>
						<view class="txt">收藏</view>
					</view>
				</view>
			</view>
		</view>
		<view class="pd15">
			<view class="memberIndex_section uni-bg-white b_radius uni-mb10">
				<view class="section_bd">
					<view class="li_25 center flex flexWrap">
						<view class="item" @click="golink('/pages/member/information/information')">
							<view class="iconImg"><image class="icon" src="https://yd.wtanvxin.com/static/my_data.png" mode="widthFix"></image></view>
							<view class="txt">我的数据</view>
						</view>
						<!-- <view class="item" @click="golink('/pages/member/myplan/myplan')">
							<view class="iconImg"><image class="icon" src="https://yd.wtanvxin.com/static/my_plan.png" mode="widthFix"></image></view>
							<view class="txt">我的计划</view>
						</view> -->
						<view class="item" @click="golink('/pages/member/myappointment/myappointment')">
							<view class="iconImg"><image class="icon" src="https://yd.wtanvxin.com/static/my_yuyue.png" mode="widthFix"></image></view>
							<view class="txt">我的预约</view>
						</view>
						<view class="item" @click="golink('/pages/member/mycourse/mycourse')">
							<view class="iconImg"><image class="icon" src="https://yd.wtanvxin.com/static/my_kc.png" mode="widthFix"></image></view>
							<view class="txt">我的课程</view>
						</view>
						<view class="item" @click="golink('/pages/member/order/order')">
							<view class="iconImg p_re">
								<image class="icon" src="https://yd.wtanvxin.com/static/my_order.png" mode="widthFix"></image>
								<view class="circleNum" v-if="memberInfo.OrderNum">{{ memberInfo.OrderNum }}</view>
							</view>
							<view class="txt">我的订单</view>
						</view>
					</view>
				</view>
			</view>
			<view class="memberIndex_section uni-bg-white b_radius uni-mb10">
				<view class="section_bd">
					<view class="li_25 center flex flexWrap">
						<!-- <view class="item">
							<view class="iconImg"><image class="icon" src="https://yd.wtanvxin.com/static/u_1.png" mode="widthFix"></image></view>
							<view class="txt">我的手环</view>
						</view> -->
						<view class="item" @click="golink('/pages/tabBar/my/wallet')">
							<view class="iconImg"><image class="icon" src="https://yd.wtanvxin.com/static/u_2.png" mode="widthFix"></image></view>
							<view class="txt">我的钱包</view>
						</view>
						<view class="item" @click="golink('/pages/member/score/score')">
							<view class="iconImg"><image class="icon" src="https://yd.wtanvxin.com/static/u_3.png" mode="widthFix"></image></view>
							<view class="txt">积分</view>
						</view>
						<view class="item" @click="getAttest">
							<view class="iconImg"><image class="icon" src="https://yd.wtanvxin.com/static/u_4.png" mode="widthFix"></image></view>
							<view class="txt">{{ memberInfo.IsBusiness ? '我的门店' : '门店申请' }}</view>
						</view>
						<!-- <view class="item" @click="getAttest">
							<view class="iconImg"><image class="icon" src="https://yd.wtanvxin.com/static/u_4.png" mode="widthFix"></image></view>
							<view class="txt">{{ memberInfo.IsBusiness ? '我的店铺' : '店铺申请' }}</view>
						</view> -->
						<view class="item" @click="golink('/pages/member/partner/partner')">
							<view class="iconImg"><image class="icon" src="https://yd.wtanvxin.com/static/u_5.png" mode="widthFix"></image></view>
							<view class="txt">合伙人</view>
						</view>
					</view>
				</view>
			</view>
			<view class="memberIndex_list line-list b_radius uni-mb10">
				<view class="line-item" @click="golink('/pages/message/messageClass/messageClass')">
					<view class="item-left flex1">
						<text class="iconfont icon-pinglun"></text>
						<view class="flex1">我的消息</view>
						<text class="tag" style="border-radius: 100px;" v-if="newscount">{{ newscount }}</text>
					</view>
					<view class="arrowr uni-icon uni-icon-arrowright"></view>
				</view>
				<view class="line-item" @click="golink('/pages/member/invoiceList/invoiceList')">
					<view class="item-left">
						<text class="iconfont icon-fankui"></text>
						<view>发票信息</view>
					</view>
					<view class="arrowr uni-icon uni-icon-arrowright"></view>
				</view>
				<view class="line-item" @click="golink('/pages/member/coupon/coupon')">
					<view class="item-left">
						<image src="https://yd.wtanvxin.com/static/u_6.png" mode="widthFix"></image>
						<view>优惠券</view>
					</view>
					<view class="arrowr uni-icon uni-icon-arrowright"></view>
				</view>
				<view class="line-item" @click="golink('/pages/member/address/address')">
					<view class="item-left">
						<text class="iconfont icon-dizhi"></text>
						<view>收货地址</view>
					</view>
					<view class="arrowr uni-icon uni-icon-arrowright"></view>
				</view>
				<view class="line-item" @click="golink('/pages/member/myAppraise/myAppraise')">
					<view class="item-left">
						<text class="iconfont icon-assess"></text>
						<view>我的评价</view>
					</view>
					<view class="arrowr uni-icon uni-icon-arrowright"></view>
				</view>
				<view class="line-item" @click="golink('/pages/member/orderTui/orderTui')">
					<view class="item-left">
						<text class="iconfont icon-tksh"></text>
						<view>退款/售后</view>
					</view>
					<view class="arrowr uni-icon uni-icon-arrowright"></view>
				</view>
				<view class="line-item" @click="golink('/pages/member/inviteTwo/inviteTwo')">
					<view class="item-left">
						<text class="iconfont icon-fenxiang"></text>
						<view>邀请好友</view>
					</view>
					<view class="arrowr uni-icon uni-icon-arrowright"></view>
				</view>
				<view class="line-item" @click="golink('/pages/member/kefu/kefu')">
					<view class="item-left">
						<text class="iconfont icon-kefu"></text>
						<view>联系客服</view>
					</view>
					<view class="arrowr uni-icon uni-icon-arrowright"></view>
				</view>
				<view class="line-item" @click="golink('/pages/member/question/question')">
					<view class="item-left">
						<text class="iconfont icon-help"></text>
						<view>帮助中心</view>
					</view>
					<view class="arrowr uni-icon uni-icon-arrowright"></view>
				</view>
				<view class="line-item" @click="golink('/pages/member/set/set')">
					<view class="item-left">
						<text class="iconfont icon-shezhi"></text>
						<view>设置</view>
					</view>
					<view class="arrowr uni-icon uni-icon-arrowright"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { host, post, get, toLogin } from '@/common/util.js';
export default {
	data() {
		return {
			userId: '',
			token: '',
			memberInfo: {},
			OrderInfo: {},
			newscount: 0,
			Info: {}
		};
	},
	onLoad() {
		// #ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		// #endif
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		if (toLogin()) {
			this.getMemberInfo();
		}
	},
	methods: {
		// 店铺申请
		async getAttest() {
			if (toLogin()) {
				if (this.memberInfo.IsBusiness) {
					uni.navigateTo({
						url: '/pages/goods/storeIndex/storeIndex?id=' + this.memberInfo.ShopId
					});
				} else {
					let r = await post('User/StoreAuthInfo', {
						UserId: this.userId,
						Token: this.token,
						IsBusiness: 1
					});
					if (r.code == 0) {
						uni.navigateTo({
							url: '/pages/other/applyShop/applyShop'
						});
					} else {
						return;
					}
				}
			}
		},
		// 跳转
		golink(url) {
			if (this.userId && this.token) {
				uni.navigateTo({
					url: url
				});
			} else {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			}
		},
		async getMemberInfo() {
			let result = await post('User/GetCenterInfo', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code === 0) {
				this.memberInfo = result.data;
				uni.setStorageSync('name', this.memberInfo.NickName);
				uni.setStorageSync('Avatar', this.memberInfo.Avatar);
				// uni.setStorageSync('ReferralCode',result.data.ReferralCode)
				// this.$store.commit("update", {
				//   Wallet:result.data.Wallet
				// });
				this.NewsCount();
			} else if (result.code === 2) {
				this.memberInfo = {};
				toLogin();
			}
		},

		async NewsCount() {
			let result = await post('News/NewsCount', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code === 0) {
				this.newscount = result.count;
			}
		}
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
		}
		return {
			title: '英达思创！',
			path: '/pages/tabBar/my/my?inviteCode=' + uni.getStorageSync('ReferralCode'),
			imageUrl: 'http://yd.wtanvxin.com/static/logo.png'
		};
	}
};
</script>

<style scoped lang="scss">
.memberTop {
	position: relative;
	padding: 20upx 30upx 40upx;
	color: #fff;
	background: #2c2d2d;

	.conBox {
		.tx_info * {
			line-height: 1.5;
		}

		.tx_info {
			align-items: center;
			font-size: 28upx;

			.tx {
				margin-right: 20upx;
				border: 1upx solid #fff;
				background-color: #eee;
				width: 130upx;
				height: 130upx;
				border-radius: 50%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.info {
				flex: 1;
				overflow: hidden;
				position: relative;
				padding: 0 30px 0 0;

				.info-item {
					width: 140upx;
					display: flex;
					flex-direction: column;
					justify-content: center;
				}

				.name {
					font-size: 0;
					display: flex;
					align-items: center;

					.txt {
						display: inline-block;
						vertical-align: middle;
						font-size: 34upx;
						color: #fff;
						max-width: 148upx;
						overflow: hidden;
						white-space: nowrap;
						-o-text-overflow: ellipsis;
						text-overflow: ellipsis;
					}
				}

				.attest1 {
					margin-left: 10rpx;
					height: 40rpx;
					line-height: 1.1;
					background-color: #feed00;
					color: #ff3333;
					font-size: 20rpx;
					border-radius: 40rpx;
					padding-right: 10upx;

					image {
						width: 40rpx;
						height: 40rpx;
						border-radius: 100%;
					}
				}
			}

			.attest {
				padding: 5rpx 30rpx;
				background-color: rgba(#ffffff, 0.4);
				color: #fff;
				z-index: 2;
				border-radius: 30rpx;
			}
		}

		.u_data {
			margin-top: 40upx;

			.item {
				width: 25%;

				.num {
					font-size: 40upx;
					line-height: 1.5;
				}

				.txt {
					color: #999;
				}
			}
		}
	}
}

.circleNum {
	position: absolute;
	content: '';
	top: -10upx;
	right: -16upx;
	font-size: 20upx;
	color: #ff3333;
	border: 1upx solid #ff3333;
	background-color: #fff;
	min-width: 36upx;
	height: 36upx;
	line-height: 36upx;
	border-radius: 100%;
	text-align: center;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}

.memberIndex_section {
	.section_bd {
		padding: 30upx 20upx 0;
	}

	.item {
		margin-bottom: 30upx;

		.iconImg {
			width: 60upx;
			height: 60upx;
			margin: 0 auto 6upx;
		}

		.txt {
			font-size: 22upx;
		}
	}
}

.memberIndex_list {
	.item-left {
		display: flex;
		align-items: center;
		image {
			width: 44upx;
			height: 44upx;
			margin-right: 20upx;
		}
		.iconfont {
			font-size: 44upx;
			line-height: 1;
			margin-right: 20upx;
		}
		view {
			font-size: 30upx;
		}
	}

	.arrowr {
		color: #ccc;
		font-size: 36upx;
		line-height: 1.2;
		.rag {
			background: $primary;
			color: #fff;
			border-radius: 100px;
			font-size: 24upx;
			padding: 0 8upx;
			float: left;
			margin: 6upx 0;
		}
	}
}
</style>
