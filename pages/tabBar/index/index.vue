
<template>
	<view>
		<view class="nav flex-between" :style="{ 'padding-top': barHeight + 'px' }">
			<block v-if="pageCon==1">
				<view class="nav-left">
					<view :class="[tabNav==1?'active':'']" @click="tapNav(1)">关注</view>
					<view :class="[tabNav==2?'active':'']" @click="tapNav(2)">精选</view>
					<view :class="[tabNav==3?'active':'']" @click="tapNav(3)">同城</view>
				</view>
				<view class="redact flex-end">
					<view @click="showLive">
						<image src="http://xcx.yixijiu19.com/static/Live.png" mode="aspectFit"></image>
					</view>
					<view @click="search" class="iconfont icon-sousuo"></view>
				</view>
			</block>
			<view v-if="pageCon==2" class="pageCon2title flex-center">
				亿喜
			</view>
		</view>
		<view :style="{ height: barHeight + 44 + 'px' }"></view>
		<!-- 轮播 -->
		<view class="index_swiper" v-if="tabNav!=1">
			<swiper class="swiper" :indicator-dots="false" autoplay :interval="5000" :duration="500" @change="changeSwiper">
				<swiper-item v-for="(item,index) in bannerList" :key="index">
					<view class="swiper-item pd15" @click="tolink(item.Url)">
						<image class="img" :src="item.Pic" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="dots" style="bottom: 10upx;">
				<view v-for="(item,index) in bannerList.length" :key="index" :class="['dot',currentSwiper==index?'active':'']"></view>
			</view>
		</view>
		<block v-if="pageCon==1">
		<view class="playList">
			<view class="left-list" style="padding-right: 8upx;">
			<block v-for="(item,index) in PreviewList" :key="index">
				<view class="play" v-if="index%2==0" @click="goLivePlay(item,index)">
					<view :class="[tabNav==1?'playVideo':'playVideo1']">
						<image :src="item.Logo" mode="widthFix"></image>
						<view class="lookNum">
							<image src="/static/liveing.gif"></image>
							<text>{{item.ViewNum}}人观看</text>
						</view>
						<!-- <view class="like" v-if="tabNav!=1">
							<image src="http://xcx.yixijiu19.com/static/like.png"></image>
							<text>{{item.LikeNum}}</text>
						</view> -->
					</view>
					<view :class="['txtbox',tabNav==1?'':'bg_fff']">
						<view class="playTitle uni-ellipsis2" v-if="tabNav!=1&&item.Title">{{item.Title}}</view>
						<view :class="tabNav==1?'player follow': 'player'">
							<image :src="item.Avatar"></image>
							<text >{{item.NickName}}</text>
						</view>
						<view v-if="tabNav==3&&item.Distance" class="distance">
							距你{{item.Distance}}
						</view>
					</view>
				</view>
			</block>
			</view>
			<view class="right-list" style="padding-left: 8upx;">
			<block v-for="(item,index) in PreviewList" :key="index">
				<view class="play" v-if="index%2==1" @click="goLivePlay(item,index)">
					<view :class="[tabNav==1?'playVideo':'playVideo1']">
						<image :src="item.Logo" mode="widthFix"></image>
						<view class="lookNum">
							<image src="/static/liveing.gif"></image>
							<text>{{item.ViewNum}}人观看</text>
						</view>
						<!-- <view class="like" v-if="tabNav!=1">
							<image src="http://xcx.yixijiu19.com/static/like.png"></image>
							<text>{{item.LikeNum}}</text>
						</view> -->
					</view>
					<view :class="['txtbox',tabNav==1?'':'bg_fff']">
						<view class="playTitle uni-ellipsis2" v-if="tabNav!=1&&item.Title">{{item.Title}}</view>
						<view :class="tabNav==1?'player follow': 'player'">
							<image :src="item.Avatar"></image>
							<text >{{item.NickName}}</text>
						</view>
						<view v-if="tabNav==3&&item.Distance" class="distance">
							距你{{item.Distance}}
						</view>
					</view>
				</view>
			</block>
			</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<noData :isShow="noDataIsShow" tips="请等主播上线后再来观看主播的精彩表现"></noData>
		</block>
		<view class="staticPage uni-bg-white uni-mt10" v-if="pageCon==2">
			<view class="itembox pd15">
				<view class="hd center">公司介绍</view>
				<view class="txtbox uni-mb10">
					<view class="p" style="text-indent: 60upx;">
						深圳亿喜酒业有限公司，2013年成立于——广东深圳宝安区。公司业务已遍布全国各地，服务范围全面扩展；与各大公司、工厂、企业、事业单位、学校等各企事业单位进行了多次成功的合作，并建立了长期的合作关系；积累了丰富的经验，并以灵活的经营方式及完善的售后服务赢得了良好的社会信誉。
					</view>
					<view class="p" style="text-indent: 60upx;">
						公司经营范围是：产品包装设计；酒类的研发；国内贸易，经营进出口业务。（法律、行政法规规定禁止的项目除外；法律、行政法规规定限制的项目须取得许可证后方可经营）。许可经营项目是：酒类的批发及销售，预包装食品批发。
					</view>
					<view class="p" style="text-indent: 60upx;">
						我们期许同你的品牌越飞越高，同时热邀请您到公司参观、考察、交流、合作。
					</view>
				</view>
				<view class="img uni-mb10"><image src="http://m.dance-one.com/static/img/item1.png" mode="widthFix"></image></view>
			</view>
			
			<view class="itembox">
				<view class="hd center">合作品牌</view>
				<view class="icons jigou flex flexWrap uni-mb10">
					<view class="item">
						<image class="icoimg" src="http://yx.wtvxin.com/pc/img/index/01ad.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://yx.wtvxin.com/pc/img/index/02ad.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://yx.wtvxin.com/pc/img/index/03ad.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://yx.wtvxin.com/pc/img/index/04ad.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://yx.wtvxin.com/pc/img/index/05ad.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://yx.wtvxin.com/pc/img/index/06ad.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://yx.wtvxin.com/pc/img/index/07ad.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://yx.wtvxin.com/pc/img/index/08ad.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://yx.wtvxin.com/pc/img/index/09ad.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://yx.wtvxin.com/pc/img/index/10ad.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://yx.wtvxin.com/pc/img/index/11ad.png" mode="widthFix"></image>
					</view>
					<view class="item">
						<image class="icoimg" src="http://yx.wtvxin.com/pc/img/index/12ad.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="itembox youshi">
				<view class="hd center">我们的优势</view>
				<view class="icons flex-between">
					<view class="item">
						<image class="icoimg" src="http://yx.wtvxin.com/pc/img/index/shengxin.png" mode="widthFix"></image>
						<view class="txt">
							<text class="zh1">好货低价</text>
							<text class="zh">精选爆款超低折扣</text>
						</view>
					</view>
					<view class="item">
						<image class="icoimg" src="http://yx.wtvxin.com/pc/img/index/anxin.png" mode="widthFix"></image>
						<view class="txt">
							<text class="zh1">正品保障</text>
							<text class="zh">源头直采人工质检</text>
						</view>
					</view>
					<view class="item">
						<image class="icoimg" src="http://yx.wtvxin.com/pc/img/index/tiexin.png" mode="widthFix"></image>
						<view class="txt">
							<text class="zh1">商家入驻</text>
							<text class="zh">自主上架管理简单</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="advbox" v-if="showXY=='block'">
			<view class="imgbox">
				<view class="textbox">
					<view class="title">服务协议和隐私政策</view>
					<view class="main">
						请你务必审慎阅读、充分理解“服务协议”和“隐私政策”各条款，包括但不限于：为了向你提供附近的商品筛选、实时视频等服务，我们需要获取您的定位信息、相机等权限。您可以在“设置”中查看、变更、删除个人信息并管理授权。
					</view>
					<view class="main">
						您可阅读<text class="c_blue" @click="tolink('/pages/message/agreement/agreement')">《服务协议》</text>和<text class="c_blue" @click="tolink('/pages/message/agreement2/agreement2')">《隐私政策》</text>了解详细信息。如您同意，请点击“同意”开始接受我们的服务。
					</view>
					<view class="maskbtnbox">
						<view class="c_999" @click="xytab(0)">暂不使用</view>
						<view class="c_theme" @click="xytab(1)">同意</view>
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
		<uni-popup type="center" ref="Noticewin" :maskClick="false">
			<view class="pop-notice">
				<image src="/static/notice.png" mode="" class="icontop"></image>
				<view class="pop-hd">
					{{NoticeInfo.Title}}
				</view>
				<scroll-view class="pop-scroll" scroll-y>{{NoticeInfo.Content}}</scroll-view>
				<view class="btn" @click="$refs.Noticewin.close()">我知道了</view>
			</view>
			<view class="closebtn_bb iconfont icon-close" @click="$refs.Noticewin.close()"></view>
		</uni-popup>
	</view>
</template>

<script>
	import amapFile from '@/common/amap-wx.js';
	var myAmapFun = new amapFile.AMapWX({ key: '2cf130b84fa23acfd8b04e82bc4af283' });
	import {post,toLogin,navigate} from '@/common/util.js'
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import noData from '@/components/noData.vue'; //暂无数据
export default {
	data() {
		return {
			barHeight: 0,
			tabNav:2,
			bannerList:[],
			currentSwiper:0,
			city:'',
			isIssue:'',//是否可直播 1是，2否
			userId: "",
			token: "",
			Page:1,
			PageSize:10,
			PreviewClass:[],
			PreviewList:[],
			Lat:null,
			Lon:null,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			showXY:"none",//"none":不显示 "block"显示
			pageCon:0,
			NoticeInfo:{}//首页公告
		};
	},
	components:{
		uniLoadMore,
		noData
	},
	onLoad(e) {
		this.userId = uni.getStorageSync("userId");
		this.token = uni.getStorageSync("token");
		this.pageCon=uni.getStorageSync("pageCon");
		// #ifdef APP-PLUS
		var height = plus.navigator.getStatusbarHeight();
		this.barHeight = height;
		if(uni.getStorageSync("showXY")!=""&&uni.getStorageSync("showXY")!='undefined'){
			this.showXY=uni.getStorageSync("showXY");
		}else{
			this.showXY="block";
		}
		// #endif
		// #ifdef H5
		this.barHeight = 0;
		// #endif
		if(!this.pageCon){
			post("System/GetOpen",{},1).then(res=>{
				if(res.code==0){
					if(res.data==1){
						this.pageCon=1
					}else{
						this.pageCon=2
					}
				}
			})
		}
		this.getBanner()
	
		let _this= this
		uni.getLocation({
			type: 'wgs84',
			geocode:true,
			success:(r) =>{
				this.Lat=r.latitude
				this.Lon=r.longitude
				// 缓存获取到的地区
				uni.setStorageSync('location',{
					lat:r.latitude,
					lng:r.longitude,
					address:r.address,
				})
			console.log('location',r)
				// #ifdef APP-PLUS
					_this.city=r.address.city
					_this.getCityCode()
				// #endif
				// #ifdef MP-WEIXIN
				myAmapFun.getRegeo({
					success: function(data) {
						var index = data[0].name.indexOf('市');
						let cityname = data[0].name;
						_this.city = cityname;
						console.log(_this.city);
						_this.getCityCode()
						// uni.setStorageSync('cityname',_this.cityname)
					},
					fail: function(info) {
						//失败回调
						console.log(info);
					}
				});
				// #endif
			},
			fail: function () {
				uni.showToast({
				    title: '获取地址失败，将导致部分功能不可用',
					icon:'none'
				});
			}
		})
		// this.getPreviewClass()
		this.getPreviewList();
		this.getNotice();
	},
	onShow() {
		this.pageCon=uni.getStorageSync("pageCon");
		this.isIssue=uni.getStorageSync("isIssue")||''
		if(uni.getStorageSync("userId")&&uni.getStorageSync("token")&&this.isIssue!=1){
			this.getisIssue();
		}
		this.getPreviewList();
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
		//显示协议
		xytab(id){
			this.showXY=false;
			if(id==0){
				plus.runtime.quit();
			}else{
				uni.setStorageSync('showXY',"none");
			}
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
		// 获取banner图
		async getBanner(){
			let result = await post('Banner/BannerList',{
				Cid:1
			})
			if(result.code==0){
				this.bannerList=result.data
			}
		},
		changeSwiper(e){
			this.currentSwiper=e.detail.current;
		},
		// 获取城市编码
		async getCityCode(){
			let result = await post('Area/GetCityCode',{
				Name:this.city
			})
			if(result.code==0){
				console.log(result.data,123)
				
			}
		},
		//获取公告
		async getNotice(){
			let result = await post('System/GetHomeNotice',{
				UserId:this.userId,
				Token:this.token
			})
			if(result.code==0&&result.data){
				this.NoticeInfo=result.data;
				setTimeout(()=>{
					this.$refs.Noticewin.open();
				},200)
			}
		},
		// 直播预告分类
		async getPreviewClass(){
			let res = await post('LivePreview/PreviewClass')
			if(res.code==0){
				this.PreviewClass=res.data
			}
		},
		// 直播分类列表
		async getPreviewList(){
			console.log(this.tabNav)
			let type=6
			if(this.tabNav!=1){
				type=0
			}
			
			console.log(type)
			let res= await post('LivePreview/PreviewList',{
				UserId:this.userId,
				Token:this.token,
				Page:this.Page,
				PageSize:this.PageSize,
				Type:type,
				AreaSite:this.tabNav==3?this.city:'',
				Lat:this.tabNav==3?this.Lat:'',
				Lng:this.tabNav==3?this.Lon:''
			})
			console.log(res,'listbiao')
			if (res.count > 0) {
				this.hasData = true;
				this.noDataIsShow = false;
				res.data.forEach(function(item){
					item.Title=decodeURIComponent(item.Title);
					item.Intro=decodeURIComponent(item.Intro)
				})
			}
			if (res.count == 0 && this.Page == 1) {
				this.noDataIsShow = true;
				this.hasData = false;
			}
			if (this.Page === 1) {
				this.PreviewList = res.data;
			}
			if (this.Page > 1) {
				this.PreviewList = this.PreviewList.concat(
					res.data
				);
			}
			if (res.data.length <this.PageSize) {
				this.isLoad = false;
				this.loadingType = 2;
			} else {
				this.isLoad = true;
				this.loadingType = 0
			}
			// this.PreviewList=res.data
		},
		tapNav(type){
			if(type==1&& !uni.getStorageSync("userId")){
				toLogin()
				return
				// console.log(11)
			}
			this.tabNav=type;
			this.Page=1;
			this.getPreviewList()
			
		},
		// 获取用户是否为认证用户
		async getUserInfo(){
			let res =  await post('User/GetCenterInfo')
		},
		// 导航栏开播图标
		showLive() {
			let _this=this;
			// this.showlivebox=true
			if(toLogin()){
				if(this.isIssue==1){
					uni.navigateTo({
						url:'/pages/preview/preview'
					})
					// uni.showActionSheet({
					// 	itemList:['立即开播','开播预告'],
					// 	success(res) {
					// 	  console.log(res.tapIndex)
					// 	  if(res.tapIndex==0){
					// 		  navigate('livepush/livepush')
					// 	  }else{
					// 		  uni.navigateTo({
					// 		  	url:'/pages/preview/preview'
					// 		  })
					// 	  }
					// 	},
					// 	fail(res) {
					// 	  console.log(res.errMsg);
					// 	}
					// })
				}else{
					//#ifndef APP-PLUS
					uni.showModal({
						title:'认证提示',
						content: "您还没有权限，去认证？",
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
		// 搜索框
		search(){
			uni.navigateTo({
				url:'/pages/goods/ProductList/ProductList'
			})
		},
		// 跳转直播
		goLivePlay(item,i){
			if(!toLogin()){return false;}
			if(this.PreviewList[i].Flag==1){
				//#ifdef APP-PLUS
				navigate('liveplay/live3',{MemberId:item.MemberId})
				//#endif
				//#ifndef APP-PLUS
				navigate('liveplay/live',{MemberId:item.MemberId})
				//#endif
			}else{
				uni.showToast({
					title:'直播已结束或未开始！',
					icon:'none'
				})
			}
			// if(this.PreviewList[i].Flag==1){
			// 	navigate('liveplay/live',{MemberId:item.MemberId})
			// }else{
			// 	uni.navigateTo({
			// 		url:'/pages/upLoadDetail/upLoadDetail?id='+this.PreviewList[i].Id
			// 	})
			// }
		}
	},
	// 下拉刷新
	onPullDownRefresh(){
		this.userId = uni.getStorageSync("userId");
		this.token = uni.getStorageSync("token");
		this.Page=1;
		this.PreviewList=[]
		this.getPreviewList();
		uni.stopPullDownRefresh();
	},
	// 上拉加载
	onReachBottom() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.Page++;
			this.getPreviewList();
		} else {
			this.loadingType = 2;
		}
	},
	// #ifdef  MP-WEIXIN
	onShareAppMessage(res) {
		
	},
	// #endif
};
</script>

<style lang="scss" scoped>
@import './style';
.index_swiper{
	margin-top: 30upx;
}
.pop-notice{
	background: #fff;
	border-radius: 28upx;
	width: 80%;
	margin: 0 auto;
	padding: 20upx 30upx;
	position: relative;
	.icontop{
		position: absolute;
		left: 50%;
		top: -80upx;
		transform: translateX(-50%);
		width: 172upx;
		height: 172upx;
	}
	.pop-hd{
		font-size: 36upx;
		font-weight: bold;
		margin-top: 80upx;
		margin-bottom: 20upx;
		padding-bottom: 20upx;
		border-bottom: 1px solid #eee;
	}
	.pop-scroll{
		max-height: 600upx;
		text-align: left;
		line-height: 1.8;
		text-align: justify;
	}
	.btn{
		width: 480upx;
		height: 80upx;
		border-radius: 40upx;
		line-height: 80upx;
		color: #fff;
		background-color: #fea30d;
		margin: 40upx auto 20upx;
	}
}
.closebtn_bb{
	color: #fff;
	width: 66upx;
	height: 66upx;
	line-height: 66upx;
	font-size: 30upx;
	margin: 20upx auto 0;
	border: 1px solid #fff;
	border-radius: 50%;
}
.pageCon2title{
	width: 100%;
	height: 44px;
	font-size: 32rpx;
	font-weight: bold;
}
.staticPage{
	.itembox{
		.hd{
			color: $primary;
			font-weight: bold;
			font-size: 36upx;
			padding: 30upx;
		}
		.txtbox{
			.p{
				font-size: 30upx;
				margin-bottom: 10upx;
				text-align: justify;
			}
		}
		.icons{
			text-align: center;
			margin-top: 30upx;
			.item{
				width: 33.33%;
			}
			.icoimg{
				width: 128upx;
				margin-bottom: 20upx;
			}
			.txt{
				line-height: 1.5;
			}
			.zh{ 
				font-size: 30upx;display: block;
			}
			.en{
				font-size: 24upx;
			}
			&.jigou{
				padding: 0 20upx;
				.item{
					width: 25%;
					.icoimg{
						width: 90%;
						margin-bottom: 20upx;
					}
				}	
			}
		}
	}
	.youshi{
		background: url(http://yx.wtvxin.com/pc/img/index/jiaru-banner.png) center center no-repeat;
		background-size: cover;
		padding: 40upx 30upx;
		.hd{
			color: #fff !important;
		}
		.item{
			background: rgba(0,0,0,.3);
			padding: 40upx 10upx 30upx;
			margin: 0 1px;
			height: 340rpx;
			.txt{
				color: #fff;
				.zh1{
					font-size: 30upx;
				}
				.zh{
					font-size: 24upx;
				}
			}
		}
	}
}
</style>
