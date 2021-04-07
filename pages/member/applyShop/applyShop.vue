<template>
	<view class="applyShop">
		<view class="line"></view>
		<view class="form">
			<view class="name">
				<text class="name_1">名称</text>
				<view class="name_2"><input type="text" placeholder="请输入机构名称" /></view>
			</view>
			<view class="name">
				<text class="name_1">地址</text>
				<view class="name_2"><input type="text" placeholder="请输入机构地址" /></view>
			</view>
			<view class="name">
				<text class="name_1">联系电话</text>
				<view class="name_2"><input type="text" placeholder="请输入联系电话" /></view>
			</view>
			<view class="name">
				<text class="name_1">法人代表</text>
				<view class="name_2"><input type="text" placeholder="请输入法人代表" /></view>
			</view>
			<view class="name">
				<text class="name_1">银行开户行</text>
				<view class="name_2"><input type="text" placeholder="请输入银行开户行" /></view>
			</view>
			<view class="name">
				<text class="name_1">银行对公账户</text>
				<view class="name_2"><input type="text" placeholder="请输入对公账户" /></view>
			</view>
			<view class="upImg">
				<view class="upImg_1">合法资质证明</view>
				<view class="upImg_2"><hlUploadImg ref="hlUploadImg" :imgStyle="imgStyle" :selectBtn="upStyle"></hlUploadImg></view>
			</view>
		</view>
		<view class="upBtn">提交</view>
	</view>
</template>

<script>
import hlUploadImg from '@/components/hl-uploadImg3/hlUploadImg.vue';
export default {
	components: {
		hlUploadImg
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
				text: '添加证明' //文本  空字符串不需要要文字
			}
		};
	},
	methods: {}
};
</script>

<style lang="scss">
.applyShop {
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
				flex: 2;
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
