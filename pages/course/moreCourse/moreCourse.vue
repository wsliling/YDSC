<template>
	<view class="moreCourse">
		<view class="tab">
			<view class="bg_fff tabList flex">
				<view class="item" v-for="(item, index) in tabs" :key="index" :class="{ active: item.Id == tabIndex }" @click="cliTab(item.Id)">{{ item.Name }}</view>
			</view>
			<view class="list" v-if="hasData">
				<view class="tab1" v-for="(item, index) in classlist" :key="index">
					<view class="sec2_1"><image :src="item.PicImg" @click="classDetails(item.Id)" mode="aspectFill"></image></view>
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
			pageSize: 8,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			classlist: [],
			tabs: [],
			tabIndex: 45,
			id: 0
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getCourseList();
		this.getCourseType();
	},
	methods: {
		classDetails(id) {
			uni.navigateTo({
				url: '/pages/course/classDetails/classDetails?detailId=' + id
			});
		},
		cliTab(index) {
			this.tabIndex = index;
			this.page = 1;
			this.classlist = [];
			this.noDataIsShow = false;
			this.hasData = false;
			this.getCourseList();
		},
		//所有课程类型
		async getCourseType() {
			let result = await post('Course/GetCourseTypeList', {});
			if (result.code == 0) {
				this.tabs = result.data;
			}
		},
		//课程列表
		async getCourseList() {
			let result = await post('Course/GetCourseOutlineList', {
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
				this.classlist = result.data;
			}
			if (this.page > 1) {
				this.classlist = this.classlist.concat(result.data);
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
		this.getCourseList();
		uni.stopPullDownRefresh();
	},
	// 上拉加载
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.page++;
			this.getCourseList();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
