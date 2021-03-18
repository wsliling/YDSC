<template>
	<view>
		<view class="set-list">
			<view class="set-item">
				<view>手机号</view>
				<input type="text" v-model="tel" disabled placeholder="输入您的手机号"/>
			</view>
			<view class="set-item">
				<view>验证码</view>
				<input type="number" v-model="code" placeholder="输入验证码"/>
				<!-- <text>发送验证码</text> -->
				<text class="getcode" @click="sendCode">{{codeMsg}}</text>
			</view>
			<view class="set-item">
				<view>新密码</view>
				<input type="text" password="true" v-model="pwd" placeholder="输入您的新密码"/>
			</view>
			<view class="set-item">
				<view>确认密码</view>
				<input type="text"  password="true" v-model="newPwd" placeholder="请确认您的密码"/>
			</view>
		</view>
		<view class="btn" @click="amend">
			<view>确认</view>
		</view>
	</view>
</template>

<script>
	import {valPhone , post} from '@/common/util.js' 
	export default {
		data() {
			return {
				codeMsg: "获取验证码",
				userId:'',
				token:'',
				tel:'',
				code:'',
				pwd:'',
				newPwd:'',
				timer:null,
				has_click:false,
				count:"",
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.getPhone()
		},
		methods: {
			getCode() {
				if (valPhone(this.tel)) {
					if (!this.has_click) {
						this.sendCode();
					}
				}
			},
			async getPhone(){
				let res = await post('User/GetMemberMobile',{
					"UserId":this.userId,
					"Token":this.token
				})
				console.log(res)
				this.tel=res.data.Mobile
				console.log(this.tel)
			},
			async sendCode() {
				let result = await post("User/GetUpdatePswCode", {
					"UserId":this.userId,
					"Token":this.token,
					// "Mobile": this.tel,
					"Type": 0
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
			async amend(){
				if(this.pwd!=this.newPwd){
					uni.showToast({
						title:"密码不一致请重新输入",
						icon:'none'
					})
				}else{ 
					let res = await post('User/UpdatePassword',{
						"UserId":this.userId,
						"Token":this.token,
						// "Mobile": this.tel,
						"SecondPassWord":this.pwd,
						"VerifyCode":this.code
					})
					if(res.code==0){
						uni.showToast({
							title:'修改密码成功',
							icon:'success',
							duration:2000,
							success(){
								setTimeout(function(){
									uni.setStorageSync("userId",'');
									uni.setStorageSync("token",'');
									uni.reLaunch({
										url:'/pages/login/login?isResgister=1'
									})
								},2000)
							}
						})
					}
				}
				
			}
		}
	}
</script>

<style lang="scss">
page {
	background-color: #f2f2f2;
}
.set-list {
	margin: 20upx 0;
	padding: 0 25upx;
	background-color: #fff;
	.set-item {
		height: 110upx;
		// line-height: 110upx;
		font-size: 30upx;
		display: flex;
		align-items: center;
		// justify-content: space-between;
		border-bottom: 1upx solid #ececec;
		text {
			color: $primary;
			width: 240upx; 
			text-align: right;
			border-left: 1upx solid #ececec; 
			
		}
		input{
			flex: 1;
		}
		view {
			width: 210upx;
		}
	}
	.set-item:last-of-type {
		border: none;
	}
}
.btn{
	margin: 80upx 30upx 0;
	view{
		background-color: $primary;
		color: #fff;
		height: 88upx;
		border-radius: 10upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30upx;
	}
}
</style>
