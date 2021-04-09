<template>
	<view>
		<view class="titleTab">
			<view class="item" @click="change(0)" :class="{ active: btnnum == 0 }">课程</view>
			<view class="item" @click="change(1)" :class="{ active: btnnum == 1 }">已购买</view>
		</view>
		<view class="list" v-if="btnnum == 0" v-for="(item, index) in 3" :key="index">
			<view class="leftImg"><image class="img" src="/static/health/change/class_11.png"></image></view>
			<view class="rightContent">
				<view class="titledetail">帕梅拉10分钟全身燃脂新燃脂分钟全身燃脂新燃脂</view>
				<view class="time">极速燃脂.10分钟</view>
				<view class="userinfo">
					<view class="user">
						<view class="header"><image class="headerImg" src="/static/health/change/class_11.png"></image></view>
						<view class="name">零碎记忆</view>
					</view>
					<view class="price">￥21.98</view>
				</view>
			</view>
		</view>
		<view class="list" v-if="btnnum == 1" v-for="(item, index) in 3" :key="index">
			<view class="leftImg"><image class="img" src="/static/health/change/class_11.png"></image></view>
			<view class="rightContent">
				<view class="titledetail">帕梅拉10分钟全身燃脂新燃脂分钟全身燃脂新燃脂</view>
				<view class="time">极速燃脂.10分钟</view>
				<view class="userinfo">
					<view class="user">
						<view class="header"><image class="headerImg" src="/static/health/change/class_11.png"></image></view>
						<view class="name">零碎记忆</view>
					</view>
					<view class="price">￥21.98</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			btnnum: 1
		};
	},
	methods: {
		change(e) {
			this.btnnum = e;
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
// 列表
.list {
	border-bottom: solid 2upx #f5f5f5;
	display: flex;
	background-color: #ffffff;
	padding: 30upx 0;
	margin: 0 20upx;
	&:last-child {
		border-bottom: 0;
	}
	.leftImg {
		width: 246upx;
		height: 152upx;
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
			color: #999999;
		}
		.userinfo {
			display: flex;
			justify-content: space-between;
			.user {
				display: flex;
				.header {
					width: 40upx;
					height: 40upx;
					border-radius: 50%;
					overflow: hidden;
					margin-right: 18upx;
					.headerImg {
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
