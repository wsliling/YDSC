<template>
	<view class="scoreArea">
		<view class="sec" v-for="(item, index) in prolist" :key="index">
			<view class="sec_1"><image :src="item.PicImg"></image></view>
			<view class="sec_2">
				<view class="title">{{ item.Name }}</view>
				<view class="title_1">1瓶 500ml</view>
				<view class="title_2">
					<text class="text_1">{{ item.Score }}</text>
					<text class="text_2">积分</text>
				</view>
			</view>
			<view class="sec_3" @click="change(item.Id)">兑换</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
		<noData :isShow="noDataIsShow"></noData>
		<view class="bottom" @click="tolink('/pages/member/scoreRecord/scoreRecord?prosId=' + id)">兑换记录</view>
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
			userId: '',
			token: '',
			page: 1,
			pageSize: 8,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			prolist: [],
			Score: 0, //会员积分
			Id: 0,
			id: 0
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getProList();
	},
	onShow() {
		this.GetMemInfo();
	},
	methods: {
		//跳转
		tolink(Url, islogin) {
			if (islogin == 'login') {
				if (toLogin()) {
					uni.navigateTo({
						url: Url
					});
				}
			} else {
				uni.navigateTo({
					url: Url
				});
			}
		},
		//商品列表
		async getProList() {
			let result = await post('Productjf/GetList', {
				page: this.page,
				pageSize: this.pageSize,
				UserId: this.userId,
				Token: this.token
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
				this.prolist = result.data;
			}
			if (this.page > 1) {
				this.prolist = this.prolist.concat(result.data);
			}
			if (result.data.length < this.pageSize) {
				this.isLoad = false;
				this.loadingType = 2;
			} else {
				this.isLoad = true;
				this.loadingType = 0;
			}
		},

		//获取账户积分信息
		async GetMemInfo() {
			let result = await post('User/GetMemInfo', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.Score = result.data.Score;
			}
		},
		change(id) {
			this.Id = id;
			this.getExchange();
		},
		async getExchange() {
			let result = await post('Productjf/ProductExchange', {
				UserId: this.userId,
				Token: this.token,
				Pro_Id: this.Id
			});
			if (result.code == 0) {
				//积分
				if (this.Score < this.prolist.Score) {
					uni.showToast({
						title: '积分不足！',
						icon: 'none',
						duration: 2000
					});
				} else {
					uni.showToast({
						title: '兑换成功',
						icon: 'none',
						duration: 2000
					});
				}
			}
		}
	},
	onPullDownRefresh() {
		this.page = 1;
		uni.stopPullDownRefresh();
	},
	// 上拉加载
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.page++;
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss">
.scoreArea {
	margin-top: 22upx;
	background-color: white;
	height: 100vh;
	.sec {
		padding: 25upx;
		display: flex;
		align-items: flex-end;
		border-bottom: 1px solid #f5f5f5;
		.sec_1 {
			flex: 1;
			image {
				width: 180upx;
				height: 180upx;
			}
		}
		.sec_2 {
			flex: 3;
			padding-left: 20upx;
			.title {
				font-size: 35upx;
				font-weight: bold;
				width: 178px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.title_1 {
				color: gray;
			}
			.title_2 {
				transform: scale(0.9);
				margin-left: -20upx;
				.text_1 {
					font-size: 38upx;
					color: #fe7c32;
					font-weight: bold;
				}
				.text_2 {
					padding-left: 10upx;
				}
			}
		}
		.sec_3 {
			flex: 1.2;
			text-align: center;
			height: 60upx;
			line-height: 60upx;
			color: white;
			background-color: #fe7c32;
			border-radius: 30upx;
		}
	}
	.bottom {
		color: #fc8f55;
		position: fixed;
		bottom: 0;
		font-size: 30upx;
		text-align: center;
		background-color: #f5f5f5;
		width: 100%;
		height: 90upx;
		line-height: 90upx;
	}
}
</style>
