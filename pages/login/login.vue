<template>
	<view class="content">
		<view class="regLoginBox" v-if="isShowMolie">
			<view class="logo">
				<view class="img">
					<image class="logoimg" src="/static/logo.png" mode="widthFix"></image>
					<view class="Title">英达思创</view>
				</view>
			</view>
			<view class="from pd10">
				<view class="from-line">
					<view :class="['iconfont',logintype?'icon-iconzh1':'icon-shouji']"></view>
					<input type="text" class="ipt" v-model="tel" value="" placeholder="请输入手机号码" />
				</view>
				<view class="from-line" v-if="logintype">
					<view class="iconfont icon-mima"></view>
					<input type="password" class="ipt" v-model="pwd" value="" placeholder="请输入密码" />
				</view>
				<view class="from-line" v-else>
					<view class="iconfont icon-mima"></view>
					<input type="text" class="ipt" value="" v-model="code" placeholder="请输入验证码" />
					<view class="getcode" @click="getCode">{{codeMsg}}</view>
				</view>
				<view class="from-line text_r" style="margin:0;" @click="changeWay">
					<text class="c_theme" v-if="logintype">手机验证码登录</text>
					<text class="c_theme" v-if="!logintype">密码登录</text>
				</view>
				<view class="ftbtn" style="padding:40upx 0 20upx 0;">
					<button type="primary" @click="btnSubmit" class="btn">登录</button>
				</view>
				<view class="form-line aLine" style="margin:0 30upx;">
					<view @click="register" class="inline-block aline">没有账号？注册账号</view>
					<view v-if="logintype" @click="getPassword" class="inline-block aline fr">忘记密码?</view>
				</view>
			</view>
			<!-- 其他登录方式 -->
			<view class="Otherway center" v-if="false">
				<view class="title"><text class="txt">其他登录方式</text></view>
				<view class="waylist flex">
					<view class="flex-item" @click="changeWay(1)">
						<view class="iconfont icon-weixin1" style="background: #09BB07;"></view>
						<view class="name">微信</view>	
					</view>
					<view class="flex-item" @click="changeWay(2)">
						<view :class="['iconfont',logintype?'icon-shouji':'icon-zh1']"></view>
						<view class="name">{{logintype?'手机':'账号'}}</view>	
					</view>
				</view>	
			</view>
			<!-- #ifdef H5 -->
			<!-- <view class="downapp" @click="golink('/pages/dowmApp/dowmApp')">下载英达思创app</view> -->
			<!-- #endif -->
		</view>
		<!-- #ifdef MP-WEIXIN -->  
		<view class="MP-login" v-if="isShowminiApp">
		    <view class="logo">
				<view class="logoimg">
					<image class="img_bb" src="/static/logo.png" mode="widthFix"></image>
				</view>
				<view class="Title">英达思创</view>
		    </view> 
			<button v-if="isband" class="login-btn btn_gree" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">绑定手机号</button>
		    <button v-else class="login-btn btn_gree" open-type="getUserInfo" @click="oauth">微信登录</button>
		    <view class="c_blue uni-center" @click="loginTel">手机号登录/注册</view>
		</view>
		<!-- #endif --> 
	</view>
</template>

<script>
	import {host,post,get,valPhone} from '@/common/util.js';
	export default {
		onLoad(e){
			if(e.inviteCode){
				this.inviteCode=e.inviteCode;
				uni.setStorageSync('inviteCode',e.inviteCode)
			}
			if(uni.getStorageSync('inviteCode')){
				this.inviteCode=uni.getStorageSync('inviteCode')
			}
			// #ifdef APP-PLUS
			if((e.askUrl!=undefined )&& (e.askUrl!="")&& (e.askUrl!=null)){
				this.askUrl=e.askUrl.toString().replace(/\%3F/g, '?').replace(/\%3D/g, '=').replace(/\%26/g, '&')
			}
			if(e.isResgister){
				this.isRegister = e.isResgister
			}
			if(e.isIndex){
				this.isIndex = e.isIndex
			}
			var height = plus.navigator.getStatusbarHeight();
			this.barHeight = height;
			// #endif
			// #ifndef MP-WEIXIN
			// console.log(e.askUrl,"99999999999999")
			this.isShowMolie=false;
			this.isShowminiApp = true;
			// #endif
			// #ifdef H5
			this.barHeight = 0;
			// #endif
			const pages = getCurrentPages();
			this.pagesLen=pages.length;
			console.log("this.pagesLen",this.pagesLen)
		},
		onShow(){ 
			// console.log(this.$root.$mp,111) 
			
			// #ifdef MP-WEIXIN
			this.isShowMolie=false;
			this.isShowminiApp = true;
			// #endif
			// #ifndef MP-WEIXIN
			// console.log("7777777777777")
			this.isShowMolie=true;
			this.isShowminiApp = false;
			// #endif
			// #ifndef APP-PLUS
			if(this.$root.$mp.query.askUrl){
				this.askUrl = this.$root.$mp.query.askUrl.toString().replace(/\%3F/g, '?').replace(/\%3D/g, '=').replace(/\%26/g, '&');
			}
			if(this.$root.$mp.query.isResgister){
				this.isRegister = this.$root.$mp.query.isResgister
			}
			if(this.$root.$mp.query.isIndex){
				this.isIndex = this.$root.$mp.query.isIndex
			}
			// #endif
			// console.log(this.isRegister,"8888888888")
		},
		data() {
			return {
				pagesLen:0,
				barHeight:0,//app端增加状态栏高度
				tel:"",
				pwd:"",
				askUrl: "",
				code:"",
				codeMsg: "获取验证码",
				timer : null,
				count:"",
				has_click: false,
				isRegister:false,
				isIndex:false,
				logintype:false,//true表示密码登录，false手机验证码登录
				isShowMolie:true,//是否显示号登录界面
				isShowminiApp:false,//是否显示小程序登录
				inviteCode:'',
				isband:false,//是否绑定手机号
				jsonARR:{}
			};
		},
		methods: { 
			getPhoneNumber(e){
				if(e.detail.errMsg=="getPhoneNumber:ok"){
					this.jsonARR['iv']=e.detail.iv;
					this.jsonARR['encryptedData']=e.detail.encryptedData;
					this.bandPhoneNumber(this.jsonARR);
				}else{
					uni.showToast({
					  title: "获取授权失败！",
					  icon: "none",
					  duration: 2000
					});
				}
			},
			golink(url){
				uni.navigateTo({
					url
				})
			},
			changeWay(e){
				if(e==1){
					// #ifdef MP-WEIXIN
					this.isShowMolie=false;
					this.isShowminiApp=true;
					// #endif
					// #ifdef H5
					uni.showToast({
						title: "暂不支持该方式",
						icon: "none",
						duration: 2000
					});
					// #endif
				}else{
					this.isShowMolie=true;
					this.isShowminiApp=false;
					this.logintype=!this.logintype;
					if(!this.logintype){
						this.pwd=""
					}
				}
			},
			//获取验证码
			getCode() {
				if (valPhone(this.tel)) {
					if (!this.has_click) {
						this.sendCode();
					}
				}
			},
			async sendCode() {
				let result = await post("Login/GetUserSms", {
					"Mobile": this.tel,
					"VerifyType": 1
				});
				if (result.code === 0) {
					this.has_click = true;
					const TIME_COUNT = 90; // 90s后重新获取验证码
					this.count = TIME_COUNT;
					uni.showToast({
						title: "发送成功，请注意查收!",
						icon: "none",
						duration: 2000
					});
					this.timer = setInterval(() => {
						if (this.count > 0 && this.count <= TIME_COUNT) {
							this.count--;
							this.codeMsg = this.count + "s后重新获取";
						} else {
							clearInterval(this.timer);
							this.timer = null;
							this.codeMsg = "获取验证码";
						}
					}, 1000);
			
				} else {
					this.has_click = false;
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
				}
			},
			valOther(){
				if(this.logintype){
					if(this.pwd==""){
						uni.showToast({
						  title: "请输入密码!",
						  icon: "none",
						  duration: 2000
						});
						return false;
					}
					if(this.pwd.length<6){
						uni.showToast({
						  title: "密码长度不能小于6个字符!",
						  icon: "none",
						  duration: 2000
						});
						return false;
					}
				}else{
					if(this.code == ""){
						uni.showToast({
						  title: "请输入验证码!",
						  icon: "none",
						  duration: 2000
						});
						return false;
					}
				}
				return true;
			},
			btnSubmit() {
				if(valPhone(this.tel) && this.valOther()){
					this.login();
				}
			},
			async login(){
				let result;
				if(this.logintype){
					result = await post("Login/LoginByMobile",{
						"mobile": this.tel,
					    "password": this.pwd
					})
				}else{
					result = await post("Login/MemberLoginByCode",{
						"Mobile": this.tel,
					    "VerifyCode": this.code,
						"InviteCode":this.inviteCode
					})
				}
				if(result.code===0){
					uni.setStorageSync('token', result.data.Token);
					uni.setStorageSync('userId', result.data.UserId);
					uni.setStorageSync('ReferralCode', result.data.ReferralCode);
					uni.setStorageSync('IsShop', result.data.IsShop);
					// console.log(result.data,"mmmmmmmmmmmm")
					let _this = this;
					
					uni.showToast({
					     title: "登录成功",
					     duration: 1800
					});
					setTimeout(function() {
						// if(_this.isRegister){
						// 	uni.switchTab({
						// 		url: "/pages/tabBar/my/my"
						// 	  });	
						// }else{
						// 	uni.navigateBack();
						// }
						
					     if (_this.pagesLen === 1) {
							uni.switchTab({
								url: '/pages/tabBar/index/index',
							})
						} else {
							uni.navigateBack({
								delta: 1
							});
						}
						
					 }, 1800);
				}else{
					uni.showToast({
					  title: result.msg,
					  icon: "none",
					  duration: 2000
					});
				}
			},
			// 小程序登录
			async MPlogin(code, iv, encryptedData,userInfo){
				let _this = this;
				let result=await post("Login/SignInNew",{
					iv:iv,
					code:code,
					encryptedData:encryptedData
				})
				uni.setStorageSync("unionid", result.data.unionid);
				uni.setStorageSync("token", result.data.Token);
				uni.setStorageSync("userId", result.data.UserId);
				uni.setStorageSync("openId", result.data.openId);
				uni.setStorageSync('ReferralCode', result.data.ReferralCode);
				uni.setStorageSync('IsShop', result.data.IsShop);
				console.log(result.data,"mmmmmmmmmmmm")
				if(result.code===0){
					uni.showToast({
					  title: "登录成功!",
					  icon: "none",
					  duration: 1500,
					  success:function(){
						setTimeout(function() {
							// if(_this.isRegister){
							// 	uni.switchTab({
							// 		url: "/pages/tabBar/my/my"
							// 	  });	
							// }else{
							// 	uni.navigateBack();
							// }
							if (_this.pagesLen === 1) {
								uni.switchTab({
									url: '/pages/tabBar/index/index',
								})
							} else {
								uni.navigateBack({
									delta: 1
								});
							}
						 }, 1500);
					  }
					});
				}else if (result.code === 2) {
					// uni.showToast({
					// 	title: result.msg,
					// 	icon: 'none',
					// 	duration: 1500,
					// 	success: function() {
					// 		setTimeout(function() {
					// 			wx.redirectTo({
					// 				url: '/pages/register/register?type=1'
					// 			})
					// 		}, 1500);
					// 	}
					// })
					uni.showToast({
					  title: result.msg,
					  icon: "none",
					  duration: 2000
					});
					this.isband=true;
					this.jsonARR={
						openId:result.data.openId,
						unionid:result.data.unionid,
						userInfo:userInfo,
						session_key:result.data.session_key,
						InviteCode:_this.inviteCode
					}
				}
				else{
					uni.showToast({
					  title: result.msg,
					  icon: "none",
					  duration: 2000
					});
				}
			},
			oauth(){
				let loginCode='';
				uni.login({
					success:(res)=>{
						loginCode=res.code;
					},
					fail: (err) => {
					    console.error('授权登录失败：' + JSON.stringify(err));
					}
				})
				uni.getUserProfile({
					desc:"用于显示用户头像，昵称等信息",
				    success: (infoRes) => {
				        /**
				         * 实际开发中，获取用户信息后，需要将信息上报至服务端。
				         * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
				         */
						uni.setStorageSync("userInfo", infoRes.userInfo);
						uni.setStorageSync("avatarUrl", infoRes.userInfo.avatarUrl);
						
						this.MPlogin(loginCode, infoRes.iv, infoRes.encryptedData,infoRes.userInfo);
				    }
				});
			},
			async bandPhoneNumber(json){
				let result=await post("Login/getPhoneNumber",json)
				if(result.code==0){
					console.log(result)
					uni.setStorageSync("token", result.data.Token);
					uni.setStorageSync("userId", result.data.UserId);
					let _this = this;
					uni.showToast({
					  title: "登录成功!",
					  icon: "none",
					  duration: 1500,
					  success:function(){
						setTimeout(function() {
							if(_this.isRegister){
								uni.switchTab({
									url: "/pages/tabBar/my/my"
								  });	
							}else{
								uni.navigateBack();
							}
						 }, 1500);
					  }
					});
				}
			},
			
			//微信跳转登录
			loginTel(){
				this.isShowminiApp=false;
				// setTimeout(()=>{
				this.isShowMolie=true;
				// },5)
				
			},
			//注册
			register(){
				uni.navigateTo({
					url: '/pages/register/register'
				})
			},
			//忘记密码
			getPassword(){
				uni.navigateTo({
					url: '/pages/getPassword/getPassword'
				})
			},
			toback(){
				if(this.isIndex){
					uni.switchTab({
						url:"/pages/tabBar/index/index"
					})
				}else if(this.isRegister){
					uni.switchTab({
						url: "/pages/tabBar/my/my"
					});
				}else{
					uni.navigateBack();
				}
			}
		}
	}
</script>
<style scoped>
	@import '@/common/login.css';
  .regLoginBox{
	  width: 90%;
	  position: absolute;
	  top: 50%;
	  left: 5%;
	  transform: translateY(-50%);
	  border-radius: 20rpx;
	  box-sizing: border-box;
  }
  .from-line{
	  border-radius: 40rpx;
  }
 .downapp{
 	width: 100%;
 	text-align: center;
 	margin-top: 60upx;
 	color: #FF3333;
 	text-decoration:underline
 }
</style>
