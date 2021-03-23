<template>
	<view class="gym">
		<view class="list-1">
			<view class="list-cell" v-for="(item, index) in 5" :key="index">
				<view class="hd flex-start" @click="tolink('/pages/personal/VenueDetail/VenueDetail')">
					<view class="author"><image src="/static/default.png" mode="aspectFill"></image></view>
					<view class="flex1">
						<view class="name flex-start">
							<text class="txt uni-ellipsis">动体能健身工作室</text>
							<text class="uni-icon uni-icon-arrowright fz14"></text>
						</view>
						<view class="fz12 c_999">距离您2.1km</view>
					</view>
				</view>
				<view class="bd">
					<scroll-view class="image-list" scroll-x="true">
						<view class="img" v-for="(i, e) in 8" :key="e"><image src="/static/of/s1.png" mode="aspectFill"></image></view>
					</scroll-view>
				</view>
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
		//跳转
		tolink(Url, islogin) {
			if (islogin == 'login') {
				if (toLogin()) {
					uni.navigateTo({
						url: Url
					});
				}
			} else {
				uni.navigateTo({
					url: Url
				});
			}
		}
	}
};
</script>

<style lang="scss">
.gym {
	.list-1 {
		padding-top: 20upx;
		.list-cell {
			padding: 24upx 0 24upx 20upx;
			margin-bottom: 16upx !important;
			background: #fff;
			.hd {
				margin-bottom: 20upx;
				.author {
					height: 90upx;
					width: 90upx;
					margin-right: 20upx;
					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
						border: 1upx solid #ddd;
					}
				}
				.name {
					.txt {
						font-size: 32upx;
						font-weight: bold;
						max-width: 300upx;
					}
				}
			}
			.image-list {
				white-space: nowrap;
				width: 100%;
				.img {
					display: inline-block;
					width: 180upx;
					height: 180upx;
					margin-right: 10upx;
					image {
						width: 100%;
						height: 100%;
						border-radius: 6px;
						overflow: hidden;
					}
				}
			}
		}
	}
}
</style>
