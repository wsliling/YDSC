<template>
	<view class="invite bg_fff" style=" padding-bottom: 30upx;overflow:hidden;position: fixed;">
		<view id="bb_canvas">
			<view class="inn_bg "><image src="@/static/invite.png" alt="" class="invite"></image></view>
			<view class="invite_box">
				<view class="inn-title">邀请好友</view>
				<view class="inn-content">
					<image class="user-img" :src="Avatar"></image>
					<text class="user-name">{{ NickName }}</text>
					<view class="tel" @click="copybtn()">复制邀请码：{{ info.ReferralCode }}</view>
					<image class="code_img" :src="info.InviteQRcode"></image>
					<view class="tip">出示二维码，好友扫码注册时可建立邀请关系</view>
				</view>
			</view>
			<view class="joinImg" @click="saveImg"><view>立即邀请</view></view>
			<!-- <view class=" flex bg_fff pp3 flexAlignCenter">
				  <view class=" flex flexColumn flex1 justifyContentStart">
					  <view class=" flex flexAlignCenter">
						  <image :src="Avatar" alt="" class="ava mr2"></image>
						  <view class="mr2" style="margin-left:20upx;">
							  <view>{{tel}}</view>
							  <view class="font20 yy_ma mt1" @click="">邀请码：{{info.ReferralCode}}</view>
						  </view>
					  </view>
				  </view>
				  <image :src="info.InviteQRcode" alt="" class="code_img"></image>
			  </view> -->
		</view>
		<!-- <view class="yy_scan font30 " @click="showShare" >点击分享</view> -->
		<!--分享-->
		<!-- <view class="mask" v-if="isShowShare" @click="cancelShare" @catchtouchmove="true"></view> -->
		<!-- <view class="modal_mask flex justifyContentAround pp3" v-if="isShowShare">
			 <view class="flex flexColumn flexAlignCenter" @click="sharePlus">
				  <image src="http://jyy.wtvxin.com/static/images/icons/vy.png" alt="" class="circle_img"></image>
				  <view class="mt1 flex1 font18">分享微信好友</view>
			  </view>
			
				<view class="flex flexColumn flexAlignCenter" @click="saveImg">
					<image src="http://jyy.wtvxin.com/static/images/icons/quan.png" alt="" class="circle_img"></image>
					<view class="mt1 flex1 font18">分享到朋友圈</view>
				</view>
			 
		  </view> -->
		<!-- 保存海报 -->
		<view class="mask" v-if="showImg" @catchtouchmove="true"></view>
		<!-- #ifndef H5-->
		<view class="imgbox" v-if="showImg">
			<canvas canvas-id="myCanvas" disable-scroll="true" @touchmove="touchMove" class="share-canvas" style="width:100%;height:100%;" v-if="!hasimg"></canvas>
			<image :src="saveImgurl" alt="" v-else style="width:100%;height:100%;"></image>
		</view>
		<view class="saveBtn" v-if="showImg" @click="Wxshare">保存至相册</view>
		<!-- #endif -->
	</view>
</template>

<script>
import { post } from '@/common/util.js';
import { pathToBase64, base64ToPath } from '@/common/image-tools.js';

export default {
	data() {
		return {
			userId: '',
			token: '',
			tel: '',
			Avatar: '',
			info: {},
			isShowShare: false,
			showImg: false,
			bgurl: '',
			codeurl: '',
			avaurl: '',
			hasimg: false,
			saveImgurl: '',
			shareImgUrl: '', //h5分享好友图片
			disabled: false,
			canvasWidthPx: 300,
			canvasHeightPx: 500,
			NickName: ''
		};
	},

	onLoad() {},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.hasimg = false;
		this.showImg = false;
		this.isShowShare = false;
		this.InviteFriends();
		this.GetCenterInfo();
	},

	methods: {
		touchMove() {
			console.log('jinzhi');
		},
		showShare() {
			this.isShowShare = true;
		},
		cancelShare() {
			this.isShowShare = false;
		},
		sharePlus() {
			console.log(this.codeurl, 'app分享微信好友拉！！！！！！');
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 0,
				href: 'http://shop.dadanyipin.com/#/pages/tabBar/index/index?inviteCode=' + this.info.ReferralCode,
				title: '大单易拼等你来！',
				summary: '我正在使用大单易拼，赶紧跟我一起来体验！',
				imageUrl: this.codeurl,
				success: function(res) {
					console.log('success:' + JSON.stringify(res));
				},
				fail: function(err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
		},
		saveImg() {
			this.showImg = true;
			this.isShowShare = false;
			//#ifndef H5
			setTimeout(() => {
				this.drawCanvas();
			}, 100);
			//#endif
		},
		blur() {
			this.disabled = true;
		},
		copybtn() {},
		H5share() {
			uni.showToast({
				icon: 'none',
				title: '请长按保存图片'
			});
		},
		drawCanvas() {
			let _this = this;
			if (!this.hasimg) {
				const ctx = uni.createCanvasContext('myCanvas');
				//背景图片
				// #ifndef MP-WEIXIN
				var codeurl = this.info.InviteQRcode;
				// #endif

				var bgurl = this.bgurl;
				var avaurl = this.avaurl;
				// var tel=this.tel
				var code = '邀请码：' + this.info.ReferralCode;
				console.log(bgurl, 'bgurl');
				console.log(codeurl);
				//画布背景填色
				ctx.setFillStyle('#ffffff');
				ctx.fillRect(0, 0, 300, 500);
				// ctx.setFillStyle('#5A4ABA')
				// ctx.fillRect(0, 0, 300, 32);
				//图片
				// ctx.setFillStyle('#fff')
				ctx.drawImage(bgurl, 0, 0, 300, 350);
				ctx.drawImage(avaurl, 12, 410, 50, 50); //头像没有路径
				// console.log(tel)
				//说明文字
				ctx.setFontSize(12);
				ctx.setFillStyle('#FFFFFF');
				// ctx.fillText(tel, 80, 420)
				ctx.setFontSize(9);
				ctx.setFillStyle('#ee9b11');
				this.drawRoundedRect(ctx, '#ee9b11', '#ee9b11', 74, 435, 90, 18, 9);
				ctx.setFillStyle('#ffffff');
				ctx.fillText(code, 84, 447.5);

				ctx.rect(200, 400, 64, 64);
				ctx.stroke();
				ctx.drawImage(codeurl, 200, 400, 64, 64);

				ctx.draw(true, function() {
					uni.canvasToTempFilePath({
						canvasId: 'myCanvas',
						x: 0,
						y: 0,
						width: 300 - 12, //截取canvas的宽度 -10解决白边问题
						height: 500, //截取canvas的高度
						destWidth: 600, //输出图片宽度
						destHeight: 1000,
						quality: 1,
						success: function(res) {
							console.log(res, 'pppppppppppppp');
							_this.hasimg = true;
							_this.saveImgurl = res.tempFilePath;
							console.log(_this.saveImgurl, '画布画图。。。');
						}
					});
				});
			}
		},
		Wxshare() {
			var _this = this;
			console.log(321);
			uni.saveImageToPhotosAlbum({
				//保存图片到相册
				filePath: _this.saveImgurl,
				success: function(result) {
					uni.showToast({
						title: '图片保存成功！',
						duration: 2000,
						success() {
							setTimeout(function() {
								_this.showImg = false;
							}, 2000);
						}
					});
					// // #ifdef APP-PLUS
					// uni.share({
					//     provider: "weixin",
					//     scene: "WXSenceTimeline",
					//     type: 2,
					//     imageUrl: _this.saveImgurl,
					//     success: function (res) {
					//         console.log("success:" + JSON.stringify(res));
					//     },
					//     fail: function (err) {
					//         console.log("fail:" + JSON.stringify(err));
					//     }
					// });
					// // #endif
				}
			});
		},
		roundedRect(ctx, x, y, width, height, radius) {
			if (width <= 0 || height <= 0) {
				ctx.arc(x, y, radius, 0, Math.PI * 2);
				return;
			}
			ctx.moveTo(x + radius, y);
			ctx.arcTo(x + width, y, x + width, y + height, radius);
			ctx.arcTo(x + width, y + height, x, y + height, radius);
			ctx.arcTo(x, y + height, x, y, radius);
			ctx.arcTo(x, y, x + radius, y, radius);
		},
		drawRoundedRect(ctx, strokeStyle, fillStyle, x, y, width, height, radius) {
			ctx.beginPath();
			this.roundedRect(ctx, x, y, width, height, radius);
			ctx.strokeStyle = strokeStyle;
			ctx.fillStyle = fillStyle;
			ctx.stroke();
			ctx.fill();
		},
		GetCenterInfo() {
			post('User/GetCenterInfo', {
				UserId: this.userId,
				Token: this.token
			}).then(res => {
				console.log(res.data);
				// this.tel = res.data.Mobile;
				this.Avatar = res.data.Avatar;
				this.NickName = res.data.NickName;
				var _this = this;
				uni.getImageInfo({
					src: '../../../static/invite.png', //服务器返回的图片地址
					success: function(res) {
						console.log(res.path, 'res');
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
						console.log(res.path, '邀请好友');
						_this.codeurl = res.path;
					},
					fail: function(err) {
						//失败回调
					}
				});
			});
		},
		copy(str) {
			uni.showModal({
				title: '复制邀请码？',
				content: str,
				success(res) {
					if (res.confirm) {
						uni.setClipboardData({
							data: str,
							success(res) {}
						});
					}
				}
			});
		}
	},
	// onShareAppMessage: function() {
	//  console.log(this.info.ReferralCode,"this.info.ReferralCode")
	//   return {
	//     title: "大单易拼", //转发页面的标题
	//     path: '/pages/tabBar/index/index?inviteCode='+this.info.ReferralCode
	//   }
	// },
	onPullDownRefresh() {
		this.hasimg = false;
		this.showImg = false;
		this.isShowShare = false;
		this.InviteFriends();
		this.GetCenterInfo();
		uni.stopPullDownRefresh();
	}
};
</script>

<style scoped lang="scss">
.invite {
	background-color: #f5f5f5;
}
.inn_bg {
	width: 750upx;
	/* height:644upx; */
	height: 1246upx;
	position: relative;
	.invite {
		width: 750upx;
		top: 0;
		height: auto;
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
			/* line-height: none; */
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
	margin: 580upx 30upx;
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
