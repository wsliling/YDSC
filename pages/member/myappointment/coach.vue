<template>
	<view>
		<view class="topbox">
			<view class="icon"><image src="http://yd.wtanvxin.com/static/time.png"></image></view>
			<view class="time">{{regclasslistdetail.CourseDate}} {{regclasslistdetail.DayWeek}} {{regclasslistdetail.CourseTimeSpan}}</view>
		</view>
		<view class="introduct">
			<view class="title">{{regclasslistdetail.Title}}</view>
			<view class="txtcolor">
				<view class="gray">{{regclasslistdetail.TargetName}}</view>
				<view class="gray">{{regclasslistdetail.DifficultyName}}</view>
				<!-- <view class="gray">60分钟</view> -->
			</view>
			<view class="userinfo">
				<view class="header"><image :src="regclasslistdetail.CoachAvatar"></image></view>
				<view class="name">{{regclasslistdetail.CoachNick}}</view>
			</view>
		</view>
		<view class="studio">
			<view class="header"><image :src="regclasslistdetail.StoreLogo"></image></view>
			<view class="company">
				<view class="studioName">{{regclasslistdetail.StoreName}}</view>
				<view class="address">{{regclasslistdetail.StoreAddress}}</view>
			</view>
			<view class="trangle"></view>
		</view>
		<view class="classIntroduct">
			<view class="titlename">课程简介</view>
			<view class="content">{{regclasslistdetail.Content}}
			</view>
		</view>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
export default {
	data() {
		return {
			userId: '',
			token: '',
			regclasslistdetail: {},
			Id: 0
		};
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Id = e.orderNo;
		this.getRegClassListDetail();
	},
	methods: {
		//预约课程详情
		async getRegClassListDetail() {
			let result = await post('Course/GetRegCourseOffline_xq', {
				UserId: this.userId,
				Token: this.token,
				OrderNo: this.Id
			});
			if (result.code == 0) {
				this.regclasslistdetail = result.data;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.topbox {
	height: 380upx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 200upx;
	background: linear-gradient(-51deg, #fa600a, #f76345);
	.icon {
		width: 82upx;
		height: 82upx;
		margin-bottom: 20upx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.time {
		font-size: 40upx;
		font-weight: bold;
		color: #ffffff;
		text-align: center;
	}
}
.introduct {
	background-color: #ffffff;
	padding: 20upx 30upx;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	height: 278upx;
	background: #ffffff;
	.title {
		font-size: 40upx;
		font-weight: bold;
		color: #333333;
	}
	.txtcolor {
		display: flex;
		.gray {
			border-right: solid 2rpx #999;
			padding: 0 16upx;
			color: #999;
			line-height: 30upx;
			&:last-child {
				border-right: none;
			}
			&:first-child {
				padding-left: 0;
			}
		}
	}
	.userinfo {
		display: flex;
		align-items: center;
		.header {
			width: 72upx;
			height: 72upx;
			border-radius: 50%;
			overflow: hidden;
			margin-right: 16upx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.name {
			font-size: 28upx;
		}
	}
}
.studio {
	display: flex;
	align-items: center;
	height: 184upx;
	background: #ffffff;
	padding: 0 26upx;
	margin-top: 26upx;
	.header {
		width: 104upx;
		height: 104upx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 20upx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.company {
		width: 500upx;
		.studioName {
			font-size: 32upx;
			font-weight: bold;
			color: #212121;
		}
		.address {
			font-size: 22upx;
			font-weight: 500;
			color: #404040;
		}
	}
	.trangle {
		width: 20upx;
		height: 20upx;
		border-top: solid 4upx #999;
		border-left: solid 4upx #999;
		transform: rotate(130deg);
	}
}
.classIntroduct {
	background-color: #ffffff;
	margin-top: 26upx;
	padding: 26upx;
	.titlename {
		font-size: 34upx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 10upx;
	}
	.content {
		font-size: 28upx;
		font-weight: 500;
		color: #666666;
	}
}
</style>
