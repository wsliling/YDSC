<template>
	<view>
		<uni-nav-bar fixed="true" color="#ffffff" :border="false">
			<block slot="center" class="flex1">
				<view class="input-view" style="background: #f2f2f2; border-radius: 10upx; margin-left: 30upx;" @click="tolink('/pages/goods/ProductList/ProductList')">
					<uni-icons class="input-uni-icon" type="search" size="22" color="#b8b8b8" />
					<input confirm-type="search" disabled="" class="nav-bar-input" type="text" placeholder="输入搜索关键词" />
				</view>
			</block>
			<block slot="right" class="flex">
				<view class="iconfont icon-class" style="color: #584f60; font-size: 22px; padding:0 10upx;" @click="tolink('/pages/goods/classify/classify')"></view>
				<view class="iconfont icon-tianchongxing- p_re" style="color: #584f60; font-size: 22px; padding:0 10upx;" @click="tolink('/pages/goods/cart/cart')">
					<text class="uni-badge" v-if="CartNum > 0">{{ CartNum > 99 ? '99+' : CartNum }}</text>
				</view>
			</block>
		</uni-nav-bar>
		<!-- <view :style="{height:(44+barHeight)+'px'}"></view> -->
		<view>
			<!-- 轮播 -->
			<view class="index_swiper uni-bg-white">
				<swiper class="swiper" :indicator-dots="false" autoplay :interval="5000" :duration="500" @change="changeSwiper">
					<swiper-item v-for="(banner, index) in Bannerlist" :key="index">
						<!-- <view class="swiper-item pd15" @click="tolink(banner.Url)"><image class="img" :src="banner.Pic" mode="aspectFill"></image></view> -->
						<view class="swiper-item pd15" @click="tolink(banner.Url)"><image class="img" :src="banner.Pic" mode="aspectFill"></image></view>
					</swiper-item>
				</swiper>
				<view class="dots" style="bottom: 30upx;">
					<view v-for="(item, index) in Bannerlist.length" :key="index" :class="['dot', currentSwiper == index ? 'active' : '']"></view>
				</view>
			</view>
			<view class="icon-menu li_20 uni-bg-white pd15 uni-mb10">
				<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0">
					<block v-for="(item, index) in categoryList" :key="index">
						<view class="item" @click="tolink('/pages/goods/secondlist/secondlist?id=' + item.Id + '&keystr=' + item.Name)">
							<image class="icon" :src="item.Pic || 'http://yd.wtanvxin.com/static/60x60.png'"></image>
							<text class="txt">{{ item.Name }}</text>
						</view>
					</block>
				</scroll-view>
			</view>
			<!-- 好物推荐 -->
			<view class="page-section BrandList uni-bg-white pd15 uni-mb10">
				<view class="Yi-hd flex-between">
					<view class="title"><text>今日好物推荐</text></view>
				</view>
				<view class="uni-bd" v-if="BannerlistTwo.length" @click="tolink('/pages/goods/findpro/findpro')">
					<!-- <view class="item" @click="tolink(BannerlistTwo[0].Url)"><image :src="BannerlistTwo[0].Pic" mode="aspectFill"></image></view>
					<view class="item" @click="tolink(BannerlistTwo[1].Url)"><image :src="BannerlistTwo[1].Pic" mode="aspectFill"></image></view>
					<view class="item" @click="tolink(BannerlistTwo[2].Url)"><image :src="BannerlistTwo[2].Pic" mode="aspectFill"></image></view>
					 -->
					<view class="item"><image :src="BannerlistTwo[0].Pic" mode="aspectFill"></image></view>
					<view class="item"><image :src="BannerlistTwo[1].Pic" mode="aspectFill"></image></view>
					<view class="item"><image :src="BannerlistTwo[2].Pic" mode="aspectFill"></image></view>
				</view>
			</view>
			<!-- 小banner -->
			<!-- <view class="page-section BrandList uni-bg-white pp3 uni-mb10" v-if="BannerlistThree.length">
				<view class="img" @click="tolink('/pages/goods/lease/lease')"><image :src="BannerlistThree[0].Pic" mode="widthFix"></image></view>
			</view> -->
			<!-- 每日上新 -->
			<view class="page-section HotsellList uni-bg-white pd15 uni-mb10" v-if="newprolist.length">
				<view class="Yi-hd flex-between">
					<view class="title"><text>上新精选</text></view>
					<view class="more" @click="tolink('/pages/goods/newpro/newpro')">
						更多
						<text class="arrow uni-icon uni-icon-arrowright"></text>
					</view>
				</view>
				<view class="uni-bd">
					<scroll-view class="scroll-view_H Hotsell-list" scroll-x="true" scroll-left="0">
						<view class="scroll-view-item_H" v-for="(item, index) in newprolist" :key="index">
							<view class="itembox" @click="tolink('/pages/goods/productDetail/productDetail?proId=' + item.Id)">
								<view class="image-view"><image class="img" :src="item.PicNo || 'http://via.placeholder.com/800x800'" mode="aspectFill"></image></view>
								<view class="porductname uni-center">{{ item.Name }}</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<!-- 猜你喜欢 -->
			<view class="areapro pd15">
				<view class="Yi-hd flex-between">
					<view class="title"><text>猜你喜欢</text></view>
				</view>
				<view class="uni-product-list" v-if="hasData">
					<block v-for="(item, index) in prolist" :key="index"><product :datajson="item" v-on:goDetail="goDetail"></product></block>
				</view>
				<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
				<noData :isShow="noDataIsShow"></noData>
			</view>
		</view>
	</view>
</template>

<script>
import { post, get, toLogin, webUrl } from '@/common/util.js';
import product from '@/components/product.vue';
import noData from '@/components/noData.vue'; //暂无数据
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
export default {
	components: {
		product,
		noData,
		uniLoadMore
	},
	data() {
		return {
			userId: '',
			token: '',
			barHeight: 0,
			Bannerlist: [], //轮播图
			BannerlistTwo: [],
			BannerlistThree: [],
			currentSwiper: 0,
			CartNum: 0, //购物车数量
			categoryList: [], //类型
			newprolist: [], //新品
			Groupprolist: [], //拼团产品
			TypeId: 0,
			prolist: [],
			page: 1,
			pageSize: 8,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		// #ifdef APP-PLUS
		this.barHeight = plus.navigator.getStatusbarHeight();
		// #endif
		this.BannerList(2);
		this.BannerListTwo(12);
		this.BannerListThree(13);
		this.getTypeList();
		this.getnewpro();
		this.getprolist();
	},
	onShow() {
		this.pageCon = uni.getStorageSync('pageCon');
		this.getCartNum();
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
		//轮播图
		async BannerList(type) {
			//顶级分类
			let result = await post('Banner/BannerList', {
				Cid: type
			});
			if (result.code === 0) {
				this.Bannerlist = result.data;
			}
		},
		async BannerListTwo(type) {
			let result = await post('Banner/BannerList', {
				Cid: type
			});
			if (result.code === 0) {
				this.BannerlistTwo = result.data;
			}
		},
		async BannerListThree(type) {
			let result = await post('Banner/BannerList', {
				Cid: type
			});
			if (result.code === 0) {
				this.BannerlistThree = result.data;
			}
		},
		changeSwiper(e) {
			this.currentSwiper = e.detail.current;
		},
		//获取购物车数量
		async getCartNum() {
			let result = await post('Cart/GoodsCartNum', {
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token')
			});
			if (result.code == 0) {
				this.CartNum = result.data.Count;
			} else {
				uni.hideToast();
			}
		},
		// 产品类型
		getTypeList() {
			post('Goods/TypeList', {}).then(res => {
				if (res.code == 0) {
					this.categoryList = res.data;
				}
			});
		},
		//获取上新产品
		async getnewpro() {
			let result = await post('Goods/GoodsList', {
				page: 1,
				pageSize: 10,
				IsNew: 1
			});
			if (result.code == 0) {
				if (result.data.length > 0) {
					this.newprolist = result.data;
				}
			}
		},
		goDetail(id) {
			uni.navigateTo({
				url: '/pages/goods/productDetail/productDetail?proId=' + id
			});
		},
		//分类商品列表
		async getprolist() {
			let result = await post('Goods/GoodsList', {
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token'),
				page: this.page,
				pageSize: this.pageSize,
				TypeId: this.TypeId,
				// IsLike:this.TypeId?0:1
				IsLike: 0
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
				this.prolist = result.data;
			}
			if (this.page > 1) {
				this.prolist = this.prolist.concat(result.data);
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
		this.getCartNum();
		this.getprolist();
		uni.stopPullDownRefresh();
	},
	// 上拉加载
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.page++;
			this.getprolist();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss" scoped>
@import './style';
</style>
