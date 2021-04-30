<template>
	<view class="course">
		<view class="top">
			<view class="top_left">
				深圳
				<text class="iconfont icon-arrow_r"></text>
			</view>
			<view class="search">
				<uni-nav-bar color="#ffffff" background-color="#fff" :border="false">
					<block slot="center" class="flex1">
						<view class="input-view" style="background: #f2f2f2; border-radius: 10upx; margin-left: 30upx;">
							<uni-icons class="input-uni-icon" type="search" size="22" color="#b8b8b8" />
							<input confirm-type="search" disabled="" class="nav-bar-input" type="text" placeholder="输入搜索关键词" />
						</view>
					</block>
				</uni-nav-bar>
			</view>
		</view>
		<!-- 轮播 -->
		<view class="index_swiper">
			<swiper class="swiper" :indicator-dots="false" autoplay :interval="5000" :duration="500" @change="changeSwiper">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<view class="swiper-item swiperTop" @click="tolink(item.Url)"><image class="img" :src="item.Pic" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
			<view class="dots" style="bottom: 10upx;">
				<view v-for="(item, index) in bannerList.length" :key="index" :class="['dot', currentSwiper == index ? 'active' : '']"></view>
			</view>
		</view>
		<view class="sec" v-if="bannerListOne.length">
			<view class="sec_1"><image :src="bannerListOne[0].Pic" @click="order"></image></view>
			<view class="sec_2">
				<view><image :src="bannerListOne[1].Pic" @click="orderClass"></image></view>
				<view><image :src="bannerListOne[2].Pic" @click="gym"></image></view>
			</view>
		</view>
		<view class="line"></view>
		<view class="sec1" v-if="bannerListTwo.length">
			<view class="sec1_title">大家都在练</view>
			<view class="sec1_1"><image :src="bannerListTwo[0].Pic"></image></view>
			<view class="sec1_2">
				<image :src="bannerListTwo[1].Pic" @click="newPer"></image>
				<image :src="bannerListTwo[2].Pic"></image>
			</view>
		</view>
		<view class="line"></view>
		<view class="sec2">
			<view class="sec1_title">推荐课程</view>
			<view class="sec2_tab">
				<view class="bg_fff tabList flex">
					<view class="item" v-for="(item, index) in tabs" :key="index" :class="{ active: item.Id == tabIndex }" @click="cliTab(item.Id)">{{ item.Name }}</view>
				</view>
				<view class="list" v-if="hasData">
					<view class="tab1" v-for="(item, index) in classlist" :key="index">
						<view class="sec2_1"><image :src="item.PicImg" @click="classDetails(item.Id)"></image></view>
					</view>
					<view class="more" @click="moreCourse">查看更多推荐课程</view>
				</view>
				<noData :isShow="noDataIsShow"></noData>
			</view>
		</view>
		<view class="line"></view>
		<view class="sec3"><view class="sec1_title">猜你喜欢</view></view>
		<view class="sec4" v-for="(item, index) in classlike" :key="index">
			<view class="sec4_1" @click="orderClassDetails(item.Id)">
				<view><image :src="item.PicImg"></image></view>
				<view>
					<view class="sec4_title">{{ item.Title }}</view>
					<view class="sec4_title1">{{ item.DifficultyName }} . {{ item.CourseDuration }}分钟</view>
					<view class="sec4_title2">
						<image :src="item.CoachAvatar || '/static/default.png'"></image>
						<text>{{ item.CoachNick }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
		<noData :isShow="noDataIsShow"></noData>
	</view>
</template>
<script>
import { post, get, toLogin } from '@/common/util.js';
import product from '@/components/product.vue';
import noData from '@/components/noData.vue'; //暂无数据
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
import bmSearchInput from '@/components/bm-searchInput/bm-searchInput.vue';
export default {
	components: {
		noData,
		uniLoadMore,
		product,
		bmSearchInput
	},
	data() {
		return {
			userId: '',
			token: '',
			datalist: [],
			page: 1,
			pageSize: 3,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			pageCon: 0,
			classlist: [],
			classlike: [],
			bannerList: [],
			bannerListOne: [],
			bannerListTwo: [],
			currentSwiper: 0,
			tabs: [],
			tabIndex: 45,
			id: 0
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.pageCon = uni.getStorageSync('pageCon');
		this.getClassList();
		this.getClassType();
		this.getClassLike();
		this.getBanner(6);
		this.getBannerOne(7);
		this.getBannerTwo(10);
	},
	onShow() {
		this.pageCon = uni.getStorageSync('pageCon');
	},
	methods: {
		gym() {
			uni.navigateTo({
				url: '/pages/course/gym/gym'
			});
		},
		moreCourse() {
			uni.navigateTo({
				url: '/pages/course/moreCourse/moreCourse'
			});
		},
		newPer() {
			uni.navigateTo({
				url: '/pages/course/newPer/newPer'
			});
		},
		order() {
			uni.navigateTo({
				url: '/pages/course/order/order'
			});
		},
		orderClass() {
			uni.navigateTo({
				url: '/pages/course/orderClass/orderClass'
			});
		},
		classDetails(id) {
			uni.navigateTo({
				url: '/pages/course/classDetails/classDetails?detailId=' + id
			});
		},
		orderClassDetails(id) {
			uni.navigateTo({
				url: '/pages/course/orderClassDetails/orderClassDetails?orderId=' + id
			});
		},
		cliTab(index) {
			this.tabIndex = index;
			this.page = 1;
			this.classlist = [];
			this.noDataIsShow = false;
			this.hasData = false;
			this.getClassList();
		},
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
		// 获取banner图
		async getBanner(type) {
			//顶级分类
			let result = await post('Banner/BannerList', {
				Cid: type
			});
			if (result.code === 0) {
				this.bannerList = result.data;
			}
		},
		async getBannerOne(type) {
			let result = await post('Banner/BannerList', {
				Cid: type
			});
			if (result.code === 0) {
				this.bannerListOne = result.data;
			}
		},
		async getBannerTwo(type) {
			let result = await post('Banner/BannerList', {
				Cid: type
			});
			if (result.code === 0) {
				this.bannerListTwo = result.data;
			}
		},
		changeSwiper(e) {
			this.currentSwiper = e.detail.current;
		},
		//所有课程类型
		async getClassType() {
			let result = await post('Course/GetCourseTypeList', {});
			if (result.code == 0) {
				this.tabs = result.data;
			}
		},
		// 课程列表
		async getClassList() {
			let result = await post('Course/GetCourseOutlineList', {
				page: this.page,
				pageSize: this.pageSize,
				UserId: this.userId,
				Token: this.token,
				SearchKey: '',
				IsNewPeopleVip: 0,
				Ctype: this.tabIndex,
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
		},
		// 猜你喜欢
		async getClassLike() {
			let result = await post('Course/GetCourseOfflineList', {
				page: this.page,
				pageSize: this.pageSize,
				UserId: this.userId,
				Token: this.token,
				SearchKey: '',
				IsNewPeopleVip: 0,
				IsLike: 1,
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
				this.classlike = result.data;
			}
			if (this.page > 1) {
				this.classlike = this.classlike.concat(result.data);
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
			this.getClassLike();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
