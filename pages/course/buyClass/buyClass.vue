<template>
	<view class="scoreExchange">
		<view class="line"></view>
		<view class="con">
			<view class="con_1"><image :src="classdetail.PicImg" mode="aspectFill"></image></view>
			<view class="con_2">
				<view class="title">{{ classdetail.Name }}</view>
				<view class="title_1">{{ classdetail.TargetName }} | {{ classdetail.DifficultyName }} | {{ classdetail.CourseDuration }}分钟</view>
				<view class="title_2">{{ classdetail.StoreNick }}</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="priceAll">
			<view class="price_1">
				<view class="price_1_1">课程原价</view>
				<view class="price_1_2">￥{{ classdetail.Price }}</view>
			</view>
			<view class="price_2">
				<view class="price_1_1">优惠券</view>
				<view class="price_1_2">暂无可用</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="pay">
			<view class="pay-bd line-list">
				<block v-for="(item, index) in payway" :key="index">
					<view class="line-item flex-between" @click="tabBtn(item.type)">
						<view class="item-l flex-start">
							<view :class="['icon', item.className]"></view>
							<view class="lab">{{ item.typeName }}</view>
						</view>
						<view class="item-r"><view style="margin: 0;" :class="['IconsCK IconsCK-radio', payType == item.type ? 'checked' : '']"></view></view>
					</view>
				</block>
			</view>
		</view>
		<view class="mask" v-if="showMask"></view>
		<view v-if="showMask" class="toastMask">
			<view class="toast_title">您还未设置支付密码，无法使用余额支付，是否马上设置？</view>
			<view class="flex taost_btn">
				<view class=" btn_tt btn_no1" @click="showMask = false">取消</view>
				<view class=" btn_tt btn_no2" @click="tolink('/pages/other/ChangepayPwd/ChangepayPwd?nopwd=1')">确认</view>
			</view>
		</view>
		<pay v-on:hidePay="hidePay" v-on:getPassword="getPassword" v-if="showPay" :allprice="allprice"></pay>
		<view class="foot">
			总计：
			<view class="score">￥{{ classdetail.Price }}</view>
			<view class="payfor" @click="submitBtn">提交</view>
		</view>
	</view>
</template>

<script>
import { post,debounce } from '@/common/util.js';
import pay from '@/components/pay.vue';
export default {
	components: { pay },
	data() {
		return {
			userId: '',
			token: '',
			classdetail: {},
			Id: 0,
			payType: 0, //0微信支付
			payway: [
				{
					type: 0,
					typeName: '微信支付',
					className: 'icon_weixin'
				},
				// #ifndef MP-WEIXIN
				{
					type: 1,
					typeName: '支付宝',
					className: 'icon_alipay'
				},
				// #endif
				{
					type: 2,
					typeName: '余额支付',
					className: 'icon_yue'
				}
			],
			showPay: false, //支付密码弹框
			MemberWallet: 0, //会员余额
			Score: 0, //会员积分
			hasPayPassword: 0, //是否设置支付密码
			allprice: '0',
			showMask: false,
			inCode:0,
			orderNo:'',
			WxOpenid: '',
			WxCode: '',
		};
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Id = e.classId;
		if(e.inCode){
			this.inCode = e.inCode
		}
		this.getClassDetail();
	},
	onShow() {
		this.GetMemInfo();
		this.showMask = false;
		this.WxOpenid = uni.getStorageSync('openId');
		// #ifdef  MP-WEIXIN
		this.getcode();
		// #endif
	},
	methods: {
		//跳转
		tolink(Url) {
			uni.navigateTo({
				url: Url
			});
		},
		// 课程详情
		async getClassDetail() {
			let result = await post('Course/GetCourse_Outline_xq', {
				OutlineId: this.Id,
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.classdetail = result.data;
				this.allprice = this.classdetail.Price.toString();
			}
		},
		//获取账户信息
		async GetMemInfo() {
			let result = await post('User/GetMemInfo', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				// this.IsPlus=result.data.IsPlus;
				// this.username=result.data.Mobile;
				this.MemberWallet = result.data.Wallet;
				this.Score = result.data.Score;
				this.hasPayPassword = result.data.IsSetPayPwd;
			}
		},
		tabBtn(index) {
			this.payType = index;
		},
		//关闭支付密码弹窗
		hidePay(e) {
			this.showPay = false;
		},
		//立即支付
		submitBtn() {
			if (this.payType == 0) {
				debounce(()=>{
					this.CourseBuy();
				})
				
			} else if (this.payType == 1) {
				uni.showToast({
					title: '暂不支持支付宝支付！',
					icon: 'none',
					duration: 2500
				});
			} else if (this.payType == 2) {
				//余额
				if (this.hasPayPassword == 1) {
					if (this.MemberWallet < this.classdetail.Price) {
						uni.showToast({
							title: '余额不足，请选择其他支付方式！',
							icon: 'none',
							duration: 2000
						});
					} else {
						this.showPay = true;
					}
				} else {
					this.showMask = true;
				}
			}
		},
		//接收支付密码
		getPassword(Password) {
			this.ConfirmPay(Password);
		},
		//余额支付
		async ConfirmPay(Password) {
			let result = await post('Course/CourseBuy', {
				UserId: this.userId,
				Token: this.token,
				OutlineId: this.Id,
				IsPayWallet: 1,
				IsPayScore: 0,
				Password: Password,
				ShareId:this.inCode
			});
			if (result.code === 200) {
				this.showPay = false;
				uni.redirectTo({
					url: '/pages/course/buyClassSuc/buyClassSuc'
				});
			} else if (result.code === 102) {
				//#ifndef APP-PLUS
				uni.showModal({
					content: '您还没有设置支付密码，去设置？',
					success(res) {
						if (res.confirm) {
							uni.redirectTo({
								url: '/pages/other/ChangepayPwd/ChangepayPwd?nopwd=1'
							});
						} else if (res.cancel) {
						}
					}
				});
				//#endif
				//#ifdef APP-PLUS
				this.$showModal({
					content: '您还没有设置支付密码，去设置？'
				})
					.then(res => {
						uni.redirectTo({
							url: '/pages/other/ChangepayPwd/ChangepayPwd?nopwd=1'
						});
						//确认
					})
					.catch(res => {
						//取消
					});
				//#endif
			} else {
				let _this = this;
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 1500
				});
			}
		},
		//支付前提交订单
		async CourseBuy(){
			let result = await post('Course/CourseBuy', {
				UserId: this.userId,
				Token: this.token,
				OutlineId: this.Id,
				IsPayWallet: 0,
				IsPayScore: 0,
				ShareId:this.inCode
			});
			if(result.code==0){
				this.orderNo=result.data
				setTimeout(()=>{
					this.ConfirmWeiXinSmallPay()
				},1000)
			}
		},
		getcode() {
			let _this = this;
			uni.login({
				success: function(res) {
					if (res.code) {
						_this.WxCode = res.code;
					} else {
						console.log('登录失败！' + res.errMsg);
					}
				}
			});
		},
		//小程序支付
		async ConfirmWeiXinSmallPay() {
			let result = await post('Order/WechatPayCourse', {
				WxCode: this.WxCode,
				UserId: this.userId,
				Token: this.token,
				OrderNo: this.orderNo,
				WxOpenid: this.WxOpenid,
				paytype: 4
			});
			var payData = JSON.parse(result.data.JsParam);
			if (result.code === 0) {
				let _this = this;
				uni.requestPayment({
					timeStamp: payData.timeStamp,
					nonceStr: payData.nonceStr,
					package: payData.package,
					signType: payData.signType,
					paySign: payData.paySign,
					success(res) {
						_this.type = '';
						_this.showPay = false;
						uni.redirectTo({
							url: '/pages/payresult/payresult?allprice=' + _this.orderInfo.TotalPrice + '&orderNo=' + _this.orderNo
						});
					},
					fail(res) {}
				});
			}
		},
	}
};
</script>

<style lang="scss" scoped>
@import './style';
.mask {
	z-index: 999;
}
.toastMask {
	position: fixed;
	background: #ffffff;
	z-index: 1000;
	top: 50%;
	left: 50%;
	width: 600upx;
	height: 300upx;
	border-radius: 25upx;
	transform: translate(-50%, -50%);
	.toast_title {
		height: 200upx;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 30upx;
		font-size: 30upx;
		fong-weight: 600;
		border-bottom: 1upx solid #f5f5f5;
	}
	.taost_btn {
		.btn_tt {
			width: 50%;
			text-align: center;
			height: 100upx;
			line-height: 100upx;
		}
		.btn_no2 {
			color: $primary;
			border-left: 1upx solid #f5f5f5;
		}
	}
}
.line-list .line-item::before {
	background-color: white;
}
.line-list .line-item {
	padding: 4px 15px;
}
.pay-bd .line-item .icon {
	height: 45upx;
	width: 45upx;
}
.pay-bd .line-item .lab {
	padding-left: 20upx;
	font-size: 26upx;
}
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
</style>
