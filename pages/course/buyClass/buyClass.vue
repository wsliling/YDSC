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
				<view class="price_1_1">优惠券</view>
				<view class="price_1_2">暂无可用</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="pay">
			<view class="payPic">
				<view class=" iconfont icon-weixinzhifu wx"></view>
				<view class=" iconfont icon-zhifubao zfb"></view>
				<view class=" iconfont icon-qianbao qb"></view>
			</view>
			<view class="payWay">
				<view class="text">微信支付</view>
				<view class="text">支付宝支付</view>
				<view class="text">钱包支付</view>
			</view>
			<view class="payRadio">
				<radio-group>
					<view>
						<label class="radio"><radio checked="true" value="" color="#fa6008" /></label>
					</view>
					<view>
						<label class="radio"><radio value="" color="#fa6008" /></label>
					</view>
					<view>
						<label class="radio"><radio value="" color="#fa6008" /></label>
					</view>
				</radio-group>
			</view>
		</view>
		<view class="foot">
			总计：
			<view class="score">￥29.00</view>
			<view class="payfor" @click="buyClassSuc">提交</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		buyClassSuc() {
			uni.navigateTo({
				url: '/pages/course/buyClassSuc/buyClassSuc'
			});
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
