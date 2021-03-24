<template>
	<view class="partner">
		<view class="line"></view>
		<view class="sec">
			<view class="sec_1" @click="notPartner">
				<view class="sec1_1"><image src="/static/my/partner_1.png" mode=""></image></view>
				<view class="sec1_2">我的团队</view>
				<view class="iconfont icon-arrow_r sec1_3"></view>
			</view>
			<view class="sec_2" @click="myTeam">
				<view class="sec1_1"><image src="/static/my/partner_2.png" mode=""></image></view>
				<view class="sec1_2">我的团队</view>
				<view class="iconfont icon-arrow_r sec1_3"></view>
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
		notPartner() {
			uni.navigateTo({
				url: '/pages/member/notPartner/notPartner'
			});
		},
		myTeam() {
			uni.navigateTo({
				url: '/pages/member/myTeam/myTeam'
			});
		}
	}
};
</script>

<style lang="scss">
.partner {
	.line {
		height: 22upx;
		background-color: #f3f3f3;
	}
	.sec {
		background-color: white;
		.sec_1 {
			display: flex;
			align-items: center;
			height: 100upx;
			line-height: 100upx;
			border-bottom: 1px solid #f3f3f3;
			.sec1_1 {
				flex: 0.7;
				padding: 20upx;
				image {
					width: 45upx;
					height: 32upx;
				}
			}
			.sec1_2 {
				flex: 2;
			}
			.sec1_3 {
				flex: 8;
				font-size: 22upx;
				text-align: right;
				padding-right: 20upx;
			}
		}
		.sec_2 {
			display: flex;
			align-items: center;
			height: 100upx;
			line-height: 100upx;
			border-bottom: 1px solid #f3f3f3;
			.sec1_1 {
				flex: 0.7;
				padding: 20upx;
				image {
					width: 42upx;
					height: 32upx;
				}
			}
			.sec1_2 {
				flex: 2;
			}
			.sec1_3 {
				flex: 8;
				font-size: 22upx;
				text-align: right;
				padding-right: 20upx;
			}
		}
	}
}
</style>
