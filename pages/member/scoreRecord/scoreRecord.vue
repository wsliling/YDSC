<template>
	<view class="scoreRecord">
		<view class="sec">
			<view class="sec_1"><image src="/static/my/score/score_1.png" mode=""></image></view>
			<view class="sec_2">
				<view class="title">健康营养奶昔蛋白质粉</view>
				<view class="title_1">积分：675</view>
				<view class="title_2">兑换日期:2019-11-25 11:20</view>
			</view>
			<view class="sec_3">×1</view>
		</view>
		<view class="sec">
			<view class="sec_1"><image src="/static/my/score/score_1.png" mode=""></image></view>
			<view class="sec_2">
				<view class="title">健康营养奶昔蛋白质粉</view>
				<view class="title_1">积分：675</view>
				<view class="title_2">兑换日期:2019-11-25 11:20</view>
			</view>
			<view class="sec_3">×1</view>
		</view>
		<view class="sec">
			<view class="sec_1"><image src="/static/my/score/score_1.png" mode=""></image></view>
			<view class="sec_2">
				<view class="title">健康营养奶昔蛋白质粉</view>
				<view class="title_1">积分：675</view>
				<view class="title_2">兑换日期:2019-11-25 11:20</view>
			</view>
			<view class="sec_3">×1</view>
		</view>
		<view class="sec">
			<view class="sec_1"><image src="/static/my/score/score_1.png" mode=""></image></view>
			<view class="sec_2">
				<view class="title">健康营养奶昔蛋白质粉</view>
				<view class="title_1">积分：675</view>
				<view class="title_2">兑换日期:2019-11-25 11:20</view>
			</view>
			<view class="sec_3">×1</view>
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
.scoreRecord {
	margin-top: 22upx;
	background-color: white;
	height: 100vh;
	.sec {
		padding: 25upx;
		line-height: 60upx;
		display: flex;
		align-items: flex-start;
		border-bottom: 1px solid #f5f5f5;
		.sec_1 {
			flex: 1;
			image {
				width: 180upx;
				height: 180upx;
			}
		}
		.sec_2 {
			flex: 6;
			padding-left: 20upx;
			.title {
				font-size: 35upx;
				font-weight: bold;
			}
			.title_1 {
			}
			.title_2 {
				color: gray;
				font-size: 26upx;
			}
		}
		.sec_3 {
			flex: 1;
			text-align: right;
			font-size: 30upx;
			font-weight: bold;
		}
	}
}
</style>
