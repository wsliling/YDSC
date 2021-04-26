<template>
	<view class="applyPartnerFail">
		<view class="line"></view>
		<view class="secAll">
			<view class="iconfont icon-shibai suc"></view>
			<view class="suc_1">申请失败</view>
			<view class="suc_2">{{ auditreason }}</view>
			<view class="review" @click="back">重新申请</view>
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
			auditreason: '' //申请失败原因
		};
	},
	onShow() {
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getPartnerAuthInfo();
	},
	methods: {
		back() {
			uni.navigateTo({
				url: '../applyPartner/applyPartner'
			});
		},
		//申请合伙人信息
		async getPartnerAuthInfo() {
			let result = await post('User/PartnerAuthInfo', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.auditreason = result.data.AuditReason;
			}
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
