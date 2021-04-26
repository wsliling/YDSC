<template>
	<view class="applyPartnerSuc">
		<view class="line"></view>
		<view class="secAll">
			<view class="iconfont icon-xiaoxi-chenggong suc"></view>
			<view class="suc_1">申请成功</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	onshow() {},
	onLoad() {
		setTimeout(() => {
			uni.navigateTo({
				url: '/pages/member/myTeam/myTeam'
			});
		}, 500);
	},
	methods: {}
};
</script>

<style lang="scss">
.applyPartnerSuc {
	.line {
		height: 22upx;
		color: #e5e5e5;
	}
	.secAll {
		text-align: center;
		background-color: white;
		padding: 30upx 0 120upx 0;
		.suc {
			color: #fa6008;
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
