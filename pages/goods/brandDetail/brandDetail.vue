<template>
	<view>
		<!-- 轮播 -->
		<view class="index_swiper">
			<view class="swiper" v-if="brandImg">
				<view class="swiper-item pd15" @click="tolink(ExternalLink)">
					<image class="img" :src="brandImg" mode="aspectFill"></image>
				</view>
			</view>
			<block v-else>
				<swiper class="swiper" :indicator-dots="false" autoplay :interval="5000" :duration="500" @change="changeSwiper">
					<swiper-item v-for="(banner,index) in Bannerlist" :key="index">
						<view class="swiper-item pd15" @click="tolink(banner.Url)">
							<image class="img" :src="banner.Pic" mode="aspectFill"></image>
						</view>
					</swiper-item>
				</swiper>
				<view class="dots" style="bottom: 18px;">
					<view v-for="(item,index) in Bannerlist.length" :key="index" :class="['dot',currentSwiper==index?'active':'']"></view>
				</view>
			</block>
		</view>
		<view id="filter" class="pd15">
			<view :class="['filterMenu b_radius',isfixed?'scroll':'']">
				<view class="menu flex-between center">
					<view class="item" :class="{'active':item.active}" @click="shiftFilterTab(index)" v-for="(item,index) in filterTab"
					 :key="index">{{item.name}}<text v-if="item.isSortorder" class="filterBtn" :class="{'upBtn':item.sortorder==1,'downBtn':item.sortorder==0}"></text></view>
				</view>
			</view>
			<view class="product-list-level" v-if="hasData">
				<block v-for="(item,index) in prolist" :key="index">
				<view class="outside uni-mb10 uni-bg-white b_radius" @click="tolink('/pages/goods/productDetail/productDetail?proId='+item.Id)">
					<view class="pictrue">
						<image :src="item.PicNo||'http://via.placeholder.com/800x800'" mode="aspectFill"></image>
					</view>
					<view class="txtBox">
						<view>
							<view class="title uni-ellipsis2">{{item.Name}}</view>
							<view class="flex">
								<view class="tag tag-zy">自营</view>
							</view>
						</view>
						<view class="pronumber flex-between">
							<view>
								<text class="price"><text class="fz12">￥</text>{{item.Price}}</text>
								<text class="oldprice" v-if="item.MarketPrice>item.Price">￥{{item.MarketPrice}}</text>
							</view>
							<view class="opentuan" >立即购买</view>
						</view>
					</view>
				</view>
				</block>
			</view>
			<view class="uni-tab-bar-loading" v-if="hasData">
				<uni-load-more :loadingType="loadingType"></uni-load-more>
			</view>
			<noData :isShow="noDataIsShow"></noData>
		</view>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	export default {
		components: {
			noData,
			uniLoadMore
		},
		data() {
			return {
				userId: "",
				token: "",
				headTitle:'',
				brandImg:'',
				ExternalLink:'',
				Bannerlist:[],//轮播图
				currentSwiper:0,
				brandId:0,
				prolist:[],
				page:1,
				pageSize:8,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				isfixed:false,//筛选是否定位
				filtertop:0,
				filterTab: [{
						name: "综合",
						sortname: 0,
						isSortorder: false,
						active: true
					},
					{
						name: "价格",
						sortorder: "", //0-升序，1降序
						sortname: 2,
						isSortorder: true,
						active: false
					},
					{
						name: "销量",
						sortorder: "", //0-升序，1降序
						sortname: 3,
						isSortorder: true,
						active: false
					},
					{
						name: "新品",
						sortorder: "", //0-升序，1降序
						sortname: 4,
						isSortorder: true,
						active: false
					}
				],
				Sorttype:0,//排序类型0-默认，1人气，2价格，3销量，4上新
				SortOrder:'',//排序方式0-升序，1降序
			};
		},
		onLoad(e) {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.headTitle=e.keystr;
			this.brandId=e.id;
			this.brandImg=e.brandImg;
			this.ExternalLink=e.Link;
			this.BannerList(4);
			this.getprolist();
			uni.setNavigationBarTitle({
				title: this.headTitle+'品牌闪购专场'
			})
		},
		onShow() {
			
		},
		methods: {
			//轮播图
			async BannerList(type){
				//顶级分类
				let result = await post("Banner/BannerList",{
					Cid:type
				});
				if (result.code === 0) {
					this.Bannerlist = result.data;
				}
			},
			changeSwiper(e){
				this.currentSwiper=e.detail.current;
			},
			//跳转
			tolink(Url){
				uni.navigateTo({
					url: Url
				})
			},
			//分类商品列表
			async getprolist(){
				let result = await post("Goods/GoodsList", {
				page: this.page,
				pageSize: this.pageSize,
				BrandId:this.brandId,
				Sort:this.Sorttype,
				Order:this.SortOrder
				});
				if(result.code==0){
					if (result.data.length > 0){
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
					this.prolist = this.prolist.concat(
						result.data
					);
				}
				if (result.data.length <this.pageSize) {
					this.isLoad = false;
					this.loadingType = 2;
				} else {
					this.isLoad = true;
					this.loadingType = 0
				} 
			},
			shiftFilterTab(index) {
				let _this = this;
				_this.filterTab.forEach(function(item, subIndex) {
					if (subIndex === index) {
						_this.$set(item, 'active', true);
						if (item.isSortorder) {
							if (item.sortorder == "") {
								_this.$set(item, 'sortorder', "0");
							} else if (item.sortorder == "0") {
								_this.$set(item, 'sortorder', "1");
							} else {
								_this.$set(item, 'sortorder', "0");
							}
						}
					} else {
						_this.$set(item, 'active', false);
						_this.$set(item, 'sortorder', "");
					}
				});
				_this.Sorttype = _this.filterTab[index].sortname;
				if (_this.filterTab[index].isSortorder) {
					_this.SortOrder = _this.filterTab[index].sortorder;
				} else {
					_this.SortOrder = "";
				}
				 _this.page = 1;
				_this.prolist = [];
				_this.noDataIsShow = false;
				_this.isLoad = false;
				_this.loadingType = 0; //0加载前，1加载中，2没有更多了
				_this.getprolist();
			},
			getheight(){
				let _this=this;
				let query = uni.createSelectorQuery();
				query.select('#filter').boundingClientRect(res => { //获取元素距离页面顶部高度
				  _this.filtertop=res.top;
				}).exec()
			}
		},
		onPageScroll(e){
			this.getheight();
			if(this.filtertop<44){
				this.isfixed=true;
			}else{
				this.isfixed=false;
			}
		},
		onPullDownRefresh(){
			this.page=1;
			this.Sorttype=0;
			this.SortOrder='';
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
	}
</script>

<style lang="scss" scoped>
	@import  "./style";
</style>
