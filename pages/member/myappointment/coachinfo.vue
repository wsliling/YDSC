<template>
	<view>
		<view class="topbox">
			<view class="icon"><image src="http://yd.wtanvxin.com/static/time.png"></image></view>
			<view class="time">{{ regclasslistcoachdetail.ApplyDate }} {{ regclasslistcoachdetail.DayWeek }} {{ regclasslistcoachdetail.ApplyTimeSpan }}</view>
		</view>
		<view class="introduct">
			<view class="title">教练信息</view>
			<view class="userinfo">
				<view style="display: flex; align-items: center;">
					<view class="header"><image :src="regclasslistcoachdetail.CoachAvatar"></image></view>
					<view class="caochinfo">
						<view class="name">{{ regclasslistcoachdetail.CoachNick }}</view>
						<view class="contentname">{{ regclasslistcoachdetail.CoachType }}</view>
					</view>
				</view>
				<view class="homepage" @click="tolink">
					<view class="txt">个人主页</view>
					<view class="trangle"></view>
				</view>
			</view>
		</view>
		<view class="studio">
			<view class="header"><image :src="regclasslistcoachdetail.StoreLogo"></image></view>
			<view class="company">
				<view class="studioName">{{ regclasslistcoachdetail.StoreName }}</view>
				<view class="address">{{ regclasslistcoachdetail.StoreAddress }}</view>
			</view>
			<view class="trangle"></view>
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
			regclasslistcoachdetail: {},
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
		tolink() {
			uni.navigateTo({
				url: '/pages/homepage/homepage'
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
				this.regclasslistcoachdetail = result.data;
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
.trangle {
	width: 20upx;
	height: 20upx;
	border-top: solid 4upx #999;
	border-left: solid 4upx #999;
	transform: rotate(130deg);
}
</style>
