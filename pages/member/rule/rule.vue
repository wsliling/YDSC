<template>
	<view class="rule">
		<view class="sec">
			<view class="title">1、签到规则说明</view>
			<view class="sec_1">
				<view>1) 每日登陆小程序进行签到</view>
				<view>2) 每天登陆签到发放5个积分</view>
				<view>3) 连续七天签到,第七天签到可获得20个积分,则第八天重新开始一个周期。</view>
				<view>4) 如中途有间隔天数没有签到，签到周期重新计算。</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {}
};
</script>

<style lang="scss">
.rule {
	background-color: white;
	height: 100vh;
	padding: 20upx;
	.sec {
		line-height: 55upx;
		.title {
			font-size: 40upx;
			font-weight: bold;
		}
		.sec_1 {
			margin-top: 20upx;
			color: #818181;
		}
	}
}
</style>
