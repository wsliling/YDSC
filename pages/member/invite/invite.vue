<template>
  <view class="content">
	  <html2canvas ref="html2canvas" :domId="domId" @renderFinish="renderFinish">
	  	<view class="inviteBox p_re" id="poster">
			<view class="user flex-start">
				<view class="tx">
					<image class="user-img" :src="avaurl"></image>
				</view>
				<view class="text_left">
					<text class="user-name">{{NickName}}</text>
					<view class="tel" @click="copy(ReferralCode)">邀请码：{{ReferralCode}}</view>
				</view>
			</view>
			<view class="maxtxt">
				亿喜直播电商系统,3223个《亿喜主播之家》联动,把好产品卖到全国2856个县区,服务亿万家庭,托起亿万财富!
			</view>
			<view class="code flex-start">
				<image class="code_img" :src="codeurl"></image>
				<text>长按识别图中二维码</text>
			</view>
			
			<view class="tip">
				出示二维码，好友注册时扫码可建立邀请关系
			</view>
			<!-- #ifdef H5 -->
			<image class="h5img" v-if="saveImgurl" :src="saveImgurl" mode="widthFix"></image>
			<!-- #endif -->
		</view>
	  </html2canvas> 
		  <view class="joinImg">
		  	<view  @click="Wxshare">保存相册</view>
			<!-- #ifndef MP-WEIXIN -->
		  	<view @click="sharePlus">立即邀请</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<button type="default" open-type="share">
				立即邀请
			</button>
			<!-- #endif -->
		  </view>
  </view>
</template>

<script>
import {post,permision} from '@/common/util.js'
import { base64ToPath, pathToBase64 } from '@/common/image-tools.js';
export default {
  data () {
    return {
	  domId:'',
      userId:"",
      token:"",
      tel:"出示二维码，好友注册时扫码可建立邀请关系",
      Avatar:"",
      info:{},
      codeurl:"",
      avaurl:"",
      saveImgurl:"",
	  shareImgUrl:'',//h5分享好友图片
	  disabled: false,
	  canvasWidthPx:300,
	  canvasHeightPx:450,
	  NickName:'',
	  ReferralCode:'',//自己的邀请码
    }
  },

  async onLoad(){
    this.userId = uni.getStorageSync("userId");
    this.token = uni.getStorageSync("token");
    this.ReferralCode = uni.getStorageSync("ReferralCode");//自己的邀请码
	this.NickName=uni.getStorageSync("name");
	try{
		const imgInfo = await uni.getImageInfo({
			src: uni.getStorageSync("Avatar")||'http://xcx.yixijiu19.com/static/default.png'
		});
		const imgInfo2 = await uni.getImageInfo({
			src: uni.getStorageSync("qrimg")
		});
		this.avaurl = await pathToBase64(imgInfo[1].path);
		this.codeurl= await pathToBase64(imgInfo2[1].path);
	}catch(e){
		//TODO handle the exception
	}
  },
  onShow(){
   
  },
  mounted() {
  	this.domId = '#poster'
  },
  onShareAppMessage(res){
	   if (res.from === 'button') {// 来自页面内分享按钮
	        console.log(res.target)
	      }
	      return {
	        title: '亿喜小程序！',
	        path: '/pages/register/register?inviteCode='+this.ReferralCode,
			imageUrl:'http://xcx.yixijiu19.com/static/logo.png'
	      }
  },
  methods: {
	sharePlus(){
		console.log(this.codeurl,"app分享微信好友拉！！！！！！")
		// #ifdef APP-PLUS
			uni.share({
				provider: "weixin",
				scene: "WXSceneSession",
				type: 0,
				href: "http://xcx.yixijiu19.com/#/pages/register/register?inviteCode="+this.ReferralCode,
				title: "亿喜APP！",
				summary: "我正在使用亿喜APP，赶紧跟我一起来体验！",
				imageUrl: 'http://xcx.yixijiu19.com/static/logo.png',
				// miniProgram:{
				// 	id:'gh_da1c486d94da',
				// 	path: '/pages/register/register?inviteCode='+this.ReferralCode,
				// 	type:2,
				// 	webUrl:"http://xcx.yixijiu19.com"
				// },
				success: function (res) { 
					console.log("success:" + JSON.stringify(res));
				},
				fail: function (err) {
					console.log("fail:" + JSON.stringify(err));
				}
			});
		// #endif
	},
    
	blur() {
		this.disabled = true;
	},
	// 判断是否已开启权限
	async quanxian() {
		let platform = uni.getSystemInfoSync()&&uni.getSystemInfoSync().platform;
		switch (uni.getSystemInfoSync().platform) {
			case 'android':
				var res = await permision.requestAndroidPermission('android.permission.WRITE_EXTERNAL_STORAGE');
				if(res == 1){//已经获取授权开始
					
				}else{
					uni.showToast({
						title: '请先开启相册权限',
						icon: 'none',
						success() {
							// permision.gotoAppPermissionSetting();
						}
					});
				}
				break;
	
			case 'ios':
				var iosres = await permision.judgeIosPermission('photoLibrary');
				if(iosres){//已经获取授权
					
				}else{
					uni.showModal({  
						content: '请先开启相册权限！',  
						confirmText: '设置',  
						success: res => {  
							if(res.confirm) {  
								plus.runtime.openURL('app-settings://')  
							} else {  
								uni.navigateBack({  
									delta: 1  
								})  
							}  
						}  
					}); 
				}
			break;
		}
	},
	
    Wxshare(){
		//#ifndef H5
		var _this=this
		this.quanxian();
		uni.saveImageToPhotosAlbum({  //保存图片到相册
		  filePath: _this.saveImgurl,
		  success: function (result) {
			uni.showToast({
			  title: "图片保存成功！",
			  duration: 2000,
			  success() {
		
			  }
			})
		  },
		  fail(res) {
		  	console.log(res)
		  }
		})
		//#endif
		//#ifdef H5
		uni.showToast({
			icon: "none",
			title: "请长按保存图片"
		})
		//#endif
    },
   	
	renderFinish(filePath) {
		this.saveImgurl = filePath;
		console.log("filePath", filePath)
	},
    copy(str){
		//#ifndef APP-PLUS
      uni.showModal({
        title:'复制邀请码？',
        content:str,
        success(res){
          if(res.confirm){
           uni.setClipboardData({
              data: str,
              success (res) {
              
              }
            })
          }
        }
      })
	  //#endif
	  //#ifdef APP-PLUS
	  this.$showModal({
	  	title:'复制邀请码？',
	  	content: str,
	  }).then(res=>{
	  	uni.setClipboardData({
	  	   data: str,
	  	   success (res) {
	  	   
	  	   }
	  	 })
	  	//确认
	    }).catch(res=>{
	  	//取消
	    })
	  //#endif
    },
  }
}
</script>

<style scoped lang='scss'>
	.content{
		padding: 60rpx;
	}
.inviteBox{
	/* width: 100%; */
	background-color: #fff;
	/* height: 62vh; */
	margin-bottom: 60rpx;
	border-radius: 20rpx;
	text-align: center;
	box-shadow: 1px 1px 10px #999;
	overflow: hidden;
	.code{
		text-align: center;
		padding: 30rpx 30rpx 0;
		image{
			width: 220rpx;
			height: 220rpx;
			margin-right: 20rpx;
		}
	}
	.maxtxt{
		font-size: 60rpx;
		font-weight: bold;
		line-height: 1.2;
		text-align: justify;
		text-indent: 120rpx;
		padding: 0 30rpx;
	}
	.user{
		padding: 30rpx;
		.tx{
			margin-right: 20rpx;
			image{
				display: block;
				margin: 0 auto;
				width: 90rpx;
				height: 90rpx;
				/* border-radius: 100%; */
			}
		}
		.user-name{
			line-height: 1;
		}
		.tel{
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
	
	.tip{
		margin: 20rpx 20rpx 0;
		border-top: 1rpx solid #ececec;
		font-size: 24rpx;
		color: #999;
		height: 80rpx;
		line-height: 80rpx;
	}
	.h5img{
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
	}
}
.joinImg{
		/* width: 100%; */
		display: flex;
		align-items: center;
		color: #fff;
		/* text-align: center; */
		height: 88upx;
		justify-content: center;
		flex-wrap: wrap;
		view{
			margin-top: 20rpx;
			text-align: center;
			border-radius: 40upx;
			background-color: $primary;
			line-height: 70upx;
			padding: 0 60rpx;
			font-size: 28upx;
			box-shadow: 1px 1px 10px #999;
		}
		button{
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
		view:first-of-type{
			background-color: #fff;
			color: #333;
			margin-right: 90rpx;
		}
	}
</style>

