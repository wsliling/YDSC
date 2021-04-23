<template>
	<view>
		<view class="lease_list">
			<view class="item flex-between" v-for="(item, index) in mylease" :key="index">
				<view class="img"><image :src="item.DevicePic"></image></view>
				<view class="txtbox flex1">
					<view class="flex-between">
						<view class="tit uni-ellipsis2">{{ item.DeviceName }}</view>
						<view class="num">{{ item.Number }}次</view>
					</view>
					<view class="price">￥{{ item.UnitPrice*item.Number }}</view>
					<view class="time">租赁日期：{{ item.AddTime }}</view>
				</view>
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
			mylease: {},
		};
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getMyLease();
	},
	methods: {
		//跳转
		goLink(url) {
			uni.navigateTo({
				url: url
			});
		},
		//我的租赁
		async getMyLease() {
			let result = await post('Device/MyLeaseDeviceList', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.mylease = result.data;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.lease_list {
	padding: 30upx;
	.item {
		margin-bottom: 20upx;
		background: #fff;
		padding: 20upx;
		border-radius: 16upx;
		.img {
			image {
				background: #f2f2f2;
				width: 160upx;
				height: 160upx;
				border-radius: 12upx;
			}
		}
		.txtbox {
			padding-left: 20upx;
			.tit {
				font-size: 30upx;
				line-height: 1.2;
				flex: 1;
			}
			.num {
				font-size: 28upx;
			}
			.price {
				color: #ff0000;
			}
			.time {
				color: #999;
				font-size: 24upx;
			}
		}
	}
}
</style>
