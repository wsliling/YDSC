<template>
	<swiper class="image-container" :previous-margin="distance" :next-margin="distance" circular  @change="swiperChange" :vertical="verticals">
		<swiper-item :class="currentIndex == index ? 'swiper-item' : 'swiper-item-side'" v-for="(item, index) in imgList" :key="item">
			<view @click="clickImg(item)" :class="currentIndex == index ? 'item-img' : 'item-img-side'"  lazy-load :style="dontFirstAnimation ? 'animation: none;' : ''">{{item}}</view>
		</swiper-item>
	</swiper>
</template>
<script>
	export default {
		props: {
			imgList: {
				type: Array,
				default() {
					return []
				}
			},
			urlKey: {
				type: String,
				default() {
					return ''
				}
			},
			verticals: {
				type: String,
				default() {
					return ''
				}
			},
			distance: {
				type: String,
				default() {
					return ''
				}
			},
		},
		data() {
			return {
				currentIndex: 0,
				dontFirstAnimation: true,
			}
		},
		methods: {
			swiperChange(e) {
				this.dontFirstAnimation = false
				this.currentIndex = e.detail.current
				console.log(e.detail.current+1)
			},
			clickImg(item) {
				this.$emit('selected', item, this.currentIndex)
			}
		}
	}
</script>
<style scoped>
	.image-container {
		max-height: 280rpx;
		text-align: center;
	}

	.item-img {
		width: 100upx;
		height: 60rpx;
		border-radius: 14rpx;
		animation: to-big .3s;
		margin: 0;
		color: #fa6008;
	}

	.swiper-item {
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.item-img-side {
		height: 40rpx;
		color: #e9e9e9;
		border-radius: 14rpx;
		animation: to-mini .3s;
		
	}

	.swiper-item-side {
		height: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	@keyframes to-mini
	{
		from {
			height: 60rpx;
		}
		to {
			height: 40rpx;
		}
	}
	@keyframes to-big
	{
		from {
			height: 40rpx;
		}
		to {
			height: 60rpx;
		}
	}
</style>
