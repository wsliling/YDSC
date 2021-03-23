<template>
	<view class="course">
		<view class="top">
			<view class="top_left">
				深圳
				<text class="iconfont icon-arrow_r"></text>
			</view>
			<view class="search">
				<bm-search-input
					:isHistory="true"
					:lists_title="search_result_title"
					:lists_note="search_result_note"
					:input_length="my_input_length"
					:lists="suggestion_lists"
					v-on:parent_get_lists="get_selected_lists"
					v-on:parent_search="finish_search"
				></bm-search-input>
			</view>
		</view>
		<view><banner :list="bannerList" @toDetailPage="toDetailPage" :height="300" :padding="10" :borderRadius="20"></banner></view>
		<view class="sec">
			<view class="sec_1"><image src="/static/health/change/class_2.png" @click="order"></image></view>
			<view class="sec_2">
				<view class=""><image src="/static/health/change/class_3.png" @click="orderClass"></image></view>
				<view class=""><image src="/static/health/change/class_4.png" @click="stadium"></image></view>
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
						<view class="tab1">
							<view class="sec2_1"><image src="/static/health/change/class_8.png"></image></view>
							<view class="sec2_1"><image src="/static/health/change/class_9.png"></image></view>
							<view class="sec2_1"><image src="/static/health/change/class_10.png"></image></view>
							<view class="more" @click="moreCourse">查看更多推荐课程</view>
						</view>
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
			pageSize: 8,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			isIssue: '', //是否可发布 1是，2否
			pageCon: 0,
			//搜索结果中的标题
			search_result_title: [],
			//搜索结果中的备注(不需要可以删掉)
			search_result_note: [],
			// 搜索建议列表
			suggestion_lists: [],
			// 自定义搜索框长度
			my_input_length: '86%',
			navbackgroundColor: '#fff',
			themeColor: '#33CCCC',
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
		this.getdatalist();
	},
	onShow() {
		this.pageCon = uni.getStorageSync('pageCon');
		this.isIssue = uni.getStorageSync('isIssue') || '';
		if (uni.getStorageSync('userId') && uni.getStorageSync('token') && this.isIssue != 1) {
			this.getisIssue();
		}
	},
	methods: {
		stadium() {
			uni.navigateTo({
				url: '/pages/course/stadium/stadium'
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
		//跳转
		tolink(Url) {
			uni.navigateTo({
				url: Url
			});
		},
		todetails(id) {
			//#ifdef H5
			uni.navigateTo({
				url: '/pages/hwDetails/hwDetails2?id=' + id
			});
			//#endif
			//#ifndef H5
			uni.navigateTo({
				url: '/pages/hwDetails/hwDetails?id=' + id
			});
			//#endif
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
		torelease() {
			let _this = this;
			if (toLogin()) {
				if (this.isIssue == 1) {
					uni.navigateTo({
						url: '/pages/release/release'
					});
				} else {
					//#ifndef APP-PLUS
					uni.showModal({
						title: '认证提示',
						content: '您还没有权限，去认证',
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

		//列表
		async getdatalist() {
			let url = this.pageCon == 2 ? 'Goods/GoodsList' : 'News/BrandgoodsList';
			let result = await post(url, {
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token'),
				page: this.page,
				pageSize: this.pageSize
			});
			if (result.code == 0) {
				if (result.data.length > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
					result.data.forEach(function(item) {
						item.Title = decodeURIComponent(item.Title);
					});
				}
			}
			if (result.data.length == 0 && this.page == 1) {
				this.noDataIsShow = true;
				this.hasData = false;
			}
			if (this.page === 1) {
				this.datalist = result.data;
			}
			if (this.page > 1) {
				this.datalist = this.datalist.concat(result.data);
			}
			if (result.data.length < this.pageSize) {
				this.isLoad = false;
				this.loadingType = 2;
			} else {
				this.isLoad = true;
				this.loadingType = 0;
			}
		},
		goDetail(id) {
			uni.navigateTo({
				url: '/pages/goods/productDetail/productDetail?proId=' + id
			});
		},
		async Likebtn(id, index, Islike) {
			let result = await post('News/BrandgoodsLikes', {
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token'),
				Id: id
			});
			if (result.code == 0) {
				let _this = this;
				uni.showToast({
					title: result.msg,
					icon: 'none'
				});
				let num = _this.datalist[index].LikeNum;
				if (Islike > 0) {
					num--;
					_this.$set(_this.datalist[index], 'IsLike', 0);
				} else {
					num++;
					_this.$set(_this.datalist[index], 'IsLike', 1);
				}
				_this.$set(_this.datalist[index], 'LikeNum', num);
			} else if (result.code == 2) {
				uni.hideToast();
				toLogin();
			}
		}
	},
	onPullDownRefresh() {
		this.page = 1;
		this.getdatalist();
		uni.stopPullDownRefresh();
	},
	// 上拉加载
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.page++;
			this.getdatalist();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
