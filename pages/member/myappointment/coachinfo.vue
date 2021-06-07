<template>
	<view>
		<view class="topbox">
			<view class="icon"><image src="https://yd.wtanvxin.com/static/time.png"></image></view>
			<view class="time">{{ info.ApplyDate }} {{ info.DayWeek }} {{ info.CourseTimeSpan }}</view>
		</view>
		<view class="introduct">
			<view class="title">教练信息</view>
			<view class="userinfo">
				<view style="display: flex; align-items: center;">
					<view class="header"><image :src="info.CoachAvatar || 'https://yd.wtanvxin.com/static/default.png'"></image></view>
					<view class="caochinfo">
						<view class="name">{{ info.CoachNick }}</view>
						<view class="contentname">{{ info.CoachType }}</view>
					</view>
				</view>
				<view class="homepage" @click="tolink('/pages/homepage/homepage?id='+info.MemberId)">
					<view class="txt">个人主页</view>
					<view class="iconfont icon-arrow_r"></view>
				</view>
			</view>
		</view>
		<view class="studio" @click="tolink('/pages/personal/VenueDetail/VenueDetail?gymId='+info.StoreId)">
			<view class="header"><image :src="info.StoreLogo || 'https://yd.wtanvxin.com/static/default.png'"></image></view>
			<view class="company">
				<view class="studioName">{{ info.StoreName }}</view>
				<view class="address">{{ info.StoreAddress }}</view>
			</view>
			<view class="iconfont icon-arrow_r"></view>
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
			info: {},
			Id: 0
		};
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Id = e.orderNo;
		this.getRegClassListCoachDetail();
	},
	methods: {
		tolink(url) {
			uni.navigateTo({
				url: url
			});
		},
		//预约教练详情
		async getRegClassListCoachDetail() {
			let result = await post('Course/GetRegCoach_xq', {
				UserId: this.userId,
				Token: this.token,
				OrderNo: this.Id
			});
			if (result.code == 0) {
				this.info = result.data;
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
		justify-content: space-between;
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
			font-size: 30upx;
		}
		.caochinfo {
			.contentname {
				font-size: 24upx;
				color: #bbbbbb;
			}
		}
	}
}
.studio {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 184upx;
	background: #ffffff;
	padding: 0 30upx;
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
}
.homepage {
	display: flex;
	align-items: center;
	color: #cbcbcb;
	font-size: 24upx;
	.txt {
		margin: 10upx;
	}
}
.icon-arrow_r {
	color: #999;
	font-size: 28upx;
}
</style>
