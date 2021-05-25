<template>
	<view>
		<!-- 轮播 -->
		<view class="index_swiper">
			<view class="boxradius"></view>
			<swiper class="swiper" :indicator-dots="false" autoplay :interval="5000" :duration="500" @change="changeSwiper">
				<swiper-item v-for="(banner, index) in Bannerlist" :key="index">
					<view class="swiper-item pd15" @click="tolink(banner.Url)"><image class="img" :src="banner.Pic" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
			<view class="dots" style="bottom: 10px;">
				<view v-for="(item, index) in Bannerlist.length" :key="index" :class="['dot', currentSwiper == index ? 'active' : '']"></view>
			</view>
		</view>
		<view>
			<!-- 上新精选 -->
			<view class="todaynew pd15" v-if="newprolist.length">
				<view class="c-hd uni-mb10">
					上新精选
					<text class="text">精选新品 闭眼放心买</text>
				</view>
				<view class="product-list-level">
					<block v-for="(item, index) in newprolist" :key="index">
						<view class="outside uni-mb10 uni-bg-white b_radius" @click="tolink('/pages/goods/productDetail/productDetail?proId=' + item.Id)">
							<view class="pictrue"><image :src="item.PicNo || 'http://via.placeholder.com/800x800'" mode="aspectFill"></image></view>
							<view class="txtBox">
								<view>
									<view class="title uni-ellipsis2">{{ item.Name }}</view>
									<view class="flex">
										<view class="tag tag-zy" v-if="item.IsPlatform">{{ item.IsPlatform }}</view>
									</view>
								</view>
								<view class="pronumber flex-between">
									<view>
										<text class="price">
											<text class="fz12">￥</text>
											{{ item.Price }}
										</text>
									</view>
									<!-- <view class="opentuan" >立即查看</view> -->
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
			<!-- 为你推荐 -->
			<view class="recomPro" id="filter" style="min-height: 100vh;">
				<view :class="['filterMenu pd15', isfixed ? 'scroll' : '']">
					<view class="menu flex-between center">
						<view class="item" :class="{ active: item.active }" @click="shiftFilterTab(index)" v-for="(item, index) in filterTab" :key="index">
							{{ item.name }}
							<text v-if="item.isSortorder" class="filterBtn" :class="{ upBtn: item.sortorder == '0', downBtn: item.sortorder == '1' }"></text>
						</view>
					</view>
				</view>
				<view class="pp3">
					<view class="uni-product-list" v-if="hasData">
						<block v-for="(item, index) in prolist" :key="index"><product :datajson="item" v-on:goDetail="goDetail"></product></block>
					</view>
					<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
					<noData :isShow="noDataIsShow"></noData>
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
			Bannerlist: [], //轮播图
			currentSwiper: 0,
			newprolist: [], //新品
			prolist: [],
			page: 1,
			pageSize: 8,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			isfixed: false, //筛选是否定位
			filtertop: 0,
			filterTab: [
				{
					name: '为你推荐',
					sortname: 0,
					isSortorder: false,
					active: true
				},
				{
					name: '价格',
					sortorder: '', //0：倒序；1:为顺序
					sortname: 2,
					isSortorder: true,
					active: false
				},
				{
					name: '销量',
					sortorder: '', //0：倒序；1:为顺序
					sortname: 3,
					isSortorder: true,
					active: false
				},
				{
					name: '上新时间',
					sortorder: '', //0：倒序；1:为顺序
					sortname: 4,
					isSortorder: true,
					active: false
				}
			],
			Sorttype: 0, //排序类型0-默认，1人气，2价格，3销量，4上新
			SortOrder: '' //排序方式0-升序，1降序
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.BannerList(18);
		this.getnewpro();
		this.getprolist();
	},
	methods: {
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
		changeSwiper(e) {
			this.currentSwiper = e.detail.current;
		},
		//跳转
		tolink(Url) {
			uni.navigateTo({
				url: Url
			});
		},
		goDetail(id) {
			uni.navigateTo({
				url: '/pages/goods/productDetail/productDetail?proId=' + id
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
		//分类商品列表
		async getprolist() {
			let result = await post('Goods/GoodsList', {
				page: this.page,
				pageSize: this.pageSize,
				IsNew: 1,
				IsRecommend: 1,
				Sort: this.Sorttype,
				Order: this.SortOrder
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
		},
		shiftFilterTab(index) {
			let _this = this;
			_this.filterTab.forEach(function(item, subIndex) {
				if (subIndex === index) {
					_this.$set(item, 'active', true);
					if (item.isSortorder) {
						if (item.sortorder == '') {
							_this.$set(item, 'sortorder', '0');
						} else if (item.sortorder == '0') {
							_this.$set(item, 'sortorder', '1');
						} else {
							_this.$set(item, 'sortorder', '0');
						}
					}
				} else {
					_this.$set(item, 'active', false);
					_this.$set(item, 'sortorder', '');
				}
			});
			_this.Sorttype = _this.filterTab[index].sortname;
			if (_this.filterTab[index].isSortorder) {
				_this.SortOrder = _this.filterTab[index].sortorder;
			} else {
				_this.SortOrder = '';
			}
			_this.page = 1;
			_this.prolist = [];
			_this.noDataIsShow = false;
			_this.isLoad = false;
			_this.loadingType = 0; //0加载前，1加载中，2没有更多了
			_this.getprolist();
		},
		getheight() {
			let _this = this;
			let query = uni.createSelectorQuery();
			query
				.select('#filter')
				.boundingClientRect(res => {
					//获取元素距离页面顶部高度
					_this.filtertop = res.top;
				})
				.exec();
		}
	},
	onPageScroll(e) {
		this.getheight();
		if (this.filtertop < 44) {
			this.isfixed = true;
		} else {
			this.isfixed = false;
		}
	},
	onPullDownRefresh() {
		this.page = 1;
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
