<template>
	<view class="scoreArea">
		<view class="sec">
			<view class="sec_1"><image src="/static/my/score/score_1.png" mode=""></image></view>
			<view class="sec_2">
				<view class="title">健康营养奶昔蛋白质粉</view>
				<view class="title_1">1瓶 500ml</view>
				<view class="title_2">
					<text class="text_1">2678</text>
					<text class="text_2">积分</text>
				</view>
			</view>
			<view class="sec_3">兑换</view>
		</view>
		<view class="sec">
			<view class="sec_1"><image src="/static/my/score/score_1.png" mode=""></image></view>
			<view class="sec_2">
				<view class="title">健康营养奶昔蛋白质粉</view>
				<view class="title_1">1瓶 500ml</view>
				<view class="title_2">
					<text class="text_1">2678</text>
					<text class="text_2">积分</text>
				</view>
			</view>
			<view class="sec_3">兑换</view>
		</view>
		<view class="sec">
			<view class="sec_1"><image src="/static/my/score/score_1.png" mode=""></image></view>
			<view class="sec_2">
				<view class="title">健康营养奶昔蛋白质粉</view>
				<view class="title_1">1瓶 500ml</view>
				<view class="title_2">
					<text class="text_1">2678</text>
					<text class="text_2">积分</text>
				</view>
			</view>
			<view class="sec_3">兑换</view>
		</view>
		<view class="sec">
			<view class="sec_1"><image src="/static/my/score/score_1.png" mode=""></image></view>
			<view class="sec_2">
				<view class="title">健康营养奶昔蛋白质粉</view>
				<view class="title_1">1瓶 500ml</view>
				<view class="title_2">
					<text class="text_1">2678</text>
					<text class="text_2">积分</text>
				</view>
			</view>
			<view class="sec_3">兑换</view>
		</view>
		<view class="bottom" @click="scoreRecord">兑换记录</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		scoreRecord() {
			uni.navigateTo({
				url: '/pages/member/scoreRecord/scoreRecord'
			});
		}
	}
};
</script>

<style lang="scss">
.scoreArea {
	margin-top: 22upx;
	background-color: white;
	padding-bottom: 232upx;
	.sec {
		padding: 25upx;
		display: flex;
		align-items: flex-end;
		border-bottom: 1px solid #f5f5f5;
		.sec_1 {
			flex: 1;
			image {
				width: 180upx;
				height: 180upx;
			}
		}
		.sec_2 {
			flex: 3;
			padding-left: 20upx;
			.title {
				font-size: 35upx;
				font-weight: bold;
			}
			.title_1 {
				color: gray;
			}
			.title_2 {
				transform: scale(0.88);
				margin-left: -20upx;
				.text_1 {
					font-size: 38upx;
					color: #fe7c32;
					font-weight: bold;
				}
				.text_2 {
					padding-left: 10upx;
				}
			}
		}
		.sec_3 {
			flex: 1.2;
			text-align: center;
			height: 60upx;
			line-height: 60upx;
			color: white;
			background-color: #fe7c32;
			border-radius: 30upx;
		}
	}
	.bottom {
		color: #fc8f55;
		position: fixed;
		bottom: 0;
		font-size: 30upx;
		text-align: center;
		background-color: #f5f5f5;
		width: 100%;
		height: 90upx;
		line-height: 90upx;
	}
}
</style>
