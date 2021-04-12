<template>
	<view class="classDetails">
		<view class="top">
			<view class="photo"><image src="/static/course/course3_1.png" mode=""></image></view>
			<view class="info"><view class="name">超强下腹燃脂,7分钟躺练版训练</view></view>
			<view class="detail">
				<view class="detail_1">极速燃脂 | 低强度 | 7分钟</view>
				<view class="detail_2">1.8万人看过</view>
			</view>
			<view class="info1">
				<view class="info1_3"><image src="/static/course/course3_2.png" mode=""></image></view>
				<view class="info1_4">YDstrong官方课程</view>
				<view class="info1_2">关注</view>
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
		<view class="line"></view>
		<view class="con">
			<view class="title">训练部位</view>
			<view class="con1_1">全身、腹部</view>
		</view>
		<view class="line"></view>
		<view class="con">
			<view class="title">训练准备</view>
			<view class="con1_1">毛巾、饮用水、瑜伽垫</view>
		</view>
		<view class="line"></view>
		<view class="con">
			<view class="title">注意事项</view>
			<view class="con1_1">老年人(年龄大于65岁)、孕妇、残疾人不适宜训练此课程;患有糖尿病、心脑血管疾病、肺部类疾病以及其他新陈代谢疾病的人群,不适宜训练此课程。</view>
		</view>
		<view class="line"></view>
		<view class="con">
			<view class="title">购买须知</view>
			<view class="con1_1">购买此课程后，可观看视频教程进行训练</view>
		</view>
		<view class="line last_line"></view>
		<view class="foot">
			<view class="foot_1">
				<view class="iconfont icon-collect1"></view>
				收藏
			</view>
			<view class="foot_2">
				<view class="iconfont icon-share"></view>
				分享
			</view>
			<view class="foot_3" @click="scoreExchane">99Y币兑换</view>
			<view class="foot_4" @click="buyClass">￥29购买</view>
		</view>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
export default {
	components: {},
	data() {
		return {
			userId: '',
			token: '',
			Id: '',
			classdetail: []
		};
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Id = e.detailId;
		this.getClassDetail();
	},
	methods: {
		scoreExchane() {
			uni.navigateTo({
				url: '/pages/course/scoreExchange/scoreExchange'
			});
		},
		buyClass() {
			uni.navigateTo({
				url: '/pages/course/buyClass/buyClass'
			});
		},
		async getClassDetail() {
			let result = await post('Course/GetCourse_Outline_xq', {
				OutlineId: this.Id,
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.classdetail = result.data;
			}
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
