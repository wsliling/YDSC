<template>
	<view class="exchangeClassSuc">
		<view class="line"></view>
		<view class="success">
			<view class="iconfont icon-gou success_1"></view>
			<view class="success_3">兑换成功</view>
			<view class="success_2">恭喜您兑换成功，您可以在个人中心- Y币页面查看。</view>
			<view class="btn">
				<view class="btn_1" @click="back">返回首页</view>
				<view class="btn_2" @click="scoreRecord">查看兑换课程</view>
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
		},
		scoreRecord() {
			uni.navigateTo({
				url: '/pages/member/scoreRecord/scoreRecord'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.exchangeClassSuc {
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
		.success_2 {
			color: #b0b0b0;
			width: 62%;
			margin-left: 20%;
			margin-top: 20upx;
		}
		.btn {
			display: flex;
			.btn_1 {
				flex: 1;
				height: 80upx;
				line-height: 80upx;
				border-radius: 70upx;
				color: #fa6008;
				border: 1px solid #fa6008;
				text-align: center;
				margin: 40upx;
			}
			.btn_2 {
				flex: 1;
				height: 80upx;
				line-height: 80upx;
				border-radius: 70upx;
				color: white;
				background-color: #fa6008;
				text-align: center;
				margin: 40upx;
			}
		}
	}
}
</style>
