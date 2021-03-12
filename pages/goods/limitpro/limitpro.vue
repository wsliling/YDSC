<template>
	<view>
		<view class="bg"><image src="http://xcx.yixijiu19.com/static/bg1.png" mode="widthFix"></image></view>
		<uni-nav-bar fixed="true" color="#ffffff" background-color="transparent" title="限时购" left-icon="arrowleft" @clickLeft="back" :border="false">
		</uni-nav-bar>
		<!-- 导航 -->
		<view class="timetab" v-if="hasTime" :style="{top:barHeight+44+'px'}">
		 	<scroll-view id="tab-bar" class="swiper-tab" scroll-x :scroll-left="scrollLeft">
				<block v-for="(item,index) in timelist" :key="index">
					<view class="item" :class="{active:tabIndex==index,on:item.staus=='疯抢中'}" :id="'tabNum'+index" :data-current="index" @click="tapTab(index,item.staus)" style="width: 20%; padding: 0 16upx;">
						<view class="time">{{item.StartTimeStr}}</view>
						<view class="txt">{{item.staus}}</view>
					</view>
				</block>
		 	</scroll-view>
		</view>
		<view style="height: 100upx;"></view>
		<view class="mainbox p_re pd15" style="z-index: 4; padding-top: 12upx;">
			<!-- <view class="stime">还剩 00:19:46 结束</view> -->
			<view class="product-list-level" v-if="hasData">
				<block v-for="(item,index) in prolist" :key="index">
					<view class="outside uni-mb10 uni-bg-white b_radius" @click="tolink('/pages/goods/productDetail/productDetail?proId='+item.Id+'&isLimint=1')">
						<view class="pictrue">
							<image :src="item.PicNo||'http://via.placeholder.com/800x800'" mode="aspectFill"></image>
						</view>
						<view class="txtBox">
							<view>
								<view class="title uni-ellipsis2">{{item.Name}}</view>
								<view class="flex">
									<view class="ratebox">
										<view class="num" :style="{width:(100-item.StockProportion)+'%'}"></view>
										<text>{{item.SalesNum}}人热抢中</text>
									</view>
								</view>
							</view>
							<view class="pronumber flex-between">
								<view><text class="price"><text class="fz12">￥</text>{{item.TimePrice}}</text><text class="oldprice">￥{{item.Price}}</text></view>
								<view class="opentuan" v-if="timeType!=2">立即抢购</view>
								<view class="opencall" v-else @click.stop="remind">开抢提醒</view>
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
		<!--设置开抢通知弹窗 -->
		<view class="Remindout" v-if="isShowRemind">
			<view class="backbox">
				<view class="title">设置开抢通知</view>
				<view class="backtxt c_999">请留下您的手机号码，商品开抢前我们会第一时间通知您！</view>
				<input class="ipt" type="number" value="" />
				<view class="select">
					<view @click="closeBtn">取消</view>
					<view class="keep">确定</view>
				</view>
			</view>
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
				barHeight:0,
				hasTime:false,
				timelist:[],
				starTime:"",//开始时间
				isactive:0,
				timeType:0,//0当前，1已开始，2即将开始
				isShowRemind:false,
				tabIndex:0,
				scrollLeft: 0,
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
			// #ifdef APP-PLUS
			this.barHeight = plus.navigator.getStatusbarHeight();
			// #endif
			// #ifdef H5
			this.barHeight = 0;
			// #endif
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.FlashSaleTimeList();
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			//跳转
			tolink(Url){
				uni.navigateTo({
					url: Url
				})
			},
			tapTab(index,staus) { //点击tab-bar
				this.tabIndex=index;
				this.starTime=this.timelist[index].StartTime;
				this.loadingType = 0;
				this.hasData = false;
				this.noDataIsShow = false;
				this.isLoad = false;
				this.page = 1;
				this.allPage = 0;
				this.count = 0;
				this.limitlist = {};
				if(index==this.timelist.length-1){
					this.setScrollLeft(index);
				}else{
					this.setScrollLeft(index+1);
				}
				if(staus=="疯抢中"){
					this.timeType=0;
				}
				if(staus=="已开始"){
					this.timeType=1;
				}
				if(staus=="即将开抢"){
					this.timeType=2;
				}
				this.getprolist();
			},
			//限时购时间
			async FlashSaleTimeList(){
				let result = await post("Goods/FlashSaleTimeList",{});
				if (result.code === 0){
					let _this=this;
					if (result.data.length > 0) {
						this.hasTime = true;
						this.hasData=true;
						this.timelist=result.data;
						let timecount=this.timelist.length;
						let nowtime=new Date().getHours();
						let i=0;
						if(timecount==1){
							i=0;
							this.navindex=i;
							let startime=this.timelist[i].StartTime;
							let stardiff=nowtime-startime;
							if(stardiff<0){
							  this.timelist[i]["staus"]="即将开抢";
							}
							if(stardiff==0){
							  this.timelist[i]["staus"]="疯抢中";
							}
							if(stardiff>0){
							  this.timelist[i]["staus"]="已开抢";
							}
						}else if(timecount>1){
							for(i=1;i<timecount;i++){
								let startime1=this.timelist[i-1].StartTime;
								let startime2=this.timelist[i].StartTime;
								let stardiff1=nowtime-startime1;
								let stardiff2=startime2-nowtime;
								if(stardiff1<0&&stardiff2>0){
									this.timelist[i]["staus"]="即将开抢";	
									this.timelist[i-1]["staus"]="即将开抢";
								}
								if(stardiff1>=0&&stardiff2>0){
									this.timelist[i]["staus"]="即将开抢";
									this.timelist[i-1]["staus"]="疯抢中";
								}
								if(stardiff1>0&&stardiff2<=0){
									this.timelist[i]["staus"]="疯抢中";
									this.timelist[i-1]["staus"]="已开始";
									this.isactive=i;
								}
							}
						}
						setTimeout(()=>{
							_this.tapTab(_this.isactive,_this.timelist[_this.isactive].staus);
						},100)
					}else{
						this.noDataIsShow = true;
					}
				}
			},
			setScrollLeft: async function(tabIndex) {
				let leftWidthSum = 0;
				for (var i = 0; i <= tabIndex; i++) {
					let nowElement = await this.getWidth('tabNum' + i);
					leftWidthSum = leftWidthSum + nowElement.width+10;//10是margin值
				}
				let winWidth = uni.getSystemInfoSync().windowWidth;
				this.scrollLeft = leftWidthSum > winWidth ? (leftWidthSum - winWidth) : 0;
			},
			getWidth(id) { //得到元素的宽
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select('#' + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				});
			},
			//分类商品列表
			async getprolist(){
				let result = await post("Goods/FlashSaleGoodList", {
					UserId: this.userId,
					Token: this.token,
					page: this.page,
					pageSize: this.pageSize,
					timeNum: this.starTime
				});
				if(result.code==0){
					let _this=this;
					if (result.data.length > 0){
						this.hasData = true;
						this.noDataIsShow = false;
						result.data.forEach(function(item){
							_this.GetRTime(item,item.FlashSaleEndTime);
						})
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
			//倒计时
			GetRTime(item,endTime) {
			  let _this = this;
			  //倒计时
			  let timeStr = "";
			  let endtime=endTime.replace(/-/g, '/').replace(/T/g, ' ');
			  let EndTime = new Date(endtime); //结束时间
			  let timer = setInterval(function() {
				let NowTime = new Date(); //当前时间
				let t = EndTime.getTime() - NowTime.getTime();
				if (t > 0) {
				  let d = Math.floor(t / 1000 / 60 / 60 / 24); //天
				  let h = Math.floor((t / 1000 / 60 / 60) % 24); //时
				  let m = Math.floor((t / 1000 / 60) % 60); //分
				  let s = Math.floor((t / 1000) % 60); //秒
				  if (parseInt(d) < 1) {
					d = "";
				  } else {
					d = d + "天";
				  }
				  if (parseInt(h) < 10) {
					h = "0" + h;
				  }
				  if (parseInt(m) < 10) {
					m = "0" + m;
				  }
				  if (parseInt(s) < 10) {
					s = "0" + s;
				  }
				  timeStr = d + h + ":" + m + ":" + s;
				  _this.$set(item, "countTime", timeStr);
				} else {
				  clearInterval(timer);
				}
			  }, 1000);
			},
			async remind(){
				//this.isShowRemind=true;
				let result = await post("Goods/RushNotice",{
					UserId: this.userId,
					Token: this.token,
					TimeNum:this.starTime
				});
				if(result.code==0){
					uni.showToast({
						title: "设置提醒成功！",
						icon: "none",
						duration: 2000
					});
				}
			},
			closeBtn(){
				this.isShowRemind=false;
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
	@import "./style";
</style>
