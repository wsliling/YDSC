<template>
	<view class="appointmentCoach">
		<block v-if="coachlist.length">
		<view class="title">推荐教练</view>
		<view class="tui">
			<view class="list" v-for="(item, index) in coachlist" :key="index">
				<view class="list1_1"><image :src="item.Avatar || 'http://yd.wtanvxin.com/static/default.png'" @click="coachDetails(item.MemberId)" mode="aspectFill"></image></view>
				<view class="name">{{ item.UserNick }}</view>
				<view class="num">{{ item.ApplyNum }}人预约过</view>
			</view>
		</view>
		</block>
		<block v-if="hasData">
		<view class="title">全部教练</view>
		<view class="list1" v-for="(item, index) in coachlistOne" :key="index">
			<view class="list1_1"><image :src="item.Avatar|| 'http://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image></view>
			<view class="list1_2">
				<view class="name">{{ item.UserNick }}</view>
				<view class="num">{{ item.ApplyNum }}人预约过</view>
			</view>
			<view class="list1_3" @click="coachDetails(item.MemberId)">立即预约</view>
		</view>
		</block>
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
			pageSize: 12,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			IsRec: 0,
			AreaCode: '',
			coachlist: {},
			coachlistOne: {}
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.AreaCode = uni.getStorageSync('AreaCode');
		this.getRec();
		this.getCoachList();
	},
	methods: {
		coachDetails(id) {
			uni.navigateTo({
				url: '/pages/course/coachDetails/coachDetails?memberId=' + id
			});
		},
		//推荐
		async getRec(){
			let result = await post('Course/GetCoachList', {
				page: 1,
				pageSize: 20,
				IsRec: 1,
				AreaCode: this.AreaCode
			});
			if (result.code == 0){
				this.coachlist = result.data;
			}
		},
		//教练列表
		async getCoachList() {
			let result = await post('Course/GetCoachList', {
				page: this.page,
				pageSize: this.pageSize,
				AreaCode: this.AreaCode
			});
			if (result.code == 0) {
				if (result.data.length > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
				}
				if (result.data.length == 0 && this.page == 1) {
					this.noDataIsShow = true;
					this.hasData = false;
				}
				if (this.page === 1) {
					this.coachlistOne = result.data;
				}
				if (this.page > 1) {
					this.coachlistOne = this.coachlist.concat(result.data);
				}
				if (result.data.length < this.pageSize) {
					this.isLoad = false;
					this.loadingType = 2;
				} else {
					this.isLoad = true;
					this.loadingType = 0;
				}
			}
		}
	},
	onPullDownRefresh() {
		this.page = 1;
		this.coachlistOne=[];
		this.getRec();
		this.getCoachList();
		uni.stopPullDownRefresh();
	},
	// 上拉加载
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.page++;
			this.getCoachList();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
