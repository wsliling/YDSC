<template>
	<view class="orderClassDetails">
		<view class="top">
			<view class="photo"><image :src="orderdetail.PicImg"></image></view>
			<view class="info">
				<view class="name">{{ orderdetail.Title }}</view>
			</view>
			<view class="detail">{{ orderdetail.TargetName }} | {{ orderdetail.DifficultyName }}</view>
			<view class="info1">
				<view class="info1_3"><image :src="orderdetail.CoachAvatar"></image></view>
				<view class="info1_4">{{ orderdetail.CoachNick }}</view>
				<view class="info1_1"><image :src="orderdetail.RegUser||'/static/default.png'"></image></view>
				<view class="info1_2">{{ orderdetail.ApplyNum }}人已预约</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="cen">
			<view class="stadium"><image :src="orderdetail.StoreLogo"></image></view>
			<view class="stadium_1">
				<view class="stadium_1_1">{{ orderdetail.StoreName }}</view>
				<view class="stadium_1_2">{{ orderdetail.StoreAddress }}</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="con">
			<view class="title">课程简介</view>
			<view class="con1_1">
				{{ orderdetail.CoachNick }}
				<!-- <text>展开更多</text> -->
			</view>
		</view>
		<view class="line"></view>
		<view class="time"><times v-if="hasDate" :reserveId="Id" :jsonData="orderdetail.DateList"></times></view>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
import times from '@/components/pretty-timespicker2/pretty-timespicker2.vue';
export default {
	components: {
		times
	},
	data() {
		return {
			userId: '',
			token: '',
			Id: 0,
			orderdetail: {},
			hasDate:false
		};
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Id = e.orderId;
		this.getOrderDetail();
		// this.getOrderDetails();
	},
	methods: {
		async getOrderDetail() {
			let result = await post('Course/GetCourseOffline_xq', {
				Id: this.Id,
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.orderdetail = result.data;
				this.hasDate=true
				
			}
		}
		// async getOrderDetails() {
		// 	let result = await post('Course/CourseOfflineReg', {
		// 		Id: this.Id,
		// 		UserId: this.userId,
		// 		Token: this.token,
		// 		// DateId: 0,
		// 		// HourId: 0
		// 	});
		// 	if (result.code == 0) {
		// 		this.orderdetail = result.data;
		// 	}
		// }
	}
};
</script>

<style lang="scss">
@import './style';
</style>
