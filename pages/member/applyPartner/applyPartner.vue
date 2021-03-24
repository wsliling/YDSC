<template>
	<view class="applyPartner">
		<view class="line"></view>
		<view class="form">
			<view class="name">
				<text class="name_1">姓名</text>
				<view class="name_2"><input type="text" placeholder="请输入您的姓名" /></view>
			</view>
			<view class="name">
				<text class="name_1">电话</text>
				<view class="name_2"><input type="text" placeholder="请输入电话号码" /></view>
			</view>
			<view class="upImg">
				<view class="upImg_1">身份证</view>
				<view class="upImg_2">
					<hlUploadImg ref="hlUploadImg" :imgStyle="imgStyle" :selectBtn="upStyle"></hlUploadImg>
					<hlUploadImg ref="hlUploadImg" :imgStyle="imgStyle" :selectBtn="upStyle"></hlUploadImg>
				</view>
			</view>
		</view>
		<view class="upBtn" @click="applyPartnerSuc">提交</view>
	</view>
</template>

<script>
import hlUploadImg from '@/components/hl-uploadImg/hlUploadImg.vue';
import hlUploadImg2 from '@/components/hl-uploadImg2/hlUploadImg.vue';
export default {
	components: {
		hlUploadImg,
		hlUploadImg2
	},
	data() {
		return {
			imgStyle: {
				height: 1.5,
				width: '100%',
				borderRadius: '10upx',
				border: '1px dashed #dcdcdc',
				color: '#aaaaaa'
			},
			upStyle: {
				icon: 'icon-camerafill', //图标，空字符串不需要图标
				text: '上传身份证正面照' //文本  空字符串不需要要文字
			}
		};
	},
	methods: {
		applyPartnerSuc() {
			uni.navigateTo({
				url: '../applyPartnerSuc/applyPartnerSuc'
			});
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
			.name_2 {
				padding-left: 60upx;
				margin-left: 30upx;
			}
		}
		.upImg {
			padding: 20upx 15upx 20upx 30upx;
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
