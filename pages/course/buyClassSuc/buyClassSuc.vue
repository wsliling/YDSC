<template>
	<view class="buyClassSuc">
		<view class="line"></view>
		<view class="success">
			<view class="iconfont icon-gou success_1"></view>
			<view class="success_3">支付成功</view>
			<view class="success_2">恭喜您付款成功，您可以在个人中心- 我的课程页面查看。</view>
			<view class="btn">
				<view class="btn_1" @click="back">返回首页</view>
				<view class="btn_2">查看购买课程</view>
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
.buyClassSuc {
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
			font-size: 60px;
			margin-top: 30px;
		}
		.success_3 {
			margin-top: -20px;
			color: #fa6008;
			font-size: 16px;
		}
		.success_2 {
			color: #b0b0b0;
			width: 62%;
			margin-left: 20%;
			margin-top: 10px;
		}
		.btn {
			display: flex;
			.btn_1 {
				flex: 1;
				height: 35px;
				line-height: 35px;
				border-radius: 30px;
				color: #fa6008;
				border: 1px solid #fa6008;
				text-align: center;
				margin: 20px;
			}
			.btn_2 {
				flex: 1;
				height: 35px;
				line-height: 35px;
				border-radius: 30px;
				color: white;
				background-color: #fa6008;
				text-align: center;
				margin: 20px;
			}
		}
	}
}
</style>
