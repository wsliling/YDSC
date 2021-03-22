<template>
	<view>
		<view class="topbox">
			<view class="icon"><image src="../../../static/time.png"></image></view>
			<view class="time">2021-02-23 周二 18:00-19:00</view>
		</view>
		<view class="introduct">
			<view class="title">超强下腹燃脂，躺练版训练</view>
			<view class="txtcolor">
				<view class="gray">极速燃脂</view>
				<view class="gray">低强度</view>
				<view class="gray">60分钟</view>
			</view>
			<view class="userinfo">
				<view class="header"><image src="../../../static/health/change/class_2.png"></image></view>
				<view class="name">柠檬</view>
			</view>
		</view>
		<view class="studio">
			<view class="header"><image src="../../../static/health/change/class_2.png"></image></view>
			<view class="company">
				<view class="studioName">动体能健身工作室</view>
				<view class="address">龙华区恒福路98号淘金花园商业中心</view>
			</view>
			<view class="trangle"></view>
		</view>
		<view class="classIntroduct">
			<view class="titlename">课程简介</view>
			<view class="content">
				瑜伽教练培训简介，培训专业瑜伽教练，专业瑜伽推拿 培训，针对不同的学习方式，提升未来的竞争力，让您 的人生更加适合自己的特长，帮助学员在管理过程中的
				提升，坚持两周时间，可以感觉到身体素
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {}
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
		.name{
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
	padding:26upx;
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
