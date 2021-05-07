<template>
	<view v-if="hasData">
		<view class="productBanner">
			<!-- #ifdef MP-WEIXIN -->
			<button class="sharebtn" open-type="share"><view class="iconfont icon-share"></view></button>
			<!-- #endif -->
			<video v-if="showVideo" :src="proInfo.Video" :class="['video',isfixed?'top':'']" id="proVideo" @play="playVideo" @pause="pauseVideo">
			</video>
			<swiper class="swiper" :indicator-dots="false" :autoplay="false" :interval="5000" :duration="500" @change="changeBanner">
				<swiper-item v-if="proInfo.Video" :show-fullscreen-btn="false" :show-play-btn="false" show-mute-btn :enable-progress-gesture="false">
					<view class="isplay" @click="playBtn"></view>
					<view class="swiper-item">
						<image class="img" :src="proInfo.PicData[0].PicUrl" mode="aspectFill"></image>
					</view>
				</swiper-item>
				<swiper-item v-for="(item,index) in proInfo.PicData" :key="index">
					<view class="swiper-item">
						<image class="img" :src="item.PicUrl" mode="aspectFill" @click.stop="previewImg(proInfo.imgArr,index)"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="pagination" v-if="hasBanner">{{bannerindex+1}}/{{Bannerlen}}</view>
		</view>
		<view class="red_price flex-between pd15" v-if="GroupId>0">
			<view class="gl_price">
				<text class="yuan">￥</text>
				<text class="price mr1">{{GroupproInfo.FightingPrice}}</text>
				<text class="oldprice">￥{{GroupproInfo.OriginalPrice}}</text>
			</view>
			<view class="gr_num flex-column">
				<text class="num1">{{GroupproInfo.MinPeopleNum}}人团</text>
				<text class="num2">已拼{{GroupproInfo.SuccessGroup}}件</text>
			</view>
		</view>
		<view :class="['red_price flash flex-between pd15',starTimetype==0?'bg-green':'']" v-if="isLimint==1">
			<view class="gl_price">
				<view class="">
					抢购价
				</view>
				<view class="">
					<text class="yuan">￥</text>
					<text class="price mr1">{{proInfo.TimePrice}}</text>
					<text class="oldprice">￥{{proInfo.Price}}</text>
				</view>
			</view>
			<view class="gr_num flex-column">
				<text class="txt"><text class="iconfont icon-shangou"></text>限时秒杀</text>
				<view class="time flex-end" >
					<text class="timetxt">{{starTimetype==1?'距离结束':'距离开始'}}</text>
					<view class="countDown">
					  <text>{{timeStr[1]||'00'}}</text>:<text>{{timeStr[2]||'00'}}</text>:<text>{{timeStr[3]||'00'}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-bg-white pd15 uni-mb10 pdt15">
			<view class="listpt" v-if="GroupId==0&&isLimint==0">
				<view class="listprice flex-between">
					<view class="listm listm-l">
						<text class="selling"><span>¥</span>{{proInfo.Price?proInfo.Price:''}}</text>
						<text class="original" v-if="proInfo.MarketPrice!=0">¥{{proInfo.MarketPrice?proInfo.MarketPrice:0}}</text>
					</view>
					<view class="listm flex rt" v-if="proInfo.DistributionIncome!=0">
						<view class="cash">补贴</view>
						<view class="cashm">¥{{proInfo.DistributionIncome?proInfo.DistributionIncome:''}}</view>
					</view>
				</view>
			</view>
			<view class="site">
				<view class="slogan">{{proInfo.Name?proInfo.Name:''}}</view>
				<view class="desc uni-ellipsis2">
					{{proInfo.Synopsis?proInfo.Synopsis:''}}
				</view>
			</view>
			<view class="discount flex-between">
				<view class="txt payment">已售{{proInfo.SalesVolume?proInfo.SalesVolume:0}}</view>
				<view class="txt addr" v-if="proInfo.ShowArea">
					{{proInfo.ShowArea}}
				</view>
				<view class="txt" v-else>
					{{proInfo.IsPinkage?"运费："+proInfo.Freight+"元":"包邮"}}
				</view>
			</view>
		</view>
		<view class="shipments uni-bg-white uni-mb10" v-if="proInfo.IsAloneBuy==0">
			<view class="pick flex-between" v-if="CouponList.length" @click="showWin('优惠')">
				<view class="lab">领券</view>
				<view class="couponbox flex1">
					<view class="couponico">
						<text class="coupontxt" v-if="index<2" v-for="(item,index) in CouponList" :key="index">
							<block v-if="item.DiscountType==1">
								<block v-if="item.MeetConditions!=0">
									满{{item.MeetConditions}}
								</block>
								<block v-else>下单立</block>
								减{{item.Denomination}}
							</block>
							<block v-else>
								<block v-if="item.MeetConditions!=0">
									满{{item.MeetConditions}}
								</block>
								<block v-else>下单立</block>
								打{{item.Denomination*100/10}}折
							</block>
						</text>
					</view>
				</view>
				<view class="iconfont icon-arrow_r"></view>
			</view>
			<view class="pick flex-between" @click="showSku(GroupId>0?1:islive?2:0)">
				<view class="lab">规格</view>
				<view class="flex1">{{SpecText}} {{number+'件'}}</view>
				<view class="iconfont icon-arrow_r"></view>
			</view>
			<view class="pick flex-between" v-if="proInfo.ParameterJson!=='{}'&&proInfo.ParameterJson!==''" @click="showWin('参数')">
				<view class="lab">参数</view>
				<view class="flex1">
					{{attrArr0}}
				</view>
				<view class="iconfont icon-arrow_r"></view>
			</view>
			
			<view class="pick flex-between needknow" v-if="isServiceInfo" @click="showWin('服务')">
				<view class="lab">服务</view>
				<view class="flex-start flex1 flexWrap">
					<view class="drawinfo" v-if="index<3" v-for="(item,index) in proInfo.ServiceInfo" :key="index"><text class="iconfont icon-gou c_theme"></text>{{item.Name}}</view>
				</view>
				<view class="iconfont icon-arrow_r"></view>
			</view>
		</view>
		<!-- 拼团模块 -->
		<block v-if="GroupId>0">
		<view class="rulebox uni-bg-white uni-mb10">
			<view class="Yi-hd flex-between">
			  <view class="title">拼团玩法</view>
			  <view class="more" @click="showWin('规则')">
				详细规则<text class="fz12 iconfont icon-arrow_r"></text>
			  </view>
			</view>
			<image src="http://yd.wtanvxin.com/static/rule.jpg" mode="widthFix" class="rulepic"></image>
		</view>
		
		<view class="swiper_bb uni-bg-white uni-mb10" v-if="recordList.length>0">
			<view class="Yi-hd flex-between uni-mb10">
			  <view class="title">他们都在拼，可直接参团</view>
			</view>
			<swiper :class="recordList.length>1?'swiper_pt swiper_height ':'swiper_pt'" vertical="false"  :display-multiple-items="displayMultiple" :circular="true" :autoplay="true" interval="5000" :duration='600'>
			<swiper-item class="swiper_item_box" v-for="(item,sindex) in recordList" :key="sindex">
				<view class="item_box_left flex-start flex1">
					<image :src="item.MemberHeadImg||'http://yd.wtanvxin.com/static/default.png'"></image>
					<view class="time-box flex1">
						<view class="name">{{item.MemberHeadNick}}</view>
						<view class="time">
							还差<text class="c_theme">{{item.MaxPeople - item.CurrentPeople}}</text>人成团，剩余
							<text class="c_theme">{{item.EndTime[0]}}:{{item.EndTime[1]}}:{{item.EndTime[2]}}</text>结束
						</view>
					</view>
				</view>
				<view class="item_box_right">
					<view class="btn" v-if="item.IsOkJoin==0"  @click="showSku(1,item.Id)">去参团</view>
					<view class="btn" v-else  @click="showSku(1,item.Id)">去参团</view>
				</view>
			</swiper-item>
			</swiper>
			
		</view>
		</block>
		<!-- 拼团模块end -->
		
		<!-- 商品评价 -->
		<view class="comment uni-bg-white uni-mb10">
			<view class="Yi-hd flex-between">
			  <view class="title">商品评价<text class="c_999 font26">({{commentCount}})</text></view>
			  <view class="more c_theme" v-if="hasComment" @click="tolink('/pages/goods/evaluation/evaluation?id='+proId)">
				查看全部<text class="fz12 iconfont icon-arrow_r"></text>
			  </view>
			</view>
			<block v-if="hasComment">
				<view class="comment-item" v-for="(item,index) in CommentList" :key="index">
				  <view class="name flex-between">
					<view class="flex-start flex1">
					  <img class="tx" :src="item.Avatar||'http://yd.wtanvxin.com/static/default.png'" alt="">
					  <view>{{item.NickName}}</view>
					</view>
					<view class="flex">
					   <view class="star iconfont icon-collect" v-for="(item1,index1) in item.Rank" :key="index1"></view>
					</view>
				  </view>
				  <view class="detail">{{item.ContentText}}</view>
				  <view class="flex flexWrap imgs"  v-if="item.PicData">
					<block v-for="(i,e) in item.imgArr" :key="e">
						<image v-if="e<3" :src="i" mode="" class="shop_pic"  @click="previewImg(item.imgArr,i)"></image>
					</block>
				  </view>
				  <view class="time">{{item.AddTime}}</view>
				</view>
			</block>
			<view class="uni-comment" v-else>
				<view class="uni-center" style="padding: 20upx; color: #999;">
					暂无评论
				</view>
			</view> 
		</view>
		<!-- 店铺 -->
		<view class="product-shop uni-bg-white uni-mb10" v-if="proInfo.ShopData">
			<view class="flex flex-between">
				<view class="shop-logo">
					<image class="img" :src="proInfo.ShopData.Logo||'http://via.placeholder.com/100x100'" mode="aspectFill"></image>
				</view>
				<view class="txtbox flex1">
					<view class="name">{{proInfo.ShopData.ShopNick}}<text class="tag tag-zy ml5" v-if="proInfo.ShopData.IsPlatform">{{proInfo.ShopData.IsPlatform}}</text></view>
					<view class="pf flex-start">
						<view class="lab fz12 mr1">综合体验</view>
						<view class="starbox">
							<uni-rate size="14" margin='2' color="#bbb" :showtxt="false" disabled="true" active-color="#ff6666" v-if="proInfo.ShopData.ServiceScore" :value="proInfo.ShopData.ServiceScore"></uni-rate>
						</view>
					</view>
				</view>
				<view class="btn" @click="tolink('/pages/goods/storeIndex/storeIndex?id='+proInfo.ShopData.ShopId)">进店逛逛</view>
			</view>
		</view>
		<!-- 图文详情-->
		<view class="uni-bg-white">
			<view class="Yi-hd" style="padding: 30upx;"><text class="title">商品详情</text></view>
			<view class="detailhtml" v-if="proInfo.ContentDetail">
				<uParse :content="proInfo.ContentDetail" />
			</view>
		</view>
		<!-- 详情底部 -->
		<view style="height: 100upx;"></view>
		<view class="foot-fiexd">
			<view class="dd-foot">
				<view class="border-top"></view> 
				<view class="foot-item" style="position: relative;">
					<!-- #ifndef MP-WEIXIN -->
					<view class="bd" @click="tolink('/pages/other/kefu/kefu?qqnum=996889692')">
						<view class="iconfont icon-kefu"></view>
					客服</view>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN --> 
					<button class="bd" open-type="contact" style="border:0!important;padding:0;background: #ffffff;line-height:1.9">
						<view class="iconfont icon-kefu"></view>
					客服</button>
					<!-- #endif -->
				</view>
				<view class="foot-item">
					<view class="bd"><view class="iconfont" :class="[IsCollect ? 'icon-collect' : 'icon-collect1']" @click="collect"></view>收藏</view>
				</view>
				<view class="foot-item" style="margin-right: 20upx;" @click="tolink('/pages/goods/cart/cart')">
					<view class="bd"><view class="iconfont icon-tianchongxing- p_re"><text class="uni-badge" v-if="CartNum>0">{{CartNum>99?'99+':CartNum}}</text></view>购物车</view>
				</view>
				<!-- 有拼团样式 -->
				<view class="foot-item foot-item-btns" v-if="proInfo.IsAloneBuy==0">
					<view class="btn btn_1 flex no" @click="showSku(3)" v-if="proInfo.IsAloneBuy==0&&GroupId==0&&islive==0">
						<view class="txt">加入购物车</view>
					</view>
					<view class="btn btn_2 flex" v-if="starTimetype==0&&isLimint==1" style="opacity: .6;" @click="remind">
						<view class="txt" style="font-size: 28upx;">即将开始</view>
					</view>
					<view class="btn flex" v-else :class="[GroupId>0?'btn_1':'btn_2 no']" @click="showSku(2)">
						<view class="num">¥{{isLimint==0?proInfo.Price:proInfo.TimePrice}}</view>
						<view class="txt">{{GroupId>0?'单独购买':'立即购买'}}</view>
					</view>
					<view class="btn btn_2 flex" @click="showSku(1,GroupRecordId)" v-if="GroupId>0">
						<view>
							<view class="num">¥{{GroupPrice}}</view>
							<view class="txt">{{GroupRecordId?'我要拼团':'我要开团'}}</view>
						</view>
					</view>
				</view>
				<view class="foot-item foot-item-btns" v-else>
					<block v-if="reStock>0">
					<view class="btn btn_1 flex" @click="gouBuy(0)">
						<view class="num">¥{{alonePrice}}</view>
						<view class="txt">单独购买</view>
					</view>
					<view class="btn btn_2 flex" style="flex:1.4" v-if="GroupId>0" @click="gouBuy(1)">
						<view>
							<view class="num">¥{{GroupPrice}}</view>
							<view class="txt">我要拼团</view>
						</view>
					</view>
					</block>
					<block v-else>
						<view class="btn btn_1 flex" style="background-color: #C9C9C9;">
							<view class="txt" style="font-size: 30upx;">已售罄</view>
						</view>
					</block>
				</view>
			</view>
		</view>
		<!-- 详情底部 end -->
		<view class="topbtn" @click="Top" v-if="isTop"><text class="iconfont icon-iconset0418"></text></view>
		<!-- 弹出优惠券 -->
		<uni-popup ref="CouponWin" type="bottom">
			<view class="uni-modal-Coupon">
				<view class="closebtn uni-icon uni-icon-close" @click="hidePopup"></view>
				<view class="bottom-title">优惠</view>
				<view class="bottom-content">
					<view class="fz12 c_999 uni-mb5">领券</view>
					<view class="couponlist">
						<view class="coupon-item uni-mb10" v-for="(item,index) in CouponList" :key="index">
							<view class="flex-between">
								<view class="couponleft flex1">
									<view class="title">
										<view class="price" v-if="item.DiscountType=='1'"><text>￥</text><text class="num">{{item.Denomination}}</text></view>
										<view class="price" v-if="item.DiscountType=='2'"><text class="num">{{item.Denomination*100/10}}</text><text>折</text></view>
										<view class="couponname">{{item.Name}}</view>
									</view>
									<view class="txt">{{item.MeetConditions!='0'?'满'+item.MeetConditions+'元可用':'无门槛'}}</view>
									<view class="txt fz12">{{item.StartEndTimeStr}}</view>
								</view>
								<view class="couponbtn">
									<view class="btn" v-if="item.IsMyAlready==0" @click="ReceiveCoupon(item.Id,index)">立即领取</view>
									<view class="btn dis" v-if="item.IsMyAlready==1">已领取</view>
									<view class="rightimg" v-if="item.IsMyAlready==1"><image src="http://yd.wtanvxin.com/static/ylq.png" mode=""></image></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="bottom-btn" @click="hidePopup">完成</view>
			</view>
		</uni-popup>
		<!-- 弹出产品参数 -->
		<uni-popup ref="attrWin" type="bottom">
			<view class="uni-modal-Attr">
				<view class="bottom-title">产品参数</view>
				<view class="bottom-content">
					<view class="attrlist uni-mb10">
						<view class="uni-list-cell" v-for="(item,index) in attrArr" :key="index">
							<view class="uni-list-cell-navigate">
								{{index}}
								<text class="list-cell-r">{{item}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="bottom-btn" @click="hidePopup">完成</view>
			</view>
		</uni-popup>
		<!-- 弹出服务 -->
		<uni-popup ref="serverWin" type="bottom">
			<view class="uni-modal-Attr">
				<view class="bottom-title">服务</view>
				<view class="bottom-content">
					<view class="attrlist uni-mb10">
						<view class="uni-list-cell" v-for="(item,index) in proInfo.ServiceInfo" :key="index">
							<view class="uni-list-cell-navigate flexWrap">
								<view>
									<text class="iconfont icon-gou c_theme mr1"></text>{{item.Name}}
								</view>
								<view class="desc c_999" style="width: 100%;">
									{{item.Info}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="bottom-btn" @click="hidePopup">完成</view>
			</view>
		</uni-popup>
		<!-- 弹出sku -->
		<popupsku :proInfo="proInfo" :show="showPopupSku&&isProData" :showbtntype="showbtntype" :fromPinTuan="fromPinTuan" :GroupRecordId="GroupRecordId" v-on:hidePopup="hidePopup" v-on:getsku="getsku" v-on:addcartok="getCartNum" :isLimint="isLimint*1" :starTimetype="starTimetype" :inviteCode="inviteCode"></popupsku>
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
		<!-- 弹出分享 -->
		<uni-popup ref="popupShare" type="bottom">
			<nvue-share :title="proInfo.Name" :imageUrl="proInfo.PicData[0].PicUrl" :url="'/pages/goods/productDetail/productDetail?proId='+proId+'&inCode='+ReferralCode+'&isLimint='+isLimint"></nvue-share>
		</uni-popup>
		<!-- 悬浮窗 -->
		<!-- #ifndef MP-WEIXIN -->
		<movable-area class="fixed-area" v-if="islive&&showArea">
			<movable-view class="fixed-box" direction="all" :inertia="false" :animation="false">
				<view class="minvideo">
					<video :src="liveURL" id="liveVideo" :controls="false" autoplay object-fit="cover" :loop="islive==2?true:false" :show-center-play-btn="false" :enable-progress-gesture="false">
						<!-- #ifndef MP-WEIXIN -->
						<cover-view class="fixecover" @click="tobacklive"></cover-view>
						<cover-view class="close" @click.stop="closeArea">×</cover-view>
						<!-- #endif -->
					</video>
					<!-- #ifdef MP-WEIXIN -->
					<view class="fixecover" @click="tobacklive"></view>
					<view class="close" @click.stop="closeArea">×</view>
					<!-- #endif -->
				</view>
			</movable-view>
		</movable-area>
		<!-- #endif -->
	</view>
</template>

<script>
	import {post,get,toLogin,uncodeUtf16,webUrl,wssHost} from '@/common/util.js';
	import h5Copy from '@/common/junyi-h5-copy';
	import uParse from '@/components/uParse/src/wxParse.vue';
	import popupsku from '@/components/popupSku.vue';
	import nvueShare from '@/components/uni-popup/nvue-share.vue'
	export default {
		components: {
			uParse,
			popupsku,
			nvueShare
		},
		data() {
			return {
				userId: "",
				token: "",
				ReferralCode:'',//自己的邀请码
				inviteCode:'',//他人的邀请码
				isTop:false,//是否显示置顶
				proId:'',//商品id
				TypeId:0,//产品类型
				hasData:false,//是否渲染页面
				proInfo:{},
				ProSku:[],//普通商品Sku
				IsCollect:false, //是否收藏该商品
				bannerindex:0,//当前轮播图
				Bannerlen:0,//轮播图数量
				hasBanner:false,
				CartNum:0,//购物车数量
				showPopupinfo:false,//参数
				attrArr:{},//产品参数
				attrArr0:'产品参数',
				isServiceInfo:false,//服务
				hasComment:false,//是否有评论
				commentCount:0,//评价总数
				CommentList:[],//评价列表
				CouponList:[],//优惠券
				
				showPopupSku:false,
				number:1,
				SpecText:'',
				canaddcar:false, //sku齐全可以加入购物车
				price:'',
				plusprice:'',
				
				showbtntype:0,//0:加购+立即 1:拼团确定 2:立即,3加购

				timer:null,
				timeStr:[],//倒计时
				groupTime:[],//参团倒计时
				grouptimer:null,//参团计时器
				fromPinTuan:false,//是否是拼团sku
				GroupRecordId:0,//参团的团购记录id
				isProData:false,//是否已经渲染
				GroupId:0,//拼团id
				GroupproInfo:{},//拼团信息
				GroupPrice:0,//拼团价格
				GroupSku:[],//拼团商品Sku
				recordList:[],//拼团记录列表
				displayMultiple:2,//拼团模块显示个数
				
				isLimint:0,//0非限时购产品，1限时购产品
				starTimetype:1,//0秒杀未开始，1一开始，2已结束
				
				islive:0,//1表示直播视频带货，2表示品牌好物带货
				liveURL:"",//带货视频地址
				showArea:true,
				liveContext:null,//带货视频
				
				videoContext:null,//bannner视频
				showVideo:false,
				isfixed:false,
				isplaynow:0,
				isPause:true,
			}
		},
		onLoad(e) {
			this.proId=e.proId;
			this.isLimint=e.isLimint||0;
			this.islive=e.islive||0;
			if(this.islive==2){
				this.liveURL=decodeURIComponent(e.liveURL);
			}else{
				this.liveURL=e.liveURL||'';
			}
			// #ifndef MP-WEIXIN
			if(this.liveURL){
				this.liveContext=uni.createVideoContext('liveVideo')
			}
			//#endif
			if(e.inCode){
				this.inviteCode = e.inCode
				// #ifdef MP-WEIXIN
				uni.setStorageSync('inviteCode', e.inCode);
				// #endif
			}
			if(e.GroupRecord){
				this.GroupRecordId=parseInt(e.GroupRecord)||0
			}
		},
		onShow(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.ReferralCode = uni.getStorageSync("ReferralCode");//自己的邀请码
			this.Goodsxq();
			this.getCommentList();
			this.getCartNum();
			if(this.liveContext){
				this.liveContext.play();
				
			}
		},
		onHide() {
			if(!this.ispause){
				// this.videoContext.pause();
			}
		},
		onUnload() {
			if(!this.ispause){
				// this.videoContext.pause();
			}
		},
		//分享
		onNavigationBarButtonTap(e) {
			if(e.index===0){
				//#ifdef APP-PLUS
				this.$refs.popupShare.open()
				//this.sharePlus()
				//#endif
				//#ifdef H5
				const status = h5Copy(window.location.origin+'/#'+"/pages/goods/productDetail/productDetail?proId="+this.proId+"&inCode="+ this.ReferralCode+'&isLimint='+this.isLimint)
				if(status){
				    uni.showToast({title:'链接复制成功，快去分享给好友吧~'})
				}else{
				    uni.showToast({title:'分享失败',icon:'none'})
				}
				//#endif
			}
		},
		methods: {
			//监听暂停
			pauseVideo(){
				this.isfixed=true;
				this.ispause=true;
			},
			//监听播放
			playVideo(){
				this.isfixed=false;
				this.ispause=false;
			},
			//点击播放
			playBtn(){
				let _this = this;
				this.showVideo=true;
				this.isfixed=false;
				this.isplaynow=1;
				setTimeout(()=>{
					_this.videoContext.play();
				},500)
			},
			//关闭悬浮窗
			closeArea(){
				this.showArea=false;
			},
			tobacklive(){
				//uni.navigateBack({})
			},
			//跳转
			tolink(Url,tabBar) {
				if(tabBar=='tabBar'){
					uni.switchTab({
						url: Url
					})
				}else{
					uni.navigateTo({
						url: Url
					})
				}
			},
			//轮播切换
			changeBanner(e){
				this.bannerindex=e.detail.current;
			},
			//返回顶部
			Top(){
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 200
				});
			},
			async Goodsxq(){
				let result = await post("Goods/Goodsxq", {
					userId:this.userId,
					token:this.token,
					Id: this.proId
				});
				if(result.code==0){
					let _this=this;
					if(result.data.IsVideo==1){
						this.Bannerlen=result.data.PicData.length+1;
						this.videoContext=uni.createVideoContext('proVideo');
					}else{
						this.Bannerlen=result.data.PicData.length;
					}
					if(result.data.PicData.length){
						this.hasBanner=true;
						let arr = []
						result.data.PicData.forEach(function(item) {
						  arr.push(item.PicUrl)
						  _this.$set(result.data,"imgArr",arr);
						})
					}
					this.TypeId=result.data.TypeId;
					this.GetCouponlist();//获取优惠券
					this.IsCollect=result.data.IsCollection.Value;
					if(result.data.ServiceInfo.length){
						this.isServiceInfo=true
					}
					if(result.data.ParameterJson!=""&&result.data.ParameterJson!="{}"){
						this.attrArr=JSON.parse(result.data.ParameterJson);
						let str=''
						for(let keystr in this.attrArr){
							str+=keystr+' '
						}
						this.attrArr0=str.split(' ')[0]+' '+str.split(' ')[1]
					}
					this.number=result.data.MinBuyNum;
					this.ProSku=result.data.Sku;
					this.GroupId=(this.isLimint!=1&&!this.islive)?result.data.GroupId:0;
					//this.isLimint=result.data.IsFlashSale;
					this.proInfo=result.data;
					if(this.GroupId>0){//可以拼团
						this.isProData = false;
						this.hasData = false;
						this.GroupProductInfo()//拼团商品详情
						this.getGroupRecordList() //拼团记录
					}else{
						this.isProData = true;
						this.hasData = true;
					}
					//限时
					if(this.isLimint){
						let dateBegin = new Date(this.proInfo.FlashSaleStartTime);
						let dateNow = new Date(); //获取当前时间
						let beginDiff = dateNow.getTime() - dateBegin.getTime(); //时间差的毫秒数 
						var beginDayDiff = Math.floor(beginDiff / (24 * 3600 * 1000)); //计算出相差天数  
						if(beginDayDiff < 0){
							this.starTimetype=0;
							this.GetRTime(this.proInfo.FlashSaleStartTime);
						}else{
							this.starTimetype=1;
							this.GetRTime(this.proInfo.FlashSaleEndTime);
						}
					}
				}
			},
			//预览图片
			previewImg(imgurls,index){
			  uni.previewImage({
				current:index,
				urls: imgurls,
				indicator:imgurls.length
			  });
			},
			//获取购物车数量
			async getCartNum(){
				let result = await post("Cart/GoodsCartNum", {
					UserId: uni.getStorageSync("userId"),
					Token: uni.getStorageSync("token")
				});
				if(result.code==0){
					this.CartNum=result.data.Count;
				}else{
					uni.hideToast()
				}
			},
			//获取产品优惠券
			async GetCouponlist(){
				let result = await post("Coupon/CouponCenter", {
					userId:this.userId,
					token:this.token,
					ProId: this.proId,
					TypeId:this.TypeId,
					Page:1,
					PageSize:99
				});
				if(result.code==0){
					if(result.data.length){
						this.CouponList=result.data;
					}
				}
			},
			//领取优惠券
			async ReceiveCoupon(Couponid,index){
				let result =await post("Coupon/GetCoupon", {
					"UserId": this.userId,
					"Token": this.token,
					"CouponId": Couponid
				});
				if (result.code === 0){
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
					this.CouponList[index].Limit--;
					if(this.CouponList[index].Limit==0){
						this.$set(this.CouponList[index],'IsMyAlready',1);
					}
				}else if(result.code === 2){
					uni.hideToast();
					toLogin();
				}
			},
			//评论列表
			async getCommentList(){
			  let res=await post("Order/OrderCommentList",{
				Page:1,
				PageSize: 2,
				ProId:this.proId,
				UserId: this.userId,
				Token: this.token,
			  })
			  if(res.code==0){
				let _this=this
				if(res.data.length){
					_this.hasComment=true;
					this.commentCount = res.count
					res.data.forEach(function(item) {
					  let arr = []
					  for(var i=0;i<item.PicData.length;i++){
						arr.push(item.PicData[i].PicUrl)
					  }
					  _this.$set(item, "imgArr",arr);
						let str = uncodeUtf16(item.ContentText)
						 _this.$set(item,"ContentText",str)
					})
					_this.CommentList=res.data;
				}else{
					_this.hasComment=false;
				}
			   }
			},
			//隐藏暂停视频
			hideVideo(){
				if(!this.isfixed){
					this.isPause=false;
				}else{
					this.isPause=true;
				}
				if(this.proInfo.Video&&this.isplaynow){
					this.isfixed=true;
					this.videoContext.pause();
				}
			},
			// 弹出参数\服务
			showWin(str){
				this.hideVideo();
				if(str=="参数"){
					this.$refs.attrWin.open();
				}else if(str=="服务"){
					this.$refs.serverWin.open();
				}else if(str=="优惠"){
					this.$refs.CouponWin.open();
				}else if(str=="规则"){
					this.$refs.ruleWin.open();
				}
			},
			//展示底部 Sku
			showSku: function(type,GroupRecordId) {
				this.isProData = false;
				let _this=this;
				if(type==1){//替换传给sku组件的值
					this.fromPinTuan=true
					this.GroupRecordId=GroupRecordId
					this.$set(_this.proInfo,'Sku',_this.GroupSku);
				}else{
					// if(this.isLimint==1&&this.starTimetype==0){
					// 	this.remind();
					// 	return
					// }
					this.fromPinTuan=false;
					this.GroupRecordId=0
					this.$set(_this.proInfo,'Sku',_this.ProSku);
				}
				this.showbtntype=type;
				this.showPopupSku=true;
				this.isProData = true;
				this.hideVideo();
			},
			getsku:function(msg){
				 console.log(msg)
			  this.number=msg[0];
			  this.SpecText=msg[1];
			  this.canaddcar=msg[2];
			  this.price=msg[3];
			  this.plusprice=msg[4];
			},
			//统一的关闭popup方法
			hidePopup: function() {
				this.showPopupSku=false
				this.$refs.attrWin.close();
				this.$refs.serverWin.close();
				this.$refs.CouponWin.close();
				this.$refs.ruleWin.close();
				this.$refs.popupShare.close();
			},
			//添加取消收藏
			async collect(){
				let objUrl = ''
				if(this.IsCollect){
					objUrl = "User/ReCollections"
				}else{
					objUrl = "User/AddCollections"
				}
				let result = await post(objUrl, {
					Id: this.proId,
					userId:this.userId,
					token:this.token,
				  });
				if(result.code==0){
					if(this.IsCollect){
						uni.showToast({
							title: "已取消收藏！",
							icon:"none",
							duration: 1500
						});
						this.IsCollect=false;
					}else{
						uni.showToast({
							title: "添加收藏成功！",
							icon:"none",
							duration: 1500
						});
						this.IsCollect=true;
					}
				};
				if(result.code==2){
					uni.hideToast();
					toLogin();
				}
			},
		
			// 拼团
			//拼团商品详情
			async GroupProductInfo(){
				let result = await post("GroupBuy/GroupProductInfo", {
					userId:this.userId,
					token:this.token,
					GroupId: this.GroupId
				});
				if(result.code==0){
					var _this=this;
					this.hasData = true;
					this.GroupproInfo=result.data;
					this.GroupSku=result.data.Sku;
					this.$set(_this.proInfo,'FightingPrice',result.data.FightingPrice);//在普通产品详情添加拼团商品信息，公用一套sku组件
					this.$set(_this.proInfo,'OriginalPrice',result.data.OriginalPrice);
					this.GroupPrice=result.data.FightingPrice;
				}
			},
			//拼团记录
			async getGroupRecordList(){
				let res = await post('GroupBuy/GetGroupRecordList',{
					GroupId: this.GroupId,
					Tpey:0
				})
				if(res.code == 0){
					this.recordList = res.data
					if(this.recordList.length>1){
						this.displayMultiple=2
					}else {
						this.displayMultiple=1
					}
					let time=[]
					res.data.forEach((item)=>{time.push(item.EndTime)})
					this.GroupTime(time)
				}
			}, 
			//参团时间倒计时
			GroupTime(timearr){
				let _this = this;
				var date =[]
				var endtime =[]
				let t=[]
				let d =[]
				let h =[]
				let m =[]
				let s =[]
				for (let i = 0; i<timearr.length;i++){
					date[i] = new Date(timearr[i]);
					endtime[i]= Date.parse(date[i]);
					// console.log(endtime)
					this.timer = setInterval(function() {
						let NowTime = new Date(); //当前时间
						t[i] = endtime[i] - NowTime.getTime();
						if (t[i] > 0) {
							d[i] = Math.floor(t[i] / 1000 / 60 / 60 / 24); //天
							h[i] = Math.floor((t[i] / 1000 / 60 / 60) % 24); //时
							m[i] = Math.floor((t[i] / 1000 / 60) % 60); //分
							s[i] = Math.floor((t[i] / 1000) % 60); //秒
							if (parseInt(d) < 1) {
							d[i] = "";
							} else {
							d[i] = d[i] + "天";
							}
							if (parseInt(h[i]) < 10) {
							h[i] = "0" + h[i];
							}
							if (parseInt(m[i]) < 10) {
							m[i] = "0" + m[i];
							}
							if (parseInt(s[i]) < 10) {
							s[i] = "0" + s[i];
							}
							_this.recordList[i].EndTime=[h[i],m[i],s[i]]
							_this.groupTime[i]=([h[i],m[i],s[i]]) ;
							return [h[i],m[i],s[i]]
						} else {
							clearInterval(this.grouptimer);
						}
					}, 1000);
				}
			},
			
			//限时商品倒计时
			GetRTime(endTime) {
			  let _this = this;
			  //倒计时
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
				this.starTimetype=2;
				clearInterval(this.timer);
			  }
			  }, 1000);
			},
			remind(){
				uni.showToast({
					title: "秒杀还没有开始哦！",
					icon: "none",
					duration: 2000
				});
			},
			//分享app
			sharePlus(){
				uni.share({
				    provider: "weixin",
				    scene: "WXSceneSession",
				    type: 0,
				    href: webUrl+"/#/pages/goods/productDetail/productDetail?proId="+this.proId+"&inCode="+ this.ReferralCode,//分享好友产品带上邀请码
				    title: this.proInfo.Name,
				    summary: this.proInfo.Synopsis,
				    imageUrl: this.proInfo.PicData[0].PicUrl,
				    success: function (res) {
				        console.log("success:" + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log("fail:" + JSON.stringify(err));
				    }
				});
			}, 

		},
		onPageScroll(e){
			if(e.scrollTop>300){
				this.isTop=true;
			}else{
				this.isTop=false;
			}
		},
		onPullDownRefresh(){
			this.Goodsxq();
			this.GetCouponlist();
			this.getCommentList();
			this.getCartNum();
			uni.stopPullDownRefresh();
		},
		 // #ifdef MP-WEIXIN
	    onShareAppMessage: function(e) {
		　　// 设置菜单中的转发按钮触发转发事件时的转发内容
		　　var shareObj = {
		　　　　title: this.proInfo.Name,        // 默认是小程序的名称(可以写slogan等)
		　　　　path: "/pages/goods/productDetail/productDetail?proId="+this.proId+"&inCode="+ this.ReferralCode,        // 默认是当前页面，必须是以‘/’开头的完整路径
		　　　　imageUrl:  this.proInfo.PicData[0].PicUrl, 
		　　　　success: function(res){
		　　　　　　// 转发成功之后的回调
		　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
						console.log("1111111111111111")
		　　　　　　}
		　　　　},
		　　　　fail: function(){
				console.log("22222222222")
		　　　　　　// 转发失败之后的回调
		　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
		　　　　　　　　// 用户取消转发
		　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
		　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
		　　　　　　}
		　　　　},
		　　　　complete: function(){
		　　　　　　// 转发结束之后的回调（转发成不成功都会执行）
					console.log("33333333333333")
		　　　　}
		　　};
		　　return shareObj;
		}
		// #endif
	}
</script>

<style scoped lang="scss">
	@import "./style";
	.productBanner{
		.video{
			position: absolute;
			width:100%;height:750upx;
			left: 0; top:0;
			z-index: 3;
		}
		.video.top{
			top: -2000px;
		}
		.isplay{
			height: 88upx;
			width: 88upx;
			position: absolute;
			left: 50%;
			top: 50%;
			margin: -44upx 0 0 -44upx;
			background: url(http://yd.wtanvxin.com/static/play.png);
			background-size: cover;
			z-index: 2;
		}
	}
	.fixed-area {
		pointer-events: none; // 这里是重点，盒子可穿透操作
		width: 100vw;
		height: 100vh;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 100000;
		.fixed-box {
			pointer-events: auto;
			width: max-content;
			height: auto;
			overflow: hidden;
			z-index: 9999;
			display: flex;
			align-items: center;
			justify-content: center;
			left: 580rpx;
			top: 160rpx;
			.minvideo{
				width: 160rpx;
				height: 240rpx;
				background: #000;
				border: 6rpx solid #FF5000;
				position: relative;
				video{
					width: 100%;
					height: 100%;
				}
				.fixecover{
					width: 160rpx;
					height: 240rpx;
					position: absolute;
					top: -6rpx;
					left: -6rpx;
					z-index: 9998;
				}
				.close{
					height: 40upx;
					width: 40upx;
					display: flex;
					justify-content: center;
					align-items: center;
					line-height: 40upx;
					/* #ifdef APP-PLUS */
					line-height: 24upx;
					/* #endif */
					border-radius: 50%;
					background: rgba(0,0,0,.6);
					position: absolute;
					top: 4upx;
					right: 4upx;
					color: #fff;
					z-index: 9999;
					font-size: 32upx;
					text-align: center;
				}
			}
		}
	}

</style>
