<template>
	<view class="order">
		<view class="title">推荐教练</view>
		<view class="tui">
			<view class="list">
				<view><image src="/static/course/course5_1.png" @click="details"></image></view>
				<view class="name">张倩倩</view>
				<view class="num">8765人预约过</view>
			</view>
			<view class="list">
				<view><image src="/static/course/course5_2.png" mode=""></image></view>
				<view class="name">刘武奇</view>
				<view class="num">8765人预约过</view>
			</view>
			<view class="list">
				<view><image src="/static/course/course5_1.png" mode=""></image></view>
				<view class="name">张倩倩</view>
				<view class="num">8765人预约过</view>
			</view>
			<view class="list">
				<view><image src="/static/course/course5_2.png" mode=""></image></view>
				<view class="name">刘武奇</view>
				<view class="num">8765人预约过</view>
			</view>
		</view>
		<view class="title">全部教练</view>
		<view class="list1">
			<view class="list1_1"><image src="/static/course/course5_3.png" mode=""></image></view>
			<view class="list1_2">
				<view class="name">李云龙</view>
				<view class="num">8765人预约过</view>
			</view>
			<view class="list1_3">立即预约</view>
		</view>
		<view class="list1">
			<view class="list1_1"><image src="/static/course/course5_4.png" mode=""></image></view>
			<view class="list1_2">
				<view class="name">李雪儿</view>
				<view class="num">8765人预约过</view>
			</view>
			<view class="list1_3_1">已约满</view>
		</view>
		<view class="list1">
			<view class="list1_1"><image src="/static/course/course5_5.png" mode=""></image></view>
			<view class="list1_2">
				<view class="name">郝武建</view>
				<view class="num">8765人预约过</view>
			</view>
			<view class="list1_3">立即预约</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		details() {
			uni.navigateTo({
				url: '/pages/course/details/details'
			});
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
