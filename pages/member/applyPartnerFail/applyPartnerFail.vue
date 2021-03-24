<template>
	<view class="applyPartnerFail">
		<view class="line"></view>
		<view class="secAll">
			<view class="iconfont icon-shibai suc"></view>
			<view class="suc_1">申请失败</view>
			<view class="suc_2">上传照片不清晰，信息有速盖</view>
			<view class="review" @click="back">重新申请</view>
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
			uni.navigateTo({
				url: '../applyPartner/applyPartner'
			});
		}
	}
};
</script>

<style lang="scss">
.applyPartnerFail {
	.line {
		height: 22upx;
		color: #e5e5e5;
	}
	.secAll {
		text-align: center;
		background-color: white;
		padding: 30upx 0 120upx 0;
		.suc {
			color: #ff3c3c;
			font-size: 180upx;
			margin-bottom: -70upx;
		}
		.suc_1 {
			font-size: 35upx;
			font-weight: bold;
			margin-top: 10upx;
		}
		.suc_2 {
			color: #b0b0b0;
			font-size: 26upx;
			margin-top: 10upx;
		}
		.review {
			border: 1px solid #ff3c3c;
			color: #ff3c3c;
			height: 85upx;
			line-height: 85upx;
			border-radius: 70upx;
			width: 68%;
			margin: 50upx auto 0 auto;
		}
	}
}
</style>
