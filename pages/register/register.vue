<template>
	<view class="content">
		<!-- #ifdef H5 -->
		<uni-nav-bar fixed="true" color="#333333" background-color="#ffffff" title="注册" :border="false" leftIcon="''">
		</uni-nav-bar>
		<!-- #endif -->
		<view class="regLoginBox">
			<view class="logo">
				<view class="img">
					<image src="/static/logo.png" mode="widthFix"></image>
					<view class="Title">英达思创</view>
				</view>
			</view>
			<view class="from pd10">
				<view class="from-line">
					<view class="iconfont icon-shouji"></view>
					<input type="text" class="ipt" value="" v-model="tel" placeholder="请输入手机号码" />
				</view>
				<view class="from-line">
					<view class="iconfont icon-anquan"></view>
					<input type="text" class="ipt" value="" v-model="code" placeholder="请输入验证码" />
					<view class="getcode" @click="getCode">{{codeMsg}}</view>
				</view>
				<view class="from-line" v-if="type!=1">
					<view class="iconfont icon-mima"></view>
					<input type="password" class="ipt" value="" v-model="pwd" placeholder="请输入密码" />
				</view>
				<view class="from-line" v-if="type!=1">
					<view class="iconfont icon-mima"></view>
					<input type="password" class="ipt" value="" v-model="pwd2" placeholder="请再次输入密码" />
				</view>
				<view class="from-line" style="position: relative;">
					<view class="iconfont icon-mima"></view>
					<input type="text" class="ipt" :disabled="disabled" v-model="inviteCode" placeholder="好友邀请码(选填)" />
					<text class="inviteTips" v-if="disabled">好友邀请码</text>
				</view>
				<view class="from-txt">
					<view  @click="shiftAgree" style="display: inline-block;vertical-align: middle;"><view class="IconsCK IconsCK-radio" :class="{'checked':isAgree}" style="margin-right: 8upx;"></view><text>我已阅读并同意</text></view>
					<navigator url="/pages/message/agreement/agreement" class="inline-block" style="color:#3fb1ea;">《用户协议》</navigator>
				</view>
				<view class="ftbtn" style="padding:40upx 0 20upx 0;">
					<button type="primary" class="btn" @click="btnSubmit">{{type==1?'确认绑定':'确认注册'}}</button>
				</view>
				<!-- #ifndef APP-PLUS -->
				<!-- <view class="downapp" @click="golink('/pages/dowmApp/dowmApp')">下载英达思创app</view> -->
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	import {
		host,
		post,
		get,
		valPhone
	} from '@/common/util.js';
	export default {
		onLoad(e) {
			this.inviteCode=e.inviteCode;
			this.type = e.type
			console.log(this.type,"type999999999999")
		},
		onShow() {
			// #ifdef MP-WEIXIN
			if(uni.getStorageSync('inviteCode')){
				this.inviteCode=uni.getStorageSync('inviteCode')
			}
			// #endif
			if(this.inviteCode){
				this.disabled=true
			}else{
				this.disabled=false
			}
		},
		data() {
			return {
				tel: "",
				pwd: "",
				pwd2: "",
				code: "",
				inviteCode: "", //邀请码
				timer: null,
				codeMsg: "获取验证码",
				count: "",
				TIME_COUNT: 60,
				has_click: false,
				isAgree:true,
				disabled: false,
				type:0,//1小程序绑定手机号
			};
		},
		methods: {
			golink(url){
				uni.navigateTo({
					url
				})
			},
			getCode() {
				if (valPhone(this.tel)) {
					if (!this.has_click) {
						this.sendCode();
					}
				}
			},
			shiftAgree(){
				this.isAgree = !this.isAgree;
			},
			regResetPwdValOther() {
				if (this.code == "") {
					uni.showToast({
						title: "验证码不能为空!",
						icon: "none",
						duration: 2000
					});
					return false;
				}
				if(this.type != 1){
					console.log("9999999999")
					if (this.pwd == "" || this.pwd2 == "") {
						uni.showToast({
							title: "密码不能为空!",
							icon: "none",
							duration: 2000
						});
						return false;
					}
					if (this.pwd != this.pwd2) {
						uni.showToast({
							title: "两次输入密码不同!",
							icon: "none",
							duration: 2000
						});
						return false;
					}
					if (this.pwd.length < 6) {
						uni.showToast({
							title: "密码长度不能小于6个字符!",
							icon: "none",
							duration: 2000
						});
						return false;
					}
				}
				if (!this.isAgree) {
					uni.showToast({
						title: "请勾选同意用户协议!",
						icon: "none",
						duration: 2000
					});
					return false;
				}
				return true;
			},
			async sendCode() {
				let objUrl = ''
				let method = ''
				if(this.type == 1){
					objUrl = 'Login/GetMiniAppBindTelCode?Mobile='
					method = 'get'
				}else{
					objUrl = 'Login/GetRegSMSCode?Mobile='
					method='POST'
				}
				console.log(this.type,"类型")
				uni.request({
				    url:host+ objUrl+this.tel, //仅为示例，并非真实的接口地址
				    method: method,
				    header: {
				      'content-type': 'application/json;charset=utf-8' // 默认值
				    },
				    success: (result)=> {
				     console.log(result)
					 let data = result.data
					 if (data.code === 0) {
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
								this.has_click = false;
					 			this.timer = null;
					 			this.codeMsg = "获取验证码";
					 		}
					 	}, 1000);
					 
					 } else {
					 	this.has_click = false;
					 	uni.showToast({
					 		title: result.data.msg,
					 		icon: "none",
					 		duration: 2000
					 	});
					 }
				    }
				  })
			},
			async wxBand(){
				let result = await post("Login/BindOrRegister", {
					"mobile": this.tel,
					"unionid":uni.getStorageSync("unionid"),
					"openId": uni.getStorageSync("openId"),
					"yzcode": this.code,
					"InviteCode": this.inviteCode
				});
				if (result.code === 0) {
					let _this = this;
					uni.showToast({
						title: "绑定成功!",
						icon: "none",
						duration: 2000,
						success: function() {
							setTimeout(function() {
								uni.navigateTo({
									url: "/pages/login/login?isResgister=1"
								})
							}, 2000);
						}
					});
				} else {
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
				}
			},
			async phoneNumberRegister() {
				let result = await post("Login/MobileRegister", {
					"mobile": this.tel,
					"password": this.pwd,
					"yzcode": this.code,
					"InviteCode": this.inviteCode
				});
				if (result.code === 0) {
					let _this = this;
					uni.showToast({
						title: "注册成功，请使用注册手机号登陆!",
						icon: "none",
						duration: 2000,
						success: function() {
							setTimeout(function() {
								// #ifndef H5
								uni.navigateTo({
									url: "/pages/login/login?isResgister=1"
								})
								// #endif
								// #ifdef H5
								uni.navigateTo({
									url: "/pages/dowmApp/dowmApp"
								})
								// #endif
							}, 2000);
						}
					});
				} else {
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
				}
			},
			btnSubmit(){
				if(valPhone(this.tel) && this.regResetPwdValOther()){
					if(this.type == 1){
						this.wxBand()
					}else{
						this.phoneNumberRegister();
					}
					
				}
			}
		},
	}
</script>

<style scoped lang="scss">
	@import '@/common/login.css';
	.logo {
		padding: 100upx 0 80upx;
	}
	.regLoginBox{
		 /* background: rgba(0,0,0,0.5); */
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
	.from .from-txt {
	    font-size: 14px;
	    /* color: #fff; */
	}
	.inviteTips{ position: absolute; right: 30upx; top: 0; color: #bbb; line-height: 80upx;text-decoration: underline;}
	.downapp{
		width: 100%;
		text-align: center;
		margin-top: 60upx;
		color: $primary;
		text-decoration:underline
	}
</style>
