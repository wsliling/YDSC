<template>
	<view>
		<view class="set-list">
			<view class="set-item">
				<view>当前手机号</view>
				<input type="text" v-model="phone" :disabled='true'/>
			</view>
			<view class="set-item">
				<view>新手机号</view>
				<input type="number" v-model="newPhone" placeholder="输入当前手机号" />
			</view>
			<view class="set-item">
				<view>验证码</view>
				<input type="number" v-model="code" placeholder="输入验证码" />
				<text @click="getCode">{{codeMsg}}</text>
			</view>
		</view>
		<view class="btn" @click="amend">
			<view>确认</view>
		</view>
	</view>
</template>

<script>
	import {post,valPhone } from '@/common/util.js'
export default {
	data() {
		return {
			codeMsg: "获取验证码",
			phone:'',
			userId:'',
			token:'',
			newPhone:null,
			code:null,
			timer:null,
			has_click:false,
			count:""
		};
	},
	onLoad(){
		this.userId = uni.getStorageSync("userId");
		this.token = uni.getStorageSync("token");
		this.getPhone()
	},
	methods: {
		async getPhone(){
			let res = await post('User/GetMemberMobile',{
				"UserId":this.userId,
				"Token":this.token
			})
			console.log(res)
			this.phone=res.data.Mobile
		},
		getCode() {
			if (valPhone(this.newPhone)) {
				if (!this.has_click) {
					this.sendCode();
				}
			}
		},
		async sendCode() {
			console.log(this.newPhone)
			let result = await post("User/GetBindTelCode", {
				"UserId":this.userId,
				"Token":this.token,
				"Mobile": this.newPhone,
				"Type": 1
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
			let res = await post('User/UpdateMobile',{
				"UserId":this.userId,
				"Token":this.token,
				"Mobile": this.newPhone,
				"VerifyCode":this.code,
				"Type":1
			})
			if(res.code==0){
				uni.showToast({
					title:res.msg,
					icon:'none',
					duration:2000,
					success: () => {
						setTimeout(function(){
							uni.navigateBack()
						},2000)
					}
				})
			}
		}
	}
};
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
			width: 200upx;
			text-align: right;
			border-left: 1upx solid #ececec; 
			
		}
		input{
			flex: 1;
			padding-right: 30upx;
			text-align: right;
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
