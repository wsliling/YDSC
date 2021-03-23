<template>
	<view class="details">
		<view class="top">
			<view class="photo"><image src="../../../static/course/course5_6.png" mode=""></image></view>
			<view class="info">
				<view class="name">张倩倩</view>
				<view class="detail">瑜伽教练</view>
				<view class="person">
					个人主页
					<text class="iconfont icon-arrow_r"></text>
				</view>
			</view>
			<view class="info1">
				<view class="info1_1"><image src="../../../static/course/course5_7.png" mode=""></image></view>
				<view class="info1_2">1.8万人已预约</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="cen">
			<view class="stadium"><image src="../../../static/course/course_2.png" mode=""></image></view>
			<view class="stadium_1">
				<view class="stadium_1_1">深圳力美健俱乐部</view>
				<view class="stadium_1_2">龙华区恒福路98号淘金花园商业中心</view>
			</view>
		</view>
		<view class="line" @click="show"></view>
		<view class="time"><times @change="getTime"></times></view>
	</view>
</template>

<script>
import times from '@/components/pretty-timespicker/pretty-timespicker.vue';
export default {
	components: {
		times
	},
	data() {
		return {};
	},
	methods: {}
};
</script>

<style lang="scss">
@import './style';
</style>
