<template>
	<view class="scoreExchange">
		<view class="line"></view>
		<view class="con">
			<view class="con_1"><image :src="classdetail.PicImg"></image></view>
			<view class="con_2">
				<view class="title">{{ classdetail.Name }}</view>
				<view class="title_1">{{ classdetail.TargetName }} | {{ classdetail.DifficultyName }} | {{ classdetail.CourseDuration }}分钟</view>
				<view class="title_2">{{ classdetail.StoreNick }}</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="priceAll">
			<view class="price_1">
				<view class="price_1_1">课程原价</view>
				<view class="price_1_2">￥{{ classdetail.Price }}</view>
			</view>
			<view class="price_2">
				<view class="price_1_1">需要积分</view>
				<view class="price_1_2">{{ classdetail.Score }}Y币</view>
			</view>
		</view>
		<view class="foot">
			<view class="score">{{ classdetail.Score }}Y币</view>
			<view class="exchange" @click="exchangeClassSuc">兑换</view>
		</view>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
export default {
	data() {
		return {
			userId: '',
			token: '',
			classdetail: {},
			Id: 0
		};
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Id = e.classId;
		this.getClassDetail();
	},
	methods: {
		exchangeClassSuc() {
			this.getCourseBuy();
			// uni.navigateTo({
			// 	// url: '/pages/course/exchangeClassSuc/exchangeClassSuc'
			// });
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
			}
		},
		// 积分兑换
		async getCourseBuy() {
			let result = await post('Course/CourseBuy', {
				OutlineId: this.Id,
				UserId: this.userId,
				Token: this.token,
				IsPayWallet: 0,
				IsPayScore: 1,
				Password: ''
			});
			if (result.code == 0) {
				uni.navigateTo({
					url: '/pages/course/exchangeClassSuc/exchangeClassSuc'
				});
			}
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
