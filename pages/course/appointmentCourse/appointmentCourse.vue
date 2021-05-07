<template>
	<view class="appointmentCourse">
		<view class="tab">
			<view class="bg_fff tabList flex">
				<view class="item" v-for="(item, index) in tabs" :key="index" :class="{ active: item.Id == tabIndex }" @click="cliTab(item.Id)">{{ item.Name }}</view>
			</view>
			<view class="list" v-if="hasData">
				<view class="con" v-for="(item, index) in course" :key="index">
					<view class="con_1"><image :src="item.PicImg"></image></view>
					<view class="con_2">
						<view class="title">{{ item.Title }}</view>
						<view class="title_1">{{ item.TargetName }} | {{ item.DifficultyName }} | {{ item.CourseDuration }}分钟</view>
						<view class="title_2">
							<view class="title2_1">
								<image :src="item.CoachAvatar || '/static/default.png'"></image>
								<text>{{ item.CoachNick }}</text>
							</view>
							<view class="title2_2" @click="courseDetails(item.Id)">立即预约</view>
						</view>
					</view>
				</view>
			</view>
			<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
			<noData :isShow="noDataIsShow"></noData>
		</view>
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
			pageSize: 10,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			course: [],
			tabs: [],
			tabIndex: 45,
			id: 0
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getCourse();
		this.getCourseType();
	},
	methods: {
		courseDetails(id) {
			uni.navigateTo({
				url: '/pages/course/courseDetails/courseDetails?appointId=' + id
			});
		},
		cliTab(index) {
			this.tabIndex = index;
			this.page = 1;
			this.course = [];
			this.noDataIsShow = false;
			this.hasData = false;
			this.getCourse();
		},
		//所有课程类型
		async getCourseType() {
			let result = await post('Course/GetCourseTypeList', {});
			if (result.code == 0) {
				this.tabs = result.data;
			}
		},
		//预约课程列表
		async getCourse() {
			let result = await post('Course/GetCourseOfflineList', {
				page: this.page,
				pageSize: this.pageSize,
				UserId: this.userId,
				Token: this.token,
				SearchKey: '',
				IsNewPeopleVip: 0,
				Ctype: this.tabIndex,
				IsLike: 0,
				IsRic: 0
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
				this.course = result.data;
			}
			if (this.page > 1) {
				this.course.push(...result.data);
			}
			if (result.data.length < this.pageSize) {
				this.isLoad = false;
				this.loadingType = 2;
			} else {
				this.isLoad = true;
				this.loadingType = 0;
			}
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
			this.getCourse();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
