<template>
	<view>
		<view class="set-list">
			<view class="set-item" @click="goLink('/pages/member/modifyTel/modifyTel')">
				<view>手机号</view>
				<view>
					<text>{{phone}}</text>
					<text class="iconfont icon-arrow_r"></text>
				</view>
			</view>
			<view class="set-item" @click="goLink('/pages/member/modifyPad/modifyPad')">
				<view>登录密码</view>
				<text class="iconfont icon-arrow_r"></text>
			</view>
			<view class="set-item" @click="goLink('/pages/other/ChangepayPwd/ChangepayPwd')">
				<view>支付密码</view>
				<text class="iconfont icon-arrow_r"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import {post} from '@/common/util.js'
	export default {
		data() {
			return {
				phone:'',
				userId:'',
				token:''
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.getPhone()
		},
		methods: {
			goLink(url){
				uni.navigateTo({
					url:url
				})
			},
			async getPhone(){
				let res = await post('User/GetMemberMobile',{
					"UserId":this.userId,
					"Token":this.token
				})
				// console.log(res)
				this.phone=res.data.Mobile
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f2f2f2;
}
.set-list{
	margin: 20upx 0;
	padding: 0 25upx;
	background-color: #fff;
	.set-item{
		height: 110upx;
		// line-height: 110upx;
		font-size: 30upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1upx solid #ececec;
		text{
			color: #999;
		}
		image{
			width: 12upx;
			height: 24upx;
			margin-left: 20upx;
		}
	}
	.set-item:last-of-type{
		border: none;	
	}
}
</style>
