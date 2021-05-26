<template>
	<view class="course">
		<view class="top uni-bg-white">
			<view class="top_left" @click="tolink('/pages/chooseCity/chooseCity')">
				<!-- 深圳 -->
				{{ cityname || '定位' }}
				<text class="iconfont icon-arrow_r"></text>
			</view>
			<view class="search">
				<uni-nav-bar color="#ffffff" background-color="#fff" :border="false">
					<block slot="center" class="flex1">
						<view class="input-view" style="background: #f2f2f2; border-radius: 10upx;" @click="tolink('/pages/course/classList/classList')">
							<uni-icons class="input-uni-icon" type="search" size="22" color="#b8b8b8" />
							<input confirm-type="search" class="nav-bar-input" type="text" placeholder="输入搜索关键词" />
						</view>
					</block>
				</uni-nav-bar>
			</view>
		</view>
		<!-- 轮播 -->
		<view class="index_swiper uni-bg-white" style="padding-top: 100upx;">
			<swiper class="swiper" :indicator-dots="false" autoplay :interval="5000" :duration="500" @change="changeSwiper">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<view class="swiper-item swiperTop" @click="tolink(item.Url)"><image class="img" :src="item.Pic" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
			<view class="dots" style="bottom: 10upx;">
				<view v-for="(item, index) in bannerList.length" :key="index" :class="['dot', currentSwiper == index ? 'active' : '']"></view>
			</view>
		</view>
		<view class="sec uni-bg-white uni-mb10" v-if="bannerListOne.length && bannerListTwo.length && bannerListThree.length">
			<view class="sec_1"><image :src="bannerListOne[0].Pic" mode="aspectFill" @click="tolink('/pages/course/appointmentCoach/appointmentCoach')"></image></view>
			<view class="sec_2">
				<view><image :src="bannerListTwo[0].Pic" mode="aspectFill" @click="tolink('/pages/course/appointmentCourse/appointmentCourse')"></image></view>
				<view><image :src="bannerListThree[0].Pic" mode="aspectFill" @click="tolink('/pages/course/gym/gym')"></image></view>
			</view>
		</view>
		<block v-if="pageCon == 1">
			<view class="sec1 uni-bg-white uni-mb10" v-if="bannerListFour.length && bannerListFive.length && bannerListSix.length">
				<view class="sec1_title">大家都在练</view>
				<view class="sec1_1"><image :src="bannerListFour[0].Pic" mode="aspectFill" @click="tolink('/pages/course/list/list?seakey=' + '减脂')"></image></view>
				<view class="sec1_2 flex-between">
					<image :src="bannerListFive[0].Pic" mode="aspectFill" @click="tolink('/pages/course/newPer/newPer')"></image>
					<image :src="bannerListSix[0].Pic" mode="aspectFill" @click="tolink('/pages/course/list/list?seakey=' + '增肌')"></image>
				</view>
			</view>
			<view class="sec2 uni-bg-white uni-mb10">
				<view class="sec1_title">推荐课程</view>
				<view class="sec2_tab">
					<scroll-view scroll-x="true" class="tabList">
						<view class="item" v-for="(item, index) in tabs" :key="index" :class="{ active: index == tabIndex }" @click="cliTab(index, item.Id)">{{ item.Name }}</view>
					</scroll-view>
					<view class="list" v-if="hasData">
						<block v-for="(item, index) in classlist" :key="index">
							<view class="sec2_1"><image :src="item.PicImg" mode="aspectFill"></image></view>
							<view class="detail" @click="tolink('/pages/course/classDetails/classDetails?detailId=' + item.Id)">
								<view class="title uni-ellipsis">{{ item.Title }}</view>
								<view class="title_1">{{ item.CourseDuration }}分钟 · {{ item.DifficultyName }} · {{ item.TargetName }}</view>
							</view>
						</block>
						<view class="more" @click="tolink('/pages/course/moreCourse/moreCourse')">查看更多推荐课程</view>
					</view>
					<noData :isShow="noDataIsShow"></noData>
				</view>
			</view>
		</block>
		<view class="sec3 uni-bg-white">
			<view class="sec1_title">猜你喜欢</view>
			<view class="sec4" v-for="(item, index) in classlike" :key="index">
				<view class="sec4_1" @click="tolink('/pages/course/courseDetails/courseDetails?appointId=' + item.Id)">
					<view><image :src="item.PicImg" mode="aspectFill"></image></view>
					<view>
						<view class="sec4_title">{{ item.Title }}</view>
						<view class="sec4_title1">{{ item.DifficultyName }} . {{ item.CourseDuration }}分钟</view>
						<view class="sec4_title2">
							<image :src="item.CoachAvatar || 'http://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image>
							<text>{{ item.CoachNick }}</text>
						</view>
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
import { MP } from '@/common/map.js'; //h5百度定位
import noData from '@/components/noData.vue'; //暂无数据
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
export default {
	components: {
		noData,
		uniLoadMore,
		product
	},
	data() {
		return {
			pageCon: 0,
			userId: '',
			token: '',
			datalist: [],
			page: 1,
			pageSize: 3,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			classlist: [],
			classlike: [],
			bannerList: [],
			bannerListOne: [],
			bannerListTwo: [],
			bannerListThree: [],
			bannerListFour: [],
			bannerListFive: [],
			bannerListSix: [],
			currentSwiper: 0,
			tabs: [],
			tabIndex: 0,
			tabid: 0,
			locationAddress: '',
			nowCity: '', //当前城市
			cityname: '全国', //定位城市
			AreaCode: '', //区域国家码
			AreaType: 0 //1不限市，区
		};
	},
	onLoad() {
		this.pageCon = uni.getStorageSync('pageCon');
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getCourseType();
		this.getCourseLike();
		this.getBanner(7);
		this.getBanner(8);
		this.getBanner(9);
		this.getBanner(10);
		this.getBanner(11);
		this.getBanner(12);
		this.getBanner(13);
		var _this = this;
		// #ifdef APP-PLUS||MP-WEIXIN
		uni.getLocation({
			type: 'wgs84',
			geocode: true,
			success: function(res) {
				console.log(res);
				// #ifdef APP-PLUS
				var city = res.address.city.replace(/市/, '');
				uni.setStorageSync('cityname', city);
				_this.cityname = city;
				_this.nowCity = city;
				_this.getAreaCode(city);

				// #endif
				// #ifdef MP-WEIXIN
				_this.wxGetCity(res.longitude, res.latitude);
				// #endif
				console.log(res);
			}
		});
		// #endif
		//百度定位
		// #ifdef H5
		MP(0).then(BMap => {
			var _this = this;
			let myCity = new BMap.LocalCity();
			myCity.get(function(res) {
				var city = res.name.replace(/市/, '');
				uni.setStorageSync('cityname', city);
				_this.cityname = city;
				_this.nowCity = city;
				_this.getAreaCode(city);
			});
		});
		// #endif
	},
	onShow() {
		this.cityname = uni.getStorageSync('cityname');
		this.getAreaCode(this.cityname);
	},
	methods: {
		cliTab(index, id) {
			this.tabIndex = index;
			this.tabid = id;
			this.page = 1;
			this.classlist = [];
			this.noDataIsShow = false;
			this.hasData = false;
			this.getCourseList();
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
		// 定位当前城市
		getlocationNow() {
			this.cityname = this.nowCity;
			this.getAreaCode(this.nowCity);
		},
		//小程序解析经纬度获取城市
		// #ifdef MP-WEIXIN
		wxGetCity(lon, lat) {
			var _this = this;
			wx.request({
				url: 'https://restapi.amap.com/v3/geocode/regeo?output=JSON&location=' + lon + ',' + lat + '&key=280802ed0116fef931dbcf5e7e9278d7&radius=1000&extensions=all',
				header: {
					'content-type': 'application/json' // 默认值
				},
				success(res) {
					if (res.statusCode === 200) {
						var cityname = res.data.regeocode.addressComponent.city.replace(/市/, '');
						uni.setStorageSync('cityname', cityname);
						_this.cityname = cityname;
						_this.getAreaCode(cityname);
					} else {
						console.log('获取信息失败，请重试！');
					}
				}
			});
		},
		// #endif
		async getAreaCode(name) {
			if (name && name != '全国') {
				let result = await post('Area/GetCityCode', {
					Name: name
				});
				if (result.code === 0) {
					this.AreaCode = result.data.Code;
					this.AreaType = 1;
				}
			} else if (name == '全国') {
				this.AreaCode = '';
				this.AreaType = 0;
			} else {
				this.AreaCode = '';
				this.AreaType = 0;
			}
			uni.setStorageSync('AreaCode', this.AreaCode);
		},
		// 获取banner图
		async getBanner(type) {
			//顶级分类
			let result = await post('Banner/BannerList', {
				Cid: type
			});
			if (result.code === 0) {
				if (type == 7) {
					this.bannerList = result.data;
				} else if (type == 8) {
					this.bannerListOne = result.data;
				} else if (type == 9) {
					this.bannerListTwo = result.data;
				} else if (type == 10) {
					this.bannerListThree = result.data;
				} else if (type == 11) {
					this.bannerListFour = result.data;
				} else if (type == 12) {
					this.bannerListFive = result.data;
				} else if (type == 13) {
					this.bannerListSix = result.data;
				}
			}
		},
		changeSwiper(e) {
			this.currentSwiper = e.detail.current;
		},
		//所有课程类型
		async getCourseType() {
			let result = await post('Course/GetCourseTypeList', {});
			if (result.code == 0) {
				this.tabs = result.data;
				this.tabid = this.tabs[0].Id;
				this.getCourseList();
			}
		},
		// 课程列表
		async getCourseList() {
			let result = await post('Course/GetCourseOutlineList', {
				page: this.page,
				pageSize: this.pageSize,
				UserId: this.userId,
				Token: this.token,
				SearchKey: '',
				IsNewPeopleVip: 0,
				Ctype: this.tabid,
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
		async getCourseLike() {
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
			this.getCourseLike();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
