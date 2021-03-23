<template>
	<view class="scoreExchange">
		<view class="line"></view>
		<view class="con">
			<view class="con_1"><image src="/static/course/course3_3.png" @click="classDetails"></image></view>
			<view class="con_2">
				<view class="title">超强下腹燃脂，7分钟躺练版</view>
				<view class="title_1">极速燃脂 | 低强度 | 7分钟</view>
				<view class="title_2">YDstrong官方课程</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="priceAll">
			<view class="price_1">
				<view class="price_1_1">课程原价</view>
				<view class="price_1_2">￥29</view>
			</view>
			<view class="price_2">
				<view class="price_1_1">需要积分</view>
				<view class="price_1_2">99Y币</view>
			</view>
		</view>
		<view class="foot">
			<view class="score">99Y币</view>
			<view class="exchange" @click="exchangeClassSuc">兑换</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		exchangeClassSuc() {
			uni.navigateTo({
				url: '/pages/course/exchangeClassSuc/exchangeClassSuc'
			});
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
