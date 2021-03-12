<template>
	<view>
		<view class="detail">
			<text class="iconfont icon-xiaoxi-chenggong"></text>
			<view>购买成功</view>
		</view>
		<button class="choose" @click="back">返回</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			back(){
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
.detail{
	background-color: #fff;
	min-height: 445rpx;
	width: 100%;
	margin-top: 20rpx;
	padding-bottom: 20rpx;
	text-align: center;
	view{
		text-align: center;
		font-size: 36rpx;
		font-weight: 600;
		
	}
}
	.iconfont{
		color: #4caf50;
		font-size: 175rpx;
	}
	.choose{
		// margin-top: 40rpx;
		margin: 40rpx 40rpx 0;
		background-color: #FF3333;
		color: #fff;
		border-radius: 100rpx;
	}
</style>
