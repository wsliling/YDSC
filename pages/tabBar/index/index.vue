<template>
	<view>
		<!-- 轮播 -->
		<view class="index_swiper" v-if="tabNav != 1">
			<swiper class="swiper" :indicator-dots="false" autoplay :interval="5000" :duration="500" @change="changeSwiper">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<view class="swiper-item pd15" @click="tolink(item.Url)"><image class="img" :src="item.Pic" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
			<view class="dots" style="bottom: 10upx;">
				<view v-for="(item, index) in bannerList.length" :key="index" :class="['dot', currentSwiper == index ? 'active' : '']"></view>
			</view>
		</view>
		<view class="cen">
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
		<view class="cen">
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
		<view class="cen">
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
		<view class="cen">
			<view class="cardTitle">健康生活</view>
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
		<view class="swiper uni-mb10">
			<swiper3D  :imgList="imgList" :currentIndexParameter="currentpic"></swiper3D>
		</view>
	</view>
</template>

<script>
import amapFile from '@/common/amap-wx.js';
var myAmapFun = new amapFile.AMapWX({ key: '2cf130b84fa23acfd8b04e82bc4af283' });
import { post, toLogin, navigate } from '@/common/util.js';
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
import noData from '@/components/noData.vue'; //暂无数据
<<<<<<< HEAD
import carousel from '@/components/vear-carousel/vear-carousel.vue';
=======
>>>>>>> remotes/origin/master
export default {
	data() {
		return {
			barHeight: 0,
			tabNav: 2,
			bannerList: [],
			currentSwiper: 0,
			city: '',
			isIssue: '', //是否可直播 1是，2否
			userId: '',
			token: '',
			Page: 1,
			PageSize: 10,
			PreviewClass: [],
			PreviewList: [],
			Lat: null,
			Lon: null,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			showXY: 'none', //"none":不显示 "block"显示
			pageCon: 0,
			NoticeInfo: {}, //首页公告
			currentpic: 1, // 默认先展示的图片下标
			imgList: [
				{
					src: 'https://img9.51tietu.net/pic/2019-091200/vgkpidei2tjvgkpidei2tj.jpg',
					url: ''
				},
				{
					src: 'https://img9.51tietu.net/pic/2019-091200/euzekmi5m23euzekmi5m23.jpg',
					url: ''
				},
				{
					src: 'https://img9.51tietu.net/pic/2019-091200/143tt0ta4sr143tt0ta4sr.jpg',
					url: ''
				},
				{
					src: 'https://img9.51tietu.net/pic/2019-091200/ff1vqwm3q33ff1vqwm3q33.jpg',
					url: ''
				}
			]
		};
	},
	components: {
		uniLoadMore,
		noData,
		// swiper3D
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.pageCon = uni.getStorageSync('pageCon');
		// #ifdef APP-PLUS
		var height = plus.navigator.getStatusbarHeight();
		this.barHeight = height;
		if (uni.getStorageSync('showXY') != '' && uni.getStorageSync('showXY') != 'undefined') {
			this.showXY = uni.getStorageSync('showXY');
		} else {
			this.showXY = 'block';
		}
		// #endif
		// #ifdef H5
		this.barHeight = 0;
		// #endif
		if (!this.pageCon) {
			post('System/GetOpen', {}, 1).then(res => {
				if (res.code == 0) {
					if (res.data == 1) {
						this.pageCon = 1;
					} else {
						this.pageCon = 2;
					}
				}
			});
		}
		this.getBanner();

		let _this = this;
		uni.getLocation({
			type: 'wgs84',
			geocode: true,
			success: r => {
				this.Lat = r.latitude;
				this.Lon = r.longitude;
				// 缓存获取到的地区
				uni.setStorageSync('location', {
					lat: r.latitude,
					lng: r.longitude,
					address: r.address
				});
				console.log('location', r);
				// #ifdef APP-PLUS
				_this.city = r.address.city;
				_this.getCityCode();
				// #endif
				// #ifdef MP-WEIXIN
				myAmapFun.getRegeo({
					success: function(data) {
						var index = data[0].name.indexOf('市');
						let cityname = data[0].name;
						_this.city = cityname;
						console.log(_this.city);
						_this.getCityCode();
						// uni.setStorageSync('cityname',_this.cityname)
					},
					fail: function(info) {
						//失败回调
						console.log(info);
					}
				});
				// #endif
			},
			fail: function() {
				uni.showToast({
					title: '获取地址失败，将导致部分功能不可用',
					icon: 'none'
				});
			}
		});
		// this.getPreviewClass()
		this.getPreviewList();
		this.getNotice();
	},
	onShow() {
		this.pageCon = uni.getStorageSync('pageCon');
		this.isIssue = uni.getStorageSync('isIssue') || '';
		if (uni.getStorageSync('userId') && uni.getStorageSync('token') && this.isIssue != 1) {
			this.getisIssue();
		}
		this.getPreviewList();
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
		//显示协议
		xytab(id) {
			this.showXY = false;
			if (id == 0) {
				plus.runtime.quit();
			} else {
				uni.setStorageSync('showXY', 'none');
			}
		},
		//判断是否可以发布视频
		async getisIssue() {
			let result = await post('LivePreview/Preview', {
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token')
			});
			if (result.code == 7) {
				uni.hideToast();
				this.isIssue = 2;
				uni.setStorageSync('isIssue', 2);
			} else {
				uni.hideToast();
				this.isIssue = 1;
				uni.setStorageSync('isIssue', 1);
			}
		},
		// 获取banner图
		async getBanner() {
			let result = await post('Banner/BannerList', {
				Cid: 1
			});
			if (result.code == 0) {
				this.bannerList = result.data;
			}
		},
		changeSwiper(e) {
			this.currentSwiper = e.detail.current;
		},
		// 获取城市编码
		async getCityCode() {
			let result = await post('Area/GetCityCode', {
				Name: this.city
			});
			if (result.code == 0) {
				console.log(result.data, 123);
			}
		},
		//获取公告
		async getNotice() {
			let result = await post('System/GetHomeNotice', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0 && result.data) {
				this.NoticeInfo = result.data;
				setTimeout(() => {
					this.$refs.Noticewin.open();
				}, 200);
			}
		},
		// 直播预告分类
		async getPreviewClass() {
			let res = await post('LivePreview/PreviewClass');
			if (res.code == 0) {
				this.PreviewClass = res.data;
			}
		},
		// 直播分类列表
		async getPreviewList() {
			console.log(this.tabNav);
			let type = 6;
			if (this.tabNav != 1) {
				type = 0;
			}

			console.log(type);
			let res = await post('LivePreview/PreviewList', {
				UserId: this.userId,
				Token: this.token,
				Page: this.Page,
				PageSize: this.PageSize,
				Type: type,
				AreaSite: this.tabNav == 3 ? this.city : '',
				Lat: this.tabNav == 3 ? this.Lat : '',
				Lng: this.tabNav == 3 ? this.Lon : ''
			});
			console.log(res, 'listbiao');
			if (res.count > 0) {
				this.hasData = true;
				this.noDataIsShow = false;
				res.data.forEach(function(item) {
					item.Title = decodeURIComponent(item.Title);
					item.Intro = decodeURIComponent(item.Intro);
				});
			}
			if (res.count == 0 && this.Page == 1) {
				this.noDataIsShow = true;
				this.hasData = false;
			}
			if (this.Page === 1) {
				this.PreviewList = res.data;
			}
			if (this.Page > 1) {
				this.PreviewList = this.PreviewList.concat(res.data);
			}
			if (res.data.length < this.PageSize) {
				this.isLoad = false;
				this.loadingType = 2;
			} else {
				this.isLoad = true;
				this.loadingType = 0;
			}
			// this.PreviewList=res.data
		},
		tapNav(type) {
			if (type == 1 && !uni.getStorageSync('userId')) {
				toLogin();
				return;
				// console.log(11)
			}
			this.tabNav = type;
			this.Page = 1;
			this.getPreviewList();
		},
		// 获取用户是否为认证用户
		async getUserInfo() {
			let res = await post('User/GetCenterInfo');
		},
		// 导航栏开播图标
		showLive() {
			let _this = this;
			// this.showlivebox=true
			if (toLogin()) {
				if (this.isIssue == 1) {
					uni.navigateTo({
						url: '/pages/preview/preview'
					});
					// uni.showActionSheet({
					// 	itemList:['立即开播','开播预告'],
					// 	success(res) {
					// 	  console.log(res.tapIndex)
					// 	  if(res.tapIndex==0){
					// 		  navigate('livepush/livepush')
					// 	  }else{
					// 		  uni.navigateTo({
					// 		  	url:'/pages/preview/preview'
					// 		  })
					// 	  }
					// 	},
					// 	fail(res) {
					// 	  console.log(res.errMsg);
					// 	}
					// })
				} else {
					//#ifndef APP-PLUS
					uni.showModal({
						title: '认证提示',
						content: '您还没有权限，去认证？',
						confirmColor: '#FF3333',
						success(res) {
							if (res.confirm) {
								_this.Authselect();
							} else if (res.cancel) {
							}
						}
					});
					//#endif
					//#ifdef APP-PLUS
					this.$showModal({
						title: '认证提示',
						content: '您还没有权限，去认证？'
					})
						.then(res => {
							_this.Authselect();
							//确认
						})
						.catch(res => {
							//取消
						});
					//#endif
				}
			}
		},
		Authselect() {
			uni.showActionSheet({
				itemList: ['店铺认证', '网红达人认证'],
				success: async res => {
					if (res.tapIndex == 0) {
						let r = await post('User/ShopAuthInfo', {
							UserId: uni.getStorageSync('userId'),
							Token: uni.getStorageSync('token'),
							IsBusiness: 1
						});
						if (r.code == 0) {
							uni.navigateTo({
								url: '/pages/other/attest/attest2'
							});
						} else {
							return;
						}
					} else {
						let r = await post('User/SageAuthInfo', {
							UserId: uni.getStorageSync('userId'),
							Token: uni.getStorageSync('token')
						});
						if (r.code == 0) {
							uni.navigateTo({
								url: '/pages/other/attest/attest?type=1'
							});
						} else {
							return;
						}
					}
				},
				fail(res) {
					console.log(res.errMsg);
				}
			});
		},
		// 搜索框
		search() {
			uni.navigateTo({
				url: '/pages/goods/ProductList/ProductList'
			});
		},
		// 跳转直播
		goLivePlay(item, i) {
			if (!toLogin()) {
				return false;
			}
			if (this.PreviewList[i].Flag == 1) {
				//#ifdef APP-PLUS
				navigate('liveplay/live3', { MemberId: item.MemberId });
				//#endif
				//#ifndef APP-PLUS
				navigate('liveplay/live', { MemberId: item.MemberId });
				//#endif
			} else {
				uni.showToast({
					title: '直播已结束或未开始！',
					icon: 'none'
				});
			}
			// if(this.PreviewList[i].Flag==1){
			// 	navigate('liveplay/live',{MemberId:item.MemberId})
			// }else{
			// 	uni.navigateTo({
			// 		url:'/pages/upLoadDetail/upLoadDetail?id='+this.PreviewList[i].Id
			// 	})
			// }
		}
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Page = 1;
		this.PreviewList = [];
		this.getPreviewList();
		uni.stopPullDownRefresh();
	},
	// 上拉加载
	onReachBottom() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.Page++;
			this.getPreviewList();
		} else {
			this.loadingType = 2;
		}
	},
	// #ifdef  MP-WEIXIN
	onShareAppMessage(res) {}
	// #endif
};
</script>
<style lang="scss" scoped>
@import './style';
.index_swiper {
	margin-top: 30upx;
}
.pop-notice {
	background: #fff;
	border-radius: 28upx;
	width: 80%;
	margin: 0 auto;
	padding: 20upx 30upx;
	position: relative;
	.icontop {
		position: absolute;
		left: 50%;
		top: -80upx;
		transform: translateX(-50%);
		width: 172upx;
		height: 172upx;
	}
	.pop-hd {
		font-size: 36upx;
		font-weight: bold;
		margin-top: 80upx;
		margin-bottom: 20upx;
		padding-bottom: 20upx;
		border-bottom: 1px solid #eee;
	}
	.pop-scroll {
		max-height: 600upx;
		text-align: left;
		line-height: 1.8;
		text-align: justify;
	}
	.btn {
		width: 480upx;
		height: 80upx;
		border-radius: 40upx;
		line-height: 80upx;
		color: #fff;
		background-color: #fea30d;
		margin: 40upx auto 20upx;
	}
}
.closebtn_bb {
	color: #fff;
	width: 66upx;
	height: 66upx;
	line-height: 66upx;
	font-size: 30upx;
	margin: 20upx auto 0;
	border: 1px solid #fff;
	border-radius: 50%;
}
.pageCon2title {
	width: 100%;
	height: 44px;
	font-size: 32rpx;
	font-weight: bold;
}
.staticPage {
	.itembox {
		.hd {
			color: $primary;
			font-weight: bold;
			font-size: 36upx;
			padding: 30upx;
		}
		.txtbox {
			.p {
				font-size: 30upx;
				margin-bottom: 10upx;
				text-align: justify;
			}
		}
		.icons {
			text-align: center;
			margin-top: 30upx;
			.item {
				width: 33.33%;
			}
			.icoimg {
				width: 128upx;
				margin-bottom: 20upx;
			}
			.txt {
				line-height: 1.5;
			}
			.zh {
				font-size: 30upx;
				display: block;
			}
			.en {
				font-size: 24upx;
			}
			&.jigou {
				padding: 0 20upx;
				.item {
					width: 25%;
					.icoimg {
						width: 90%;
						margin-bottom: 20upx;
					}
				}
			}
		}
	}
	.youshi {
		background: url(http://yx.wtvxin.com/pc/img/index/jiaru-banner.png) center center no-repeat;
		background-size: cover;
		padding: 40upx 30upx;
		.hd {
			color: #fff !important;
		}
		.item {
			background: rgba(0, 0, 0, 0.3);
			padding: 40upx 10upx 30upx;
			margin: 0 1px;
			height: 340rpx;
			.txt {
				color: #fff;
				.zh1 {
					font-size: 30upx;
				}
				.zh {
					font-size: 24upx;
				}
			}
		}
	}
}
</style>
