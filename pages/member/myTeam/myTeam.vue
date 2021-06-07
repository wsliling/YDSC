<template>
	<view class="myTeam">
		<view class="top">
			<view class="top_1">
				<view class="perAll">
					<view class="per_1">{{ data.TeamNum }}</view>
					<view class="per_2">总人数</view>
				</view>
				<view class="perAdd">
					<view class="per_1">{{ data.JTNum }}</view>
					<view class="per_2">今日新增</view>
				</view>
				<view class="perAddYes">
					<view class="per_1">{{ data.ZTNum }}</view>
					<view class="per_2">昨日新增</view>
				</view>
			</view>
			<view class="top_2" v-if="FatherData.length > 0">
				<view class="top_2_img"><image :src="FatherData[0].Avatar || 'https://yd.wtanvxin.com/static/default.png'"></image></view>
				<view class="top_2_right">
					<view class="top_2_right_1">{{ FatherData[0].NickName }}</view>
					<view class="top_2_right_2">我的邀请人</view>
				</view>
			</view>
			<view class="top_2" v-else>
				<view class="top_2_right"><view class="top_2_right_2">没有邀请人</view></view>
			</view>
		</view>
		<view class="tab">
			<scroll-view scroll-x="true" class="tabList">
				<view class="item" v-for="(item, index) in tabs" :key="index" :class="{ active: item.Id == tabIndex }" @click="cliTab(item.Id)">{{ item.GradeName }}</view>
			</scroll-view>
			<view class="list" v-if="hasData">
				<block v-for="(item, index) in TeamList" :key="index">
					<view class="con">
						<view class="con_1"><image :src="item.Avatar || 'https://yd.wtanvxin.com/static/default.png'"></image></view>
						<view class="con_2">
							<view class="title">{{ item.NickName }}</view>
							<view class="title_1">{{ item.Mobile }}</view>
						</view>
						<view class="con_3">{{ item.CreateTime }}</view>
					</view>
				</block>
			</view>
			<!-- <view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view> -->
			<noData :isShow="noDataIsShow"></noData>
		</view>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
import noData from '@/components/noData.vue'; //暂无数据
export default {
	components: {
		noData,
		uniLoadMore
	},
	data() {
		return {
			userId: '',
			token: '',
			page: 1,
			pageSize: 12,
			TeamList: [],
			FatherData: {},
			data: {},
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			tabs: [],
			tabIndex: 1
		};
	},
	onLoad() {},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.init();
		this.getTab();
	},
	methods: {
		cliTab(index) {
			this.tabIndex = index;
			this.TeamList = [];
			this.init();
		},
		async init() {
			let result = await post('User/MyCustom', {
				UserId: this.userId,
				Token: this.token,
				Page: this.page,
				PageSize: this.pageSize,
				Type: this.tabIndex
			});
			if (result.code == 0) {
				this.data = result.data;
				this.TeamList = this.data.TeamList;
				this.FatherData = this.data.FatherData;
				if (this.data.TeamNum == 0) {
					this.noDataIsShow = true;
					this.hasData = false;
				} else {
					this.noDataIsShow = false;
					this.hasData = true;
				}
			}
		},
		async getTab() {
			let result = await post('User/GetGradeList', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.tabs = result.data;
			}
		}
	},
	onPullDownRefresh() {
		this.page = 1;
		this.init();
		uni.stopPullDownRefresh();
	},
	// 上拉加载
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.page++;
			this.init();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss">
.myTeam {
	background-color: white;
	height: 100vh;
	padding: 20upx;
	.top {
		background-color: #fd4646;
		color: white;
		border-radius: 20upx;
		padding: 30upx 0 200upx 0;
		margin: 10upx;
		position: relative;
		.top_1 {
			display: flex;
			align-items: center;
			text-align: center;
			line-height: 50upx;
			.per_1 {
				font-size: 45upx;
			}
			.per_2 {
				color: #fccfc6;
			}
			.perAll {
				flex: 1;
				border-right: 1px solid #ff7b7b;
			}
			.perAdd {
				flex: 1;
				border-right: 1px solid #ff7b7b;
			}
			.perAddYes {
				flex: 1;
			}
		}
		.top_2 {
			display: flex;
			align-items: center;
			background-color: #ed413a;
			padding: 20upx 0;
			width: 100%;
			position: absolute;
			bottom: 0;
			border-radius: 0 0 20upx 20upx;
			.top_2_img {
				flex: 2;
				text-align: center;
				image {
					width: 120upx;
					height: 120upx;
				}
			}
			.top_2_right {
				flex: 5;
				.top_2_right_1 {
					font-size: 36upx;
				}
				.top_2_right_2 {
					color: #fccfc6;
					padding-left: 20upx;
				}
			}
		}
	}
	.tab {
		position: relative;
		height: 80%;
		background-color: white;
		margin: 0;
		margin-top: 20upx;
		margin-left: -20upx;
		.tabList {
			width: 100%;
			white-space: nowrap;
			padding: 0 10px;
			background-color: white;
			z-index: 9;
			.item {
				overflow: hidden;
				display: inline-block;
				text-align: center;
				color: grey;
				line-height: 73rpx;
				font-size: 32rpx;
				font-weight: 500;
				height: 100%;
				box-sizing: border-box;
				margin: 0 12px;
				&.active {
					color: #f57609;
					border-bottom: 5rpx solid #f57609;
					font-weight: bold;
					margin: 0 12px;
				}
			}
		}
		.con {
			display: flex;
			align-items: center;
			padding: 25upx 15upx 30upx 5upx;
			border-bottom: 1px solid #f6f6f6;
			.con_1 {
				flex: 1;
				padding: 0 20upx;
				image {
					height: 80upx;
					width: 80upx;
					border-radius: 50%;
				}
			}
			.con_2 {
				flex: 2;
				line-height: 38upx;
				.title {
					font-size: 32upx;
				}
				.title_1 {
					color: #8a8a8a;
					font-size: 28upx;
					transform: scale(0.95);
					margin-left: -8upx;
				}
			}
			.con_3 {
				text-align: right;
				flex: 5;
				color: #8a8a8a;
				font-size: 28upx;
				transform: scale(0.95);
			}
		}
		.xxx {
			font-size: 42rpx;
			padding: 20rpx 0;
		}
	}
}
</style>
