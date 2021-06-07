<template>
	<view>
		<view class="top">
			<view v-for="(item, index) in date" :key="index" @click="tabs(index)" :class="tab == index ? 'one' : 'one2'">
				<view class="one_2">{{ item.days }}</view>
				<view class="one_1">{{ item.day }}</view>
			</view>
		</view>
		<view v-if="tab == 0">
			<!-- <view class="secAll" v-for="(item, index) in 5" :key="index"> -->
			<view class="secAll">
				<view class="sec">
					<view class="sec_1"><image src="https://yd.wtanvxin.com/static/index1.png" mode=""></image></view>
					<view class="sec_2">规律起床</view>
					<view class="sec_3">
						<text>07:00</text>
						<text>/07:00</text>
					</view>
				</view>
				<view class="sec">
					<view class="sec_1"><image src="https://yd.wtanvxin.com/static/index2.png" mode=""></image></view>
					<view class="sec_2">步行</view>
					<view class="sec_3">
						<text>2000</text>
						<text>/6000步</text>
					</view>
				</view>
				<view class="sec">
					<view class="sec_1"><image src="https://yd.wtanvxin.com/static/index3.png" mode=""></image></view>
					<view class="sec_2">呼吸训练</view>
					<view class="sec_3">
						<text>2</text>
						<text>/6次</text>
					</view>
				</view>
				<view class="sec">
					<view class="sec_1"><image src="https://yd.wtanvxin.com/static/index4.png" mode=""></image></view>
					<view class="sec_2">训练时长</view>
					<view class="sec_3">
						<text>20</text>
						<text>/30分钟</text>
					</view>
				</view>
				<view class="sec">
					<view class="sec_1"><image src="https://yd.wtanvxin.com/static/index5.png" mode=""></image></view>
					<view class="sec_2">早睡</view>
					<view class="sec_3">
						<text>22:00</text>
						<text>/23:00</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tab: 0,
			date: [
				{
					days: 9,
					day: '今天'
				},
				{
					days: 10,
					day: '周三'
				},
				{
					days: 11,
					day: '周四'
				},
				{
					days: 12,
					day: '周五'
				},
				{
					days: 13,
					day: '周六'
				},
				{
					days: 14,
					day: '周日'
				},
				{
					days: 15,
					day: '周一'
				}
			]
		};
	},
	methods: {
		tabs(index) {
			this.tab = index;
		}
	}
};
</script>

<style lang="scss" scoped>
.top {
	margin-top: 30upx;
	display: flex;
	.one {
		flex: 1;
		text-align: center;
		.one_1 {
			font-size: 26upx;
		}
		.one_2 {
			background-color: #fe7c32;
			color: white;
			border-radius: 50%;
			padding: 6upx 5upx;
			margin: 20upx 18upx;
		}
	}
	.one2 {
		flex: 1;
		text-align: center;
		.one_1 {
			font-size: 26upx;
		}
		.one_2 {
			background-color: #ffffff;
			border-radius: 50%;
			padding: 6upx 5upx;
			margin: 20upx 18upx;
		}
	}
}
.secAll {
	.sec {
		background-color: white;
		border-radius: 20upx;
		display: flex;
		padding: 38upx 30upx;
		margin: 20upx;
		align-items: center;
		.sec_1 {
			flex: 1;
			image {
				width: 70upx;
				height: 70upx;
			}
		}
		.sec_2 {
			flex: 4;
			color: #989ba8;
			font-size: 34upx;
		}
		.sec_3 {
			flex: 2;
			text-align: right;
			text:nth-of-type(1) {
				font-size: 34upx;
			}
			text:nth-of-type(2) {
				color: #989ba8;
			}
		}
	}
}
</style>
