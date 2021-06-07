<template>
	<view class="invite bg_fff" style=" padding-bottom: 30upx;overflow:hidden;position: fixed;">
		<view id="bb_canvas">
			<view class="inn_bg "><image src="https://yd.wtanvxin.com/static/invite.png" class="invite"></image></view>
			<view class="invite_box">
				<view class="inn-title">邀请好友</view>
				<view class="inn-content">
					<image class="user-img" :src="Avatar"></image>
					<text class="user-name">{{ NickName }}</text>
					<view class="tel" @click="copybtn(info.ReferralCode)">邀请码：{{ info.ReferralCode }}</view>
					<image class="code_img" :src="info.InviteQRcode"></image>
					<view class="tip">出示二维码，好友扫码注册时可建立邀请关系</view>
				</view>
			</view>
			<view class="joinImg">
				<!-- #ifdef H5-->
				<view @click="H5share">立即邀请</view>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<view @click="sharePlus">立即邀请</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<button type="default" open-type="share">立即邀请</button>
				<!-- #endif -->
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
			Avatar: '',
			info: {},
			bgurl: '',
			codeurl: '',
			avaurl: '',
			NickName: ''
		};
	},
	onLoad() {
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.InviteFriends();
		this.GetCenterInfo();
	},

	methods: {
		sharePlus() {
			// #ifdef APP-PLUS
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 0,
				href: 'https://yd.wtanvxin.com/#/pages/tabBar/index/index?inviteCode=' + this.info.ReferralCode,
				title: '英达思创等你来！',
				summary: '我正在使用英达思创，赶紧跟我一起来体验！',
				imageUrl: this.codeurl,
				success: function(res) {
					console.log('success:' + JSON.stringify(res));
				},
				fail: function(err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
			// #endif
		},
		copybtn(str) {
			//#ifdef MP-WEIXIN
			uni.showModal({
				title: '复制邀请码？',
				content: str,
				success(res) {
					if (res.confirm) {
						uni.setClipboardData({
							data: str,
							success(res) {
								uni.showToast({
									title: '复制成功',
									duration: 1000,
									icon: 'none'
								});
							}
						});
					}
				}
			});
			//#endif
			//#ifdef APP-PLUS
			this.$showModal({
				title: '复制邀请码？',
				content: str
			})
				.then(res => {
					uni.setClipboardData({
						data: str,
						success(res) {}
					});
					//确认
				})
				.catch(res => {
					//取消
				});
			//#endif
		},
		H5share() {
			uni.showToast({
				icon: 'none',
				title: '请长按保存图片'
			});
		},
		GetCenterInfo() {
			post('User/GetCenterInfo', {
				UserId: this.userId,
				Token: this.token
			}).then(res => {
				this.Avatar = res.data.Avatar;
				this.NickName = res.data.NickName;
				var _this = this;
				uni.getImageInfo({
					src: 'https://yd.wtanvxin.com/static/invite.png', //服务器返回的图片地址
					success: function(res) {
						//res.path是网络图片的本地地址
						_this.bgurl = res.path;
					},
					fail: function(err) {
						//失败回调
					}
				});
				uni.getImageInfo({
					src: this.Avatar, //服务器返回的图片地址
					success: function(res) {
						//res.path是网络图片的本地地址
						_this.avaurl = res.path;
					},
					fail: function(err) {
						//失败回调
					}
				});
			});
		},
		InviteFriends() {
			post('User/InviteFriends', {
				UserId: this.userId,
				Token: this.token
			}).then(res => {
				this.info = res.data;
				var _this = this;
				uni.getImageInfo({
					src: this.info.InviteQRcode, //服务器返回的图片地址
					success: function(res) {
						//res.path是网络图片的本地地址
						_this.codeurl = res.path;
					},
					fail: function(err) {
						//失败回调
					}
				});
			});
		}
	},
	onShareAppMessage(res) {
		return {
			title: '英达思创！',
			path: '/pages/tabBar/index/index?inviteCode=' + this.info.ReferralCode,
			imageUrl: 'https://yd.wtanvxin.com/static/logo.png'
		};
	},
	onPullDownRefresh() {
		this.InviteFriends();
		this.GetCenterInfo();
		uni.stopPullDownRefresh();
	}
};
</script>

<style scoped lang="scss">
.invite {
	background-color: #f5f5f5;
	height: 100vh;
}
.inn_bg {
	width: 750upx;
	height: 1210upx;
	position: relative;
	.invite {
		width: 750upx;
		top: 0;
		height: 100vh;
		position: absolute;
		bottom: 0;
		left: 0;
	}
}
.invite_box {
	background-color: #fff;
	margin: -800upx 30upx;
	/* height: 600upx; */
	position: relative;
	border-radius: 20upx;
	.inn-title {
		position: absolute;
		top: -35upx;
		left: 21%;
		height: 70upx;
		width: 400upx;
		border-radius: 20upx;
		background-color: #ec022d;
		color: #fff;
		font-size: 32upx;
		text-align: center;
		line-height: 70upx;
	}
	.inn-content {
		padding: 55upx 105upx 30upx;
		text-align: center;
		.user-img {
			width: 100upx;
			height: 100upx;
			border-radius: 50%;
			margin: 0;
		}
		text {
			display: block;
			margin-top: 15upx;
		}
		.tel {
			display: inline-block;
			text-align: center;
			border-radius: 40upx;
			width: 350upx;
			height: 60upx;
			line-height: 60upx;
			background-color: #f2f2f2;
			margin-top: 15upx;
		}
		.code_img {
			display: block;
			margin: 0 auto;
			margin-top: 20upx;
			width: 200upx;
			height: 200upx;
		}
		.tip {
			font-size: 24upx;
			color: #999;
		}
	}
}
.joinImg {
	/* width: 100%; */
	margin: 570upx 30upx;
	color: #fff;
	text-align: center;
	height: 88upx;
	border-radius: 40upx;
	background-color: #ec022d;
	position: relative;
	top: 280upx;
	view {
		line-height: 88upx;
		font-size: 32upx;
	}
	button {
		background-color: #ec022d;
		color: #fff;
		border-radius: 40upx;
	}
}
.ava {
	width: 100upx;
	height: 100upx;
	margin: 0;
}
.code_img {
	width: 160upx;
	height: 160upx;
}
.yy_ma {
	background: #7364ca;
	padding: 2upx 15upx;
	border-radius: 20upx;
	font-size: 24upx;
	color: #ffffff;
}
.yy_scan {
	background: #7364ca;
	color: #ffffff;
	border-radius: 30upx;
	width: 280upx;
	margin-left: 30upx;
	padding: 5upx 0;
	text-align: center;
	display: inline-block;
}
.yy_scan_save {
	background: #7364ca;
	color: #ffffff;
	border-radius: 30upx;
	width: 560upx;
	margin: 50upx auto;
	padding: 5upx 0;
	text-align: center;
	display: block;
}
.mask {
	z-index: 1;
}
.saveBtn {
	left: 0;
	z-index: 1;
}
.modal_mask {
	position: fixed;
	height: 200upx;
	z-index: 30;
	width: 100%;
	background: #ffffff;
	bottom: 0;
	.circle_img {
		width: 96upx;
		height: 96upx;
	}
	button {
		margin: 0;
		padding: 0;
		border: none;
		display: block;
		background: #fff;
		line-height: 1.3;
		p {
			font-size: 28upx;
		}
		img {
			display: block;
			margin: 0 auto;
			width: 96upx;
			height: 96upx;
			margin-bottom: 10upx;
		}
	}
	button::after {
		border: 0;
	}
}
.saveBtn {
	width: 100%;
	position: fixed;
	bottom: 0;
	height: 88upx;
	line-height: 88upx;
	background: #ff3333;
	color: #fff;
	text-align: center;
	z-index: 998;
}
.imgbox {
	width: 600upx;
	height: 1000upx;
	position: fixed;
	top: 46%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 10;
	background: #fff;
	.share-canvas {
		width: 100%;
		height: 100%;
	}
	img {
		width: 100%;
		height: 100%;
	}
}
.emptybox {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	image {
		width: 200upx;
		height: 200upx;
	}
}
</style>
