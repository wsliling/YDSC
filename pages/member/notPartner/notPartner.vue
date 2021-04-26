<template>
	<view class="notPartner">
		<view class="line"></view>
		<view class="sec">
			<view class="sec_img"><image src="/static/my/partner_3.png" mode=""></image></view>
			<view class="sec_1">您还不是合伙人~</view>
			<view class="apply" @click="applyPartner">申请成为合伙人</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		applyPartner() {
			uni.navigateTo({
				url: '/pages/member/applyPartner/applyPartner'
			});
		},
	}
};
</script>

<style lang="scss">
.notPartner {
	.line {
		height: 22upx;
		background-color: #f3f3f3;
	}
	.sec {
		background-color: white;
		text-align: center;
		padding-top: 200upx;
		height: 95vh;
		.sec_img {
			image {
				width: 260upx;
				height: 290upx;
			}
		}
		.apply {
			background-color: #fa6008;
			color: white;
			border-radius: 30px;
			width: 60%;
			height: 90upx;
			line-height: 90upx;
			margin: 30% auto;
		}
	}
}
</style>
