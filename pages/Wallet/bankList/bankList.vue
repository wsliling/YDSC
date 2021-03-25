<template>
	<view>
		<view class="bank-list" v-if="!noneShow" v-for="(item,index) in bankList" :key="index">
			<view class="bank-item" style="background: linear-gradient(to bottom, #fe8a71 0%,#ff5363 100%);"  v-if="index%2==0" @click="selBank(index)">
				<view class="bank-detail">
					<view class="bank-img">
						<image :src="item.BankLogo"></image>
					</view>
					<view class="bank-name">
						<view>{{item.BankName}}</view>
						<text>储蓄卡</text> 
					</view>
				</view>
				<view class="bank-num">
					<text>{{item.BankCardNo}}</text>
				</view>
			</view>
			<view class="bank-item" style="background: linear-gradient(to bottom, #5ca2d9 0%,#3f69bd 100%);" v-if="index%2==1" @click="selBank(index)">
				<view class="bank-detail">
					<view class="bank-img">
						<image :src="item.BankLogo"></image>
					</view>
					<view class="bank-name">
						<view>{{item.BankName}}</view>
						<text>储蓄卡</text> 
					</view>
				</view>
				<view class="bank-num">
					<text>{{item.BankCardNo}}</text>
				</view>
			</view>
			<view class="bank-del" @click="delCard(item.Id)">
				<text class="iconfont icon-close"></text>
			</view>
		</view>
		<view class="none-bank" v-if="noneShow">
			<image src="http://xcx.yixijiu19.com/static/none-bank.png" mode=""></image>
			<view>您还未添加过银行卡</view>
		</view>
		<view class="addbank" @click="goLink('/pages/Wallet/bankAdd/bankAdd')">
			<text class="iconfont icon-jia"></text>添加新银行卡
		</view>
	</view>
</template>

<script>
	import {post} from '@/common/util.js'
	export default {
		data() {
			return {
				bankList:[],
				noneShow:true,
				type:0
			}
		},
		onLoad(e){
			console.log(e)
			if(e.type){
				this.type=e.type
			}
		},
		onShow(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.init()
			// this.init()
		},
		methods: {
			goLink(url){
				uni.navigateTo({
					url:url
				})
			},
			selBank(index){
				// console.log(this.bankList[index])
				if(this.type==1){
					console.log(this.bankList[index])
					uni.setStorageSync('selBankCard',this.bankList[index])
					uni.redirectTo({
						url:'/pages/member/withdraw/withdraw'
					})
				}
				
			},
			async init(){
				let result = await post('Bank/BankList',{
					UserId:this.userId,
					Token:this.token
				})
				let that=this
				if(result.data.length>0){
					this.noneShow=false
					this.bankList=result.data
					let num=[]
					this.bankList.forEach((item,index) => {
						num.push(item.BankCardNo.replace(/(\d{4})(?=\d)/g, "$1 "))
						return that.bankList[index].BankCardNo=num[index]
					})
					// console.log(this.bankList)
				}
			},
			async delCard(id){
				let result = await post('Bank/DeleteBank',{
					Id:id,
					UserId:this.userId,
					Token:this.token
				})
				let that =this
				if(result.code==0){
					uni.showToast({
						title:result.msg,
						icon:'none',
						duration:2000,
						success: () => {
							setTimeout(function(){
								that.init()
							},2000)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f2f2f2;
}

.bank-list{
	position: relative;
}
.bank-del{
	position: absolute;
	right:45upx;
	top: 10upx;
	font-size: 38upx;
	// border-radius: 100%;
	// background-color: #fe5363;
	height: 50upx;
	width: 50upx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	span{
		display: inline-block;
		height: 50upx;
		width: 50upx;
		line-height: 50upx;
	}
}
.bank-item{
	// width: 345px;
	height: 280upx;
	margin: 30upx;
	border-radius: 20upx;
	padding: 40upx;
	// display: flex;
	// overflow-x: auto;
	flex-wrap: wrap;
	box-sizing: border-box;
	background-color: #fe5363;
	.bank-detail{
		display: flex;
		align-items: center;
		.bank-img{
			width: 70upx;
			height: 70upx;
			background-color: #fff;
			border-radius: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 30upx;
			image{
				width: 45upx;
				height: 45upx;
			
			}
		}
		.bank-name{
			color: #fff;
			font-size: 32upx;
			text{
				font-size: 24upx;
			}
		}
	}
	
	.bank-num{
		display: flex;
		align-items: center;
		color: #fff;
		margin-left: 100upx;
		margin-top: 60upx;
		text{
			display: block;
			// color: #ffd5cf;
			margin-right: 45upx;
		
		}
	}
}
.addbank{
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100upx;
	background-color: $primary;
	color: #fff;
	font-size: 32upx;
	text-align: center;
	line-height: 100upx;
}
.none-bank{
	margin: 0 auto;
	margin-top: 270upx;
	color: #999;
	view{
		text-align: center;
		font-size: 30upx;
		margin-top: 50upx;
	}
	image{
		width: 144upx;
		height: 100upx;
		display: flex;
		margin: 0 auto;
	}
}
</style>
