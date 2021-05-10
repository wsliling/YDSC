<template>
	<view class="orderClassDetails">
		<view class="top">
			<view class="photo"><image :src="orderdetail.PicImg" mode="aspectFill"></image></view>
			<view class="info">
				<view class="name">{{ orderdetail.Title }}</view>
			</view>
			<view class="detail">{{ orderdetail.TargetName }} | {{ orderdetail.DifficultyName }}</view>
			<view class="info1">
				<view class="info1_3"><image :src="orderdetail.CoachAvatar || 'http://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image></view>
				<view class="info1_4">{{ orderdetail.CoachNick }}</view>
				<view class="info1_1" v-for="(item, index) in reguser" :key="index">
					<image :src="item.Avatar || 'http://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image>
				</view>
				<view class="info1_2">{{ orderdetail.ApplyNum }}人已预约</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="cen">
			<view class="stadium"><image :src="orderdetail.StoreLogo || 'http://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image></view>
			<view class="stadium_1">
				<view class="stadium_1_1">{{ orderdetail.StoreName }}</view>
				<view class="stadium_1_2">{{ orderdetail.StoreAddress }}</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="con">
			<view class="title">课程简介</view>
			<view class="con1_1">{{ orderdetail.CoachNick }}</view>
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
			reguser: [],
			hasDate: false
		};
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Id = e.orderId;
		this.getOrderDetail();
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
				this.reguser = this.orderdetail.RegUser;
				this.hasDate = true;
			}
		}
	}
};
</script>
<style lang="scss">
@import './style';
</style>
