<template>
	<view>
		<uni-nav-bar fixed="true" color="#333" background-color="#fff" left-icon="arrowleft" @clickLeft="back" :border="false">
			<block slot="center" class="flex1">
				<view class="input-view" style="background: #f2f2f2; border-radius: 100px;">
					<uni-icons class="input-uni-icon" type="search" size="22" color="#b8b8b8" />
					<input confirm-type="search" class="nav-bar-input flex1" type="text" placeholder="输入搜索关键词" v-model="searchVal" @confirm="confirm" />
					<view v-if="searchVal !== ''" class="uni-searchbar__box-icon-clear" @click="clear"><uni-icons color="#999999" class="" size="18" type="clear" /></view>
				</view>
			</block>
			<block slot="right">
				<view class="uni-navbar-btn-text uni-navbar__content_view" @click="confirm"><text class="uni-nav-bar-right-text">搜索</text></view>
			</block>
		</uni-nav-bar>
		<view class="list" v-if="hasData">
			<!-- <view class="tab1" v-for="(item, index) in classlist" :key="index"> -->
			<!-- <view class="sec2_1"><image :src="item.PicImg" @click="classDetails(item.Id)" mode="aspectFill"></image></view> -->
			<!-- </view> -->
			<view v-for="(item, index) in classlist" :key="index">
				<view class="sec4_1" @click="classDetails(item.Id)">
					<view><image :src="item.PicImg" mode="aspectFill"></image></view>
					<view>
						<view class="sec4_title">{{ item.Title }}</view>
						<view class="sec4_title1">
							{{ item.DifficultyName }}
							<text style="padding-left: 10upx;" v-if="item.CourseDuration != 0">· {{ item.CourseDuration }}分钟</text>
						</view>
						<!-- <view class="sec4_title2">
							<image :src="item.CoachAvatar || 'https://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image>
							<text>{{ item.CoachNick }}</text>
						</view> -->
					</view>
				</view>
			</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
		<noData :isShow="noDataIsShow" :tips="tipstxt || '暂无搜索数据'"></noData>
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
			searchVal: '',
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
			tipstxt: ''
		};
	},
	watch: {
		searchVal() {
			this.$emit('input', {
				value: this.searchVal
			});
		}
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
		},
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		clear() {
			this.searchVal = '';
			this.getCourseList();
		},
		confirm() {
			this.couponId = '';
			// #ifndef APP-PLUS
			uni.hideKeyboard();
			// #endif
			// #ifdef APP-PLUS
			plus.key.hideSoftKeybord();
			// #endif
			if (this.searchVal) {
				this.page = 1;
				this.getCourseList();
			} else {
				uni.showToast({
					title: '请输入搜索内容',
					icon: 'none'
				});
			}
		}
	},
	onPullDownRefresh() {
		this.page = 1;
		if (this.searchVal) {
			this.getCourseList();
		}
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
			// .sec4_title2 {
			// 	color: #c5c5c5;
			// 	transform: scale(0.9);
			// 	margin-left: -25upx;
			// 	image {
			// 		border-radius: 50%;
			// 		width: 56upx;
			// 		height: 56upx;
			// 	}
			// 	text {
			// 		padding-left: 10upx;
			// 	}
			// }
		}
	}
}
</style>
