<template>
	<view class="applyPartner">
		<view class="line"></view>
		<view class="form">
			<view class="name">
				<text class="name_1">姓名</text>
				<view class="name_2"><input type="text" v-model="name" placeholder="请输入您的姓名" /></view>
			</view>
			<view class="name">
				<text class="name_1">电话</text>
				<view class="name_2"><input type="text" v-model="mobile" placeholder="请输入电话号码" /></view>
			</view>
			<view class="upImg">
				<view class="upImg_1">身份证</view>
				<view class="chooseImg" style="margin-bottom: 20rpx;" @click="chooseImage(1)">
					<image v-if="cardImg1" :src="tempcardImg1" mode="aspectFit"></image>
					<block v-else>
						<text class="iconfont icon-fabu"></text>
						<view>上传身份证正面照</view>
					</block>
				</view>
				<view class="chooseImg" style="margin-bottom: 20rpx;" @click="chooseImage(2)">
					<image v-if="cardImg2" :src="tempcardImg2" mode="aspectFit"></image>
					<block v-else>
						<text class="iconfont icon-fabu"></text>
						<view>上传身份证反面照</view>
					</block>
				</view>
			</view>
		</view>
		<view class="upBtn" @click="applyPartnerSuc">提交</view>
	</view>
</template>

<script>
import { post, valPhone, IdNumber } from '@/common/util.js';
import { pathToBase64 } from '@/common/image-tools.js';
export default {
	components: {
	},
	data() {
		return {
			userId: '',
			token: '',
			name: '', //姓名
			mobile: '', //联系电话
			cardImg1: '', //身份证正面图片
			cardImg2: '', //身份证反面图片
			tempcardImg1: '', //临时路径图片
			tempcardImg2: '',
			audit: '' //申请合伙人状态
		};
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
	},
	methods: {
		//信息校验
		valInfo() {
			if (!this.name) {
				uni.showToast({
					title: '请输入姓名!',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (!valPhone(this.mobile)) {
				return false;
			}
			if (!this.cardImg1) {
				uni.showToast({
					title: '请上传身份证正面照!',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (!this.cardImg2) {
				uni.showToast({
					title: '请上传身份证反面照!',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			return true;
		},
		applyPartnerSuc() {
			if (this.valInfo()) {
				this.getPartnerAuth();
			}
		},
		// 上传图片
		async chooseImage(type) {
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				success: async res => {
					let base64 = await pathToBase64(res.tempFilePaths[0]);
					if (type == 1) {
						//身份证正面
						this.tempcardImg1 = res.tempFilePaths[0];
						this.cardImg1 = base64;
					} else if (type == 2) {
						//身份证反面面
						this.tempcardImg2 = res.tempFilePaths[0];
						this.cardImg2 = base64;
					}
				}
			});
		},
		//申请合伙人
		async getPartnerAuth() {
			let result = await post('User/PartnerAuth', {
				UserId: this.userId,
				Token: this.token,
				IdcardPositive: this.cardImg1,
				IdcardNegative: this.cardImg2,
				FullName: this.name,
				Phone: this.mobile
			});
			if (result.code == 0) {
				console.log(result.data);
				this.getPartnerAuthInfo();
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
				if (this.audit == 0) {
					uni.navigateTo({
						url: '/pages/member/applyPartnerReview/applyPartnerReview'
					});
				}
				if (this.audit == 1) {
					uni.navigateTo({
						url: '/pages/member/applyPartnerSuc/applyPartnerSuc'
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
			}
		}
	}
};
</script>

<style lang="scss">
.applyPartner {
	.line {
		height: 22upx;
		background-color: #f3f3f3;
	}
	.form {
		background-color: white;
		.name {
			display: flex;
			align-items: center;
			border-bottom: 1px solid #f3f3f3;
			padding: 20upx 0;
			margin: 0 30upx;
			.name_1 {
				flex: 1;
			}
			.name_2 {
				flex: 3;
			}
		}
		.upImg {
			padding: 0 30upx 10upx;
			view {
				width: 30%;
				height: 90rpx;
				line-height: 90rpx;
			}
			.chooseImg {
				width: 100%;
				height: 350rpx;
				border: 1px dashed #cccccc;
				border-radius: 10rpx;
				text {
					display: inline-block;
					width: 100%;
					font-size: 60rpx;
					color: #cccccc;
					text-align: center;
					height: 45rpx;
					line-height: 300rpx;
				}
				image {
					width: 100%;
					height: 100%;
				}
				view {
					width: 100%;
					height: 45rpx;
					line-height: 45rpx;
					text-align: center;
					color: #ccc;
				}
			}
			.upImg_2 {
				padding-top: 20upx;
			}
		}
	}
	.upBtn {
		background-color: #fa6008;
		color: white;
		border-radius: 30px;
		text-align: center;
		width: 90%;
		height: 90upx;
		line-height: 90upx;
		margin: 8% auto;
	}
}
</style>
