<template>
	<view style="width: 100%; height: 100%;">
		<view class="tabs">
			<view v-for="(tab, index) in tabs" class="tab-item" :class="current == index && 'active'" @click="current = index">{{ tab.title }}</view>
		</view>
		<swiper :current="current" class="swiper-box" @change="onChange">
			<swiper-item v-for="(item, index) in tabs" :key="index">
				<!-- <scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="scrolltolower"> -->
				<scroll-view style="height: 100%;" @scrolltolower="scrolltolower">
					<!-- #ifdef MP -->
					<slot name="{{'content' + index}}"></slot>
					<!-- #endif -->
					<!-- #ifndef MP -->
					<slot :name="'content' + index"></slot>
					<!-- #endif -->
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	name: 'swiperTab',
	props: {
		currentTab: {
			type: Number,
			default: 0
		},
		tabs: {
			type: Array,
			default: []
		}
	},
	data() {
		return {
			current: this.currentTab
		};
	},
	methods: {
		onChange(e) {
			this.current = e.detail.current;
			this.$emit('change', e.detail.current);
		},
		scrolltolower(e) {
			this.$emit('onReachBottom', this.current);
			console.log(this.current);
		}
	}
};
</script>
<style>
swiper-tab {
	display: block;
	/* height: 100%; */
	background-color: white;
}
</style>
<style lang="scss" scoped>
.tabs {
	width: 73%;
	display: flex;
	.tab-item {
		flex: 1;
		text-align: center;
		color: grey;
		background: #f3f3f3;
		border-radius: 30px;
		margin: 6px -5px 6px 15px;
		line-height: 230%;
		height: 80%;
		box-sizing: border-box;
		&.active {
			color: #f57609;
			background: #f17e083d;
			border-radius: 30px;
		}
	}
}
.swiper-box {
	width: 100%;
	height: 1040upx;
	overflow: auto;
}
</style>
