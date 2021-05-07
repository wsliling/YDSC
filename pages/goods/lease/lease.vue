<template>
	<view>
		<view class="lease_list" v-for="(item, index) in devicelist" :key="index">
			<view class="item flex-between" @click="toLink('/pages/goods/submitLease/submitLease?deviceId=' + item.Id)">
				<view class="img"><image :src="item.DevicePic"></image></view>
				<view class="txt flex1">{{ item.DeviceName }}</view>
				<view class="iconfont icon-arrow_r"></view>
			</view>
		</view>
		<view class="fixedbtn">
			<view class="btn_mylease flex-center" @click="toLink('/pages/goods/myLease/myLease')">
				<image class="iconimg" src="http://yd.wtanvxin.com/static/lease.png"></image>
				我的租赁
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
			page: 1,
			pageSize: 6,
			devicelist: []
		};
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getDeviceList();
	},
	methods: {
		//跳转
		toLink(url) {
			uni.navigateTo({
				url: url
			});
		},
		// 设备列表
		async getDeviceList() {
			let result = await post('Device/GetDeviceList', {
				UserId: this.userId,
				Token: this.token,
				page: this.page,
				pageSize: this.pageSize
			});
			if (result.code === 0) {
				this.devicelist = result.data;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.lease_list {
	padding: 30upx 30upx 0 30upx;
	.item {
		background-image: linear-gradient(left, #4c444f, #392f39);
		color: #ffffff;
		padding: 20upx;
		border-radius: 16upx;
		.img {
			image {
				width: 160upx;
				height: 160upx;
			}
		}
		.txt {
			text-align: right;
			padding: 0 20upx;
			font-size: 32upx;
		}
		.icon-arrow_r {
			font-size: 28upx;
		}
	}
}
.fixedbtn {
	padding: 0;
	.btn_mylease {
		background: #fff;
		padding: 20upx 30upx;
		font-size: 32upx;
		color: $primary;
		.iconimg {
			width: 48upx;
			height: 48upx;
			margin-right: 10upx;
		}
	}
}
</style>
