<template>
	<view>
		<view class="walletBox">
			<view class="bg">
				<view class="wallet">
					<view class="reveal">
						<view class="revealTitle">我的喜币</view>
						<view class="allMoney">{{Math.floor(userInfo.Wallet*10)}}</view>
						<text>可提现：¥{{userInfo.Wallet}}</text>
					</view>
					<view class="present">
						<view @click="golink('/pages/Wallet/withdraw/withdraw?type=2')">提现</view>
					</view>
				</view>
			</view>
			
		</view>
		<view class="xiBi">
			<view class="xiItem" :class="rechargeIndex==index?'active':''" v-for="(item,index) in RechargeList" :key="index" @click="selRechar(item.RechargeAmount,index)">
				<view class="xb">
					<image src="http://yd.wtanvxin.com/static/xibi.png" mode=""></image>
					{{item.RechargeAmount*10}}
				</view>
				<text>￥{{item.RechargeAmount}}</text>
			</view>
			
			<view class="xiItem">
				<view class="xb" v-if="iptvalue">
					<image src="http://yd.wtanvxin.com/static/xibi.png" mode=""></image>
					{{iptvalue*10}}
				</view>
				<view class="flex-center" style="padding: 0 20upx; line-height: 1.5;">
					￥
					<input v-if="iptvalue" type="number" placeholder="其它金额" v-model="iptvalue" @input="getCustomMoney">
					<input v-else type="number" placeholder="其它金额" v-model="iptvalue" @input="getCustomMoney">
				</view>
			</view>
		</view>
		<view class="pay-hd ">选择支付方式</view>
		<view class="pay-bd line-list">
			<block v-for="(item,index) in payway" :key="index"> 
				<view class="line-item flex-between" @click="tabBtn(item.type)">
				  <view class="item-l flex-start">
					<view :class="['icon',item.className]"></view>
					<view class="lab">{{item.typeName}}</view>
				  </view>
				  <view class="item-r">
					<view style="margin: 0;" :class="['IconsCK IconsCK-radio',payType==index?'checked':'']"></view>
				  </view>
				</view>
			</block>
		</view>
		<view class="ftbtn pd15 uni-mt10">
			<view class="btn" @click="payBtn">立即充值</view>
		</view>
	</view>
</template>

<script>
	import {host,post,get,toLogin,getUrlParam} from '@/common/util.js';
	export default {
		data() {
			return {
				userId:'',
				token:'',
				Page:1,
				rechargeId:0,
				RechargeList:[],
				rechargeIndex:null,
				customMoney:'',
				iptvalue:'',
				userInfo:{},
				payway:[{
					type:0,
					typeName:"微信支付",
					className:"icon_weixin"
				}
				// #ifdef APP-PLUS||H5
				,{
					type:1,
					typeName:"支付宝",
					className:"icon_alipay"
				}
				// #endif
				],
				payType:0, //0微信支付
				WxOpenid:'',//微信支付
				WxCode:'',
				isshowalipay:false,
				alipayCon:"",
			}
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.getRechargeList()
			this.getUserInfo()
		},
		methods: {
			golink(url){uni.navigateTo({
				url:url
			})},
			async getRechargeList(){
				let res = await post('Recharge/RechargeList',{
					UserId:this.userId,
					Token:this.token,
					Page:this.Page
				})
				if(res.code==0){
					this.RechargeList=res.data
				}
			},
			selRechar(money,index){
				//this.rechargeId=id 
				this.rechargeIndex=index
				this.customMoney=money
			},
			getCustomMoney(e){
				this.$nextTick(() => {
				  let val = e.target.value.toString();
				  val=val.replace(/^\D*(\d*(?:\.\d{0,1})?).*$/g, '$1');	//保留1位小数	 
				 //this.rechargeId=0
				 this.rechargeIndex=null
				 this.iptvalue=val
				 this.customMoney=val
				});
			},
			async getUserInfo(){
				let res = await post('User/GetMemInfo',{
					UserId:this.userId,
					Token:this.token
				})
				if(res.code==0){
					this.userInfo=res.data
				}
			},
			// 判断浏览器环境
			isWeixin() {
			    var ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i)=="micromessenger") {
					return true;
				} else {
					return false;
				}
			},
			tabBtn(index){
				this.payType=index;
			},
			payBtn(){
				if(this.customMoney>0){
					if(this.payType==0){
						// #ifdef  H5
						if(this.isWeixin()){
							this.AddRecharge();
						}else{
							this.H5AddRecharge();
						}
						// #endif
						// #ifdef MP-WEIXIN
						this.ConfirmWeiXinSmallPay()
						// #endif
						// #ifdef APP-PLUS
						this.AppAddRecharge();
						// #endif
					}else if(this.payType==1){
						// #ifdef APP-PLUS
						this.AppAddRecharge();
						// #endif
						// #ifdef H5
						if(this.isWeixin()){
							uni.showToast({
								title:"微信暂不支持支付宝支付，请在浏览器中打开！",
								icon:"none",
								duration:2500
							})
						}else{
							this.H5ZfbRecharge();
						}
						// #endif
					}
				}else{
					uni.showToast({
						title: "请输入充值金额",
						icon: "none",
						duration: 1500
					});
				}
			},
			//app支付(payType:0 微信app 1：支付宝app)
			async AppAddRecharge() {
				if(this.payType==0){
					var apiUrl="Order/WechatPayCZYE"
					var provider="wxpay"
				}else if(this.payType==1){
					var apiUrl="Order/AliPayCZYE"
					var provider="alipay"
				}
				let result = await post(apiUrl, {
					UserId: this.userId,
					Token: this.token,
					RechargeAmount:this.customMoney,
					paytype:2
				})
				if(result.code==0){console.log(result.data)
					let _this=this;
					if(this.payType==0){
						var orderInfo=result.data.JsParam
					}else if(this.payType==1){
						var orderInfo=result.data
					}
					uni.requestPayment({
					  provider:provider,
					  orderInfo:orderInfo,
					  success(res) {
						  console.log(res)
						  uni.showToast({
						  	title:"充值成功",
						  })
						  setTimeout(res=>{
							  uni.navigateBack({})
						  },1500)
						},
					  fail(err) {console.log(err)
						  uni.showToast({
						  	title:"充值失败",
							icon:"none",
						  })
					  }
					})
				}else {
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 1500
					});
				}
			},
			//微信付款
			async AddRecharge(){
				let NewUrl=this.GetUrlRelativePath() +'/#/pages/tabBar/my/topup';
				let result= await post("Order/WechatPayCZYE",{
					UserId: this.userId,
					Token: this.token,
					RechargeAmount:this.customMoney,
					WxOpenid: this.WxOpenid,
					WxCode: this.WxCode,
					NewUrl: NewUrl,
					paytype:0
				});
				if (result.code == 201) {
					window.location.href=result.data;
				}else if(result.code == 0){
					uni.setStorageSync('openId', result.data.openid);
					this.WxOpenid = uni.getStorageSync("openId");
					if(this.WxOpenid!=""&&this.WxOpenid!="undefined"){
						this.WxCode="";//每次获取的code只能使用一次，有openid时用openid调起支付数据
					}
					this.callpay(result.data.JsParam);
				}else {
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 1500
					});
				}
			},
			//非微信环境 使用微信支付H5
			async H5AddRecharge(){
				let NewUrl=this.GetUrlRelativePath() +'/#/pages/tabBar/my/wallet';
				let result= await post("Order/WechatPayCZYE",{
					UserId: this.userId,
					Token: this.token,
					RechargeAmount:this.customMoney,
					NewUrl: NewUrl,
					paytype:3
				});
				if(result.code == 0){
					window.location.href = result.data.mweb_url;
				}else {
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 1500
					});
				}
			},
			//支付宝支付H5
			async H5ZfbRecharge(){
				let NewUrl=this.GetUrlRelativePath() +'/#/pages/tabBar/my/wallet';
				let result= await post("Order/AliPayCZYE",{
					UserId: this.userId,
					Token: this.token,
					RechargeAmount:this.customMoney,
					NewUrl: NewUrl,
					QuitUrl:NewUrl,
					paytype:3
				});
				if(result.code == 0){
					this.isshowalipay=true;
					this.alipayCon=result.data;console.log(result.data)
					this.$nextTick().then(() => {
						 document.forms['alipaysubmit'].submit()
					})
				}else {
					uni.showToast({
						title: result.msg,
						icon: "none",
					});
				}
			},
			//小程序支付
			async ConfirmWeiXinSmallPay(){
				  let result= await post("Order/WechatPayCZYE",{
					WxCode: this.WxCode,
					UserId: this.userId,
					Token: this.token,
					RechargeAmount:this.customMoney,
					WxOpenid:this.WxOpenid,
					paytype:4
				  });
				  var payData=JSON.parse(result.data.JsParam)
				  if(result.code===0){
					let _this=this;
					uni.requestPayment({
					  timeStamp: payData.timeStamp,
					  nonceStr: payData.nonceStr,
					  package: payData.package,
					  signType: payData.signType,
					  paySign: payData.paySign,
					  success(res) {
						  uni.showToast({
						  	title:"充值成功",
						  })
						  setTimeout(res=>{
							uni.navigateBack({})
						  },1500)
					  },
					  fail(res) {}
					})
				  }
			},
			callpay(param) {
				if(typeof WeixinJSBridge === 'undefined') {
					if(document.addEventListener) {
						document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(), false);
					} else if(document.attachEvent) {
						document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady());
						document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady());
					}
				} else {
					this.onBridgeReady(param);
				}
			},
			onBridgeReady(param){
				var parameter = JSON.parse(param);
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', parameter,
					function(res){
					if(res.err_msg == "get_brand_wcpay_request:ok" ){
					// 使用以上方式判断前端返回,微信团队郑重提示：
					//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
						uni.showToast({
							title:"充值成功",
						})
						setTimeout(res=>{
						  uni.navigateBack({})
						},1500)
					}else{
						uni.showToast({
							title: "支付失败",
							icon: "none",
							duration: 1500
						});
					} 
			  }); 
			},
			getcode(){
			    let _this=this;
				uni.login({
					success: function(res) {
					  if (res.code) {
						_this.WxCode=res.code;
					  } else {
						console.log('登录失败！' + res.errMsg)
					  }
					}
				});
			},
			//获取域名
			GetUrlRelativePath() {
				var urlStr = '';
				var url = document.location.toString();
				var arrUrl = url.split("//");
				var start = arrUrl[1].split("/");
				urlStr = arrUrl[0] + '//' + start[0];
				return urlStr;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.walletBox{
		margin-top: 30rpx;
		background-color: #fff;
		padding: 30rpx;
		.bg{
			height: 320rpx;
			width: 100%;
			background: url(http://yd.wtanvxin.com/static/walletXi.png) no-repeat;
			background-size: 100% 100%;
			border-radius: 10rpx;
			.wallet{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 70rpx 30rpx 0 40rpx;
				.reveal{
					color: #fff;
					.revealTitle{
						font-size: 32rpx;
					}
					.allMoney{
						font-size: 60rpx;
						font-weight: 600;
					}
					text{
						font-size: 28rpx;
					}
				}
				.present{
					color: #f2ad0f;
					font-size: 28rpx;
					view{
						margin-bottom: 20rpx;
						background-color: #fff;
						width: 180rpx;
						height: 70rpx;
						text-align: center;
						line-height: 70rpx;
						border-radius: 10rpx;
						
					}
				}
			}
		}
	}
	.xiBi{
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		// justify-content: space-between;
		margin-top: 20rpx;
		background-color: #fff;
		padding: 20rpx 30rpx;
		.xiItem{
			width: 215rpx;
			height: 160rpx;
			border-radius: 10rpx;
			box-sizing: border-box;
			background-color: #f6f6f6;
			margin-bottom: 20rpx;
			text-align: center;
			margin-right:20rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			&:nth-of-type(3n){
				margin-right: 0;
			}
			image{
				width: 30rpx;
				height: 30rpx;
				display: inline-block;
				margin-right: 10rpx;
			}
			.xb{
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 40rpx;
				font-size: 36rpx;
				font-weight: 600;
				text-align: center;
				line-height: 1;
			}
			text{
				font-size: 30rpx;
				color: #999;
			}
			
			&.active{
				border: 1rpx solid #FF3333;
			}
			&:last-of-type{
				line-height: 160rpx;
			}
		}
		
	}

.pay-hd{ background-color: #fff; margin-top: 20rpx; padding: 20rpx 30rpx 0; font-size: 32upx; font-weight: 600}
	.pay-bd .line-item .icon {
	    height: 72upx;
	    width: 72upx;
	}
	.line-list .line-item {
	    padding: 15px 30rpx;
	    position: relative;
	}
	.pay-bd .line-item .lab{ padding-left: 20upx; font-size: 30upx}
	.icon_alipay {
	    background: url(http://yd.wtanvxin.com/static/pay_alipay.png) center center no-repeat;
	    background-size: cover;
	}
	.icon_weixin {
	    background: url(http://yd.wtanvxin.com/static/pay_weixin.png) center center no-repeat;
	    background-size: cover;
	}
	.icon_yinlian {
	    background: url(http://yd.wtanvxin.com/static/pay_yinlian.png) center center no-repeat;
	    background-size: cover;
	}
	.icon_yue {
	    background: url(http://yd.wtanvxin.com/static/pay_yue.png) center center no-repeat;
	    background-size: cover;
	}
	.real-ipt{ width: 400upx; margin: 0 auto; font-size: 36upx;border: 1px solid #ddd; padding: .1rem;}
</style>
