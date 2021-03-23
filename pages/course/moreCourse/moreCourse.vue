<template>
	<view class="moreCourse">
		<view class="tab">
			<aloys-tab :tabs="tabs">
				<view slot="content0" class="xxx">
					<view class="tab1">
						<view class="con"><image src="/static/course/course2_1.png"></image></view>
						<view class="con"><image src="/static/course/course2_2.png"></image></view>
						<view class="con"><image src="/static/course/course2_3.png"></image></view>
						<view class="con"><image src="/static/course/course2_4.png"></image></view>
						<view class="con"><image src="/static/course/course2_5.png"></image></view>
						<view class="con"><image src="/static/course/course2_6.png"></image></view>
					</view>
				</view>
				<view slot="content1" class="xxx">B</view>
				<view slot="content2" class="xxx">C</view>
			</aloys-tab>
		</view>
	</view>
</template>

<script>
import aloysTab from '@/components/aloys-tab2/aloys-tab2.vue';
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
	methods: {}
};
</script>

<style lang="scss">
@import './style';
</style>
