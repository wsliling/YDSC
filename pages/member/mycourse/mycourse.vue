<template>
	<view>
		<view class="titleTab">
			<view class="item" @click="change(0)" :class="{ active: btnnum == 0 }">课程</view>
			<view class="item" @click="change(1)" :class="{ active: btnnum == 1 }">已购买</view>
		</view>
		<view class="tab_1" v-if="btnnum == 0">
			<view class="list" v-for="(item, index) in classlist" :key="index" @click="classDetails(item.Id)">
				<view class="leftImg"><image class="img" :src="item.PicImg" mode="aspectFill"></image></view>
				<view class="rightContent flex1">
					<view class="titledetail uni-ellipsis">{{ item.Name }}</view>
					<view class="time">{{ item.Difficulty }} · {{ item.Target }}</view>
					<view class="userinfo">
						<view class="user flex-start flex1">
							<view class="header"><image class="headerImg" :src="item.StoreLogo || 'http://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image></view>
							<view class="name uni-ellipsis flex1">{{ item.StoreNick }}</view>
						</view>
						<view class="price">￥{{ item.Price }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="tab_1" v-if="btnnum == 1 && hasData">
			<view class="list" v-for="(item, index) in buyclasslist" :key="index" @click="classDetails(item.Id)">
				<view class="leftImg"><image class="img" :src="item.PicImg" mode="aspectFill"></image></view>
				<view class="rightContent flex1">
					<view class="titledetail uni-ellipsis">{{ item.Name }}</view>
					<view class="time">{{ item.Difficulty }} · {{ item.Target }}</view>
					<view class="userinfo">
						<view class="user flex-start flex1">
							<view class="header"><image class="headerImg" :src="item.StoreLogo || 'http://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image></view>
							<view class="name uni-ellipsis flex1">{{ item.StoreNick }}</view>
						</view>
						<view class="price">￥{{ item.Price }}</view>
					</view>
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
			classlist: [],
			buyclasslist: [],
			id: 0
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		if (this.btnnum == 0) {
			this.classlist = [];
			this.getCourseList();
		} else {
			this.buyclasslist = [];
			this.getBuyClassList();
		}
	},
	methods: {
		change(e) {
			this.btnnum = e;
			this.hasData = false;
			this.noDataIsShow = false;
			this.page = 1;
			if (this.btnnum == 0) {
				this.classlist = [];
				this.getCourseList();
			} else {
				this.buyclasslist = [];
				this.getBuyClassList();
			}
		},
		classDetails(id) {
			uni.navigateTo({
				url: '/pages/course/classDetails/classDetails?detailId=' + id
			});
		},
		//课程列表
		async getCourseList() {
			let result = await post('Course/MemberViewCourseList', {
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
		//已购买课程列表
		async getBuyClassList() {
			let result = await post('Course/MyCourseBuyList', {
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
				this.buyclasslist = result.data;
			}
			if (this.page > 1) {
				this.buyclasslist = this.buyclasslist.concat(result.data);
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
			this.classlist = [];
			this.getCourseList();
		} else {
			this.buyclasslist = [];
			this.getBuyClassList();
		}
		uni.stopPullDownRefresh();
	},
	// 上拉加载
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.page++;
			if (this.btnnum == 0) {
				this.getCourseList();
			} else {
				this.getBuyClassList();
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
.tab_1 {
	padding-top: 100upx;
}
// 列表
.list {
	border-bottom: solid 1px #f5f5f5;
	display: flex;
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
		line-height: 65upx;
		.titledetail {
			font-size: 30upx;
			color: #333333;
		}
		.time {
			font-size: 26upx;
			color: #999999;
		}
		.userinfo {
			display: flex;
			justify-content: space-between;
			.user {
				display: flex;
				.header {
					overflow: hidden;
					margin-right: 18upx;
					.headerImg {
						border-radius: 50%;
						width: 50upx;
						height: 50upx;
					}
				}
				.name {
					font-size: 22upx;
					color: #999999;
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
