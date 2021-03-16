<template>
	<view>
		<view class="nav flex-between" :style="{ 'padding-top': barHeight + 'px' }">
			<view class="nav-left">
				<view :class="[tabNav==2?'active':'']" @click="tapNav(2)">最新</view>
				<view :class="[tabNav==4?'active':'']" @click="tapNav(4)">推荐</view>
				<view :class="[tabNav==1?'active':'']" @click="tapNav(1)">关注</view>
				<view :class="[tabNav==3?'active':'']" @click="tapNav(3)">附近</view>
			</view>
		</view>
		<view :style="{ height: barHeight + 44 + 'px' }"></view>
		<view class="list uni-bg-white uni-mt10" v-if="hasData">
			<block v-for="(item,index) in datalist" :key="index">
				<mediaList :datajson="item" Grid="2" @click="goDetail" @previewImg="previewImg"></mediaList>
			</block>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<noData :isShow="noDataIsShow"></noData>
		<view @click="tolink('/pages/personal/artPost/artPost','login')" class="uploadbtn flex-column"><text class="uni-icon uni-icon-plusempty"></text></view>
	</view>
</template>

<script>
	import {post,get,toLogin,dateUtils} from '@/common/util.js';
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
				barHeight: 0,
				tabNav:2,
				datalist: [],
				page: 1,
				pageSize: 8,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
			}
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.FindList();
		},
		onLoad() {
			// #ifdef APP-PLUS
			var height = plus.navigator.getStatusbarHeight();
			this.barHeight = height;
			// #endif
			// #ifdef H5
			this.barHeight = 0;
			// #endif
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
			tapNav(type){
				this.tabNav=type;
				this.hasData=false;
				this.noDataIsShow=false;
				this.page=1;
				this.datalist=[];
				this.FindList();
			},
			/*获取动态列表*/
			async FindList() {
				let result = await post("Find/FindList", {
					"UserId": uni.getStorageSync("userId"),
					"Token": uni.getStorageSync("token"),
					"Page": this.page,
					"PageSize":this.pageSize,
					"myType": this.tabNav,
					// "MemberId": "",
					// "SearchKey": ""
				});
				if (result.code === 0) {
					let _this=this;
					if (result.data.length > 0) {
						this.hasData = true;
						this.noDataIsShow = false;
						result.data.forEach(function(item) {
							item.Addtime=dateUtils.format(item.Addtime);
						})
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
					if (result.data.length <this.pageSize) {
						this.isLoad = false;
						this.loadingType = 2;
					} else {
						this.isLoad = true;
						this.loadingType = 0
					}
				}
			},
			//预览图片
			previewImg(obj){
				uni.previewImage({
					current:obj.imgurls[obj.index],
					urls: obj.imgurls,
					indicator:obj.imgurls.length
				});
			},
			//链接动态详情页
			goDetail(e) {
				// if(e.artType==0){//用户发布详情
					uni.navigateTo({
						url:'/pages/personal/replylist/replylist?id='+e.id
					})
				// }else{
				// 	uni.navigateTo({
				// 		url:'/pages/personal/NewsDetail/NewsDetail?id='+e.id
				// 	})
				// }
			},
		},
		onPullDownRefresh() {
			this.page = 1;
			this.datalist=[];
			this.FindList();
			uni.stopPullDownRefresh();
		},
		// 上拉加载
		onReachBottom: function() {
			if (this.isLoad) {
				this.loadingType = 1;
				this.page++;
				this.FindList();
			} else {
				this.loadingType = 2;
			}
		}
	}
</script>

<style lang="scss">
.nav {
	width: 100%;
	padding: 0 20upx;
	position: fixed;
	top: 0;
	z-index: 12;
	background: #ffffff;
   .redact{
		height: 88upx;
		line-height: 88upx;
		view{
			font-size: 50upx;
		}
	}
	.nav-left{
		display: flex;
		align-items: center;
		height: 88upx;
		view{
			font-family: PingFangSC-Regular, sans-serif;
			width: 110upx;
			color: #999999;
			font-size: 30upx;
			height: 100%;
			line-height: 88upx;
			text-align: center;
			&.active{
				font-size: 38upx;
				color: #000;
				font-weight: 600;
				position: relative;
			}
			&.active::before{
				content: '';
				width: 50upx;
				height: 4upx;
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translate(-50%,50%);
				border-radius: 20upx;
				background-color: #000;
			}
		}
	}
}
.uploadbtn{
	position: fixed;
	right: 20upx;
	bottom: 20upx;
	/* #ifdef H5 */
	bottom: 160upx;
	/* #endif */
	width: 100upx;
	height: 100upx;
	line-height:1;
	color: #fff;
	font-size: 22upx;
	background: $primary;
	border-radius: 50%;
	box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.2);
	z-index: 9;
	.uni-icon{
		font-weight: bold;
		font-size: 64upx;
		line-height: .8;
	}
	.icon{
		display: block;
		height: 40upx;
		width: 40upx;
		margin-bottom: 8upx;
	}
}
</style>
