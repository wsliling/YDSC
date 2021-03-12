<template>
	<view>
		<uni-nav-bar fixed="true" color="#333333" background-color="#ffffff" title="品牌好物" :border="false">
			<block slot="right">
				<view  v-if="pageCon==1" @click="torelease" class="iconfont icon-shipin" style="color: #333333; font-size: 24px;"></view>
			</block>
		</uni-nav-bar>
		<view v-if="pageCon==1">
			<view class="story flex-between" v-if="hasData">
				<view class="left-list" style="padding-right: 8upx;">
					<block v-for="(item,index) in datalist" :key="index">
						<view class="story-item" v-if="index%2==0" @click="todetails(item.Id)">
							<image class="storyimg" :src="item.Logo||'http://via.placeholder.com/800x800'" mode="widthFix"></image>
							<view class="story-mark">
								<view class="tag">视频同款</view>
								<view class="info">
									<view class="info_l flex flex1">
										<image class="homeimg" :src="item.Avatar||'http://xcx.yixijiu19.com/static/default.png'" mode="aspectFill"></image>
										<view class="fw uni-ellipsis">{{item.NickName||'匿名用户'}}</view>
									</view>
									<view class="info_r flex-end" @click.stop="Likebtn(item.Id,index,item.IsLike)">
										<uni-icons :type="item.IsLike==0?'heart':'heart-filled'" :color="item.IsLike==0?'#ffffff':'#ff3333'"
										 size="20" />
										<view class="text c_fff">{{item.LikeNum}}</view>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view class="right-list" style="padding-left: 8upx;">
					<block v-for="(item,index) in datalist" :key="index">
						<view class="story-item" v-if="index%2==1" @click="todetails(item.Id)">
							<image class="storyimg" :src="item.Logo||'http://via.placeholder.com/800x800'" mode="widthFix"></image>
							<view class="story-mark">
								<view class="tag">视频同款</view>
								<view class="info">
									<view class="info_l flex flex1">
										<image class="homeimg" :src="item.Avatar||'http://xcx.yixijiu19.com/static/default.png'" mode="aspectFill"></image>
										<view class="fw uni-ellipsis">{{item.NickName||'匿名用户'}}</view>
									</view>
									<view class="info_r flex-end" @click.stop="Likebtn(item.Id,index,item.IsLike)">
										<uni-icons :type="item.IsLike==0?'heart':'heart-filled'" :color="item.IsLike==0?'#ffffff':'#ff3333'"
										 size="20" />
										<view class="text c_fff">{{item.LikeNum}}</view>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>
		<view class="staticPage pd15 uni-mt10" v-if="pageCon==2">
			<view class="uni-product-list" v-if="hasData">
				<block v-for="(item,index) in datalist" :key="index">
					<product :datajson="item" v-on:goDetail="goDetail"></product>
				</block>
			</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<noData :isShow="noDataIsShow"></noData>
	</view>
</template>

<script>
	import {
		post,
		get,
		toLogin
	} from '@/common/util.js';
	import product from '@/components/product.vue';
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
				userId: "",
				token: "",
				datalist: [],
				page: 1,
				pageSize: 8,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				isIssue:'',//是否可发布 1是，2否
				pageCon:0
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.pageCon=uni.getStorageSync("pageCon");
			this.getdatalist();
		},
		onShow() {
			this.pageCon=uni.getStorageSync("pageCon");
			this.isIssue=uni.getStorageSync("isIssue")||''
			if(uni.getStorageSync("userId")&&uni.getStorageSync("token")&&this.isIssue!=1){
				this.getisIssue();
			}
		},
		methods: {
			//跳转
			tolink(Url) {
				uni.navigateTo({
					url: Url
				})
			},
			todetails(id){
				//#ifdef H5
				uni.navigateTo({
					url:'/pages/hwDetails/hwDetails2?id='+id
				})
				//#endif
				//#ifndef H5
				uni.navigateTo({
					url:'/pages/hwDetails/hwDetails?id='+id
				})
				//#endif
			},
			//判断是否可以发布视频
			async getisIssue(){
				let result=await post('LivePreview/Preview',{
					UserId: uni.getStorageSync("userId"),
					Token: uni.getStorageSync("token")
				})
				if(result.code==7){
					uni.hideToast();
					this.isIssue=2
					uni.setStorageSync("isIssue",2)
				}else{
					uni.hideToast();
					this.isIssue=1
					uni.setStorageSync("isIssue",1)
				}
			},
			Authselect(){
				uni.showActionSheet({
					itemList:['店铺认证','网红达人认证'],
					success:async (res)=> {
					  if(res.tapIndex==0){
						  let r = await post('User/ShopAuthInfo',{
							  UserId: uni.getStorageSync("userId"),
							  Token: uni.getStorageSync("token"),
							  IsBusiness:1
						  })
						  if(r.code==0){
							  uni.navigateTo({
							  	url:'/pages/other/attest/attest2'
							  })
						  }else{
							  return
						  }
						 
					  }else{
						  let r = await post('User/SageAuthInfo',{
						  	 UserId: uni.getStorageSync("userId"),
						  	 Token: uni.getStorageSync("token")
						  })
						  if(r.code==0){
						  	 uni.navigateTo({
						  	 	url:'/pages/other/attest/attest?type=1'
						  	 })
						  }else{
						  	return
						  }
					  }
					},
					fail(res) {
					  console.log(res.errMsg);
					}
				})
			},
			torelease(){
				let _this=this;
				if(toLogin()){
					if(this.isIssue==1){
						uni.navigateTo({
							url:'/pages/release/release'
						})
					}else{
						//#ifndef APP-PLUS
						uni.showModal({
							title:'认证提示',
							content: "您还没有权限，去认证",
							confirmColor:"#FF3333",
							success(res) {
								if (res.confirm) {
									_this.Authselect()
								} else if (res.cancel) {
								}
							}
						});
						//#endif
						//#ifdef APP-PLUS
						this.$showModal({
							title:'认证提示',
							content: "您还没有权限，去认证？",
						}).then(res=>{
							_this.Authselect()
							//确认
						  }).catch(res=>{
							//取消
						  })
						//#endif
					}
				}
			},
			
			//列表
			async getdatalist() {
				let url=this.pageCon==2?"Goods/GoodsList":"News/BrandgoodsList";
				let result = await post(url, {
					UserId: uni.getStorageSync("userId"),
					Token: uni.getStorageSync("token"),
					page: this.page,
					pageSize: this.pageSize
				});
				if (result.code == 0) {
					if (result.data.length > 0) {
						this.hasData = true;
						this.noDataIsShow = false;
						result.data.forEach(function(item){
							item.Title=decodeURIComponent(item.Title);
						})
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
					this.datalist = this.datalist.concat(
						result.data
					);
				}
				if (result.data.length < this.pageSize) {
					this.isLoad = false;
					this.loadingType = 2;
				} else {
					this.isLoad = true;
					this.loadingType = 0
				}
			},
			goDetail(id){
				uni.navigateTo({
					url: '/pages/goods/productDetail/productDetail?proId='+id
				})
			},
			async Likebtn(id,index,Islike){
				let result = await post("News/BrandgoodsLikes", {
					UserId: uni.getStorageSync("userId"),
					Token: uni.getStorageSync("token"),
					Id:id
				});
				if(result.code==0){
					let _this=this;
					uni.showToast({
						title: result.msg,
						icon:'none'
					})
					let num=_this.datalist[index].LikeNum;
					if(Islike>0){
						num--
						_this.$set(_this.datalist[index],"IsLike",0)
						
					}else{
						num++
						_this.$set(_this.datalist[index],"IsLike",1)
					}
					_this.$set(_this.datalist[index],"LikeNum",num)
				}else if(result.code==2){
					uni.hideToast();
					toLogin()
				}
			},
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
	}
</script>

<style lang="scss">
	@import "./style";
</style>
