<template>
	<view>
		<view class="titleTab">
			<view class="item" @click="change(0)" :class="{ active: btnnum == 0 }">课程</view>
			<view class="item" @click="change(1)" :class="{ active: btnnum == 1 }">教练</view>
		</view>
		<view class="tab_1" v-if="btnnum == 0 && hasData">
			<view class="list" v-for="(item, index) in regclasslist" :key="index" @click="tolink(btnnum, item.OrderNo)">
				<view class="leftImg"><image class="img" :src="item.PicImg" mode="aspectFill"></image></view>
				<view class="rightContent">
					<view class="titledetail">{{ item.Title }}</view>
					<view class="time">{{ item.CourseDate }} {{ item.DayWeek }} {{ item.CourseTimeSpan }}</view>
					<view class="userinfo">
						<view class="user">
							<view class="header"><image class="headerImg" :src="item.CoachAvatar || 'https://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image></view>
							<view class="name">{{ item.CoachNick }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="tab_1" v-if="btnnum == 1 && hasData">
			<view class="list" v-for="(item, index) in regclasslistcoach" :key="index" @click="tolink(btnnum, item.OrderNo)">
				<view class="jl-leftImg"><image class="img" :src="item.CoachAvatar || 'https://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image></view>
				<view class="rightContent">
					<view class="titledetail">{{ item.CoachNick }}</view>
					<view class="time">{{ item.CourseDate }} {{ item.DayWeek }} {{ item.CourseTimeSpan }}</view>
				</view>
			</view>
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
			btnnum: 0,
			userId: '',
			token: '',
			page: 1,
			pageSize: 8,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			regclasslist: [],
			regclasslistcoach: []
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		if (this.btnnum == 0) {
			this.regclasslist = [];
			this.getRegClassList();
		} else {
			this.regclasslistcoach = [];
			this.getRegClassListCoach();
		}
	},
	methods: {
		change(e) {
			this.btnnum = e;
			this.hasData = false;
			this.noDataIsShow = false;
			this.page = 1;
			if (this.btnnum == 0) {
				this.regclasslist = [];
				this.getRegClassList();
			} else {
				this.regclasslistcoach = [];
				this.getRegClassListCoach();
			}
		},
		tolink(e, id) {
			if (e == 0) {
				uni.navigateTo({
					url: '/pages/member/myappointment/coach?orderNo=' + id
				});
			} else {
				uni.navigateTo({
					url: '/pages/member/myappointment/coachinfo?orderNo=' + id
				});
			}
		},
		//预约课程列表
		async getRegClassList() {
			let result = await post('Course/MyRegCourseOfflineList', {
				UserId: this.userId,
				Token: this.token,
				page: this.page,
				pageSize: this.pageSize
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
				this.regclasslist = result.data;
			}
			if (this.page > 1) {
				this.regclasslist = this.regclasslist.concat(result.data);
			}
			if (result.data.length < this.pageSize) {
				this.isLoad = false;
				this.loadingType = 2;
			} else {
				this.isLoad = true;
				this.loadingType = 0;
			}
		},
		//预约教练列表
		async getRegClassListCoach() {
			let result = await post('Course/MyRegCoachList', {
				UserId: this.userId,
				Token: this.token,
				page: this.page,
				pageSize: this.pageSize
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
				this.regclasslistcoach = result.data;
			}
			if (this.page > 1) {
				this.regclasslistcoach = this.regclasslistcoach.concat(result.data);
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
		if (this.btnnum == 0) {
			this.regclasslist = [];
			this.getRegClassList();
		} else {
			this.regclasslistcoach = [];
			this.getRegClassListCoach();
		}
		uni.stopPullDownRefresh();
	},
	// 上拉加载
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.page++;
			if (this.btnnum == 0) {
				this.getRegClassList();
			} else {
				this.getRegClassListCoach();
			}
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss" scoped>
.titleTab {
	display: flex;
	position: fixed;
	width: 100%;
	z-index: 9;
	line-height: 80upx;
	background-color: #ffffff;
	justify-content: space-around;
	.item {
		font-size: 28upx;
		position: relative;
		&.active {
			border-bottom: solid 4rpx #fb7a31;
			color: #fb7a31;
		}
	}
}
.jl-leftImg {
	width: 120upx;
	height: 120upx;
	overflow: hidden;
	border-radius: 50%;
	background-color: #000000;
	background-color: #ffffff;
	margin-right: 20upx;
	image{
		width: 100%;
		height: 100%;
	}
}
.tab_1 {
	padding-top: 100upx;
}
// 列表
.list {
	border-bottom: solid 1px #f5f5f5;
	display: flex;
	align-items: center;
	background-color: #ffffff;
	padding: 30upx;
	&:last-child {
		border-bottom: 0;
	}
	.leftImg {
		width: 246upx;
		height: 182upx;
		border-radius: 8upx;
		overflow: hidden;
		margin-right: 10upx;
		.img {
			border-radius: 10upx;
			width: 100%;
			height: 100%;
		}
	}
	.rightContent {
		.titledetail {
			font-size: 30upx;
			font-weight: 500;
			color: #333333;
			width: 444upx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.time {
			font-size: 22upx;
			font-weight: 500;
			color: #fb7a31;
			margin: 8upx 0;
		}
		.userinfo {
			display: flex;
			justify-content: space-between;
			.user {
				display: flex;
				.header {
					width: 50upx;
					height: 50upx;
					margin-right: 18upx;
					.headerImg {
						border-radius: 50%;
						width: 100%;
						height: 100%;
					}
				}
			}
			.price {
				color: #fa6008;
				font-size: 24upx;
			}
		}
	}
}
</style>
