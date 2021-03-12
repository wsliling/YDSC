<template>
	<view class="content">
		<uni-nav-bar fixed="true" color="#ffffff" :background-color="navbg" title="我的" :border="false">
			<block slot="right">
				<view class="iconfont icon-pinglun p_re" @click="golink('/pages/message/messageClass/messageClass')" style="color: #fff; font-size: 24px;"><text class="uni-badge" v-if="newscount!=0" style="background: #ffc107;">{{newscount}}</text></view>
			</block>
		</uni-nav-bar>
		
		<view class="memberTop">
			<view class="conBox">
				<view class="tx_info flex" @click="golink('/pages/homepage/homepage?id='+userId)">
					<view>
						<image class="tx" :src="memberInfo.Avatar||'http://xcx.yixijiu19.com/static/default.png'" mode="aspectFill"></image>
					</view>
					<view class="info flex">
						<view class="info-item" style="width: 100%;">
							<view class="name">
								<text class="txt" style="max-width: 100%;">{{memberInfo.NickName||'立即登录'}}</text>
								<block v-if="pageCon==1">
									<view class="attest1 flex-start mr1" v-if="memberInfo.IdentityTag" @click.stop="golink('/pages/member/editinfo/editinfo')">
										<image src='http://xcx.yixijiu19.com/static/attest1.png'></image>
										{{memberInfo.IdentityTag}}
									</view>
									<text v-if="memberInfo.IsPlatform" class="tag c_theme" style="background: #feed00; border-radius: 100px; padding: 0 12rpx;">自营</text>
								</block>
							</view>
							<view class="perId">ID:<text id="MemberID">{{memberInfo.Id||"00000"}}</text></view>
						</view>
					</view>
					<view class="attest" v-if="!memberInfo.IdentityTag&&pageCon==1" @click.stop="getAttest">
						认证
					</view>
				</view>
				
			</view>
		</view>		
		<view class="pd15 p_re">
			<!-- 我的订单 -->
			<view class="memberIndex__section uni-bg-white b_radius myOrder uni-mb10">
				<view class="Yi-hd flex-between border_bottom" @click="golink('/pages/member/order/order?tabIndex=0')">
					<view class="title">我的订单</view>
					<view class="more">
						查看全部
						<text class="arrow uni-icon uni-icon-arrowright"></text>
					</view>
				</view>
				<view class="section__bd">
					<view class="dd-list li_20 center flex-between" >
						<view class="item" @click="golink('/pages/member/order/order?tabIndex=1')">
							<view class="iconImg p_re">
								<image class="icon" src="http://xcx.yixijiu19.com/static/my/u_order1.png" mode="widthFix"></image>
								<view class="circleNum" v-if="memberInfo.num_dfk>0">{{memberInfo.num_dfk}}</view>
							</view>
							<view class="txt">待付款</view>
						</view>
						<view class="item" @click="golink('/pages/member/order/order?tabIndex=2')">
							<view class="iconImg p_re">
								<image class="icon" src="http://xcx.yixijiu19.com/static/my/u_order2.png" mode="widthFix"></image>
								<view class="circleNum" v-if="memberInfo.num_dfh>0">{{memberInfo.num_dfh}}</view>
							</view>
							<view class="txt">待发货</view>
						</view>
						<view class="item" @click="golink('/pages/member/order/order?tabIndex=3')">
							<view class="iconImg p_re">
								<image class="icon" src="http://xcx.yixijiu19.com/static/my/u_order3.png" mode="widthFix"></image>
								<view class="circleNum" v-if="memberInfo.num_dsh>0">{{memberInfo.num_dsh}}</view>
							</view>
							<view class="txt">待收货</view>
						</view>
						<view class="item" @click="golink('/pages/member/order/order?tabIndex=4')">
							<view class="iconImg p_re">
								<image class="icon" src="http://xcx.yixijiu19.com/static/my/u_order4.png" mode="widthFix"></image>
								<view class="circleNum" v-if="memberInfo.num_dpj>0">{{memberInfo.num_dpj}}</view>
							</view>
							<view class="txt">待评价</view> 
						</view>
						<view class="item" @click="golink('/pages/member/orderTui/orderTui')">
							<view class="iconImg p_re" >
								<image class="icon" src="http://xcx.yixijiu19.com/static/my/u_order6.png" mode="widthFix"></image>
								<view class="circleNum" v-if="memberInfo.num_audit>0">{{memberInfo.num_audit}}</view>
							</view>
							<view class="txt">退款/售后</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 我的订单 end-->

			<!-- 我的服务 -->
			<view class="memberIndex__section uni-bg-white b_radius uni-mb10">
				<view class="Yi-hd flex-between border_bottom">
					<view class="title">常用功能</view>
				</view>
				<view class="section__bd Sevice">
					<view class="dd-list li_25 center flex flexWrap">
						<view class="item" v-if="pageCon==1" @click="golink('/pages/member/groupOrder/groupOrder')" >
							<image class="iconImg img25" src="http://xcx.yixijiu19.com/static/my/myicon1.png" mode="aspectFit"></image>
							<view class="txt">我的拼团</view>
						</view>
						<view class="item" v-if="pageCon==1" @click="golink('/pages/tabBar/my/wallet')">
							<image class="iconImg" src="http://xcx.yixijiu19.com/static/my/u_qb.png" mode="aspectFit"></image>
							<view class="txt">我的钱包</view>
						</view>
						<view class="item" v-if="pageCon==1" @click="golink('/pages/other/myAcount/myAcount')" >
							<image class="iconImg" src="http://xcx.yixijiu19.com/static/my/u_sy.png" mode="aspectFit"></image>
							<view class="txt">我的收益</view>
						</view>
						<view class="item" @click="golink('/pages/member/coupon/coupon')" >
							<image class="iconImg img25" src="http://xcx.yixijiu19.com/static/my/myicon2.png" mode="aspectFit"></image>
							<view class="txt">优惠券</view>
						</view>
						<view class="item" @click="golink('/pages/member/follow/follow')">
							<image class="iconImg img25" src="http://xcx.yixijiu19.com/static/my/myicon3.png" mode="aspectFit"></image>
							<view class="txt">我的关注</view>
						</view>
						<view class="item" @click="golink('/pages/member/collect/collect')">
							<image class="iconImg img25" src="http://xcx.yixijiu19.com/static/my/myicon5.png" mode="aspectFit"></image>
							<view class="txt">我的收藏</view>
						</view>
						<!-- <view class="item" v-if="pageCon==1" @click="golink('/pages/member/invite/invite')">
							<image class="iconImg" src="http://xcx.yixijiu19.com/static/my/u_yq.png" mode="aspectFit"></image>
							<view class="txt">推荐好友</view>
						</view> -->
						<view class="item" v-if="pageCon==1" @click="golink('/pages/member/invite/invite2')">
							<image class="iconImg" src="http://xcx.yixijiu19.com/static/my/u_yq.png" mode="aspectFit"></image>
							<view class="txt">推荐好友</view>
						</view>
						<view class="item" v-if="pageCon==1" @click="golink('/pages/other/myguest/myguest')">
							<image class="iconImg" src="http://xcx.yixijiu19.com/static/my/u_team.png" mode="aspectFit"></image>
							<view class="txt">我的团队</view>
						</view>
						<view class="item" @click="golink('/pages/member/address/address')">
							<image class="iconImg" src="http://xcx.yixijiu19.com/static/my/u_addr.png" mode="aspectFit"></image>
							<view class="txt">收货地址</view>
						</view>
						<!-- #ifndef MP-WEIXIN -->
						<view class="item" @click="golink('/pages/other/kefu/kefu')">
							<image class="iconImg" src="http://xcx.yixijiu19.com/static/my/u_kf.png" mode="aspectFit"></image>
							<view class="txt">官方客服</view>
						</view>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<button @error="error" @contact="btnConcat" open-type="contact" class="btn-concat">
							<view class="item" >
								<image class="iconImg" src="http://xcx.yixijiu19.com/static/my/u_kf.png" mode="aspectFit"></image>
								<view class="txt">官方客服</view>
							</view>
						</button>
						<!-- #endif -->
						<view class="item" @click="golink('/pages/other/set/set')">
							<image class="iconImg" src="http://xcx.yixijiu19.com/static/my/u_set.png" mode=""></image>
							<view class="txt">设置</view>
						</view>
						<view class="item" v-if="pageCon==1" @click="golink('/pages/member/dealerOrder/dealerOrder')">
							<image class="iconImg img25" src="http://xcx.yixijiu19.com/static/my/myicon4.png" mode="aspectFit"></image>
							<view class="txt">自营经销商订单</view>
						</view>
						<view class="item" v-if="pageCon==1" @click="golink('/pages/member/setHOt/setHOt')">
							<image class="iconImg" src="http://xcx.yixijiu19.com/static/my/u_hot.png" mode="aspectFit"></image>
							<view class="txt">上热门</view>
						</view>
						<view class="item" v-if="pageCon==1" @click="getAttest2">
							<image class="iconImg" src="http://xcx.yixijiu19.com/static/my/u_shop.png" mode="aspectFit"></image>
							<view class="txt">{{memberInfo.IsBusiness?'我的店铺':'我要开店'}}</view>
						</view>
						<!-- <view class="item" @click="golink('/pages/member/myAppraise/myAppraise')">
							<image class="iconImg" src="http://xcx.yixijiu19.com/static/icons/u_pj.png" mode=""></image>
							<view class="txt">我的评价</view>
						</view> -->
						<!-- <view class="item" @click="golink('/pages/member/invoiceList/invoiceList')">
							<image class="iconImg" src="http://xcx.yixijiu19.com/static/icons/u_fp.png" mode=""></image>
							<view class="txt">发票信息</view>
						</view>
						
						
						<view class="item" @click="golink('/pages/tabBar/my/browsing')">
							<image class="iconImg" src="http://xcx.yixijiu19.com/static/icons/u_zj.png" mode=""></image>
							<view class="txt">浏览记录</view>
						</view>
						<view class="item" @click="golink('/pages/member/question/question')">
							<image class="iconImg" src="http://xcx.yixijiu19.com/static/icons/u_fk.png" mode=""></image>
							<view class="txt">常见问题</view>
						</view> -->
						
					</view>
				</view>
			</view>
			<!-- 我的服务  end-->
		</view>
	</view>
</template>

<script>
	import {host,post,get,toLogin} from '@/common/util.js';
	export default {
		data() {
			return {
				navbg:"transparent",
				userId: "",
				token: "",
				memberInfo:{},
				OrderInfo:{},
				newscount:0,
				gologin:true,
				pageCon:0
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.pageCon=uni.getStorageSync("pageCon");
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			if(toLogin()){
				this.getMemberInfo();
				this.GetQRcode();
			}
		},
		methods: {
			error(e){
				console.log(e)
			},
			getAttest(){
				if(toLogin()){
					uni.showActionSheet({
						itemList:['经销商认证','网红达人认证'],
						success:async (res)=> {
						  console.log(res.tapIndex)
						  if(res.tapIndex==0){
							  let r = await post('User/ShopAuthInfo',{
								  "UserId": this.userId,
								  "Token": this.token
							  })
							  if(r.code==0){
								  uni.navigateTo({
								  	url:'/pages/other/attest/attest?type=0'
								  })
							  }else{
								  return
							  }
							 
						  }else{
							  let r = await post('User/SageAuthInfo',{
							  	 "UserId": this.userId,
							  	 "Token": this.token
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
				}
				
			},
			async getAttest2(){
				if(toLogin()){
					if(this.memberInfo.IsBusiness){
						uni.navigateTo({
							url:'/pages/goods/storeIndex/storeIndex?id='+this.memberInfo.ShopId
						})
					}else{
						let r = await post('User/ShopAuthInfo',{
						  "UserId": this.userId,
						  "Token": this.token,
						  "IsBusiness":1
						})
						if(r.code==0){
						  uni.navigateTo({
							url:'/pages/other/attest/attest2'
						  })
						}else{
							return
						}
					}
				}
				
			},
			// 跳转
			golink(url){
				// #ifndef MP-WEIXIN
				if(toLogin()){
					uni.navigateTo({
						url:url
					})
				}
				// #endif
				// #ifdef MP-WEIXIN
				if(this.userId&&this.token){
					uni.navigateTo({
						url:url
					})
				}else{
					uni.navigateTo({
						url:"/pages/login/login"
					})
				}
				// #endif
			},
			async getMemberInfo() {
				let result = await post("User/GetCenterInfo", {
					"UserId": this.userId,
					"Token": this.token
				})
				if (result.code === 0) {
					this.memberInfo = result.data;
					uni.setStorageSync('name',this.memberInfo.NickName)
					uni.setStorageSync('Avatar',this.memberInfo.Avatar)
					// uni.setStorageSync('ReferralCode',result.data.ReferralCode)
					// this.$store.commit("update", {
					//   Wallet:result.data.Wallet
					// });  
					this.NewsCount();
				} else if (result.code === 2) {
					this.memberInfo={}
					toLogin();
				}
			},
			
			async NewsCount() {
				let result = await post("News/NewsCount", {
					"UserId": this.userId,
					"Token": this.token
				});
				if (result.code === 0) {
					this.newscount = result.count;
				} 
			},
			async GetQRcode(){
				let _this=this;
				let url='',qrimg='';
				//#ifdef MP-WEIXIN
				url='User/GenerateImage';
				//#endif
				// #ifndef MP-WEIXIN
				url='User/InviteFriends';
				//#endif
			
				let _res=await post(url,{
					UserId:this.userId,
					Token:this.token
				})
				if(_res.code==0){
					  //#ifdef MP-WEIXIN
					  qrimg=_res.data.TcQRcode;
					  //#endif
					  // #ifndef MP-WEIXIN
					  qrimg=_res.data.InviteQRcode;
					  //#endif
					  uni.setStorageSync('qrimg',qrimg) 
				}
			},
		},
		onPageScroll(e){
			if(e.scrollTop>44){
				this.navbg="#ff3333"
			}else{
				this.navbg="transparent"
			}
			// this.getheight();
			if(this.filtertop<44){
				this.isfixed=true;
			}else{
				this.isfixed=false;
			}
		},
	}
</script>

<style scoped lang="scss">
	.memberTop {
		position: relative;
		padding: 20upx 30upx 40upx;
		color: #fff;
		&::before{
			display: block;
			content: '';
			background: #ff3333;
			background: linear-gradient(left,#ff3333,#f56552);
			width: 200vw;
			height: 560upx;
			position: absolute;
			top: 100upx;
			left: 50%;
			transform: translate(-50%,-50%);
			border-radius: 0 0 50% 50%;
			/* #ifndef H5 */
			z-index: -3;
			/* #endif */
		}
		.conBox{
			
			.tx_info * {
				line-height: 1.5;
			}
			.tx_info {
				align-items: center;
				font-size: 28upx;
				
				.tx {
					margin-right: 20upx;
					border: 1upx solid #fff;
					background-color: #eee;
					width: 130upx;
					height: 130upx;
					border-radius: 50%;
					overflow: hidden;
					image{
						width: 100%; 
						height: 100%;
					}
				}
				.info {
					flex: 1;
					overflow: hidden;
					position: relative;
				    padding: 0 30px 0 0;
					.info-item {
						width: 140upx;
						display: flex;
						flex-direction: column;
						justify-content: center;
					}
					.name{ font-size: 0;
					display: flex;
					align-items: center;
						.txt{
							display: inline-block;
							vertical-align: middle;
							font-size: 34upx;
							color: #fff;
							max-width: 148upx;
							overflow: hidden;
							white-space: nowrap;
							-o-text-overflow: ellipsis;
							text-overflow: ellipsis;
						}
					}
					.attest1{
						margin-left: 10rpx;
						height: 40rpx;
						line-height: 1.1;
						background-color: #feed00;
						color: #FF3333;
						font-size: 20rpx;
						border-radius: 40rpx;
						padding-right:10upx;
						image{
							width: 40rpx;
							height: 40rpx;
							border-radius: 100%;
						}
					}
				}
				.attest{
					padding: 5rpx 30rpx;
					background-color: rgba(#ffffff,.4);
					color: #fff;
					z-index: 2;
					border-radius: 30rpx;
				}
			}
		}
	}
	
	.content{overflow: hidden;}
	.WEIXIN_btn{ position: absolute; left: 0; top: 0; width: 100%; height: 100%; opacity: 0;}
	.btn-concat{
		border: none;
		padding: 0;
		background-color: none;
		width: 25%;
		background: #fff;
		display: inline-block;
		float: left;
		color: #5e5e5e;
		.item{
			width: 100%;
		}
	}
	button::after {
		border: none;
	}
	.circleNum {
		position: absolute;
		content: "";
		top: -10upx;
		right: -16upx;
		font-size: 20upx;
		color: #ff3333;
		border: 1upx solid #ff3333;
		background-color: #fff;
		min-width: 36upx;
		height: 36upx;
		line-height: 36upx;
		border-radius: 100%;
		text-align: center;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.memberIndex__section{
		.Yi-hd{ 
			padding: 20upx 30upx;
			margin-bottom: 30upx;
		}
		.item{
			margin-bottom: 30upx;
			.iconImg{
				width: 60upx;
				height: 60upx;
				margin: 0 auto 6upx;
			}
			.txt{
				font-size: 24upx;
			}
			.img25{
				width: 50rpx;
				height: 50rpx;
				margin: 0 auto 8px;
			}
		}
	}
	
</style> 
