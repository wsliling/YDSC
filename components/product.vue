<template>
	<view class="uni-product" @click="getproid(datajson.Id)">
		<view class="itembox">
			<view class="image-view">
				<image class="uni-product-image" :src="datajson.PicNo||'http://via.placeholder.com/800x800'"
				 mode="aspectFill"></image>
			</view>
			<view class="txtbox">
				<view class="uni-product-title">{{datajson.Name}}</view>
				<view class="uni-product-price">
					<text class="uni-product-price-original">￥{{datajson.Price}}</text>
					<text class="uni-product-price-favour" style="display: none;">￥{{datajson.MarketPrice}}</text>
					<text class="uni-product-sale">已售{{datajson.SalesVolume}}</text>
				</view>
				<view class="plus-price" v-if="datajson.IsPlusPrice==1">
					￥{{datajson.PlusPrice}}<text class="icon icon-plusprice"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'product',
		//props: ['image', 'title', 'originalPrice', 'favourPrice', 'tip']
		props: {
			datajson: {
				type: Object,
				default: function(e) {
					return {}
				}
			}
		},
		methods: {
			getproid(id) {
				this.$emit('goDetail', id);
			},
		}
	}
</script>

<style scoped>
	.uni-product {
		padding: 0;
		width: 49%;
		margin-bottom: 14upx;
		/* #ifdef MP-WEIXIN */
		width: 100%;
		height: 100%;
		margin-bottom: 0;
		/* #endif */
	}

	.uni-product .itembox {
		height: 100%;
		background: #fff;
		border-radius: 6px;
		overflow: hidden;
	}

	.uni-product .image-view {
		margin: 0;
		width: 100%;
	}

	.uni-product .uni-product-image {
		width: 100%;
	}

	.uni-product .txtbox {
		padding: 18upx;
	}

	.uni-product .uni-product-sale {
		float: right;
		font-size: 24upx;
		color: #999;
	}
	/* .uni-product-price-original{ font-size: 36upx;} */
	.plus-price .icon-plusprice{ display: inline-block; vertical-align: middle; height: 28upx; width: 60upx; background: url(http://xcx.yixijiu19.com/static/plus/plus_icon.png) right center no-repeat; background-size: 100%; }
</style>
