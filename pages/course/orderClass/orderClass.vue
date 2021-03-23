<template>
	<view class="orderClass">
		<view class="tab">
			<aloys-tab :tabs="tabs">
				<view slot="content0" class="xxx">
					<view class="con">
						<view class="con_1"><image src="/static/course/course6_1.png" @click="classDetails"></image></view>
						<view class="con_2">
							<view class="title">帕梅拉10分钟全身燃脂新...</view>
							<view class="title_1">极速燃脂 低强度 60分钟</view>
							<view class="title_2">
								<view class="title2_1">
									<image src="/static/course/course6_7.png" mode=""></image>
									<text>零碎记忆</text>
								</view>
								<view class="title2_2" @click="orderClassDetails">立即预约</view>
							</view>
						</view>
					</view>
					<view class="con">
						<view class="con_1"><image src="/static/course/course6_2.png" mode=""></image></view>
						<view class="con_2">
							<view class="title">帕梅拉10分钟全身燃脂新...</view>
							<view class="title_1">极速燃脂 低强度 60分钟</view>
							<view class="title_2">
								<view class="title2_1">
									<image src="/static/course/course6_8.png" mode=""></image>
									<text>零碎记忆</text>
								</view>
								<view class="title2_2">立即预约</view>
							</view>
						</view>
					</view>
					<view class="con">
						<view class="con_1"><image src="/static/course/course6_3.png" mode=""></image></view>
						<view class="con_2">
							<view class="title">帕梅拉10分钟全身燃脂新...</view>
							<view class="title_1">极速燃脂 低强度 60分钟</view>
							<view class="title_2">
								<view class="title2_1">
									<image src="/static/course/course6_9.png" mode=""></image>
									<text>零碎记忆</text>
								</view>
								<view class="title2_2">立即预约</view>
							</view>
						</view>
					</view>
					<view class="con">
						<view class="con_1"><image src="/static/course/course6_4.png" mode=""></image></view>
						<view class="con_2">
							<view class="title">帕梅拉10分钟全身燃脂新...</view>
							<view class="title_1">极速燃脂 低强度 60分钟</view>
							<view class="title_2">
								<view class="title2_1">
									<image src="/static/course/course6_7.png" mode=""></image>
									<text>零碎记忆</text>
								</view>
								<view class="title2_2">立即预约</view>
							</view>
						</view>
					</view>
					<view class="con">
						<view class="con_1"><image src="/static/course/course6_5.png" mode=""></image></view>
						<view class="con_2">
							<view class="title">帕梅拉10分钟全身燃脂新...</view>
							<view class="title_1">极速燃脂 低强度 60分钟</view>
							<view class="title_2">
								<view class="title2_1">
									<image src="/static/course/course6_8.png" mode=""></image>
									<text>零碎记忆</text>
								</view>
								<view class="title2_2">立即预约</view>
							</view>
						</view>
					</view>
					<view class="con">
						<view class="con_1"><image src="/static/course/course6_6.png" mode=""></image></view>
						<view class="con_2">
							<view class="title">帕梅拉10分钟全身燃脂新...</view>
							<view class="title_1">极速燃脂 低强度 60分钟</view>
							<view class="title_2">
								<view class="title2_1">
									<image src="/static/course/course6_9.png" mode=""></image>
									<text>零碎记忆</text>
								</view>
								<view class="title2_2">立即预约</view>
							</view>
						</view>
					</view>
				</view>
				<view slot="content1" class="xxx">B</view>
				<view slot="content2" class="xxx">C</view>
			</aloys-tab>
		</view>
	</view>
</template>

<script>
import aloysTab from '@/components/aloys-tab3/aloys-tab3.vue';
export default {
	components: {
		aloysTab
	},
	data() {
		return {
			tabs: [
				{
					title: '推荐'
				},
				{
					title: '减脂'
				},
				{
					title: '塑形'
				},
				{
					title: '增肌'
				},
				{
					title: '体态'
				},
				{
					title: '热身'
				}
			]
		};
	},
	methods: {
		orderClassDetails() {
			uni.navigateTo({
				url: '/pages/course/orderClassDetails/orderClassDetails'
			});
		},
		classDetails() {
			uni.navigateTo({
				url: '/pages/course/classDetails/classDetails'
			});
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
