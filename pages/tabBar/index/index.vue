<template>
	<view>
		<!-- 轮播 -->
		<view class="index_swiper" v-if="tabNav != 1">
			<swiper class="swiper" :indicator-dots="false" autoplay :interval="5000" :duration="500" @change="changeSwiper">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<!-- <view class="swiper-item swiperTop" @click="tolink(item.Url)"><image class="img" :src="item.Pic" mode="aspectFill"></image></view> -->
					<!-- <view class="swiper-item swiperTop" @click="bannerlink(item.Url, index)"><image class="img" :src="item.Pic" mode="aspectFill"></image></view> -->
					<view class="swiper-item swiperTop"><image class="img" :src="item.Pic" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
			<view class="dots" style="bottom: 10upx;">
				<view v-for="(item, index) in bannerList.length" :key="index" :class="['dot', currentSwiper == index ? 'active' : '']"></view>
			</view>
		</view>
		<view class="cen">
			<view class="cardTitle">最近体脂和运动数据</view>
			<view class="bodydata">
				<view class="lab">当前体重(kg)</view>
				<view class="weight">{{ BodyData.Weight || 0 }}</view>
				<view class="nums flex-center">
					<text>18.5</text>
					<text>24</text>
					<text>28</text>
					<text>30</text>
				</view>
				<view class="rate flex">
					<view v-for="(i, e) in 5" :key="e" :class="'rate' + e"><view v-if="bmiIndex == e" class="active" :style="'left: ' + bmiLeft + '%;'"></view></view>
				</view>
				<view class="txts flex">
					<text>偏瘦</text>
					<text>标准</text>
					<text>偏胖</text>
					<text>肥胖</text>
					<text>重度</text>
				</view>
				<view class="btns flex-center">
					<view class="btn" @click="tolink('/pages/ems/emsInfo/emsInfo', 'login')">EMS训练报告</view>
					<view class="btn" @click="tolink('/pages/ems/bodyInfo/bodyInfo', 'login')">身体详情报告</view>
				</view>
			</view>
		</view>
		<view class="cen" @click="tolink('/pages/ems/healthLife/healthLife')" v-if="false">
			<view class="cardTitle">健康生活</view>
			<view class="cardAll">
				<view class="card_1">
					<view><image src="https://yd.wtanvxin.com/static/health/jian_1.png"></image></view>
					<view>
						<text>2</text>
						/4
						<view>2021年03月10日 10:30</view>
					</view>
				</view>
				<view class="card_2_2">目标达成</view>
			</view>
		</view>
		<view class="cen" @click="tolink('/pages/ems/ExeRecord/ExeRecord')" v-if="false">
			<view class="cardTitle">运动记录</view>
			<view class="cardAll">
				<view class="card_1">
					<view><image src="https://yd.wtanvxin.com/static/health/jian_2.png"></image></view>
					<view class="card_1_2">
						<text class="card_1_1">暂无数据</text>
						<view>生命在于运动 运动贵在坚持</view>
					</view>
				</view>
				<view class="card_2_1"></view>
			</view>
		</view>
		<view class="cen" @click="tolink('/pages/ems/bodyFat/bodyFat')" v-if="false">
			<view class="cardTitle">体脂</view>
			<view class="cardAll">
				<view class="card_1">
					<view><image src="https://yd.wtanvxin.com/static/health/jian_3.png"></image></view>
					<view>
						<text>31.4</text>
						%
						<view>2021年03月10日 10:30</view>
					</view>
				</view>
				<view class="card_2">正常</view>
			</view>
		</view>
		<view class="cen" @click="tolink('/pages/ems/heart/heart')" v-if="false">
			<view class="cardTitle">心率</view>
			<view class="cardAll">
				<view class="card_1">
					<view><image src="https://yd.wtanvxin.com/static/health/jian_4.png"></image></view>
					<view>
						<text>92次</text>
						/min
						<view>2021年03月10日 10:30</view>
					</view>
				</view>
				<view class="card_2">正常</view>
			</view>
		</view>
		<!-- <view class="swiper uni-mb10" v-if="devicelist.length"><swiper3D :imgList="devicelist" :currentIndexParameter="currentpic" wx:key="index"></swiper3D></view> -->
		<swipeList :list="devicelist"></swipeList>
	</view>
</template>

<script>
import { post, toLogin, navigate } from '@/common/util.js';
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
import noData from '@/components/noData.vue'; //暂无数据
import swipeList from '@/components/swipe-3d/swipe-3d.vue';
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
			currentpic: 1, // 默认先展示的图片下标
			devicelist: [],
			BodyData: {},
			bmiIndex: 0,
			bmiLeft: 0
		};
	},
	components: {
		uniLoadMore,
		noData,
		swipeList
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getBanner(5);
		this.getBanner(6);
		// #ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		// #endif
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.GetUserBodyData();
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
		async getBanner(type) {
			let result = await post('Banner/BannerList', {
				Cid: type
			});
			if (result.code == 0) {
				if (type == 5) {
					this.bannerList = result.data;
				} else if (type == 6) {
					this.devicelist = result.data;
				}
			}
		},
		// 获取身体数据
		async GetUserBodyData() {
			let result = await post('Device/GetUserBodyData', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.BodyData = result.data;
				let bmi = result.data.BMI;
				if (bmi <= 18.5) {
					this.bmiIndex = 0;
					this.bmiLeft = (bmi / 18.5) * 100;
				} else if (bmi > 18.5 && bmi <= 24) {
					this.bmiIndex = 1;
					this.bmiLeft = ((bmi - 18.5) / 5.5) * 100;
				} else if (bmi > 24 && bmi <= 28) {
					this.bmiIndex = 2;
					this.bmiLeft = ((bmi - 24) / 4) * 100;
				} else if (bmi > 28 && bmi <= 30) {
					this.bmiIndex = 3;
					this.bmiLeft = ((bmi - 28) / 2) * 100;
				} else if (bmi > 30) {
					this.bmiIndex = 4;
					this.bmiLeft = ((bmi - 30) / 7.5) * 100;
					this.bmiLeft = this.bmiLeft > 100 ? 100 : this.bmiLeft;
				}
			} else if (result.code == 2) {
				uni.hideToast();
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
		this.GetUserBodyData();
		this.getDeviceList();
		uni.stopPullDownRefresh();
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
		}
		return {
			title: '英达思创！',
			path: '/pages/tabBar/index/index?inviteCode=' + uni.getStorageSync('ReferralCode'),
			imageUrl: 'http://yd.wtanvxin.com/static/logo.png'
		};
	}
};
</script>
<style lang="scss" scoped>
@import './style';
</style>
