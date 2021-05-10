<template>
	<view class="newPer">
		<view v-for="(item, index) in course" :key="index">
			<view class="con"><image :src="item.PicImg" @click="courseDetails(item.Id)" mode="aspectFill"></image></view>
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
			pageSize: 8,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			course: [],
			id: 0
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getCourse();
	},
	methods: {
		courseDetails(id) {
			uni.navigateTo({
				url: '/pages/course/courseDetails/courseDetails?appointId=' + id
			});
		},
		//预约课程列表
		async getCourse() {
			let result = await post('Course/GetCourseOfflineList', {
				page: this.page,
				pageSize: this.pageSize,
				UserId: this.userId,
				Token: this.token,
				SearchKey: '',
				IsNewPeopleVip: 1,
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
.newPer {
	padding: 16upx;
	.con {
		padding: 12upx;
		image {
			border-radius: 10upx;
			height: 260upx;
			width: 100%;
		}
	}
}
</style>
