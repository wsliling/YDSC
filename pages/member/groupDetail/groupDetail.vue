<template>
	<view>
		<view class="detail">
			<view class="goods flex flexAlignCenter" @click="golink('/pages/goods/productDetail/productDetail?proId='+GroupMemberInfo.ProductId)">
				<image :src="GroupMemberInfo.GroupImage"></image>
				<view class="goodsInfo">
					<view class="groupStatus">{{GroupMemberInfo.GroupStatusStr}}</view>
					<text class="goodsTitle">{{GroupMemberInfo.GroupTitle}}</text>
					<view class="price">
						<view class="newPric" style="color:#ff3333">￥<text>{{GroupMemberInfo.FightingPrice}}</text></view>
						<view class="oldPrice color_gray">￥{{GroupMemberInfo.OriginalPrice}}</view>
					</view>
				</view>
			</view>
			<view class="groupUser" v-if="GroupStatus!==0">
				<view v-for="(item,index) in GroupMemberInfo.MemberList" :key="index">
					<image :src="item.MemberAvatar" mode=""></image>
					<!-- <text>团长</text> -->
				</view>
			</view>
			<view class="lack" v-else>
				<view>还差{{GroupMemberInfo.MaxPeopleNum-GroupMemberInfo.CurrentPeople}}人即可成团</view>
				<view class="lastTime flex-center uni-mt10">
					剩余
					<view class="countDown">
					  <text>{{timeStr[1]||'00'}}</text>:<text>{{timeStr[2]||'00'}}</text>:<text>{{timeStr[3]||'00'}}</text>
					</view>结束
				</view>
			</view>
			<view class="groupUser" v-if="GroupStatus==0">
				<view  v-for="(item,index) in GroupMemberInfo.MemberList" :key="index">
					<image :src="item.MemberAvatar" mode=""></image>
				</view>
			</view>
			<view class="chackGoods" v-if="GroupStatus!==0" @click="golink('/pages/goods/pinpro/pinpro')">
				查看更多拼团商品
			</view>
			<view class="chackGoods" v-else @click="getShare(groupId)">
				邀请好友参团
			</view>
			<view class="lackTips" v-if="GroupStatus==0">
				请尽快成团，否则就被抢光了哦！
			</view>
		</view>
		<view class="grouprule flex flexAlignCenter flex-between" @click="showWin">
			<view>拼团规则</view>
			<view >
				好友拼团  人满发货  人不满退款
				<text class="iconfont icon-arrow_r"></text>
			</view>
		</view>
		<!-- 弹出拼团规则 -->
		<uni-popup ref="ruleWin" type="center">
			<view class="uni-modal-rule">
				<view class="inner uni-bg-white b_radius">
					<view class="bottom-title">拼团活动规则</view>
					<view class="bottom-content">
						<view class="h3">
							更新时间：
						</view>
						<view class="c_999">
							不定期更新，限量放送,售完即止
						</view>
						<view class="h3">
							参与步骤：
						</view>
						<view class="c_999">
							1.在拼团商品活动页面中选择商品，点击购买进入支付页<br>
							2.在5分钟内完成支付，否则订单自动取消<br>
							3.开团成功后，可将拼团信息分享给好友，指定时间内邀请到成团人数的好友享拼团价,即为拼团成功;否则，系统自动退款
						</view>
						<view class="h3">
							活动说明：
						</view>
						<view class="c_999">
							1.拼团商品不与网站其它优惠福利同享<br>
							2.拼团商品不可使用优惠券<br>
							3.同一登录账号、同一手机号、同一终端设备号、同一支付账户、同一收货地址等合理显示为同一用户的情形，均视为同一用户<br>
							4.通过不正当手段参与拼团活动，商家有权撤销相关订单<br>
						</view>
					</view>
				</view>
				<view class="closebtn_bb uni-icon uni-icon-close" @click="hidePopup"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {post,webUrl} from '@/common/util.js'
	export default {
		data() {
			return {
				GroupMemberInfo:{},
				groupId:0,
				userId:'',
				token:'',
				EndTime:'',
				GroupStatus:0,
				endDd:'',// 剩余天数
				endHh:'',//	剩余小时
				timer:null,
				timeStr:[],//倒计时
			}
		},
		onLoad(e){
			if(e.Id){
				this.groupId=e.Id
			}
		},
		onShow(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			// #ifndef APP-PLUS
			if(this.$mp.query.Id){
				this.groupId=this.$mp.query.Id
			}
			// #endif
			
			this.getGroupMemberInfo()
		},
		methods: {
			golink(url){
				uni.navigateTo({
					url:url
				})
			},
			// 弹出参数\服务
			showWin(){
				this.$refs.ruleWin.open();
			},
			//统一的关闭popup方法
			hidePopup: function() {
				this.$refs.ruleWin.close();
			},
			async getGroupMemberInfo(){
				let res= await post('GroupBuy/GroupMemberInfo',{
					UserId:this.userId,
					Token:this.token,
					GroupRecordId:this.groupId
				})
				if(res.code==0){
					this.GroupMemberInfo=res.data
					// this.EndTime=this.GroupMemberInfo.EndTime
					// var date=new Date();  
					// var hh=date.getHours();
					// var yy=date.getFullYear();  
					// var MM=date.getMonth()+1;  //因为1月这个方法返回为0，所以加1          
					// var dd=date.getDate();
					// console.log(this.EndTime.split(' '))
					// this.endDd = parseInt(this.EndTime.split(' ')[0].split('-')[2])
					// let endMm = parseInt(this.EndTime.split(' ')[0].split('-')[1])
					// let endYy = parseInt(this.EndTime.split(' ')[0].split('-')[0])
					// this.endHh = parseInt(this.EndTime.split(' ')[1].split(':')[0])
					// console.log(endYy==yy && endMm==MM)
					// if(endYy==yy && endMm==MM){
					// 	console.log(this.endHh,this.endDd)
					// 	this.endDd=this.endDd-dd
					// 	this.endHh=24-hh+this.endHh
					// 	console.log(this.endHh,this.endDd)
					// 	if(this.endHh>=24){
					// 		this.endDd=this.endDd+1
					// 		this.endHh=this.endHh-24
					// 		console.log(this.endHh,this.endDd)
					// 	}
					// }
					this.GetRTime(res.data.EndTime);
					switch(this.GroupMemberInfo.GroupStatusStr){
						case '拼团失败':
						this.GroupStatus=2
						break;
						case '拼团成功':
						this.GroupStatus=1
						break;
						case '拼团中':
						this.GroupStatus=0
						break;
					}
				}
			},
			//倒计时
			GetRTime(endTime) {
			  let _this = this;
			  let endtime=endTime.replace(/-/g, '/').replace(/T/g, ' ');
			  let EndTime = new Date(endtime); //结束时间
			  this.timer = setInterval(function() {
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
				_this.timeStr = [d,h,m,s];
			  } else {
				clearInterval(this.timer);
			  }
			  }, 1000);
			},
			getShare(){
				let that = this;
				let urlstr="/pages/goods/productDetail/productDetail?proId="+this.GroupMemberInfo.ProductId+'&GroupRecord='+this.groupId;
				uni.share({
				    provider: "weixin",
				    scene: "WXSceneSession",
				    type: 0,
				    href:  webUrl+'/#/pages/dowmApp/dowmApp?url='+encodeURIComponent(urlstr),
				    title: that.GroupMemberInfo.GroupTitle,
				    summary: "我正在使用亿喜APP开启拼团，快来和我组团吧！",
				    imageUrl: that.GroupMemberInfo.GroupImage,
					// miniProgram:{
					// 	id:'gh_da1c486d94da',
					// 	path: "/pages/goods/productDetail/productDetail?proId="+this.GroupMemberInfo.ProductId+'&GroupRecord='+this.groupId,
					// 	type:2,
					// 	webUrl:"http://xcx.yixijiu19.com"
					// },
				    success: function (res) { 
				        console.log("success:" + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log("fail:" + JSON.stringify(err));
				    }
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
@import './style';
</style>
