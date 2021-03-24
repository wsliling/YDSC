<template>
	<view class="applyPartnerReview">
		<view class="line"></view>
		<view class="secAll">
			<view class="iconfont icon-shizhong suc"></view>
			<view class="suc_1">资料审核中，请耐心等待</view>
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
.applyPartnerReview {
	.line {
		height: 22upx;
		color: #e5e5e5;
	}
	.secAll {
		text-align: center;
		background-color: white;
		padding: 30upx 0 120upx 0;
		.suc {
			color: #ffaa00;
			font-size: 190upx;
			margin-bottom: -70upx;
		}
		.suc_1 {
			font-size: 35upx;
			font-weight: bold;
		}
	}
}
</style>
