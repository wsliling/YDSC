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
				<view class="price_1_1">需要积分</view>
				<view class="price_1_2">{{ classdetail.Score }}积分</view>
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
			<view class="score">{{ classdetail.Score }}积分</view>
			<view class="exchange" @click="submitBtn">兑换</view>
		</view>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
import pay from '@/components/payScore.vue';
export default {
	components: { pay },
	data() {
		return {
			userId: '',
			token: '',
			classdetail: {},
			Id: 0,
			showPay: false, //支付密码弹框
			MemberWallet: 0, //会员余额
			Score: 0, //会员积分
			hasPayPassword: 0, //是否设置支付密码
			allprice: '0',
			showMask: false
		};
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Id = e.classId;
		this.getClassDetail();
	},
	onShow() {
		this.GetMemInfo();
		this.showMask = false;
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
				this.allprice = this.classdetail.Score.toString();
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
		//关闭支付密码弹窗
		hidePay(e) {
			this.showPay = false;
		},
		//兑换按钮
		submitBtn() {
			//积分
			if (this.hasPayPassword == 1) {
				if (this.Score < this.classdetail.Score) {
					uni.showToast({
						title: '积分不足，请选择其他支付方式！',
						icon: 'none',
						duration: 2000
					});
				} else {
					this.showPay = true;
				}
			} else {
				this.showMask = true;
			}
		},
		//接收支付密码
		getPassword(Password) {
			this.ConfirmPay(Password);
		},
		//积分兑换
		async ConfirmPay(Password) {
			let result = await post('Course/CourseBuy', {
				UserId: this.userId,
				Token: this.token,
				OutlineId: this.Id,
				IsPayWallet: 0,
				IsPayScore: 1,
				Password: Password
			});
			if (result.code === 200) {
				this.showPay = false;
				uni.redirectTo({
					url: '/pages/course/exchangeClassSuc/exchangeClassSuc'
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
		}
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
</style>
