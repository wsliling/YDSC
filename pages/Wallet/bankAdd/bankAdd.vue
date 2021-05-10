<template>
	<view>
		<view v-if="bing">
			<view class="tip">
				<text class="iconfont icon-tishi"></text>
				<view>姓名必须和身份证中的一样，务必保证银行卡信息正确</view>
			</view>
			<view class="bing-item ma-b">
				<view>持卡人姓名</view>
				<input type="text" v-model="name" placeholder="请输入持卡人姓名">
			</view>
			<view class="bing-item" @click="goLink('/pages/Wallet/selBank/selBank')">
				<view>选择对应银行</view>
				<view class="sel-bank">{{bankName}} <text class="iconfont icon-arrow_r"></text></view>
			</view>
			<view class="bing-item">
				<view>银行卡号</view>
				<input type="unmber" v-model="number" placeholder="请输入银行卡号">
			</view>
			<view class="bing-item ma-b">
				<view>开户地址</view>
				<input type="text"  @click="showArea" v-model="address" :disabled="true" placeholder="请选择银行卡开户地址">
			</view>
			<view class="bing-item">
				<view>已绑定手机号</view>
				<input type="unmber" v-model="phone" placeholder="请输入手机号码">
			</view>
			<view class="bing-item ma-b">
				<view>验证码</view>
				<input class="code" v-model="code" type="unmber" placeholder="6位验证码" >
				<text class="getcode" @click="getCode">{{codeMsg}}</text>
			</view>
		</view>
		<view class="win"  v-else>
			<image src="http://yd.wtanvxin.com/static/s1.png"></image>
			<view>绑定成功</view>
		</view>
		<view class="bing-btn" @click="addBank">
			{{bing?'绑定':'完成'}}
		</view>
		<wpicker
			mode="linkage"
			:level="3" 
			:defaultVal="areaDefault"
			@confirm="areaOk"
			@cancel="areaCancel"
			ref="area"
			:linkList="areaList"
			themeColor="#f00"
			>
		</wpicker>
	</view>
</template>

<script>
	import areaList from '@/common/areaList.js';
	import wpicker from "@/components/w-picker/w-picker.vue";
	import {post,valPhone,valbankNo} from '@/common/util.js'
	export default {
		data() {
			return {
				bing:true,	
				codeMsg: "获取验证码",
				name:'',
				number:'',
				phone:'',
				code:'',
				userId:'',
				token:'',
				address:'',
				newPhone:null,
				timer:null,
				has_click:false,
				count:"",
				bankName:'请选择',
				areaDefault:['广东省','深圳市','不限'],
				areaList,
				AreaCode:'',//地区代码
				AreaType:0,//0--默认按地区码，1--省不限市，市不限区
				BankCard:{}
			}
		},
		components:{
			wpicker
		},
		onLoad(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		onShow(){
			// if(uni.getStorageSync('bankName')){
				this.bankName=uni.getStorageSync('bankName')
				// if(uni.getStorageSync('selBankCard')){
				// 	cardObj=uni.getStorageSync('selBankCard')
				// 	this.bankName=cardObj.BankCardName
				// 	this.number=cardObj.BankCardNo
				// 	this.name=cardObj.BankName
				// }
			// }
		},
		methods: {
			goLink(url){
				console.log(url)
				uni.navigateTo({
					url:url
				})
			},
			getCode() {
				if (valPhone(this.phone)) {
					if (!this.has_click) {
						this.sendCode();
					}
				}
			},
			areaOk(e){
				this.areaDefault=e.checkArr;
				this.address=this.areaDefault[0]+'-'+this.areaDefault[1]+'-'+this.areaDefault[2]
				// console.log(this.areaDefault)
				if(e.checkArr.length===2){
					this.AreaType=1
				}else if(e.checkArr[2]=="不限" ){
					this.address=''
					uni.showToast({
						title:'请选择市级',
						icon:'none'
					})
					this.AreaType=1
					return
				}else{
					this.AreaType=0
				}
				this.AreaCode=e.checkValue[e.checkValue.length-1];
				console.log(this.AreaCode)
			},
			areaCancel(e){
				this.AreaCode='';
				
			},
			showArea(){
				this.$refs['area'].show();
			},
			async sendCode() {
				
				let result = await post("Bank/BindingBankCards", {
					"UserId":this.userId,
					"Token":this.token,
					"Mobile": this.phone
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
			async addBank(){
				if(!this.valOther()) return;
				if(this.bing==true){
					let result = await post('Bank/AddBank',{
						UserId:this.userId,
						Token:this.token,
						Mobile:this.phone,
						VerifyCode:this.code,
						BankName:this.bankName,
						BankAddress:this.address,
						BankCardNo:this.number,
						BankCardName:this.name
					})
					if(result.code==0){
						uni.setStorageSync('bankName','')
						this.bing=false
					}
				}else{
					uni.navigateBack({
						
					})
				}
				
			},
			//验证信息
			valOther(){
				if(!this.name) {
					uni.showToast({
					  title: "请输入持卡人姓名!",
					  icon: "none",
					  duration: 2000
					});
					return false;
				}
				if(!this.bankName) {
					uni.showToast({
					  title: "请选择银行!",
					  icon: "none",
					  duration: 2000
					});
					return false;
				}
				if(!valbankNo(this.number)) {
					return false;
				}
				if(!valPhone(this.phone)) {
					return false;
				}
				if(!this.code) {
					uni.showToast({
					  title: "请输入验证码!",
					  icon: "none",
					  duration: 2000
					});
					return false;
				}
				return true
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f2f2f2;
}
.tip{
	height: 85upx;
	display: flex;
	align-items: center;
	padding: 0 30upx;
	color: #999;
	text{
		color: #ffaa00;
		font-size: 40rpx;
		margin-right: 10rpx;
	}
	view{
		font-size: 24upx;
	}
}

.win{
	height: 280upx;
	background-color: #fff;
	width: 100%;
	margin-top: 20upx;
	padding-top: 85upx;
	image{
		width: 74upx;
		height: 60upx;
		margin: 0 auto;
		display: flex;
		
	}
	view{
		text-align: center;
		color: #5c5c5c;
		font-size: 30upx;
		margin-top: 20upx;
	}
}
.bing-item{
	background-color: #fff;
	display: flex;
	align-items: center;
	height: 88upx;
	font-size: 28upx;
	padding: 0 30upx;
	border-bottom: 1rpx solid #ececec;
	input{
		margin-left: auto;
		text-align: right;
	}
	.code{
		padding-right: 20upx;
	}
	.uni-input-placeholder{
		font-size: 28upx;
	}
	.sel-bank{
		margin-left: auto;
		color: #999;
		display: flex;
		align-items: center;
		image{
			margin-left: 10upx;
			width: 12upx;
			height: 24upx;
		}
	}
	.getcode{
		color: $primary;
		padding-left: 20upx;
		border-left: 1px solid #ececec;
	}
}
.ma-b{
	margin-bottom: 20upx;
	border-bottom: none;
}
.bing-btn{

	margin: 80upx 30upx 0;
	height: 88upx;
	text-align: center;
	line-height: 88upx;
	border-radius: 10upx;
	background-color: $primary;
	color: #fff;
	font-size: 32upx;
}
</style>
