<template>
	<view class="storePage">
		<store-top v-if="hasinfo" :storeinfo="storeinfo" :navcolor="navcolor" :navbg="navbg"></store-top>
		<!-- 为你推荐 -->
		<view class="recomPro" id="filter">
			<view :class="['filterMenu pd15',isfixed?'scroll':'']">
				<view v-if="isfixed" :style="{height:barHeight+'px'}"></view>
				<view class="menu flex-between center">
					<view class="item" :class="{'active':item.active}" @click="shiftFilterTab(index)" v-for="(item,index) in filterTab"
					 :key="index">{{item.name}}<text v-if="item.isSortorder" class="filterBtn" :class="{'upBtn':item.sortorder==1,'downBtn':item.sortorder==0}"></text></view>
				</view>
			</view>
			<view class="pp3">
				<view class="uni-product-list" v-if="hasData">
					<block v-for="(item,index) in prolist" :key="index">
						<product :datajson="item" v-on:goDetail="goDetail"></product>
					</block>
				</view>
				<view class="uni-tab-bar-loading" v-if="hasData">
					<uni-load-more :loadingType="loadingType"></uni-load-more>
				</view>
				<noData :isShow="noDataIsShow"></noData>
			</view>
		</view>
		<view style="height: 100upx;"></view>
		<tabbar :current="1"></tabbar>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	import product from '@/components/product.vue';
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import tabbar from '@/components/tabbar.vue';
	import storeTop from '@/components/storeTop.vue';
	export default {
		components: {
			tabbar,
			storeTop,
			product,
			noData,
			uniLoadMore
		},
		data() {
			return {
				barHeight:0,
				userId: "",
				token: "",
				navcolor:"#fff",
				navbg:"transparent",
				ShopId:"",
				hasinfo:false,
				storeinfo:{},
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
						sortorder: "", //0：倒序；1:为顺序
						sortname: 2,
						isSortorder: true,
						active: false
					},
					{
						name: "销量",
						sortorder: "", //0：倒序；1:为顺序
						sortname: 3,
						isSortorder: true,
						active: false
					},
					{
						name: "新品",
						sortorder: "", //0：倒序；1:为顺序
						sortname: 4,
						isSortorder: false,
						active: false
					}
				],
				Sorttype:0,//排序类型0-默认，1人气，2价格，3销量，4上新
				SortOrder:'',//排序方式0-升序，1降序
			}
		},
		onLoad(e) {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			// #ifdef APP-PLUS
			this.barHeight = plus.navigator.getStatusbarHeight();
			// #endif
			// #ifdef H5
			this.barHeight = 0;
			// #endif
			this.ShopId=e.id;
			this.getShopInfo();
			this.getprolist();
		},
		methods: {
		//跳转
			tolink(Url){
				uni.navigateTo({
					url: Url
				})
			},
			goDetail(id){
				uni.navigateTo({
					url: '/pages/goods/productDetail/productDetail?proId='+id
				})
			},
			async getShopInfo(){
				let result = await post("Shop/ReadShop", {
					UserId: this.userId,
					Token: this.token,
					ShopId:this.ShopId
				});
				if(result.code==0){
					this.storeinfo=result.data;
					this.bannerlist=result.data.PicData;
					this.hasinfo=true;
				}
			},
			//分类商品列表
			async getprolist(){
				let result = await post("Goods/GoodsList", {
					page: this.page,
					pageSize: this.pageSize,
					Sort:this.Sorttype,
					Order:this.SortOrder,
					ShopId:this.ShopId
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
			let h=44+this.barHeight;
			if(e.scrollTop>h){
				this.navcolor="#333";
				this.navbg="#fff"
			}else{
				this.navcolor="#fff";
				this.navbg="transparent"
			}
			this.getheight();
			if(this.filtertop<h){
				this.isfixed=true;
			}else{
				this.isfixed=false;
			}
		},
		onPullDownRefresh(){
			this.page=1;
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

<style lang="scss">
	.storePage{
		.recomPro{
			position: relative;
			background: #f5f5f5;
			z-index: 4;
			margin-top: -220upx;
		}
	}
	.filterMenu{
		box-shadow: 0 4px 4px rgba(0,0,0,.05);
		&.scroll{
			top: 44px;
		}
	}
	
</style>
