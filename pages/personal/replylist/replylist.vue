<template>
	<view>
		<!-- 内容详情 -->
		<view class="Detailbox uni-mt10" v-if="dataInfo">
			<view class="media-list">
				<view class="tit uni-mb10" v-if="NewsInfo.ContentDetails&&NewsInfo.Title">
					{{decodeURIComponent(NewsInfo.Title)}}
				</view>
				<view class="media-hd flex-between">
					<view class="media-author" @click="gotoPensonal">
						<image class="img" :src="NewsInfo.Avatar||'http://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image>
					</view>
					<view class="media-hd-l uni-ellipsis flex1">
						<text class="txt author-name">{{NewsInfo.NickName}}</text>
					</view>
					<block v-if="NewsInfo.IsMy==0">
						<view :class="['flow-btn',NewsInfo.IsFollow?'flowed':'']" @click="flowbtn">{{NewsInfo.IsFollow==0?'关注':'已关注'}}</view>
					</block>
				</view>
				<view>
					<view class="media-title detailhtml" v-if="NewsInfo.ContentDetails">
						<uParse :content="decodeURIComponent(NewsInfo.ContentDetails)" />
					</view>
					<view class="media-title" v-else-if="NewsInfo.Title">{{decodeURIComponent(NewsInfo.Title)}}</view>
					<view v-if="imgArr.length" :class="['image-section Grid3',imgArr.length==1?'image-section-one':'']">
						<view class="image-list" v-if="imgArr&&i<9" v-for="(source, i) in imgArr" :key="i" >
							<image class="img" :src="source" v-if="imgArr.length==1" mode="widthFix" @click="previewImg(imgArr,i)" />
							<image class="img" :src="source" v-else mode="aspectFill" @click="previewImg(imgArr,i)" />
						</view>
						<view v-if="imgArr.length>9" class="count">{{imgArr.length}}</view>
					</view>
				</view>
				<view class="media-foot">
					<view class="media-info-l">
						<text class="fz12 c_999">{{NewsInfo.Addtime}}</text>
					</view>
					<view class="media-info-r">
						<text class="info-text"><text class="iconfont icon-liulan"></text>{{NewsInfo.BrowseNum}}</text>
					</view>
				</view>
				<!-- <view class="media-location" v-if="NewsInfo.Location">
					<text class="info-text iconfont icon-shouhuodizhi">{{NewsInfo.Location}}</text>
				</view> -->
			</view>
		</view>
		<!-- 点赞区 -->
		<view class="zanlist uni-bg-white pd15">
			<view class="Yi-hd flex-between">
				<view class="title">点赞区</view>
			</view>
			<view class="bd flex-between">
				<view class="imgs flex1" v-if="!nolike">
					<block v-for="(item,index) in LikesList" :key="index">
						<image class="tx" :src="item.Avatar||'http://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image>
					</block>
				</view>
				<view class="c_999 flex1" v-if="nolike">
					还没有人点赞哦
				</view>
				<view class="zannum" @click="like">
					<text :class="['iconfont',NewsInfo.IsLike>0?'icon-zan1':'icon-zan']"></text>
					{{Likecount>9999?(Likecount/9999).toFixed(1)+'万':Likecount}}
				</view>
			</view>
		</view>
		<!-- 评价列表 -->
		<view class="comment-list uni-bg-white" v-if="hasData">
			<view class="Yi-hd flex-between border_bottom" style="padding: 20upx 30upx;">
				<view class="title">精选评论
					<text style="font-weight: normal; margin-left: 10upx;" v-if="commenNum">({{commenNum}})</text>
				</view>
			</view>
			<view class="bd">
				<block v-for="(item,index) in datalist" :key="index">
					<reply-item :itemData='item' @Sendreplay="Sendreplay"></reply-item>
				</block>
			</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<noData :isShow="noDataIsShow" :tips="'暂无评论'"></noData>
		<!-- 底部发表按钮 -->
		<view class="foot-fiexd">
			<view class="mark" v-if="IsShowReplyBox" @click="CancelReply"></view>
			<view :class="['foot-reply flex',IsShowReplyBox?'active':'']">
				<input class="ipt flex1" type="text" v-model="Comment" @click="showReplyBox" :placeholder="placeholder"/>
				<view class="btn-r">
					<block v-if="IsShowReplyBox">
						<view :class="['sendBtn',Comment==''?'dis':'']" @click="Send">发表</view>
					</block>
					<block v-if="!IsShowReplyBox">
						<view class="info-text"><text class="iconfont icon-pinglun"></text>{{NewsInfo.CommentNum}}</view>
						<view class="info-text" @click="like">
							<text :class="['iconfont',NewsInfo.IsLike>0?'icon-zan1':'icon-zan']"></text>
						{{Likecount>9999?(Likecount/9999).toFixed(1)+'万':Likecount}}
						</view>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {host,post,get,dateUtils,toLogin} from '@/common/util.js';
	import uParse from '@/components/uParse/src/wxParse.vue';
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	export default {
		components: {
			uParse,
			noData,
			uniLoadMore
		},
		data() {
			return {
				userId: "",
				token: "",
				Findid:"",
				NewsInfo:{},
				imgArr:[],
				dataInfo:false,
				LikesList:[],//点赞列表
				nolike:false,
				Likecount:0,//点赞数
				commenNum:0,//评论数
				page:1,
				pageSize:12,
				noDataIsShow: false,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				datalist:[],
				IsShowReplyBox:false,//是否显示评论按钮
				placeholder:"我也来说~",
				PCommentId:0,//上级评论id
				Comment:"",//评论内容
				PCommentname:"",//上级评论名
			};
		},
		onLoad: function(e) {
			this.Findid=e.id;
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.FindNewsInfo();
			this.CommnetList();
			this.getLikesList();
		},
		methods:{
			//跳转
			tolink(Url) {
				uni.navigateTo({
					url: Url
				})
			},
			/*获取发现详情*/
			async FindNewsInfo(){
			    let	result = await post("Find/FindNewsInfo", {
					"UserId": this.userId,
					"Token": this.token,
					"FindId":this.Findid
				});
				if (result.code === 0){
					this.NewsInfo=result.data;
					this.dataInfo = true;
					this.NewsInfo.Addtime=dateUtils.format(this.NewsInfo.Addtime);
					this.imgArr=this.NewsInfo.ImgList.split(",");
					this.Likecount=this.NewsInfo.LikeNum;
				}else if (result.code === 2) {
					//未登录
				} else {
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
				}
			},
			//显示评论按钮
			showReplyBox(){
				this.IsShowReplyBox=true;
			},
			//取消评论
			CancelReply(){
				this.placeholder="我也来说~";
				this.IsShowReplyBox=false;
			},
			/*获取评论列表*/
			async CommnetList(){
				let result = await post("Find/CommnetList", {
					"UserId": this.userId,
					"Token": this.token,
					"page": this.page,
					"pageSize": this.pageSize,
					"FkId": this.Findid
				});
				if(result.code==0){
					this.commenNum=result.count;
					if (result.data.length > 0) {
						let _this=this;
						this.hasData = true;
						this.noDataIsShow = false;
						result.data.forEach(function(item) {
							item.AddTime=dateUtils.format(item.AddTime);
							_this.$set(item, "imgArr",item.ImgList.split(","));
							_this.$set(item, "isSHOW",false);
							item.MyCommnetList.forEach(function(item2) {
								item2.AddTime=dateUtils.format(item2.AddTime);
								let txt =item2.Comment.split("#$#");
								if(txt.length==2){
									_this.$set(item2, "Comment",txt[1]);
									_this.$set(item2, "pname",txt[0]);
								}else{
									_this.$set(item2, "Comment",txt[0]);
									_this.$set(item2, "pname","");
								}
							})
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
			/*发表评论*/
			async CommentOperation(){
				let result = await post("Find/CommentOperation",{
					"UserId": this.userId,
					"Token": this.token,
					"FkId":this.Findid,
					"TypeInt":0,
					"ParentCommentId":this.PCommentId,
					"Comment":encodeURIComponent(this.Comment)
				});
				if(result.code===0){
					uni.showToast({
						title: result.msg,
						icon: "none"
					});
					//更新评论列表，并清空评论内容
					this.IsShowReplyBox=false;
					this.placeholder="我也来说~";
					this.PCommentname="";
					this.PCommentId=0,
					this.Comment="";
					setTimeout(()=>{
						this.page=1;
						this.datalist=[];
						this.CommnetList();
					},2000)
				} else if (result.code === 2) {
					toLogin();
				}
			},
			Send(){
				if(this.Comment!=""){
					if(this.PCommentname!=""){
						this.Comment=this.PCommentname+this.Comment;
					}
					this.CommentOperation();
				}else{
					uni.showToast({
						title: "评论内容不能为空",
						icon: "none",
						duration: 2000
					});
				}
			},
			Sendreplay(e){
				console.log(e)
				if(e[1]==""){
					this.placeholder="回复匿名";
					if(e[2]==true){
						this.PCommentname="@匿名"+"#$#"
					}
				}else{
					this.placeholder="回复"+e[1];
					if(e[2]==true){
						this.PCommentname="@"+e[1]+"#$#";
					}
				}
				this.PCommentId=e[0];
				this.IsShowReplyBox=true;
			},
			//预览图片
			previewImg(imgurls,index){
				uni.previewImage({
					current:imgurls[index],
					urls: imgurls,
					indicator:imgurls.length
				});
			},
			async flowbtn() {
				let result = await post("Find/FollowOperation", {
					"UserId": this.userId,
					"Token": this.token,
					"ToMemberId":this.NewsInfo.MemberId
				});
				if (result.code === 0) {
					uni.showToast({
						title: result.msg,
						icon:"none"
					})
					if(this.NewsInfo.IsFollow==0){
						this.NewsInfo.IsFollow=1;
					}else{
						this.NewsInfo.IsFollow=0;
					}
				
				} else if (result.code === 2) {
					let _this = this;
					toLogin();
				} 
			},
			//点赞/取消点赞
			async like(){
				let result = await post("Find/FindlikeOperation", {
					"UserId": this.userId,
					"Token": this.token,
					"FindId": this.Findid,
					"TypeStatu":0
				});
				if (result.code === 0) {
					let _this=this;
					uni.showToast({
						title: result.msg,
						icon: "none"
					});
					if(_this.NewsInfo.IsLike>0){
						_this.$set(_this.NewsInfo,"IsLike",0)
						_this.Likecount--
					}else{
						_this.$set(_this.NewsInfo,"IsLike",1)
						_this.Likecount++
					}
					this.getLikesList();
				}else if (result.code === 2) {
					toLogin();
				}
			},
			// 获取点赞列表
			async getLikesList(){
				let res =await post('Find/FindLikesList',{
					"FindId":this.Findid,
					"Page":1,
					"PageSize":6
				})
				if (res.code == 0){
					if(res.data.length){
						this.LikesList=res.data
						this.nolike=false
					}else{
						this.nolike=true
					}
				}
			},
			gotoPensonal(){
				uni.navigateTo({
					url: '/pages/homepage/homepage?id='+this.NewsInfo.MemberId
				})
			}
		},
		onPullDownRefresh() { //下拉刷新
			//监听下拉刷新动作的执行方法，每次手动下拉刷新都会执行一次
			let _this=this;
			_this.dataInfo = false;
			_this.NewsInfo={};
			this.page=1;
			setTimeout(function () {
				_this.FindNewsInfo();
				_this.CommnetList();
				_this.getLikesList();
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1000);
		},
		// 上拉加载
		onReachBottom: function() {
			if (this.isLoad) {
				this.loadingType = 1;
				this.page++;
				this.CommnetList();
			} else {
				this.loadingType = 2;
			}
		},
	}
</script>

<style scoped lang="scss">
@import "./style";
</style>
