<template>
	<view class="course">
		<view class="top">
			<view class="top_left">
				深圳
				<text class="iconfont icon-arrow_r"></text>
			</view>
			<view class="search"><bm-search-input></bm-search-input></view>
		</view>
		<view><banner :list="bannerList" :height="300" :padding="10" :borderRadius="20"></banner></view>
		<view class="sec">
			<view class="sec_1"><image src="/static/health/change/class_2.png" @click="order"></image></view>
			<view class="sec_2">
				<view class=""><image src="/static/health/change/class_3.png" @click="orderClass"></image></view>
				<view class=""><image src="/static/health/change/class_4.png" @click="gym"></image></view>
			</view>
		</view>
		<view class="line"></view>
		<view class="sec1">
			<view class="sec1_title">大家都在练</view>
			<view class="sec1_1"><image src="/static/health/change/class_5.png"></image></view>
			<view class="sec1_2">
				<image src="/static/health/change/class_6.png" @click="newPer"></image>
				<image src="/static/health/change/class_7.png"></image>
			</view>
		</view>
		<view class="line"></view>
		<view class="sec2">
			<view class="sec1_title">推荐课程</view>
			<view class="sec2_tab">
				<aloys-tab :tabs="tabs">
					<view slot="content0" class="xxx">
						<view class="tab1" v-for="(item, index) in classlist" :key="index">
							<view class="sec2_1"><image :src="item.PicImg"></image></view>
						</view>
						<!-- <view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view> -->
						<noData :isShow="noDataIsShow"></noData>
						<view class="more" @click="moreCourse">查看更多推荐课程</view>
					</view>
					<view slot="content1" class="xxx">B</view>
					<view slot="content2" class="xxx">C</view>
				</aloys-tab>
			</view>
		</view>
		<view class="line"></view>
		<view class="sec3">
			<view class="sec1_title">猜你喜欢</view>
			<view class="sec3"></view>
		</view>
		<view class="sec4">
			<view class="sec4_1">
				<view><image src="/static/health/change/class_11.png"></image></view>
				<view>
					<view class="sec4_title">帕梅拉10分钟全身燃脂新...</view>
					<view class="sec4_title1">K2初学 . 10分钟</view>
					<view class="sec4_title2">
						<image class="sec4_img" src="/static/health/change/class_14.png"></image>
						零碎记忆
					</view>
				</view>
			</view>
			<view class="sec4_1">
				<view><image src="/static/health/change/class_12.png"></image></view>
				<view>
					<view class="sec4_title">帕梅拉10分钟全身燃脂新...</view>
					<view class="sec4_title1">K2初学 . 10分钟</view>
					<view class="sec4_title2">
						<image class="sec4_img" src="/static/health/change/class_14.png"></image>
						零碎记忆
					</view>
				</view>
			</view>
			<view class="sec4_1">
				<view><image src="/static/health/change/class_13.png"></image></view>
				<view>
					<view class="sec4_title">帕梅拉10分钟全身燃脂新...</view>
					<view class="sec4_title1">K2初学 . 10分钟</view>
					<view class="sec4_title2">
						<image class="sec4_img" src="/static/health/change/class_14.png"></image>
						零碎记忆
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import { post, get, toLogin } from '@/common/util.js';
import product from '@/components/product.vue';
import noData from '@/components/noData.vue'; //暂无数据
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
import bmSearchInput from '@/components/bm-searchInput/bm-searchInput.vue';
import banner from '@/components/ay-banner/banner.vue';
import aloysTab from '@/components/aloys-tab/aloys-tab.vue';
export default {
	components: {
		noData,
		uniLoadMore,
		product,
		bmSearchInput,
		banner,
		aloysTab
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
			bannerList: [
				{
					id: 0,
					img: '/static/health/change/class_1.png',
					url: 'www.baidu.com/'
				},
				{
					id: 1,
					img: '/static/health/change/class_1.png'
				},
				{
					id: 2,
					img: '/static/health/change/class_1.png'
				}
			],
			tabs: [
				{
					title: '产品'
				},
				{
					title: '运营'
				},
				{
					title: '其他'
				}
			]
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.pageCon = uni.getStorageSync('pageCon');
		this.getClassList();
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
		// 课程列表
		async getClassList() {
			let result = await post('Course/GetCourseOutlineList', {
				page: this.page,
				pageSize: this.pageSize
				// IsRec: 1
			});
			if (result.code == 0) {
				console.log(result.data);
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
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
