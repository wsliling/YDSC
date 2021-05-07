<template>
	<view>
		<view class="inviteBox" v-if="false">
			<view class="user flex-start">
				<view class="tx"><image class="user-img" :src="Avatar || 'http://yd.wtanvxin.com/static/default.png'"></image></view>
				<view class="text_left">
					<text class="user-name">{{ NickName }}</text>
					<view class="tel" @click="copybtn()">邀请码：{{ ReferralCode }}</view>
				</view>
			</view>
			<view class="maxtxt">英达思创直播电商系统,3223个《英达思创主播之家》联动,把好产品卖到全国2856个县区,服务亿万家庭,托起亿万财富!</view>
			<view class="code flex-start">
				<image class="code_img" :src="codeurl"></image>
				<text>长按识别图中二维码</text>
			</view>

			<view class="tip">出示二维码，好友注册时扫码可建立邀请关系</view>
		</view>

		<!-- 保存海报 -->
		<!-- <view class="mask" v-if="showImg" @click="getclose" @catchtouchmove="true"></view> -->

		<view class="imgbox" v-if="showImg">
			<canvas canvas-id="myCanvas" disable-scroll="true" @touchmove="touchMove" class="share-canvas" style="width:100%;height:100%;" v-if="!hasimg"></canvas>
			<image :src="saveImgurl" alt="" v-else style="width:100%;height:100%;"></image>
		</view>
		<!-- <view class="saveBtn" v-if="showImg" @click="Wxshare">保存至相册</view> -->
		<view class="joinImg">
			<view @click="Wxshare">保存相册</view>
			<!-- #ifndef MP-WEIXIN -->
			<view @click="sharePlus">立即邀请</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<button type="default" open-type="share">立即邀请</button>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
// import {pathToBase64} from '@/common/image-tools.js';
export default {
	data() {
		return {
			userId: '',
			token: '',
			tel: '出示二维码，好友注册时扫码可建立邀请关系',
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
			canvasHeightPx: 450,
			NickName: '',
			ReferralCode: '' //自己的邀请码
		};
	},

	onLoad() {},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.ReferralCode = uni.getStorageSync('ReferralCode'); //自己的邀请码
		this.hasimg = false;
		this.showImg = false;
		this.isShowShare = false;
		this.GetCenterInfo();
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内分享按钮
			console.log(res.target);
		}
		return {
			title: '英达思创小程序！',
			path: '/pages/register/register?inviteCode=' + this.ReferralCode,
			imageUrl: 'http://yd.wtanvxin.com/static/logo.png'
		};
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
			// #ifdef APP-PLUS
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 0,
				href: 'http://yd.wtanvxin.com/#/pages/register/register?inviteCode=' + this.ReferralCode,
				title: '英达思创APP！',
				summary: '我正在使用英达思创APP，赶紧跟我一起来体验！',
				imageUrl: 'http://yd.wtanvxin.com/static/logo.png',
				// miniProgram:{
				// 	id:'gh_da1c486d94da',
				// 	path: '/pages/register/register?inviteCode='+this.ReferralCode,
				// 	type:2,
				// 	webUrl:"http://yd.wtanvxin.com"
				// },
				success: function(res) {
					console.log('success:' + JSON.stringify(res));
				},
				fail: function(err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
			// #endif
		},
		saveImg() {
			// this.showImg=true
			// this.isShowShare=false
		},
		blur() {
			this.disabled = true;
		},

		H5share() {
			uni.showToast({
				icon: 'none',
				title: '请长按保存图片'
			});
		},
		getclose() {
			this.showImg = false;
		},
		drawCanvas() {
			let _this = this;
			// if(!this.hasimg){
			const ctx = uni.createCanvasContext('myCanvas', this);
			//背景图片
			var avaurl = this.avaurl;
			var codeurl = this.codeurl;
			var tel = this.tel;
			var name = this.NickName;
			var code = '邀请码：' + this.ReferralCode;
			var tiptxt = '长按识别图中二维码';
			var maxtxturl = this.bgurl;
			//画布背景填色
			ctx.setFillStyle('#ffffff');
			ctx.fillRect(0, 0, 300, 450);
			ctx.drawImage(avaurl, 15, 15, 45, 45); //头像没有路径
			ctx.drawImage(maxtxturl, -5, 70, 300, 217);
			ctx.drawImage(codeurl, 15, 290, 100, 100);
			//说明文字
			ctx.setFontSize(12);
			ctx.setFillStyle('#999999');
			ctx.fillText(tel, 25, 410);

			ctx.setFontSize(14);
			ctx.setFillStyle('#333333');
			ctx.fillText(name, 75, 30);

			this.drawRoundedRect(ctx, '#ee9b11', '#ee9b11', 75, 40, 94, 18, 9);
			ctx.setFontSize(11);
			ctx.setFillStyle('#ffffff');
			ctx.fillText(code, 80, 53);

			ctx.setFontSize(13);
			ctx.setFillStyle('#333333');
			ctx.fillText(tiptxt, 120, 352);
			ctx.stroke();
			ctx.draw(true, function() {
				uni.canvasToTempFilePath({
					canvasId: 'myCanvas',
					x: 0,
					y: 0,
					width: 300 - 12, //截取canvas的宽度 -10解决白边问题
					height: 450, //截取canvas的高度
					destWidth: 600, //输出图片宽度
					destHeight: 900,
					fileType: 'jpg',
					quality: 1,
					success: function(res) {
						_this.hasimg = true;
						console.log(res);
						_this.saveImgurl = res.tempFilePath;
					},
					fail(res) {
						console.log(res);
					}
				});
			});
			// }
		},
		Wxshare() {
			var _this = this;
			uni.saveImageToPhotosAlbum({
				//保存图片到相册
				filePath: _this.saveImgurl,
				success: function(result) {
					uni.showToast({
						title: '图片保存成功！',
						duration: 2000,
						success() {
							//  	setTimeout(function(){
							// 	_this.showImg=false
							// },2000)
						}
					});
				},
				fail(res) {
					console.log(res);
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
			let _this = this;
			post('User/GetCenterInfo', {
				UserId: this.userId,
				Token: this.token
			}).then(res => {
				console.log(res.data);
				// this.tel = res.data.Mobile;
				this.Avatar = res.data.Avatar || 'http://yd.wtanvxin.com/static/default.png';
				this.NickName = res.data.NickName;
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
			uni.getImageInfo({
				src: 'http://yd.wtanvxin.com/static/maxtxt.jpg', //服务器返回的图片地址
				success: function(res) {
					console.log(res.path, 'res');
					//res.path是网络图片的本地地址
					_this.bgurl = res.path;
				},
				fail: function(err) {
					//失败回调
				}
			});
			let url = '',
				qrimg = '';
			//#ifdef MP-WEIXIN
			url = 'User/GenerateImage';
			//#endif
			// #ifndef MP-WEIXIN
			url = 'User/InviteFriends';
			//#endif
			post(url, {
				UserId: this.userId,
				Token: this.token
			}).then(_res => {
				//#ifdef MP-WEIXIN
				qrimg = _res.data.TcQRcode;
				//#endif
				// #ifndef MP-WEIXIN
				qrimg = _res.data.InviteQRcode;
				//#endif
				uni.getImageInfo({
					src: qrimg, //服务器返回的图片地址
					success: function(e) {
						//res.path是网络图片的本地地址
						console.log(e.path, '邀请好友');
						_this.codeurl = e.path;
					},
					fail: function(err) {
						//失败回调
					}
				});
			});
			_this.showImg = true;
			//#ifndef H5
			setTimeout(() => {
				_this.drawCanvas();
			}, 200);
			//#endif
		},

		copy(str) {
			//#ifndef APP-PLUS
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
		}
	},
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
	height: 900upx;
	margin: 60rpx auto;
	/* position: fixed;
  top: 46%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 998; */
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 1px 1px 10px #999;
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
.inviteBox {
	/* width: 100%; */
	margin: 60rpx 60rpx;
	background-color: #fff;
	/* height: 62vh; */
	border-radius: 20rpx;
	text-align: center;
	box-shadow: 1px 1px 10px #999;
	.code {
		text-align: center;
		padding: 30rpx 30rpx 0;
		image {
			width: 200rpx;
			height: 200rpx;
			margin-right: 20rpx;
		}
	}
	.maxtxt {
		font-size: 60rpx;
		font-weight: bold;
		line-height: 1.2;
		text-align: justify;
		text-indent: 120rpx;
		padding: 0 30rpx;
	}
	.user {
		padding: 30rpx;
		.tx {
			margin-right: 20rpx;
			image {
				display: block;
				margin: 0 auto;
				width: 90rpx;
				height: 90rpx;
				/* border-radius: 100%; */
			}
		}
		.user-name {
			line-height: 1;
		}
		.tel {
			/* width: 240rpx; */
			display: block;
			font-size: 24rpx;
			background-color: #ee9b11;
			border-radius: 40rpx;
			text-align: center;
			padding: 5rpx 20rpx;
			color: #fff;
		}
	}

	.tip {
		margin: 20rpx 20rpx 0;
		border-top: 1rpx solid #ececec;
		font-size: 24rpx;
		color: #999;
		height: 80rpx;
		line-height: 80rpx;
	}
}
.joinImg {
	/* width: 100%; */
	display: flex;
	align-items: center;
	color: #fff;
	/* text-align: center; */
	height: 88upx;
	justify-content: center;
	flex-wrap: wrap;
	view {
		margin-top: 20rpx;
		text-align: center;
		border-radius: 40upx;
		background-color: $primary;
		line-height: 70upx;
		padding: 0 60rpx;
		font-size: 28upx;
		box-shadow: 1px 1px 10px #999;
	}
	button {
		margin-top: 20rpx;
		text-align: center;
		border-radius: 40upx;
		background-color: $primary;
		line-height: 70upx;
		padding: 0 60rpx;
		font-size: 28upx;
		box-shadow: 1px 1px 10px #999;
		color: #fff;
	}
	view:first-of-type {
		background-color: #fff;
		color: #333;
		margin-right: 90rpx;
	}
}
</style>
