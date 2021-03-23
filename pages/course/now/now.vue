<template>
	<view class="now">
		<view class="line"></view>
		<view class="success">
			<view class="iconfont icon-gou success_1"></view>
			<view class="success_3">预约成功</view>
			<view class="time">时间：2021-03-23 周二 15:00-14:00</view>
			<view class="success_2">恭喜您预约成功，您可以在个人中心 - 我的预约页面查看</view>
			<view class="btn">
				<view class="btn_1" @click="back">返回首页</view>
				<view class="btn_2">我的预约</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		back() {
			uni.switchTab({
				url: '/pages/tabBar/course/course'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.now {
	background-color: white;
	height: 95vh;
	.line {
		height: 22upx;
		background-color: #f3f3f3;
	}
	.success {
		text-align: center;
		.success_1 {
			color: #fa6008;
			font-size: 120upx;
			margin-top: 60upx;
		}
		.success_3 {
			margin-top: -40upx;
			color: #fa6008;
			font-size: 32upx;
		}
		.time {
			color: #4c4c4c;
			font-size: 28upx;
		}
		.success_2 {
			color: #b0b0b0;
			width: 55%;
			margin-left: 22%;
			margin-top: 20upx;
			font-size: 25upx;
		}
		.btn {
			display: flex;
			.btn_1 {
				flex: 1;
				height: 80upx;
				line-height: 80upx;
				border-radius: 60upx;
				color: #fa6008;
				border: 1px solid #fa6008;
				text-align: center;
				margin: 40upx;
			}
			.btn_2 {
				flex: 1;
				height: 80upx;
				line-height: 80upx;
				border-radius: 60upx;
				color: white;
				background-color: #fa6008;
				text-align: center;
				margin: 40upx;
			}
		}
	}
}
</style>
