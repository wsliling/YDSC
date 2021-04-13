<template>
	<view class="order">
		<view class="title">推荐教练</view>
		<view class="tui">
			<view class="list" v-for="(item, index) in coachlist" :key="index">
				<view class="list1_1"><image :src="item.Avatar" @click="details(item.Id)"></image></view>
				<view class="name">{{ item.UserNick }}</view>
				<view class="num">{{ item.ApplyNum }}人预约过</view>
			</view>
			<view class="list">
				<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
				<noData :isShow="noDataIsShow"></noData>
			</view>
		</view>
		<view class="title">全部教练</view>
		<view class="list1" v-for="(item, index) in coachlist" :key="index">
			<view class="list1_1"><image :src="item.Avatar"></image></view>
			<view class="list1_2">
				<view class="name">{{ item.UserNick }}</view>
				<view class="num">{{ item.ApplyNum }}人预约过</view>
			</view>
			<view class="list1_3" @click="details(item.Id)">立即预约</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
		<noData :isShow="noDataIsShow"></noData>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
import noData from '@/components/noData.vue'; //暂无数据
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
export default {
	components: {
		noData,
		uniLoadMore
	},
	data() {
		return {
			userId: '',
			token: '',
			page: 1,
			pageSize: 4,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			IsRec: 0,
			AreaCode: '',
			coachlist: {}
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getCoachList();
	},
	methods: {
		details(id) {
			uni.navigateTo({
				url: '/pages/course/details/details?coachId=' + id
			});
		},
		//教练列表
		async getCoachList() {
			let result = await post('Course/GetCoachList', {
				page: this.page,
				pageSize: this.pageSize,
				IsRec: 0,
				AreaCode: ''
			});
			if (result.code == 0) {
				if (result.data.length > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
				}
			}
			if (result.data.length == 0 && this.page == 1) {
				this.noDataIsShow = true;
				this.hasData = false;
			}
			if (this.page === 1) {
				this.coachlist = result.data;
			}
			if (this.page > 1) {
				this.coachlist = this.coachlist.concat(result.data);
			}
			if (result.data.length < this.pageSize) {
				this.isLoad = false;
				this.loadingType = 2;
			} else {
				this.isLoad = true;
				this.loadingType = 0;
			}
		},
		onPullDownRefresh() {
			this.page = 1;
			uni.stopPullDownRefresh();
		},
		// 上拉加载
		onReachBottom: function() {
			if (this.isLoad) {
				this.loadingType = 1;
				this.page++;
			} else {
				this.loadingType = 2;
			}
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
