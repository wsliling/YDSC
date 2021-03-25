<template>
	<!-- 余额充值 -->
	<view class="wallet">
		<view style="height: 20upx;"></view>
		<view class="walletbox">
			<view class="across">
				<view class="withdraw">充值金额</view>
				<view class="drawing" >
					<view class="sign">¥</view>
					<!-- #ifdef MP-WEIXIN -->
					<input class="sign signs" type="digit" v-model="money" @input="checkPrice" placeholder="请输入要充值的金额" placeholder-style="font-size:30rpx;font-family:PingFang;font-weight:normal;" />
					<!-- #endif -->
					<!-- #ifndef MP-WEIXIN -->
					<input class="sign signs" type="digit" v-model="money" @input="checkPrice" placeholder="请输入要充值的金额" placeholder-class="sign2"/>
					<!-- #endif -->
				</view>
			</view>
			<!-- <view class="carry">该卡本次最多可充值¥20000</view> -->
			<view class="pay-hd uni-mb10">选择支付方式</view>
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
		</view>
		<view class="present">
			<view class="recharge" @click="Submit">确认充值</view>
		</view>
		<!-- 支付宝H5表单 -->
		<view class="alipayfram" v-if="isshowalipay">
			<view id="alipayfram" v-html="alipayCon"></view>
		</view>
	</view>
</template>

<script>
	import {host,post,get,toLogin,getUrlParam} from '@/common/util.js';
	export default {
		data(){
			return{
				userId: "",
				token: "",
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
				money:"",//充值金额
				WxOpenid:'',//微信支付
				WxCode:'',
				isshowalipay:false,
				alipayCon:"",
			}
		},
		onLoad() {
			// #ifdef H5
			this.WxCode=getUrlParam("code");
			this.WxOpenid = uni.getStorageSync("openId");
			if(this.WxCode){//首次跳转获取code地址都直接调起支付
				this.payweixin()
			}
			// #endif
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			// #ifdef  MP-WEIXIN
			this.WxOpenid = uni.getStorageSync("openId");
			this.getcode();
			// #endif
			// #ifdef H5
			this.WxOpenid = uni.getStorageSync("openId");
			// #endif
		},
		methods:{
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
			checkPrice(e){
				this.$nextTick(() => {
				  let val = e.target.value.toString();
				  val=val.replace(/^\D*(\d*(?:\.\d{0,1})?).*$/g, '$1');	//保留1位小数	 
				 this.money=val
				});
			},
			Submit(){
				if(this.money>0){
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
					RechargeAmount:this.money,
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
					RechargeAmount:this.money,
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
					RechargeAmount:this.money,
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
					RechargeAmount:this.money,
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
					RechargeAmount:this.money,
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

<style scoped>
	.alipayfram{
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0; top: 0;
		background: #fff;
		z-index: 999;
	}
	.wallet{
	}
	.walletbox{
		background: #FFFFFF;
		padding: 30rpx;
	}
	.across{
		justify-content: space-between;
		padding-bottom: 30rpx;
		border-bottom:1px solid rgba(236,236,236,1);
	}
	.drawing{
		display: flex;
		align-items: center;
	}
	.present{
		padding: 60rpx 30rpx 0 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family:PingFang;
		font-weight:500;
		color:rgba(255,255,255,1);
	}
	.recharge{
		width:100%;
		height:88rpx;
		background:#FF3333;
		border-radius:10rpx;
		font-size:32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.withdraw{
		font-size:30rpx;
		font-family:PingFang;
		font-weight:bold;
		color:rgba(51,51,51,1);
		line-height:120rpx;
	}
	.sign{
		font-size:35upx;
		font-family:PingFang;
		font-weight:bold;
		color:rgba(51,51,51,1);
	}
	.sign2{
		font-size:30upx;
		font-family:PingFang;
		font-weight:normal;
		color:#999;

	}
	.signs{
		display: flex;
		padding: 0 20upx;
		height: 80upx;
		font-size:50upx;
	}
	.carry{
		font-size:24rpx;
		font-family:PingFang;
		font-weight:500;
		color:#999999;
		padding-top: 25rpx;
	}
		
	.pay-hd{ padding: 20upx 0 0; font-size: 32upx; font-weight: 600}
	.pay-bd .line-item .icon {
	    height: 72upx;
	    width: 72upx;
	}
	.line-list .line-item {
	    padding: 15px 0;
	    position: relative;
	}
	.pay-bd .line-item .lab{ padding-left: 20upx; font-size: 30upx}
	.icon_alipay {
	    background: url(http://xcx.yixijiu19.com/static/pay_alipay.png) center center no-repeat;
	    background-size: cover;
	}
	.icon_weixin {
	    background: url(http://xcx.yixijiu19.com/static/pay_weixin.png) center center no-repeat;
	    background-size: cover;
	}
	.icon_yinlian {
	    background: url(http://xcx.yixijiu19.com/static/pay_yinlian.png) center center no-repeat;
	    background-size: cover;
	}
	.icon_yue {
	    background: url(http://xcx.yixijiu19.com/static/pay_yue.png) center center no-repeat;
	    background-size: cover;
	}
	.real-ipt{ width: 400upx; margin: 0 auto; font-size: 36upx;border: 1px solid #ddd; padding: .1rem;}
</style>
