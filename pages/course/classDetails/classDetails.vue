<template>
	<view class="classDetails">
		<view class="top">
			<view class="photo"><image :src="classdetail.PicImg"></image></view>
			<view class="info">
				<view class="name">{{ classdetail.Name }}</view>
			</view>
			<view class="detail">
				<view class="detail_1">{{ classdetail.TargetName }} | {{ classdetail.DifficultyName }} | {{ classdetail.CourseDuration }}分钟</view>
				<view class="detail_2">{{ classdetail.Hits }}人看过</view>
			</view>
			<view class="info1">
				<view class="info1_3" @click="tolink('/pages/personal/VenueDetail/VenueDetail?gymId=' + classdetail.StoreId)">
					<image :src="classdetail.StoreLogo  || 'http://yd.wtanvxin.com/static/default.png'"></image>
				</view>
				<view class="info1_4">{{ classdetail.StoreNick }}</view>
				<view class="info1_2">关注</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="con">
			<view class="title">课程简介</view>
			<view class="con1_1">{{ classdetail.Intro }}</view>
		</view>
		<view class="line"></view>
		<view class="con">
			<view class="title">训练部位</view>
			<view class="con1_1">
				<text v-for="(item, index) in classdetails" :key="index">{{ item.Name }}</text>
			</view>
		</view>
		<view class="line"></view>
		<view class="con">
			<view class="title">训练准备</view>
			<view class="con1_1">{{ classdetail.TrainingPreparation }}</view>
		</view>
		<view class="line"></view>
		<view class="con">
			<view class="title">注意事项</view>
			<view class="con1_1">{{ classdetail.Note }}</view>
		</view>
		<view class="line"></view>
		<view class="con">
			<view class="title">购买须知</view>
			<view class="con1_1">购买此课程后，可观看视频教程进行训练</view>
		</view>
		<view class="line last_line"></view>
		<view class="foot">
			<view class="foot_1">
				<view class="iconfont" :class="[IsCollect ? 'icon-collect bd' : 'icon-collect1']" @click="collect"></view>
				收藏
			</view>
			<view class="foot_2">
				<view class="iconfont icon-share"></view>
				分享
			</view>
			<view class="foot_3" @click="tolink('/pages/course/scoreExchange/scoreExchange?classId=' + classdetail.Id)">{{ classdetail.Score }}Y币兑换</view>
			<view class="foot_4" @click="tolink('/pages/course/buyClass/buyClass?classId=' + classdetail.Id)">￥{{ classdetail.Price }}购买</view>
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
			Id: 0,
			classdetail: {}, // 课程详情
			classdetails: [], //训练部位
			IsCollect: false //是否收藏
		};
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Id = e.detailId;
		this.getClassDetail();
	},
	methods: {
		//跳转
		tolink(Url, islogin) {
			if (islogin == 'login') {
				if (toLogin()) {
					uni.navigateTo({
						url: Url
					});
				}
			} else {
				uni.navigateTo({
					url: Url
				});
			}
		},
		// 课程详情
		async getClassDetail() {
			let result = await post('Course/GetCourse_Outline_xq', {
				OutlineId: this.Id,
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.classdetail = result.data;
				this.classdetails = result.data.TrainingSiteInfo;
				this.IsCollect = result.data.IsCollect;
			}
		},
		//添加取消收藏
		async collect() {
			let result = await post('Course/CourseCollection', {
				OutlineId: this.Id,
				userId: this.userId,
				token: this.token
			});
			if (result.code == 0) {
				if (this.IsCollect) {
					uni.showToast({
						title: '已取消收藏！',
						icon: 'none',
						duration: 1500
					});
					this.IsCollect = false;
				} else {
					uni.showToast({
						title: '添加收藏成功！',
						icon: 'none',
						duration: 1500
					});
					this.IsCollect = true;
				}
			}
			if (result.code == 2) {
				uni.hideToast();
				toLogin();
			}
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
