<template>
	<view class="courseDetails">
		<view class="top">
			<view class="photo"><image :src="appcoursedetail.PicImg" mode="aspectFill"></image></view>
			<view class="info">
				<view class="name">{{ appcoursedetail.Title }}</view>
			</view>
			<view class="detail">{{ appcoursedetail.TargetName }} | {{ appcoursedetail.DifficultyName }}</view>
			<view class="info1">
				<view class="info1_3"><image :src="appcoursedetail.CoachAvatar || 'http://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image></view>
				<view class="info1_4">{{ appcoursedetail.CoachNick }}</view>
				<view class="info1_1" v-for="(item, index) in reguser" :key="index">
					<image :src="item.Avatar || 'http://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image>
				</view>
				<view class="info1_2">{{ appcoursedetail.ApplyNum }}人已预约</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="cen">
			<view class="stadium"><image :src="appcoursedetail.StoreLogo || 'http://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image></view>
			<view class="stadium_1">
				<view class="stadium_1_1">{{ appcoursedetail.StoreName }}</view>
				<view class="stadium_1_2">{{ appcoursedetail.StoreAddress }}</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="con">
			<view class="title">课程简介</view>
			<view class="con1_1">{{ appcoursedetail.Content }}</view>
		</view>
		<view class="line"></view>
		<view class="time">
			<times v-if="hasDate && appcoursedetail.DateList.length" :reserveId="Id" :jsonData="appcoursedetail.DateList"></times>
			<view class="title" v-else>暂无排课时间</view>
		</view>
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
			appcoursedetail: {},
			reguser: [],
			hasDate: false
		};
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Id = e.appointId;
		this.getAppCourseDetail();
	},
	methods: {
		async getAppCourseDetail() {
			let result = await post('Course/GetCourseOffline_xq', {
				Id: this.Id,
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.appcoursedetail = result.data;
				this.reguser = this.appcoursedetail.RegUser;
				this.hasDate = true;
			}
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
