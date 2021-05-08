<template>
	<view>
		<view class="titleTab">
			<view class="item" @click="change(0)" :class="{ active: btnnum == 0 }">课程</view>
			<view class="item" @click="change(1)" :class="{ active: btnnum == 1 }">教练</view>
		</view>
		<block v-if="btnnum == 0">
			<view class="list" v-for="(item, index) in regclasslist" :key="index" @click="tolink(btnnum, item.OrderNo)">
				<view class="leftImg"><image class="img" :src="item.PicImg"></image></view>
				<view class="rightContent">
					<view class="titledetail">{{ item.Title }}</view>
					<view class="time">{{ item.CourseDate }} {{ item.DayWeek }} {{ item.CourseTimeSpan }}</view>
					<view class="userinfo">
						<view class="user">
							<view class="header"><image class="headerImg" :src="item.CoachAvatar || 'http://yd.wtanvxin.com/static/default.png'"></image></view>
							<view class="name">{{ item.CoachNick }}</view>
						</view>
					</view>
				</view>
			</view>
		</block>
		<block v-if="btnnum == 1">
			<view class="list" v-for="(item, index) in regclasslistcoach" :key="index" @click="tolink(btnnum, item.OrderNo)">
				<view class="jl-leftImg"><image class="img" :src="item.CoachAvatar || 'http://yd.wtanvxin.com/static/default.png'"></image></view>
				<view class="rightContent">
					<view class="titledetail">{{ item.CoachNick }}</view>
					<view class="time">{{ item.CourseDate }} {{ item.DayWeek }} {{ item.ApplyTimeSpan }}</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
export default {
	data() {
		return {
			btnnum: 0,
			userId: '',
			token: '',
			regclasslist: [],
			regclasslistcoach: []
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getRegClassList();
		this.getRegClassListCoach();
	},
	methods: {
		change(e) {
			this.btnnum = e;
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
				Token: this.token
			});
			if (result.code == 0) {
				this.regclasslist = result.data;
			}
		},
		//预约教练列表
		async getRegClassListCoach() {
			let result = await post('Course/MyRegCoachList', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.regclasslistcoach = result.data;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #ffffff;
}
.titleTab {
	display: flex;
	line-height: 80upx;
	background-color: #ffffff;
	justify-content: space-around;
	border-bottom: solid 20upx #f5f5f5;
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
	margin-right: 20upx;
}
// 列表
.list {
	border-bottom: solid 2upx #f5f5f5;
	display: flex;
	align-items: center;
	background-color: #ffffff;
	padding: 30upx 0;
	margin: 0 20upx;
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
