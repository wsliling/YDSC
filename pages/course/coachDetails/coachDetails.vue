<template>
	<view class="details">
		<view class="top">
			<view class="photo"><image :src="coachdetail.HomeCover||'https://yd.wtanvxin.com/static/topic.jpg'" mode="aspectFill"></image></view>
			<view class="info flex-between">
				<view class="name">{{ coachdetail.UserNick }}</view>
				<view class="detail">{{ coachdetail.CoachTypeName }}</view>
				<view class="person" @click="tolink('/pages/homepage/homepage?id='+coachdetail.MemberId)">
					个人主页
					<text class="iconfont icon-arrow_r"></text>
				</view>
			</view>
			<view class="info1 flex-between">
				<view class="info1_1" v-for="(item, index) in reguser" :key="index">
					<image :src="item.Avatar || 'https://yd.wtanvxin.com/static/static/default.png'" mode="aspectFill"></image>
				</view>
				<view class="info1_2">{{ coachdetail.ApplyNum }}人已预约</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="cen" @click="tolink('/pages/personal/VenueDetail/VenueDetail?gymId='+coachdetail.StoreId)">
			<view class="stadium"><image :src="coachdetail.StoreLogo || 'https://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image></view>
			<view class="stadium_1 flex1">
				<view class="stadium_1_1">{{ coachdetail.StoreNick }}</view>
				<view class="stadium_1_2">{{ coachdetail.StoreAddress }}</view>
			</view>
			<view class="iconfont icon-arrow_r c_999"></view>
		</view>
		<view class="line"></view>
		<view class="time">
			<times v-if="hasDate && coachdetail.DateList.length" :CoachId="coachdetail.CoachId" :jsonData="coachdetail.DateList"></times>
			<view class="title" v-else>暂无排课时间</view>
		</view>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
import times from '@/components/pretty-timespicker/pretty-timespicker.vue';
export default {
	components: {
		times
	},
	data() {
		return {
			userId: '',
			token: '',
			Id: 0,
			reguser: [],
			coachdetail: {},
			hasDate: false
		};
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Id = e.memberId;
		this.getcoachDetails();
	},
	methods: {
		tolink(url){
			uni.navigateTo({
				url:url
			})
		},
		async getcoachDetails() {
			let result = await post('Course/GetCoach_xq', {
				MemberId: this.Id,
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.coachdetail = result.data;
				this.reguser = this.coachdetail.RegUser;
				this.hasDate = true;
			}
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
