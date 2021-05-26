<template>
	<view>
		<view class="list" v-if="hasData">
			<view v-for="(item, index) in classlist" :key="index">
				<view class="sec4_1" @click="classDetails(item.Id)">
					<view><image :src="item.PicImg" mode="aspectFill"></image></view>
					<view>
						<view class="sec4_title">{{ item.Title }}</view>
						<view class="sec4_title1">{{ item.DifficultyName }} . {{ item.CourseDuration }}分钟</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
		<noData :isShow="noDataIsShow" :tips="tipstxt || '暂无数据'"></noData>
	</view>
</template>

<script>
import { post, get, toLogin } from '@/common/util.js';
import noData from '@/components/noData.vue'; //暂无数据
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
export default {
	components: {
		noData,
		uniLoadMore
	},
	data() {
		return {
			barHeight: 0,
			userId: '',
			token: '',
			page: 1,
			pageSize: 8,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			classlist: [],
			id: 0,
			tipstxt: '',
			searchVal: ''
		};
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
	},
	onLoad(e) {
		// #ifdef APP-PLUS
		this.barHeight = plus.navigator.getStatusbarHeight();
		// #endif
		// #ifdef H5
		this.barHeight = 0;
		// #endif
		this.searchVal = e.seakey;
		this.getCourseList();
	},
	methods: {
		classDetails(id) {
			uni.navigateTo({
				url: '/pages/course/classDetails/classDetails?detailId=' + id
			});
		}, //课程列表
		async getCourseList() {
			let result = await post('Course/GetCourseOutlineList', {
				page: this.page,
				pageSize: this.pageSize,
				UserId: this.userId,
				Token: this.token,
				SearchKey: this.searchVal,
				IsNewPeopleVip: 0,
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
	},
	// app端拦截返回事件 ，仅app端生效
	onBackPress() {
		if (this.showRight) {
			this.$refs.showRight.close();
			return true;
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: white;
}
.list {
	padding: 10upx 20upx;
	border-top: 20upx solid #f5f5f5;
	.sec4_1 {
		display: flex;
		height: 220upx;
		line-height: 220upx;
		align-items: center;
		> view:nth-of-type(1) {
			flex: 1;
			padding: 0 12upx;
			image {
				height: 190upx;
				border-radius: 10upx;
			}
		}
		> view:nth-of-type(2) {
			flex: 1.8;
			height: 200upx;
			line-height: 60upx;
			.sec4_title {
				font-size: 33upx;
			}
			.sec4_title1 {
				color: gray;
				font-size: 22upx;
			}
		}
	}
}
</style>
