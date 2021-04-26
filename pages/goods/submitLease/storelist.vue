<template>
	<view style="padding-top: 20upx;">
		<view class="line-list">
			<block v-for="(item, index) in gymlist" :key="index">
				<view class="line-item" @click="checkStore(index)">
					<text class="title uni-ellipsis flex1">{{ item.StoreNick }}</text>
					<view class="check iconfont icon-check" v-if="checkId == index"></view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
import { post, get, toLogin } from '@/common/util.js';
export default {
	data() {
		return {
			userId: '',
			token: '',
			checkId: 0,
			page: 1,
			pageSize: 5,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			gymlist: [],
			Id: 0
		};
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getGymList();
	},

	methods: {
		checkStore(id) {
			this.checkId = id;
			this.storeId = uni.setStorageSync('storeId', this.gymlist[id].Id);
			this.storeNick = uni.setStorageSync('storeNick', this.gymlist[id].StoreNick);
			this.storeMobile = uni.setStorageSync('storeMobile', this.gymlist[id].Mobile);
			setTimeout(() => {
				uni.navigateBack();
			}, 500);
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
	}
};
</script>

<style scoped lang="scss">
.line-item {
	.title {
		font-size: 32upx;
	}
	.check {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 40upx;
		width: 40upx;
		border-radius: 50%;
		background: $primary;
		color: #fff;
	}
}
</style>
