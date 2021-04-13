<template>
	<view>
		<view class="itembox pp3">
			<view class="userbox flex-between">
				<view class="author"><image :src="gymlistdetail.Logo"></image></view>
				<view class="name flex1">{{ gymlistdetail.StoreNick }}</view>
			</view>
		</view>
		<view class="itembox line-list">
			<view class="line-item">
				<text class="iconfont icon-dizhi mr2"></text>
				<view class="flex1">{{ gymlistdetail.Address }}</view>
			</view>
			<view class="line-item">
				<text class="uni-icon uni-icon-phone mr2"></text>
				<view class="flex1">{{ gymlistdetail.Phone }}</view>
			</view>
			<view class="line-item">
				<text class="iconfont icon-shijian mr2"></text>
				<view class="flex1">{{ gymlistdetail.BusinessHours }}</view>
			</view>
		</view>
		<view class="itembox pd15">
			<view class="Yi-hd"><view class="title">机构简介</view></view>
			<view class="desc fz14 c_666" style="padding-bottom: 20upx;">{{ gymlistdetail.Description }}</view>
		</view>
		<view class="itembox" style="padding: 0 0 30upx 30upx;">
			<view class="Yi-hd"><view class="title">场馆展示</view></view>
			<view class="bd">
				<scroll-view class="image-list" scroll-x="true">
					<view class="img" v-for="(item, index) in gymlistImg" :key="index"><image :src="item.PicUrl"></image></view>
				</scroll-view>
			</view>
		</view>
		<view class="itembox pd15">
			<view class="Yi-hd"><view class="title">设备</view></view>
			<view class="bd shebei-list">
				<view class="item flex-between" v-for="(item, index) in 2" :key="index">
					<view class="img"><image src="/static/health/change/jian_5.png" mode="aspectFill"></image></view>
					<view class="item_r flex-between flex1">
						<view class="name uni-ellipsis flex1">训练服</view>
						<view class="btn">租赁</view>
					</view>
				</view>
			</view>
		</view>
		<view class="itembox pd15">
			<view class="Yi-hd"><view class="title">课程</view></view>
			<view class="bd course-list">
				<view class="item flex-between" v-for="(item, index) in classlist" :key="index">
					<view class="img"><image :src="item.PicImg" @click="classDetails(item.Id)"></image></view>
					<view class="item_r flex1">
						<view class="title uni-ellipsis">{{ item.Title }}</view>
						<view class="desc">{{ item.DifficultyName }} . {{ item.CourseDuration }}分钟</view>
						<view class="flex-start uni-mt10">
							<image class="tx" src="/static/default.png" mode="aspectFill"></image>
							<text class="author">可乐加冰</text>
						</view>
					</view>
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
			pageSize: 3,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			Id: '',
			gymlistdetail: {},
			gymlistImg: [],
			classlist: []
		};
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
	},
	onLoad(e) {
		this.Id = e.gymId;
		this.getGymListDetail();
		this.getClassList();
	},
	methods: {
		//场馆详情
		async getGymListDetail() {
			let result = await post('Store/GetStoreDetail', {
				UserId: this.userId,
				Token: this.token,
				Lat: 0,
				Lng: 0,
				StoreId: this.Id
			});
			if (result.code == 0) {
				this.gymlistdetail = result.data;
				this.gymlistImg = result.data.PicData;
			}
		},
		classDetails(id) {
			uni.navigateTo({
				url: '/pages/course/classDetails/classDetails?detailId=' + id
			});
		},
		// 猜你喜欢
		async getClassList() {
			let result = await post('Course/GetCourseOutlineList', {
				page: this.page,
				pageSize: this.pageSize,
				UserId: this.userId,
				Token: this.token,
				SearchKey: '',
				IsNewPeopleVip: 0,
				IsLike: 0,
				IsRic: 0
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
			this.getClassList();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss" scoped>
@import './style';
</style>
