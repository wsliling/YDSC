<template>
	<view class="content">
		<view class="delInfo uni-bg-white">
			<view class="bold uni-mb10 fz18">
				为保证您的账号安全，请阅读账户注销的影响
			</view>
			<view class="bold fz16">
				账号注销<text class="red">不是退出登录，注销后不可恢复</text>
			</view>
			<view class="fz14">
				您的私有数据包括评论、积分、虚拟资产、订单记录等将不可恢复
			</view>
			<view class="delck uni-mt10" v-if="IdentityTag">
				<view class="flex-start uni-mb10" @click="isdel=!isdel">
					<view class="IconsCK IconsCK-radio" :class="{'checked':isdel}" style="margin-right: 8upx;"></view>
					<view>仅注销{{IdentityTag}}身份<text class="c_999">(不勾选则默认注销全部账号信息)</text></view>
				</view>
				<view style="color: #FF9800;">
					温馨提示：仅注销网红达人/经销商/店铺身份，将只保留普通用户权益，不在享有其他身份权益。
				</view>
			</view>
		</view>
		<view class="bb_ft flex uni-mt10">
			<view @click="isAgree=!isAgree" class="flex-center">
				<view class="IconsCK IconsCK-radio" :class="{'checked':isAgree}" style="margin-right: 8upx;"></view>
				<text>我已阅读注销协议</text>
			</view>
			<view class="btn flex-center" @click="submit" :class="{'active':isAgree}">确认注销</view>
		</view>
	</view>
</template>

<script>
	import {post,toLogin} from '@/common/util.js'
	export default {
		data() {
			return {
				isAgree:false,
				isdel:false,
				IdentityTag:'',
			}
		},
		onShow() {
			this.getMemberInfo();
		},
		methods: {
			async getMemberInfo() {
				let result = await post("User/GetCenterInfo", {
					"UserId": uni.getStorageSync("userId"),
					"Token": uni.getStorageSync("token")
				})
				if (result.code === 0) {
					this.IdentityTag=result.data.IdentityTag
				} else if (result.code === 2) {
					toLogin();
				}
			},
			async submit(){
				let deltype=this.IdentityTag&&this.isdel?0:1
				if(this.isAgree){
					let result = await post('User/LogOutMember',{
						"UserId": uni.getStorageSync("userId"),
						"Token": uni.getStorageSync("token"),
						"Type":deltype
					})
					if(result.code==0){
						uni.showToast({
							title:result.msg,
							icon:"none"
						})
						setTimeout(()=>{
							// if(deltype){
								uni.setStorageSync("userId",'');
								uni.setStorageSync("token",'');
								uni.setStorageSync("isIssue",'');
								uni.setStorageSync("IsShop",'');
								uni.switchTab({
									url:'/pages/tabBar/index/index'
								})
							// }else{
							// 	uni.navigateBack();
							// }
						},2000)
					}
					
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding-top: 20upx;
	}
	.delInfo{
		padding: 20upx;
		line-height: 1.6;
		.delck{
			background: #FFF9D5;
			padding: 20upx;
			border-radius: 10upx;
		}
	}
	.bold{
		font-weight: bold;
	}
	.bb_ft{
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text{
			color: #666;
			font-size: 26upx;
		}
		.btn{
			height: 80upx;
			width: 260upx;
			border-radius: 40upx;
			background: $primary;
			opacity: .5;
			color: #fff;
			margin-top: 20upx;
			&.active{
				opacity: 1;
			}
		}
	}
</style>
