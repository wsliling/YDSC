<template>
	<view class="pp3">
		<view class="pinList product-list-level" v-if="hasData">
			<block v-for="(item,index) in prolist" :key="index">
			<view class="outside uni-mb10 uni-bg-white b_radius" @click="tolink('/pages/goods/productDetail/productDetail?proId='+item.ProductId)">
				<view class="pictrue">
					<image :src="item.ImageNo||'http://via.placeholder.com/800x800'" mode="aspectFill"></image>
				</view>
				<view class="txtBox">
					<view>
						<view class="title uni-ellipsis2">{{item.Title}}</view>
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
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<noData :isShow="noDataIsShow"></noData>
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
				prolist:[],
				page:1,
				pageSize:8,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
			}
		},
		onLoad() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.getprolist();
		},
		methods: {
			//跳转
			tolink(Url){
				uni.navigateTo({
					url: Url
				})
			},
			async getprolist(){
				let result = await post("GroupBuy/GetGroupProductList", {
				page: this.page,
				pageSize: this.pageSize
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

<style>

</style>
