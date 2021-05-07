<template>
	<view class="details">
		<view class="top">
			<view class="photo"><image :src="orderdetail.HomeCover"></image></view>
			<view class="info">
				<view class="name">{{ orderdetail.UserNick }}</view>
				<view class="detail">{{ orderdetail.CoachTypeName }}</view>
				<view class="person">
					个人主页
					<text class="iconfont icon-arrow_r"></text>
				</view>
			</view>
			<view class="info1">
				<view class="info1_1" v-for="(item, index) in reguser" :key="index"><image :src="item.Avatar || 'http://yd.wtanvxin.com/static/default.png'"></image></view>
				<view class="info1_2">{{ orderdetail.ApplyNum }}人已预约</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="cen">
			<view class="stadium"><image :src="orderdetail.StoreLogo"></image></view>
			<view class="stadium_1">
				<view class="stadium_1_1">{{ orderdetail.StoreNick }}</view>
				<view class="stadium_1_2">{{ orderdetail.StoreAddress }}</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="time"><times v-if="hasDate" :CoachId="orderdetail.CoachId" :jsonData="orderdetail.DateList"></times></view>
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
			orderdetail: {},
			hasDate: false
		};
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Id = e.memberId;
		this.getOrderDetail();
	},
	methods: {
		async getOrderDetail() {
			let result = await post('Course/GetCoach_xq', {
				MemberId: this.Id,
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
