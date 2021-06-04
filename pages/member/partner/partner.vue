<template>
	<view class="partner">
		<view class="line"></view>
		<view class="sec">
			<view class="sec_1" @click="myTeam">
				<view class="sec1_1"><image src="https://yd.wtanvxin.com/static/my/partner_1.png" mode=""></image></view>
				<view class="sec1_2">我的团队</view>
				<view class="iconfont icon-arrow_r sec1_3"></view>
			</view>
			<view class="sec_2" @click="myAcount">
				<view class="sec1_1"><image src="https://yd.wtanvxin.com/static/my/partner_2.png" mode=""></image></view>
				<view class="sec1_2">我的收益</view>
				<view class="iconfont icon-arrow_r sec1_3"></view>
			</view>
		</view>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
export default {
	data() {
		return {
			userId: '',
			token: '',
			audit: 0
		};
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getPartnerAuthInfo();
	},
	methods: {
		myAcount() {
			uni.navigateTo({
				url: '/pages/other/myAcount/myAcount'
			});
		},
		myTeam() {
			if (this.audit == 0) {
				uni.navigateTo({
					url: '/pages/member/applyPartnerReview/applyPartnerReview'
				});
			}
			if (this.audit == 1) {
				uni.navigateTo({
					url: '/pages/member/myTeam/myTeam'
				});
			}
			if (this.audit == 2) {
				uni.navigateTo({
					url: '/pages/member/applyPartnerFail/applyPartnerFail'
				});
			}
			if (this.audit == 99) {
				uni.navigateTo({
					url: '/pages/member/notPartner/notPartner'
				});
			}
		},
		//申请合伙人信息
		async getPartnerAuthInfo() {
			let result = await post('User/PartnerAuthInfo', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.audit = result.data.IsAudit;
			}
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
