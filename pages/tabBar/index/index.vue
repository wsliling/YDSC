<template>
	<view>
		<!-- 轮播 -->
		<view class="index_swiper" v-if="tabNav != 1">
			<swiper class="swiper" :indicator-dots="false" autoplay :interval="5000" :duration="500" @change="changeSwiper">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<!-- <view class="swiper-item swiperTop" @click="tolink(item.Url)"><image class="img" :src="item.Pic" mode="aspectFill"></image></view> -->
					<!-- <view class="swiper-item swiperTop" @click="tolink('/pages/index/beginExercise/beginExercise')">
						<image class="img" :src="item.Pic" mode="aspectFill"></image>
					</view> -->
					<view class="swiper-item swiperTop" @click="bannerlink(item.Url, index)"><image class="img" :src="item.Pic" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
			<view class="dots" style="bottom: 10upx;">
				<view v-for="(item, index) in bannerList.length" :key="index" :class="['dot', currentSwiper == index ? 'active' : '']"></view>
			</view>
		</view>
		<view class="cen" @click="tolink('/pages/index/healthLife/healthLife')">
			<view class="cardTitle">健康生活</view>
			<view class="cardAll">
				<view class="card_1">
					<view><image src="/static/health/jian_1.png"></image></view>
					<view>
						<text>2</text>
						/4
						<view>2021年03月10日 10:30</view>
					</view>
				</view>
				<view class="card_2_2">目标达成</view>
			</view>
		</view>
		<view class="cen" @click="tolink('/pages/index/ExeRecord/ExeRecord')">
			<view class="cardTitle">运动记录</view>
			<view class="cardAll">
				<view class="card_1">
					<view><image src="/static/health/jian_2.png"></image></view>
					<view class="card_1_2">
						<text class="card_1_1">暂无数据</text>
						<view>生命在于运动 运动贵在坚持</view>
					</view>
				</view>
				<view class="card_2_1"></view>
			</view>
		</view>
		<!-- <view class="cen" @click="tolink('/pages/index/bodyFat/bodyFat')"> -->
		<view class="cen" @click="tolink('/pages/ems/bodyFat/bodyFat')">
			<view class="cardTitle">体脂</view>
			<view class="cardAll">
				<view class="card_1">
					<view><image src="/static/health/jian_3.png"></image></view>
					<view>
						<text>31.4</text>
						%
						<view>2021年03月10日 10:30</view>
					</view>
				</view>
				<view class="card_2">正常</view>
			</view>
		</view>
		<view class="cen" @click="tolink('/pages/index/healthLife/healthLife')">
		<!-- <view class="cen"> -->
			<view class="cardTitle">心率</view>
			<view class="cardAll">
				<view class="card_1">
					<view><image src="/static/health/jian_4.png"></image></view>
					<view>
						<text>92次</text>
						/min
						<view>2021年03月10日 10:30</view>
					</view>
				</view>
				<view class="card_2">正常</view>
			</view>
		</view>
		<view class="swiper uni-mb10" v-if="imgList.length"><swiper3D :imgList="imgList" :currentIndexParameter="currentpic" wx:key="index"></swiper3D></view>
	</view>
</template>

<script>
import { post, toLogin, navigate } from '@/common/util.js';
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
import noData from '@/components/noData.vue'; //暂无数据
import swiper3D from '@/components/swiper3D/swiper3D.vue';
export default {
	data() {
		return {
			tabNav: 2,
			bannerList: [],
			currentSwiper: 0,
			userId: '',
			token: '',
			Page: 1,
			PageSize: 10,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			pageCon: 0,
			currentpic: 1, // 默认先展示的图片下标
			imgList: []
		};
	},
	components: {
		uniLoadMore,
		noData,
		swiper3D
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.pageCon = uni.getStorageSync('pageCon');
		this.getBanner();
	},
	onShow() {
		this.pageCon = uni.getStorageSync('pageCon');
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
		// 获取banner图
		async getBanner() {
			let result = await post('Banner/BannerList', {
				Cid: 1
			});
			if (result.code == 0) {
				this.bannerList = result.data;
				this.imgList = result.data;
			}
		},
		changeSwiper(e) {
			this.currentSwiper = e.detail.current;
		},
		bannerlink(url, index) {
			if (index == 0) {
				uni.navigateTo({
					url: '/pages/ems/select_Pro/select_Pro'
				});
			} else {
				this.tolink(url);
			}
		}
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Page = 1;
		uni.stopPullDownRefresh();
	},
	// 上拉加载
	onReachBottom() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.Page++;
		} else {
			this.loadingType = 2;
		}
	}
};
</script>
<style lang="scss" scoped>
@import './style';
</style>
