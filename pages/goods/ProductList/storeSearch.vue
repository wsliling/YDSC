<template>
	<view>
		<uni-nav-bar fixed="true" color="#333" background-color="#fff" left-icon="arrowleft" @clickLeft="back" :border="false">
			<block slot="center" class="flex1">
			<view class="input-view" style="background: #f2f2f2; border-radius: 100px;">
				<uni-icons class="input-uni-icon" type="search" size="22" color="#b8b8b8" />
				<input confirm-type="search" class="nav-bar-input flex1" type="text" placeholder="店内搜索" v-model="searchVal" @confirm="confirm">
				<view v-if="searchVal!==''" class="uni-searchbar__box-icon-clear" @click="clear">
					<uni-icons color="#999999" class="" size="18" type="clear" />
				</view>
			</view>
			</block>
			<block slot="right">
				<view class="uni-navbar-btn-text uni-navbar__content_view" @click="confirm"><text class="uni-nav-bar-right-text">搜索</text></view>
			</block>
		</uni-nav-bar>
		<view id="filter">
			<view :class="['filterMenu pd15',isfixed?'scroll':'']">
				<view class="menu flex-between center">
					<view class="item" :class="{'active':item.active}" @click="shiftFilterTab(index)" v-for="(item,index) in filterTab"
					 :key="index">{{item.name}}<text v-if="item.isSortorder" class="filterBtn" :class="{'upBtn':item.sortorder=='0','downBtn':item.sortorder=='1'}"></text></view>
					<view class="item" @click="showDrawer('showRight')">筛选<text class="iconfont icon-filter" style="color: #999;"></text></view>
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
				<noData :isShow="noDataIsShow" :tips="'暂无搜索数据'"></noData>
			</view>
		</view>
		<!-- 筛选 -->
		<uni-drawer ref="showRight" mode="right" :mask-click="true" @change="change($event,'showRight')">
			<view class="scroll-view">
				<scroll-view class="scroll-view-box" scroll-y="true">
					<view class="info-content" :style="{paddingTop:barHeight+'px'}">
						<view class="filterPrice uni-pd10">
							<view class="title uni-mb10">价格区间</view>
							<view class="inputPrice flex">
								<view class="flex1 inputBox flexItem">
									<input type="number" class="weui-input" v-model="minPrice" placeholder="最低价">
								</view>
								<view class="flexItem line__flexItem"></view>
								<view class="flex1 inputBox flexItem">
									<input type="number" class="weui-input" v-model="maxPrice" placeholder="最高价">
								</view>
							</view>
						</view>
						<view class="filterTypeList" v-if="pageCon==1">
							<view class="uni-list-cell flex-column" @click="shiftbrandDown('分类')">
								<view class="uni-list-cell-navigate uni-navigate-bottom" :class="[classlyShow?'active':'']">
									<view class="title">分类</view>
									<view class="uni-list-cell-r fz12" style="margin-right: 30upx;">
										全部
									</view>
								</view>
								<view class="tagList li_33 clear" :class="{'show':classlyShow}">
									<view class="item" v-for="(item2,index2) in classlylist" :key="index2">
										<view class="s uni-ellipsis" :class="{'active':cIndex===index2||cid==item2.Id}" @click.stop="selected(index2,'分类')">{{item2.ClassName}}</view>
									</view>
								</view>
							</view>
						</view>
						<view class="filterTypeList" v-if="false">
							<view class="uni-list-cell flex-column" @click="shiftbrandDown('品牌')">
								<view class="uni-list-cell-navigate uni-navigate-bottom" :class="[brandShow?'active':'']">
									<view class="title">品牌</view>
									<view class="uni-list-cell-r fz12" style="margin-right: 30upx;">
										全部
									</view>
								</view>
								<view class="tagList li_33 clear" :class="{'show':brandShow}">
									<view class="item" v-for="(item2,index2) in BrandList" :key="index2">
										<view class="s uni-ellipsis" :class="{'active':bIndex===index2}" @click.stop="selected(index2,'品牌')">{{item2.Name}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="filter_ft flex center">
						<view class="btn" style="background: #ededed;" @click="resetFilter">重置</view>
						<view class="btn" style="background: #FF3333;color:#fff;" @click="sureFilter">确定</view>
					</view>
				</scroll-view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
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
				barHeight:0,
				searchVal:"",
				userId: "",
				token: "",
				cid:'',//分类id
				ShopId:"",
				typeId:"",
				classlylist:[],
				prolist:[],
				page:1,
				pageSize:8,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: true,
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
					}
				],
				showRight: false,
				minPrice: "", //筛选最小单价
				maxPrice: "", //筛选最大单价
				classlyShow:false,
				brandShow:false,
				cIndex:-1,
				bIndex:-1,
				Sorttype:0,//排序类型0-默认，1人气，2价格，3销量，4上新
				SortOrder:'',//排序方式0-升序，1降序
				BrandList:[],//品牌
				brandId:0,//选中品牌id
			}
		},
		watch: {
			searchVal() {
				this.$emit("input", {
					value: this.searchVal
				})
			}
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.pageCon=uni.getStorageSync("pageCon");
		},
		onLoad(e) {
			// #ifdef APP-PLUS
			this.barHeight = plus.navigator.getStatusbarHeight();
			// #endif
			// #ifdef H5
			this.barHeight = 0;
			// #endif
			this.ShopId=e.shopid||'';
			this.cid=e.cid||'';
			this.typeId=e.tid||'';
			this.getclassly();
			if(this.cid||this.typeId){
				this.getprolist()
			}
			//this.getBrandList();
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			clear() {
				this.searchVal = ""
				this.getprolist();
			},
			confirm() {
				// #ifndef APP-PLUS
				uni.hideKeyboard();
				// #endif
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
				if(this.searchVal){
					this.page=1;
					this.getprolist();
				}else{
					uni.showToast({
						title:"请输入搜索内容",
						icon:'none'
					})
				}
			},
			//获取分类
			async getclassly(){
				let result = await post("Goods/GetProductClass", {
					parentId: '',
					ShopId:this.ShopId
				});
				if(result.code==0){
					if(result.data.length){
						this.classlylist=result.data;
					}
				}
			},
			//获取品牌
			getBrandList(){
				post('Goods/BrandList',{}).then(res=>{
					if(res.code==0){
						this.BrandList=res.data;
					}
				})
			},
			// 打开窗口
			showDrawer(e) {
				this.$refs[e].open();
			},
			// 关闭窗口
			closeDrawer(e) {
				this.$refs[e].close();
			},
			// 抽屉状态发生变化触发
			change(e, type) {
				this[type] = e
			},
			shiftbrandDown(str){
				if(str=="分类"){
					this.classlyShow=!this.classlyShow;
				}else if(str=="品牌"){
					this.brandShow=!this.brandShow;
				}
			},
			selected(index,str){
				if(str=="分类"){
					this.cIndex=index;
				}else if(str=="品牌"){
					this.bIndex=index;
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
						Keywords:this.searchVal,
						TypeId:this.typeId,
						ShopClassId:this.cid,
						BrandId:this.brandId,
						Sort:this.Sorttype,
						Order:this.SortOrder,
						MinPrice:this.minPrice,
						MaxPrice:this.maxPrice,
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
				},
			//点击重置的时候
			resetFilter() { 
				let _this = this;
				_this.minPrice = "";
				_this.maxPrice = "";
				_this.cIndex=-1;
				_this.bIndex=-1;
				_this.cid="";
			},
			sureFilter(){
				//筛选
				this.cid=this.cIndex>-1?this.classlylist[this.cIndex].Id:'';
				this.brandId=this.bIndex>-1?this.BrandList[this.bIndex].Id:'';
				this.page=1;
				this.getprolist();
				this.closeDrawer('showRight')
			},
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
			// this.searchVal = "";
			// this.cid='';
			// this.brandId='';
			// this.Sorttype=0;
			// this.SortOrder='';
			if(this.searchVal||this.cid||this.couponId||this.brandId||this.minPrice||this.maxPrice||this.SortOrder){
				this.getprolist();
			}
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
		},
		// app端拦截返回事件 ，仅app端生效
		onBackPress() {
			if (this.showRight) {
				this.$refs.showRight.close()
				return true
			}
		}
	}
</script>

<style lang="scss">
/* 处理抽屉内容滚动 */
	.scroll-view-box {
		flex: 1;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		.weui-input{
			height: 70upx;
			line-height: 70upx;
		}
	}
	.filter_ft{
		width: 100%;
		height: 90upx;
		position: fixed;
		bottom: 0;
		left: 0;
		.btn{
			width: 50%;
			height: 90upx;
			line-height: 90upx;
			font-size: 30upx;
		}
	}
</style>
