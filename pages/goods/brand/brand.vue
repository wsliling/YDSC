<template>
	<view>
		<!-- 轮播 -->
		<view class="index_swiper">
			<view class="boxradius"></view>
			<swiper class="swiper" :indicator-dots="false" autoplay :interval="5000" :duration="500" @change="changeSwiper">
				<swiper-item v-for="(banner,index) in Bannerlist" :key="index">
					<view class="swiper-item pd15" @click="tolink(banner.Url)">
						<image class="img" :src="banner.Pic" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="dots" style="bottom: 10px;">
				<view v-for="(item,index) in Bannerlist.length" :key="index" :class="['dot',currentSwiper==index?'active':'']"></view>
			</view>
		</view>
		<view class="pd15">
			<view class="Yi-hd flex-between">
				<view class="title">
					<text>优质品牌特卖</text>
				</view>
				<view class="more flex-end"><text class="iconfont icon-gou" style="font-size: 28upx; margin-right: 4upx;"></text>精选品牌
				</view>
			</view>
			<view class="BrandList">
				<view class="brand-item uni-bg-white b_radius uni-mb10" v-for="(item,index) in datalist" :key="index">
					<view class="brandimg" @click="tolink('/pages/goods/brandDetail/brandDetail?id='+item.Id+'&keystr='+item.Name+'&brandImg='+item.Pic+'&Link='+item.ExternalLink)">
						<image :src="item.Pic||'http://via.placeholder.com/690x300'" mode="aspectFill"></image>
					</view>
					<view class="probox flex" v-if="item.prolist">
						<block v-for="(item2,index2) in item.prolist" :key="index2">
							<view class="proitem" @click="tolink('/pages/goods/productDetail/productDetail?proId='+item2.Id)">
								<view class="imgbox">
									<image :src="item2.PicNo||'http://via.placeholder.com/800x800'" mode="aspectFill"></image>
								</view>
								<view class="txtbox flex-center">
									<view><text class="price"><text class="fz12">￥</text>{{item2.Price}}</text><text class="oldprice" v-if="item2.MarketPrice>item2.Price">￥{{item2.MarketPrice}}</text></view>
								</view>
							</view>
						</block>
					</view>
				</view>
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
				Bannerlist:[],//轮播图
				currentSwiper:0,
				page:1,
				pageSize:8,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				datalist:[]
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.BannerList(4);
			this.getBrandList();
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
			//获取品牌
			getBrandList(){
				post('Goods/BrandList',{
					IsRec:1
				}).then(res=>{
					if(res.code==0){
						if(res.data.length){
							this.noDataIsShow=false;
							let _this=this;
							res.data.forEach(function(item){
								let proarr=[];
								post('Goods/GoodsList',{
									page: 1,
									pageSize: 3,
									BrandId:item.Id,
								}).then(result=>{
									if(result.code==0){
										if (result.data.length > 0){
											proarr=result.data;
											_this.$set(item,"prolist",proarr)
										}
									}
								})	
							})
							this.datalist=res.data;
						}else{
							this.noDataIsShow=true;
						}
					}
				})
			},
			
		},
		onPullDownRefresh(){
			this.BannerList(1);
			this.getBrandList();
			uni.stopPullDownRefresh();
		},
		// 上拉加载
		onReachBottom: function() {
			// if (this.isLoad) {
			// 	this.loadingType = 1;
			// 	this.page++;
			// 	this.getprolist();
			// } else {
			// 	this.loadingType = 2;
			// }
		}
	}
</script>

<style lang="scss" scoped>
	@import  "./style";
</style>
