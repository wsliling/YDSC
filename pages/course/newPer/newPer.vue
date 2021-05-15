<template>
	<view class="newPer">
		<view class="list" v-if="hasData">
			<block v-for="(item, index) in course" :key="index">
				<view class="sec2_1"><image :src="item.PicImg" mode="aspectFill"></image></view>
				<view class="detail" @click="courseDetails(item.Id)">
					<view class="title">{{ item.Title }}</view>
					<view class="title_1">{{ item.CourseDuration }}分钟 · {{ item.DifficultyName }} · {{ item.TargetName }}</view>
				</view>
			</block>
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
.list {
	margin: 20upx;
	position: relative;
	.sec2_1 {
		margin-bottom: 20upx;
		image {
			border-radius: 20upx;
			height: 280upx;
		}
	}
	.detail {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 20upx;
		height: 280upx;
		width: 100%;
		z-index: 1;
		position: absolute;
		padding-left: 30upx;
		padding-top: 100upx;
		margin-top: -300upx;
		color: white;
		.title {
			font-size: 40upx;
		}
	}
	.more {
		text-align: center;
		background: #f3f3f3;
		border-radius: 100px;
		margin: 30upx auto 0;
		height: 76upx;
		line-height: 76upx;
		width: 50%;
	}
}
</style>
