<template>
	<view>
		<view class="titleTab">
			<view class="item" @click="change(0)" :class="{ active: btnnum == 0 }">课程</view>
			<view class="item" @click="change(1)" :class="{ active: btnnum == 1 }">已购买</view>
		</view>
		<view class="list" v-if="btnnum == 0" v-for="(item, index) in classlist" :key="index" @click="classDetails(item.Id)">
			<view class="leftImg"><image class="img" :src="item.PicImg"></image></view>
			<view class="rightContent">
				<view class="titledetail">{{ item.Name }}</view>
				<view class="time">极速燃脂.10分钟</view>
				<view class="userinfo">
					<view class="user">
						<view class="header"><image class="headerImg" src="/static/health/change/class_11.png"></image></view>
						<view class="name">零碎记忆</view>
					</view>
					<view class="price">￥{{ item.Price }}</view>
				</view>
			</view>
		</view>
		<view class="list" v-if="btnnum == 1" v-for="(item, index) in buyclasslist" :key="index" @click="classDetails(item.Id)">
			<view class="leftImg"><image class="img" :src="item.PicImg"></image></view>
			<view class="rightContent">
				<view class="titledetail">{{ item.Name }}</view>
				<view class="time">{{ item.Target }}</view>
				<view class="userinfo">
					<view class="user">
						<view class="header"><image class="headerImg" :src="item.StoreLogo"></image></view>
						<view class="name">{{ item.StoreNick }}</view>
					</view>
					<view class="price">￥{{ item.Price }}</view>
				</view>
			</view>
		</view>
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
			btnnum: 1,
			userId: '',
			token: '',
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			classlist: [],
			buyclasslist: [],
			id: 0
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getClassList();
		this.getBuyClassList();
	},
	methods: {
		change(e) {
			this.btnnum = e;
		},
		classDetails(id) {
			uni.navigateTo({
				url: '/pages/course/classDetails/classDetails?detailId=' + id
			});
		},
		//课程列表
		async getClassList() {
			let result = await post('Course/MemberViewCourseList', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.classlist = result.data;
			}
		},
		//已购买课程列表
		async getBuyClassList() {
			let result = await post('Course/MyCourseBuyList', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.buyclasslist = result.data;
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
