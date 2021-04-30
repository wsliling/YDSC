<template>
	<view class="gym">
		<view class="list-1">
			<view class="list-cell" v-for="(item, index) in gymlist" :key="index">
				<view class="hd flex-start" @click="tolink('/pages/personal/VenueDetail/VenueDetail?gymId=' + item.Id)">
					<view class="author"><image :src="item.Logo"></image></view>
					<view class="flex1">
						<view class="name flex-start">
							<text class="txt uni-ellipsis">{{ item.StoreNick }}</text>
							<text class="uni-icon uni-icon-arrowright fz14"></text>
						</view>
						<view class="fz12 c_999" v-if="item.IsShowDistance">距离您{{ item.Distance }}</view>
					</view>
				</view>
				<view class="bd">
					<scroll-view class="image-list" scroll-x="true">
						<view class="img" v-for="(items, index) in item.PicData" :key="index"><image :src="items.PicUrl"></image></view>
					</scroll-view>
				</view>
			</view>
			<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
			<noData :isShow="noDataIsShow"></noData>
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
			userId: '',
			token: '',
			page: 1,
			pageSize: 8,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			gymlist: []
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getGymList();
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
		//场馆列表
		async getGymList() {
			let result = await post('Store/GetStoreList', {
				page: this.page,
				pageSize: this.pageSize,
				UserId: this.userId,
				Token: this.token,
				IsNewPeopleVip: 0,
				Lat: 0,
				Lng: 0,
				AreaSite: ''
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
				this.gymlist = result.data;
			}
			if (this.page > 1) {
				this.gymlist = this.gymlist.concat(result.data);
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
		uni.stopPullDownRefresh();
	},
	// 上拉加载
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.page++;
			this.getGymList();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss">
.gym {
	.list-1 {
		padding-top: 20upx;
		.list-cell {
			padding: 24upx 0 24upx 20upx;
			margin-bottom: 16upx !important;
			background: #fff;
			.hd {
				margin-bottom: 20upx;
				.author {
					height: 90upx;
					width: 90upx;
					margin-right: 20upx;
					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
						border: 1upx solid #ddd;
					}
				}
				.name {
					.txt {
						font-size: 32upx;
						font-weight: bold;
						max-width: 300upx;
					}
				}
			}
			.image-list {
				white-space: nowrap;
				width: 100%;
				.img {
					display: inline-block;
					width: 180upx;
					height: 180upx;
					margin-right: 10upx;
					image {
						width: 100%;
						height: 100%;
						border-radius: 6px;
						overflow: hidden;
					}
				}
			}
		}
	}
}
</style>
