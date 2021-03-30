<template>
	<view class="scoreList">
		<view class="sec">
			<view class="sec_2">
				<view class="title">每日签到</view>
				<view class="title_2">2019-11-25 11:20</view>
			</view>
			<view class="sec_3">+5</view>
		</view>
		<view class="sec">
			<view class="sec_2">
				<view class="title">每日签到</view>
				<view class="title_2">2019-11-25 11:20</view>
			</view>
			<view class="sec_3">+5</view>
		</view>
		<view class="sec">
			<view class="sec_2">
				<view class="title">每日签到</view>
				<view class="title_2">2019-11-25 11:20</view>
			</view>
			<view class="sec_3">+5</view>
		</view>
		<view class="sec">
			<view class="sec_2">
				<view class="title">商品兑换</view>
				<view class="title_2">2019-11-25 11:20</view>
			</view>
			<view class="sec_1">-120</view>
		</view>
		<view class="sec">
			<view class="sec_2">
				<view class="title">商品兑换</view>
				<view class="title_2">2019-11-25 11:20</view>
			</view>
			<view class="sec_1">-120</view>
		</view>
		<view class="sec">
			<view class="sec_2">
				<view class="title">商品兑换</view>
				<view class="title_2">2019-11-25 11:20</view>
			</view>
			<view class="sec_1">-120</view>
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
.scoreList {
	margin-top: 22upx;
	background-color: white;
	height: 100vh;
	.sec {
		padding: 25upx;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #f5f5f5;
		.sec_2 {
			flex: 6;
			padding-left: 20upx;
			.title {
				font-size: 30upx;
				font-weight: bold;
			}
			.title_2 {
				color: gray;
				font-size: 26upx;
			}
		}
		.sec_1 {
			flex: 1;
			text-align: right;
			font-size: 30upx;
			color: #ff4545;
		}
		.sec_3 {
			flex: 1;
			text-align: right;
			font-size: 30upx;
			color: #fe8441;
		}
	}
}
</style>
