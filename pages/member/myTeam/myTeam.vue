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
				<view class="top_2_img"><image :src="FatherData[0].Avatar"></image></view>
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
			<aloys-tab :tabs="tabs" v-for="(item, index) in TeamList" :key="index">
				<view slot="content0" class="xxx" v-if="item.GradeName == '普通用户'">
					<view class="con">
						<view class="con_1">
							<image :src="item.Avatar" v-if="item.Avatar != ''"></image>
							<image src="@/static/default.png" v-else></image>
						</view>
						<view class="con_2">
							<view class="title">{{ item.NickName }}</view>
							<view class="title_1">{{ item.Mobile }}</view>
						</view>
						<view class="con_3">{{ item.CreateTime }}</view>
					</view>
				</view>
				<view slot="content1" class="xxx" v-if="item.GradeName == '普通用户'">
					<view class="con">
						<view class="con_1">
							<image :src="item.Avatar" v-if="item.Avatar != ''"></image>
							<image src="@/static/default.png" v-else></image>
						</view>
						<view class="con_2">
							<view class="title">{{ item.NickName }}</view>
							<view class="title_1">{{ item.Mobile }}</view>
						</view>
						<view class="con_3">{{ item.CreateTime }}</view>
					</view>
				</view>
				<view slot="content2" class="xxx" v-if="item.GradeName == '普通用户'">
					<view class="con">
						<view class="con_1">
							<image :src="item.Avatar" v-if="item.Avatar != ''"></image>
							<image src="@/static/default.png" v-else></image>
						</view>
						<view class="con_2">
							<view class="title">{{ item.NickName }}</view>
							<view class="title_1">{{ item.Mobile }}</view>
						</view>
						<view class="con_3">{{ item.CreateTime }}</view>
					</view>
				</view>
			</aloys-tab>
		</view>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
import noData from '@/components/noData.vue'; //暂无数据
import aloysTab from '@/components/aloys-tab/aloys-tab.vue';
export default {
	components: {
		aloysTab
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
			selIndex: 1,
			noData: false,
			dataMore: true,
			tabs: [
				{
					title: '金牌合伙人'
				},
				{
					title: '银牌合伙人'
				},
				{
					title: '铜牌合伙人'
				}
			]
		};
	},
	onLoad() {
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.init();
	},
	methods: {
		async init() {
			let result = await post('User/MyCustom', {
				UserId: this.userId,
				Token: this.token,
				Page: this.page,
				PageSize:this.pageSize,
				Type: this.selIndex
			});
			if (result.code == 0) {
				this.data = result.data;
				this.TeamList = this.data.TeamList;
				this.FatherData = this.data.FatherData;
				if (this.data.TeamNum == 0) {
					this.noData = true;
					this.dataMore = false;
				} else {
					this.noData = false;
					this.dataMore = true;
				}
			}
		}
	}
};
</script>

<style lang="scss">
.myTeam {
	background-color: white;
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
		position: absolute;
		height: 80%;
		background-color: white;
		margin: 0;
		margin-top: 20upx;
		margin-left: -20upx;
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
