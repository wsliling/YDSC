<template>
	<view style="padding-top: 20upx;">
		<view class="resbox uni-bg-white">
			<image class="simg" src="http://yd.wtanvxin.com/static/s1.png" mode="aspectFill"></image>
			<view class="txt">租赁成功</view>
			<view class="tips c_999">恭喜您租赁成功，您可以在商城--租赁--设备--我的租赁页面查看</view>
			<view class="btns flex-between">
				<view class="btn" @click="goIndex">返回首页</view>
				<view class="btn btn_red" @click="goLink('/pages/goods/myLease/myLease')">我的租赁</view>
			</view>
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
			allPrice: ''
		};
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
	},
	onLoad(e) {
	},
	methods: {
		//跳转
		goLink(url) {
			uni.navigateTo({
				url: url
			});
		},
		goIndex() {
			uni.switchTab({
				url: '/pages/tabBar/index/index'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.resbox {
	text-align: center;
	padding: 100upx 90upx;
	.simg {
		width: 160upx;
		height: 160upx;
		margin: 0 auto 40upx;
	}
	.txt {
		font-size: 32upx;
		font-weight: bold;
	}
	.btn {
		border: 1px solid $primary;
		color: $primary;
		height: 90upx;
		border-radius: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32upx;
		width: 260upx;
		margin: 60upx auto 0;
		&.btn_red {
			color: #fff;
			background: $primary;
		}
	}
}
</style>
