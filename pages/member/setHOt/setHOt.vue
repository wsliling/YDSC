<template>
	<view>
		<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x>
			<view style="width: 50%;" v-for="(tab,index) in tabnav" :key="index" :class="['item',tabIndex==index ? 'active' : '']" :id="'tabNum'+index" :data-current="index" @click="tapTab(index,tab.Id)">{{tab.TypeName}}</view>
			<view class="bb_line" :style="'left:'+tabStyle+'rpx'"></view>
		</scroll-view>
		<view style="height:45px"></view>
		<view class="pd15" v-if="hastime">
			<view class="selectvideo uni-bg-white b_radius uni-mb10" v-if="tabIndex==1">
				<view class="Yi-hd flex-between pp3" @click="showWin">
					<view class="title" style="font-weight: normal;">
						上热门视频
					</view>
					<view class="more">
						{{videoId?'':'请选择'}}
						<text class="arrow iconfont icon-arrow_r"></text>
					</view>
				</view>
				<view class="bd flex-between" v-if="videoId">
					<view class="imgbox">
						<image :src='vinfo.Logo||"http://via.placeholder.com/90x90"' mode="aspectFill"></image>
					</view>
					<view class="flex1">
						<view class="name uni-ellipsis uni-mb10">
							{{vinfo.Title}}
						</view>
						<view class="c_999 fz12"><text>播放{{vinfo.Hits}}</text><text>赞{{vinfo.LikeNum}}</text><text>评论{{vinfo.CommentNum}}</text></view>
						<view class="c_999 fz12">发布时间：{{vinfo.AddTime}}</view>
					</view>
				</view>
			</view>
			<view class="selectTime uni-bg-white b_radius uni-mb10">
				<view class="daybox">
					<scroll-view class="tabday" scroll-x :scroll-left="scrollLeft">
						<block v-for="(item,index) in tabday" :key="index">
						<view :class="['item',dayIndex==index?'active':'']" @click="selectDay(index,item.Id)" :id="'tabNum'+index" :data-current="index">
							<text class="str">{{item.DateName}}</text>
							<text class="dayno">{{item.DateMonth}}</text>
						</view>
						</block>
					</scroll-view>
				</view>
				<view class="timelist flex flexWrap">
					<block v-for="(item,index) in timelist" :key="index">
					<view :class="['item',item.Id==hourId?'active':'']" @click="selectTime(index,item.Id)">
						{{item.TimeSpan}}
					</view>
					</block>
				</view>
			</view>
		</view>
		<view class="ftpay uni-bg-white flex-between" v-if="hastime">
			<view class="price c_theme">
				￥{{HotPrice}}
			</view>
			<view class="btn" @click="submint('')">
				去支付
			</view>
		</view>
		<uni-popup ref="videoWin" type="bottom">
			<view class="uni-modal-video">
				<view class="bottom-title">选择视频</view>
				<view class="close iconfont icon-close" @click="hidePopup"></view>
				<scroll-view class="bottom-content" scroll-y>
					<view class="videolist flex flexWrap" v-if="hasData">
						<block v-for="(item,index) in videolist" :key="index">
						<view :class="['item',vIndex==index?'active':'']" @click="selectVideo(index)">
							<view class="imgbox">
								<image :src='item.Logo||"http://via.placeholder.com/90x90"' mode="aspectFill"></image>
							</view>
							<view class="desc uni-ellipsis">
								{{item.Title}}
							</view>
						</view>
						</block>
					</view>
					<view class="center" v-if="hasData">
						<text class="loadingtxt" v-if="loadingType==0" @click="loadMoreReply">查看更多</text>
						<text class="loadingtxt" v-if="loadingType==1">加载中…</text>
						<text class="loadingtxt" v-if="loadingType==2">没有更多了</text>
					</view>
					<noData :isShow="noDataIsShow" tips="您还没有发布视频哦"></noData>
				</scroll-view>
				<view class="bottom-btn" @click="ConfirmV">确定</view>
			</view>
		</uni-popup>
		<!-- 支付弹窗 -->
		<uni-popup type="bottom" ref="payWin">
			<pay :total="HotPrice" @onClose="$refs.payWin.close()" @success="paySuccess" 
			:orderNumber="orderNo"></pay>
		</uni-popup>
		
	</view>
</template>

<script>
	import { post, get,debounce } from '@/common/util.js';
	import pay from '@/components/paypop.vue';
	import noData from '@/components/noData.vue'; //暂无数据
	import {payFn} from './payhot';
	export default {
		data() {
			return {
				barHeight:0,
				userId: '',
				token: '',
				tabIndex:0,
				tabnav:[
					{
						Id:0,
						TypeName:"直播"
					},
					{
						Id:1,
						TypeName:"视频"
					}
				],
				Type:0,
				scrollLeft:0,
				tabday:[],
				dayIndex:0,
				hastime:false,
				timelist:[],
				timeId:'',
				hourId:'',
				videolist:[],
				page: 1,
				pageSize: 9,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: true,
				videoId:0,
				vinfo:{},//已选视频信息
				vIndex:0,
				HotPrice:'',//热门价格
				orderNo:'',
				hasPayPassword:0,
				MemberWallet:0
			}
		},
		components:{
			pay,noData
		},
		computed: {
		  tabStyle(){
		    return ((750/this.tabnav.length)*this.tabIndex)+(((750/this.tabnav.length)-68)/2)
		  }
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
		onShow() {
			this.userId = uni.getStorageSync('userId');
			this.token = uni.getStorageSync('token');
			this.GetMemInfo();
			this.getHotTime();
			this.getvideo();
		},
		methods: {
			//跳转
			tolink(url) {
				uni.navigateTo({
					url: url,
				})
			},
			//点击tab-bar
			tapTab(index,id) {
				this.tabIndex = index;
				this.Type = id
				this.tabday=[];
				this.timelist=[];
				this.getHotTime()
			},
			selectDay(index,id){
				this.dayIndex=index;
				this.setScrollLeft(index);
				this.timelist=this.tabday[index].DateTimeList;
				this.timeId=id;
				this.hourId=this.timelist[0].Id;
				this.getHotPrice();
			},
			setScrollLeft: async function(tabIndex) {
				let leftWidthSum = 0;
				for (var i = 0; i <= tabIndex; i++) {
					let nowElement = await this.getWidth('tabNum' + i);
					leftWidthSum = leftWidthSum + nowElement.width+10;//10是margin值
				}
				let winWidth = uni.getSystemInfoSync().windowWidth;
				this.scrollLeft = leftWidthSum > winWidth ? (leftWidthSum - winWidth) : 0;
				console.log("scrollLeft"+this.scrollLeft)
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
			selectTime(index,id){
				this.hourId=id;
				this.getHotPrice();
			},
			showWin(){
				this.$refs.videoWin.open();
			},
			hidePopup: function() {
				this.$refs.videoWin.close();
			},
			//选择视频
			selectVideo(index){
				this.vIndex=index
			},
			//确认视频
			ConfirmV(){
				if(this.videolist.length){
					this.videoId=this.videolist[this.vIndex].Id;
					this.vinfo=this.videolist[this.vIndex];
				}
				this.$refs.videoWin.close();
			},
			//获取视频
			async getvideo(){
				let result = await post("News/BrandgoodsList", {
					UserId:this.userId,
					Token:this.token,
					MemberId:this.userId,
					Page:this.page,
					PageSize:this.pageSize
				})
				if(result.code==0){
					
					if (result.data.length > 0) {
						this.hasData = true;
						this.noDataIsShow = false;
					}
					if (result.data.length == 0 && this.page == 1) {
						this.noDataIsShow = true;
						this.hasData = false;
					}
					if (this.page === 1) {
						this.videolist = result.data;
					}
					if (this.page > 1) {
						this.videolist = this.videolist.concat(
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
				}
			},
			loadMoreReply() {
				if (this.isLoad) {
					this.loadingType = 1
					this.page++
					this.getvideo()
				} else {
					this.loadingType = 2
				}
			},
			//获取账户信息
			async GetMemInfo() {
				let result = await post("User/GetMemInfo", {
					UserId: uni.getStorageSync("userId"),
					Token: uni.getStorageSync("token"),
				})
				if (result.code == 0) {
					this.hasPayPassword=result.data.IsSetPayPwd;
					this.MemberWallet=result.data.Wallet;
				}
			},
			//获取热门时间段
			async getHotTime(){
				let res=await post('TencentCloud/GetHotTimeList',{
					UserId:this.userId,
					Token:this.token,
					Type:this.Type
				})
				if(res.code==0){
					if(res.data.length){
						this.hastime=true;
						this.tabday=res.data;
						this.timelist=res.data[0].DateTimeList;
						this.timeId=res.data[0].Id;
						this.hourId=this.timelist[0].Id;
						this.getHotPrice();
					}else{
						this.hastime=false
					}
				}
			},
			//获取热门价格
			async getHotPrice(){
				let res=await post('TencentCloud/GetHotPrice',{
					UserId:this.userId,
					Token:this.token,
					HotTimeId:this.timeId,
					HotHourId:this.hourId
				})
				if(res.code==0){
					this.HotPrice=res.data
				}
			},
			//打开支付窗口
			submint(ispwd,isPayWallet){
				let _this=this;
				debounce(()=>{
					if(_this.Type==1&&!_this.videoId){
						uni.showToast({
						  title: "请选择视频",
						  icon: "none",
						  duration: 2000
						});
						return false;
					}
					this.BuyHotTime(ispwd,isPayWallet)
				})
			},
			
			//购买热门时间段
			async BuyHotTime(ispwd,isPayWallet){
				//e.id= 0--微信支付.1--余额支付,2--支付宝
				let res=await post('TencentCloud/BuyHotTime',{
					UserId:this.userId,
					Token:this.token,
					HotTimeId:this.timeId,
					HotHourId:this.hourId,
					IsPayWallet:isPayWallet,
					Password:ispwd,
					Type:this.Type,
					VideoId:this.Type?this.videoId:''
				})
				if(res.code==0){
					this.orderNo=res.data;
					if(!ispwd){
						setTimeout(()=>{
							this.$refs.payWin.open();
						},500)
					}
					if(isPayWallet){
						this.$refs.payWin.close();
					}
				}else if(res.code==200){
					this.$refs.payWin.close();
					uni.redirectTo({
					  url: "/pages/member/setHOt/setSuccess"
					})
				}
			},
			async paySuccess(e,payPassword){
				if(e.id==1&&!this.hasPayPassword){
					//#ifndef APP-PLUS
					uni.showModal({
						content: "您还没有设置支付密码，去设置？",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url:"/pages/other/ChangepayPwd/ChangepayPwd?nopwd=1"
								})
							} else if (res.cancel) {
							}
						}
					});
					//#endif
					//#ifdef APP-PLUS
					this.$showModal({
						content: "您还没有设置支付密码，去设置？",
					}).then(res=>{
						uni.redirectTo({
							url:"/pages/other/ChangepayPwd/ChangepayPwd?nopwd=1"
						})
						//确认
					  }).catch(res=>{
						//取消
					  })
					//#endif
					return false
				}
				//#ifdef H5
				if(e.id==0){//微信
					
				}else if(e.id==1){//余额
					this.submint(payPassword,1)
				}
				//#endif
				//#ifndef H5
				if(e.id==1){
					this.submint(payPassword,1)
				}
				else{
					payFn(e,{
						attestType:this.Type,
						orderNo:this.orderNo,
						TotalPrice:this.HotPrice,
						payPassword
					})
				}
				//#endif
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
	.uni-popup.bottom{
		z-index: 999999;
	}
	.loadingtxt{
		text-align: center;
		color: #999;
		font-size: 28upx;
		padding: 20upx 0;
	}
</style>
