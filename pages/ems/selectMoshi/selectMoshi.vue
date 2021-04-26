<template>
	<view>
		<view class="selst_list">
			<block v-for="(item, index) in modelist" :key="index">
				<view class="item">
					<image class="imgbg" :src="item.CoverLogo" mode="aspectFill"></image>
					<view class="txtbox flex-between" @click="goLink('/pages/ems/moshi/moshi?id=' + item.Id)">
						<view class="set iconfont icon-shezhi" @click.stop="goLink('/pages/ems/setMoshi/setMoshi?modeId=' + item.Id)"></view>
						<view class="txt flex1">{{ item.TypeName }}</view>
						<view class="iconfont icon-arrow_r"></view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
import { post, toLogin } from '@/common/util.js';
export default {
	data() {
		return {
			userId: '',
			token: '',
			Page: 1,
			PageSize: 4,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			modelist: [],
			Id: 0
		};
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
	},
	onLoad(e) {
		this.Id = e.typeId;
		this.getTraininModeList();
	},
	methods: {
		//跳转
		goLink(url) {
			uni.navigateTo({
				url: url
			});
		},
		async getTraininModeList() {
			let result = await post('Device/GetTraininModeList', {
				UserId: this.userId,
				Token: this.token,
				Page: this.Page,
				PageSize: this.PageSize,
				TypeId: this.Id
			});
			if (result.code == 0) {
				this.modelist = result.data;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.selst_list {
	padding: 30upx;
	.item {
		margin-bottom: 30upx;
		color: #ffffff;
		border-radius: 16upx;
		position: relative;
		overflow: hidden;
		.imgbg {
			width: 100%;
			height: 220upx;
		}
		.txtbox {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			padding: 20upx;
			z-index: 2;
			background: rgba(0, 0, 0, 0.2);
			.txt {
				text-align: right;
				padding: 0 20upx;
				font-size: 32upx;
			}
			.icon-arrow_r {
				font-size: 28upx;
			}
			.set {
				font-size: 52upx;
				position: absolute;
				left: 0;
				top: 0;
				padding: 20upx;
				line-height: 1;
			}
		}
	}
}
</style>
