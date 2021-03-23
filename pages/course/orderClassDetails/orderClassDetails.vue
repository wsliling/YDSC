<template>
	<view class="orderClassDetails">
		<view class="top">
			<view class="photo"><image src="/static/course/course6_10.png" mode=""></image></view>
			<view class="info"><view class="name">超强下腹燃脂,躺练版训练</view></view>
			<view class="detail">极速燃脂 | 低强度 | 60分钟</view>
			<view class="info1">
				<view class="info1_3"><image src="/static/course/course3_2.png" mode=""></image></view>
				<view class="info1_4">可乐</view>
				<view class="info1_1"><image src="/static/course/course5_7.png" mode=""></image></view>
				<view class="info1_2">1.8万人已预约</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="cen">
			<view class="stadium"><image src="/static/course/course_2.png" mode=""></image></view>
			<view class="stadium_1">
				<view class="stadium_1_1">深圳力美健俱乐部</view>
				<view class="stadium_1_2">龙华区恒福路98号淘金花园商业中心</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="con">
			<view class="title">课程简介</view>
			<view class="con1_1">
				瑜伽教练培训简介，培训专业瑜伽教练，专业瑜伽推拿培训，针对不同的学习方式，提升未来的竞争力，让您的人生更加适合自己的特长，帮助学员在管理过程中的提升，坚持两周时间，可以感觉到身体素...
				<text>展开更多</text>
			</view>
		</view>
		<view class="line" @click="show"></view>
		<view class="time"><times @change="getTime"></times></view>
	</view>
</template>

<script>
import times from '@/components/pretty-timespicker2/pretty-timespicker2.vue';
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
