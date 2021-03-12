<template>
	<view>
		<uni-nav-bar fixed="true" color="#ffffff" background-color="#83c7db" left-icon="scan" @clickLeft="scan" :border="false">
			<block slot="center" class="flex1">
				<view class="input-view" @click="tolink('/pages/goods/ProductList/ProductList')">
					<uni-icons class="input-uni-icon" type="search" size="22" color="#b8b8b8" />
					<input confirm-type="search" disabled="" class="nav-bar-input" type="text" placeholder="输入搜索关键词">
				</view>
			</block>
			<block slot="right">
				<view class="iconfont icon-cart1 p_re" style="color: #fff; font-size: 22px;" @click="tolink('/pages/goods/cart/cart')"><text class="uni-badge" v-if="CartNum>0">{{CartNum>99?'99+':CartNum}}</text></view>
			</block>
		</uni-nav-bar>
		<!-- <view :style="{height:(44+barHeight)+'px'}"></view> -->
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
			<view class="Severs flex-between uni-bg-white pd15">
				<view class="item">
					<text class="iconfont icon-zp"></text>100%正品
				</view>
				<view class="item">
					<text class="iconfont icon-baoyou"></text>88元包邮
				</view>
				<view class="item">
					<text class="iconfont icon-th"></text>退换无忧
				</view>
			</view>
			<view class="icon-menu li_20 uni-bg-white pd15 uni-mb10" v-if="pageCon==1">
				<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0">
					<block v-for="(item,index) in categoryList" :key="index">
						<view class="item" @click="tolink('/pages/goods/secondlist/secondlist?id='+item.Id+'&keystr='+item.Name)">
							<image class="icon" :src="item.Pic||'http://xcx.yixijiu19.com/static/60x60.png'"></image>
							<text class="txt">{{item.Name}}</text>
						</view>
					</block>
				</scroll-view>
			</view>
			<!-- 每日上新 -->
			<view class="page-section HotsellList uni-bg-white pd15 uni-mb10" v-if="newprolist.length">
				<view class="Yi-hd flex-between">
					<view class="title">
						<text>每日上新</text>
					</view>
					<view class="more" @click="tolink('/pages/goods/newpro/newpro')">更多<text class="arrow uni-icon uni-icon-arrowright"></text>
					</view>
				</view>
				<view class="uni-bd">
					<scroll-view class="scroll-view_H Hotsell-list" scroll-x="true" scroll-left="0">
						<view class="scroll-view-item_H" v-for="(item,index) in newprolist" :key="index">
							<view class="itembox" @click="tolink('/pages/goods/productDetail/productDetail?proId='+item.Id)">
								<view class="image-view">
									<image class="img" :src="item.PicNo||'http://via.placeholder.com/800x800'" mode="aspectFill"></image>
								</view>
								<view class="porductname uni-center">{{item.Name}}</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<!-- 专题 -->
			<view class="page-section BrandList uni-bg-white uni-mb10" v-if="pageCon==1">
				<view class="live_list flex flexWrap">
					<view class="live_item" @click="tolink('/pages/goods/findpro/findpro')">
						<view class="titbox">
							<text>发现好货</text><image src="http://xcx.yixijiu19.com/static/indexlive1.png"></image>
						</view>
						<view class="txt" style="color: #1fded6;">美好新生活</view>
						<view class="imgbox flex-between"> 
							<image :src="ztimg[0]||'http://xcx.yixijiu19.com/static/of/3.png'" mode=""></image>
							<image :src="ztimg[1]||'http://xcx.yixijiu19.com/static/of/3.png'" mode=""></image>
						</view>
					</view>
					<view class="live_item" @click="tolink('/pages/liveplay/live','login')">
						<view class="titbox">
							<text>亿喜直播</text><image src="http://xcx.yixijiu19.com/static/indexlive2.png"></image>
						</view>
						<view class="txt" style="color: #f95c7e;">好物亲测评</view>
						<view class="imgbox flex-between">
							<image :src="ztimg[2]||'http://xcx.yixijiu19.com/static/of/3.png'" mode=""></image>
							<image :src="ztimg[3]||'http://xcx.yixijiu19.com/static/of/3.png'" mode=""></image>
						</view>
					</view>
					<view class="live_item" @click="tolink('/pages/goods/brand/brand')">
						<view class="titbox">
							<text>品牌闪购</text><image src="http://xcx.yixijiu19.com/static/indexlive3.png"></image>
						</view>
						<view class="txt" style="color: #8d56f2;">享惊喜折扣</view>
						<view class="imgbox flex-between">
							<image :src="ztimg[4]||'http://xcx.yixijiu19.com/static/of/3.png'" mode=""></image>
							<image :src="ztimg[5]||'http://xcx.yixijiu19.com/static/of/3.png'" mode=""></image>
						</view>
					</view>
					<view class="live_item" @click="tolink('/pages/goods/limitpro/limitpro')">
						<view class="titbox">
							<text>限时购</text><image src="http://xcx.yixijiu19.com/static/indexlive4.png"></image>
						</view>
						<view class="txt" style="color: #eb4cbb;">爆款限时限量抢</view>
						<view class="imgbox flex-between">
							<image :src="ztimg[6]||'http://xcx.yixijiu19.com/static/of/3.png'" mode=""></image>
							<image :src="ztimg[7]||'http://xcx.yixijiu19.com/static/of/3.png'" mode=""></image>
						</view>
					</view>
				</view>
			</view>
			<!-- 拼团 -->
			<view class="page-section pinList uni-bg-white pd15 uni-mb10" v-if="pageCon==1&&Groupprolist.length">
				<view class="Yi-hd flex-between">
					<view class="title">
						<text>拼团</text>
					</view>
					<view class="more" @click="tolink('/pages/goods/pinpro/pinpro')">更多<text class="arrow uni-icon uni-icon-arrowright"></text>
					</view>
				</view>
				<block v-for="(item,index) in Groupprolist" :key="index">
					<view class="outside flex-between" @click="tolink('/pages/goods/productDetail/productDetail?proId='+item.ProductId)">
						<view class="pictrue">
							<image :src="item.ImageNo||'http://via.placeholder.com/800x800'" mode="aspectFill"></image>
						</view>
						<view class="txtBox flex1">
							<view>
								<view class="title uni-ellipsis">{{item.Title}}</view>
								<view class="flex">
									<view class="pininfo"><view class="led">已拼{{item.SuccessGroup}}件</view><view class="rnum">{{item.MinPeopleNum}}人团</view></view>
								</view>
							</view>
							<view class="pronumber flex-between">
								<view><text class="price"><text class="fz12">￥</text>{{item.FightingPrice}}</text><text class="oldprice">￥{{item.OriginalPrice}}</text></view>
								<view class="opentuan" >去开团</view>
							</view>
						</view>
					</view>
				</block>
			</view>
			<!-- 猜你喜欢 -->
			<view class="areapro">
				<view class="tabbox" v-if="pageCon==1">
					<view :class="['tab-item',tabIndex==index ? 'active' : '']" v-for="(tab,index) in tablist" :key="index" @click="tapTab(index,tab.Id)">
						<view class="tabtitle">{{tab.Name}}</view>
						<view class="tabtips">{{tab.Intro}}</view>
						<view class="bb"></view>
						<view class="br"></view>
					</view>
				</view>
				<view :class="['pd15',pageCon==2?'uni-mt10':'']">
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
		</view>
		
	</view>
</template>

<script>
	import {post,get,toLogin,webUrl} from '@/common/util.js';
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
				pageCon:0,
				userId: "",
				token: "",
				barHeight:0,
				Bannerlist:[],//轮播图
				currentSwiper:0,
				CartNum:0,//购物车数量
				categoryList:[],//类型
				newprolist:[],//新品
				Groupprolist:[],//拼团产品
				tabIndex:0,
				TypeId:0,
				tablist:[
					{
						Name:"推荐",
						Intro:"猜你喜欢",
						Id:0
					}
				],
				prolist:[],
				page:1,
				pageSize:8,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				ztimg:[],//专题小图
			}
		},
		onLoad() {
			this.pageCon=uni.getStorageSync("pageCon");
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			// #ifdef APP-PLUS
			this.barHeight = plus.navigator.getStatusbarHeight();
			// #endif
			this.BannerList(2);
			this.BannerList(5);
			this.getTypeList();
			this.getnewpro();
			this.getGrouppro();
			this.getprolist();
		},
		onShow() {
			this.pageCon=uni.getStorageSync("pageCon");
			this.getCartNum();
		},
		methods: {
			//跳转
			tolink(Url,islogin) {
				if(islogin=="login"){
					if(toLogin()){
						uni.navigateTo({
							url: Url
						})
					}
				}else{
					uni.navigateTo({
						url: Url
					})
				}
			},
			// 扫一扫
			scan() {
				uni.scanCode({
				    success: function (res) {
						 let url=res.result.split('#')[1];
						 if(res.scanType=="QR_CODE"){
							 uni.navigateTo({
							 	url:url
							 })
						 }
				        console.log('条码类型：' + res.scanType);
				        console.log('条码内容：' + res.result);
				    }
				});
			},
			//轮播图
			async BannerList(type){
				//顶级分类
				let result = await post("Banner/BannerList",{
					Cid:type
				});
				if (result.code === 0) {
					if(type==2){
						this.Bannerlist = result.data;
					}else if(type==5){
						let _this=this;
						result.data.forEach(function(item,index){
							_this.ztimg.push(item.Pic)
						})
					}
				}
			},
			changeSwiper(e){
				this.currentSwiper=e.detail.current;
			},
			//获取购物车数量
			async getCartNum(){
				let result = await post("Cart/GoodsCartNum", {
					UserId: uni.getStorageSync("userId"),
					Token: uni.getStorageSync("token")
				});
				if(result.code==0){
					this.CartNum=result.data.Count;
				}else{
					uni.hideToast()
				}
			},
			// 产品类型
			getTypeList(){
				post('Goods/TypeList',{}).then(res=>{
					if(res.code==0){
						this.categoryList=res.data;
						this.tablist=this.tablist.concat(res.data).slice(0,5);
					}
				})
			},
			//获取上新产品
			async getnewpro(){
				let result = await post("Goods/GoodsList", {
					page: 1,
					pageSize: 10,
					IsNew:1
				});
				if(result.code==0){
					if (result.data.length > 0){
						this.newprolist=result.data;
					}
				}
			},
			//获取拼团列表
			async getGrouppro(){
				let result = await post("GroupBuy/GetGroupProductList", {
					page: 1,
					pageSize: 2
				});
				if(result.code==0){
					if (result.data.length > 0){
						this.Groupprolist=result.data;
					}
				}
			},
			
			tapTab(index,id){
				if (this.tabIndex === index) {
					return false;
				} else {
					this.tabIndex = index;
					this.TypeId=id;
					this.page=1;
					this.getprolist();
				}
			},
			goDetail(id){
				uni.navigateTo({
					url: '/pages/goods/productDetail/productDetail?proId='+id
				})
			},
			//分类商品列表
			async getprolist(){
				let result = await post("Goods/GoodsList", {
					UserId: uni.getStorageSync("userId"),
					Token: uni.getStorageSync("token"),
					page: this.page,
					pageSize: this.pageSize,
					TypeId:this.TypeId,
					IsLike:this.TypeId?0:1
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
		},
		onPullDownRefresh(){
			this.page=1;
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
	}
</script>

<style lang="scss" scoped>
	@import "./style";
</style>
