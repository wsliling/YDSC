<template>
	<view class="warp">
		<!-- <view style="height:20upx"></view> -->
		<view class="steps">
			<view class="stepsStatus">{{ orderinfo.StatuName }}</view>
			<view class="stepsitem">
				<view class="itembox" v-for="(item, index) in optionsList" :key="index">
					<text class="iconfont icon-gou1" v-if="index <= active" :style="{ background: '#fff', color: '#ff3333', top: '0' }"></text>
					<text v-else></text>
					<view v-if="index <= active" style="color: #fff;">{{ item.title }}</view>
					<view v-else>{{ item.title }}</view>
					<view class="active" v-if="index < active" :style="{ background: '#fff' }"></view>
					<view class="active" v-else></view>
				</view>
			</view>
		</view>
		<!-- <view class="tip">
			您的服务单已申请成功，待售后审核。<text class="iconfont icon-arrow_r"></text>
		</view> -->
		<view class="outside">
			<view class="pictrueAll">
				<view class="pictrue"><image :src="orderinfo.ProductImg" mode=""></image></view>
			</view>
			<view class="txtBox">
				<view class="title">{{ orderinfo.ProductName }}</view>
				<view class="protype">{{ orderinfo.ProductSkuName }}</view>
				<view class="pronumber">
					<text class="price">￥{{ orderinfo.ProductPrice }}</text>
					<text class="number">x{{ orderinfo.Number }}</text>
				</view>
			</view>
		</view>
		<view class="content" style="margin-top: 20rpx;">
			<view class="contentitem">
				<text>售后状态：</text>
				<text>{{ orderinfo.StatuName }}</text>
			</view>
			<view class="contentitem">
				<text>退款/退货原因：</text>
				<text>{{ orderinfo.RefuseReason }}</text>
			</view>
			<view class="contentitem">
				<text>退款金额：</text>
				<text class="price">￥{{ orderinfo.RefundMoney }}</text>
			</view>
			<view class="contentitem">
				<text>申请件数：</text>
				<text>{{ orderinfo.Number }}</text>
			</view>
			<view class="contentitem">
				<text>申请时间：</text>
				<text>{{ orderinfo.TimeStr }}</text>
			</view>
			<view class="contentitem" v-if="orderinfo.IsShowAddress == 1">
				<text>退货地址：</text>
				<text>{{ orderinfo.RefundAddress }}</text>
			</view>
			<view class="contentitem" v-if="orderinfo.ExpressId != ''">
				<text>物流单号：</text>
				<text>{{ orderinfo.ExpressId }}</text>
			</view>
		</view>
		<view class="kefubox">
			<view class="kefuitem addrightborder" @click="phonecall">
				<view class="uni-icon uni-icon-phone-filled kefuicon"></view>
				<text>拨打电话</text>
			</view>
			<!--#ifdef MP-WEIXIN-->
			<button open-type="contact" class="kefuitem">
				<view class="uni-icon uni-icon-contact kefuicon"></view>
				<text>在线客服</text>
			</button>
			<!--#endif-->
			<!--#ifdef APP-PLUS || H5 -->
			<view class="kefuitem" @click="toKefu">
				<view class="uni-icon uni-icon-contact kefuicon"></view>
				<text>在线客服</text>
			</view>
			<!--#endif-->
		</view>
		<view class="submitbtn" @click="submitbtn" v-if="(orderinfo.Status == 9 || orderinfo.Status == 10) && orderinfo.ExpressId == ''">请填写寄回信息单号</view>
		<view class="submitbtn" @click="submitbtn" v-if="(orderinfo.Status == 9 || orderinfo.Status == 10) && orderinfo.ExpressId != ''">修改寄回信息单号</view>
		<!-- 填写寄回信息 -->
		<view class="shadeAll" v-show="isShowShade2">
			<view style="width: 100%;height: 100%;" @click="closeshade"></view>
			<view class="allbox">
				<view class="boxhead">填写寄回信息</view>
				<view class="wuliubox" style="margin-top:0;">
					<view class="wuliu" @click="showCompany">
						<view class="wuliushop">物流公司</view>
						<view class="wuliuname">{{ company }}</view>
						<uni-icon size="24" type="arrowright"></uni-icon>
					</view>
					<view class="wuliu">
						<view class="wuliushop">物流单号</view>
						<input class="wuliuinput" type="text" placeholder="请输入物流单号" v-model="ExpressNo" />
					</view>
				</view>
				<view style="padding:20upx"><view class="submitbtn" style="margin-bottom:20upx;" @click="btnRefundExpress">确定</view></view>
			</view>
		</view>
		<!-- 快递公司列表 -->
		<!-- <view class="selectTypeShade" v-show="isShowShade">
		    <view class="mask"></view>
		    <view class="shade alignBottom__shade">
		    <view class="shade__bd">
		      <view class="shade__head">
		        <view class="headtext" @click="shadeClose">取消</view>
		        <view class="headtext" @click="sureCancleOrder">确定</view>
		      </view>
		      <view class="shadeContent__bd" v-show="isShowShade">
		        <picker-view class="reasonList" indicator-style="height: 80upx;" @change="bindChangeReason">
		          <picker-view-column>
		            <view class="shadeitem" v-for="(item1, index1) in companyData" :key="index1">{{item1.company}}</view>
		          </picker-view-column>
		        </picker-view>
		      </view>
		    </view>
		  </view>
		</view> -->
		<pickers v-if="isShowShade" :arr="companyData" :show.sync="isShowShade" @success="bindChangeReason"></pickers>
	</view>
</template>

<script>
import { host, post, get } from '@/common/util.js';
import pickers from '@/components/pickers';
export default {
	components: { pickers },
	data() {
		return {
			isShowShade: false, //寄回信息弹窗
			isShowShade2: false, //快递公司弹窗
			userId: '',
			token: '',
			orderNo: '',
			RefundId: '',
			orderinfo: {},
			proinfo: {},
			ExpressNo: '', //退换货快递单号
			company: '请选择物流公司', //选择的快递公司
			companyId: '', //快递公司Id
			companyData: [
				{
					Id: 0,
					code: '',
					company: '请选择物流公司',
					message: '请选择物流公司'
				}
			], //快递公司列表
			info: {},
			optionsList: [
				{
					title: '申请'
				},
				{
					title: '审核'
				},
				{
					title: '完成'
				}
			],
			active: 0,
			activeColor: '#000',
			tel: ''
		};
	},
	computed: {},
	onLoad: function(option) {
		this.orderNo = option.orderNo;
		this.RefundId = option.RefundId;
	},
	onShow: function() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getAppCourseDetails();
		this.getInfo();
		this.getExpressCompanyList();
	},
	methods: {
		toKefu() {
			uni.navigateTo({
				url: '/pages/member/kefu/kefu'
			});
		},
		//打开寄回信息单号
		submitbtn() {
			this.isShowShade2 = true;
		},
		//关闭寄回信息单号
		closeshade() {
			this.isShowShade2 = false;
		},
		//选择快递公司
		showCompany() {
			this.isShowShade = true;
		},
		//点击取消
		shadeClose() {
			this.isShowShade = false;
			this.companyId = '';
			this.company = '请选择物流公司';
		},
		//点击确定
		sureCancleOrder() {
			this.isShowShade = false;
		},
		//提交寄回信息
		btnRefundExpress() {
			if (this.VerifyExpress()) {
				if (this.orderinfo.Status == 9) {
					//退货
					this.SubmitRefundExpress();
				} else if (this.orderinfo.Status == 10) {
					//换货
					this.SubmitBarterExpress();
				}
			}
		},
		//验证填写的寄回信息
		VerifyExpress() {
			if (this.company == '请选择物流公司') {
				uni.showToast({
					title: '请选择物流公司！',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (this.ExpressNo == '') {
				uni.showToast({
					title: '请输入物流单号！',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			return true;
		},
		//换货快递单号
		async SubmitBarterExpress() {
			let result = await post('Order/SubmitBarterExpress', {
				UserId: this.userId,
				Token: this.token,
				OrderNo: this.orderNo,
				ExpressName: this.companyId,
				ExpressNo: this.ExpressNo,
				RefundId: this.RefundId
			});
			if (result.code === 0) {
				uni.showToast({
					title: '寄回信息提交成功！',
					icon: 'none',
					duration: 2000
				});
				this.isShowShade2 = false;
			} else {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 2000
				});
			}
		},
		//退货快递单号
		async SubmitRefundExpress() {
			let result = await post('Order/SubmitRefundExpress', {
				UserId: this.userId,
				Token: this.token,
				OrderNo: this.orderNo,
				ExpressName: this.companyId,
				ExpressNo: this.ExpressNo,
				RefundId: this.RefundId
			});

			if (result.code === 0) {
				uni.showToast({
					title: '寄回信息提交成功！',
					icon: 'none',
					duration: 2000
				});
				this.isShowShade2 = false;
			} else {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 2000
				});
			}
		},
		//滑动快递公司
		bindChangeReason(e) {
			if (e.Id) {
				this.companyId = e.Id;
				this.company = e.company;
			}
		},
		//获取订单详情
		async getAppCourseDetails() {
			let result = await post('Order/RefundOrderInfo', {
				UserId: this.userId,
				Token: this.token,
				OrderNo: this.orderNo,
				RefundId: this.RefundId
			});
			// let res = await post('Order/OrderDetails',{
			// 	UserId: this.userId,
			// 	Token: this.token,
			// 	OrderNo: this.orderNo,
			// })
			// if(res.code==0){
			// 	this.orderAddress=res.data.Addr
			// 	this.orderTel=res.data.Tel
			// 	this.orderContactName=res.data.ContactName
			// }
			if (result.code == 0) {
				this.orderinfo = result.data;
				this.tel = result.data.ShopTel;
				if (this.orderinfo.Status == 5 || this.orderinfo.Status == 6 || this.orderinfo.Status == 14 || this.orderinfo.Status == 15 || this.orderinfo.Status == 16) {
					this.active = 0;
				} else if (this.orderinfo.Status == 9 || this.orderinfo.Status == 10) {
					this.active = 1;
				} else if (
					this.orderinfo.Status == 7 ||
					this.orderinfo.Status == 8 ||
					this.orderinfo.Status == 11 ||
					this.orderinfo.Status == 12 ||
					this.orderinfo.Status == 13 ||
					this.orderinfo.Status == 17 ||
					this.orderinfo.Status == 18
				) {
					this.active = 2;
				}
			}
		},
		getInfo() {
			get('System/GetWebConfiguration', {}).then(res => {
				this.info = res.data;
			});
		},
		//拨打电话
		phonecall() {
			let number = '';
			number = this.tel || this.info.WebTel;
			if (number) {
				let that = this;
				//#ifndef APP-PLUS
				uni.showModal({
					content: number,
					confirmText: '呼叫',
					confirmColor: '#FF3333',
					success: function(res) {
						if (res.confirm) {
							uni.makePhoneCall({
								phoneNumber: number
							});
						} else if (res.cancel) {
						}
					}
				});
				//#endif
				//#ifdef APP-PLUS
				this.$showModal({
					content: number,
					confirmVal: '呼叫'
				})
					.then(res => {
						uni.makePhoneCall({
							phoneNumber: number
						});
						//确认
					})
					.catch(res => {
						//取消
					});
				//#endif
			}
		},
		//获取物流公司名称
		async getExpressCompanyList() {
			let result = await get('Order/GetExpressCompanyList', {});
			if (result.code === 0) {
				this.hasCompanyData = true;
				const companyData = JSON.parse(result.data);
				companyData.map(item => {
					item.message = item.company;
				});
				this.companyData.push(...companyData);
			}
		}
	}
};
</script>

<style scoped lang="scss">
.warp {
	width: 100%;
	height: 100%;
}
.outside {
	display: flex;
	background-color: #f5f5f5;
	background-color: #fff;
	margin: -50rpx 20upx 0;
	border-radius: 8upx;
}
.pictrueAll {
	height: 200upx;
}
.outside .pictrue image {
	width: 160upx;
	height: 160upx;
	margin: 20upx;
	border-radius: 6upx;
}
.txtBox {
	width: 510upx;
	padding: 20upx 20upx 0 0;
}
.txtBox .title {
	font-size: 26upx;
	display: flex;
	align-items: center;
	line-height: 38upx;
	height: 76upx;
	color: #333;
}
.txtBox .protype {
	font-size: 23upx;
	color: #999;
}
.pronumber {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.pronumber .price {
	color: #ff6666;
	font-size: 28upx;
	font-weight: 500;
}
.pronumber .number {
	color: #333;
	font-size: 23upx;
}
.content {
	margin: 20rpx;
	margin-bottom: 0;
	padding: 20upx;
	border-radius: 8upx;
	background-color: #fff;
}
.contentitem text {
	color: #999;
}
.contentitem .price {
	color: #ff6666;
}
.kefubox {
	width: 710upx;
	margin: 0 20upx;
	border-top: 1upx #ddd solid;
	background-color: #fff;
	display: flex;
}
.kefubox .kefuitem {
	height: 100upx;
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
}
button {
	background: #fff;
	font-size: 24upx;
}
button::after {
	border: none;
}
.addrightborder {
	border-right: #ddd 1upx solid;
}
.kefubox .kefuicon {
	width: 50upx;
	height: 50upx;
	margin-right: 20upx;
	color: #ee9b11;
}
.submitbtn {
	width: 670upx;
	height: 80upx;
	border-radius: 40upx;
	line-height: 80upx;
	text-align: center;
	background-color: #ee9b11;
	margin: 0 auto;
	color: #fff;
	margin-top: 70upx;
}
.shadeAll {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	background-color: rgba(0, 0, 0, 0.4);
	z-index: 3;
}
.allbox {
	position: absolute;
	bottom: 0;
	background-color: #fff;
	padding-bottom: 60upx;
	width: 100%;
}
.boxhead {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100upx;
	font-size: 36upx;
	margin: 0 40upx;
	border-bottom: #ececec 1upx solid;
}
.wuliu {
	display: flex;
	height: 100upx;
	justify-content: flex-start;
	align-items: center;
	margin: 0 40upx;
	border-bottom: #ececec 1upx solid;
}
.wuliushop {
	margin-right: 40upx;
}
.wuliuname {
	width: 460upx;
}
.wuliuinput {
	width: 460upx;
}
.selectTypeShade {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 44upx;
	z-index: 5;
}
.mask {
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.4);
}
.alignBottom__shade {
	position: absolute;
	bottom: 0;
	width: 100%;
	background: #fff;
}
.shade__head {
	display: flex;
	justify-content: space-between;
	width: 100%;
	height: 100upx;
	border-bottom: #ececec 1upx solid;
}
.headtext {
	width: 100upx;
	height: 100upx;
	line-height: 100upx;
	padding: 0 20upx;
}
.reasonList {
	width: 100%;
	height: 560upx;
}
.shadeitem {
	line-height: 80upx;
	height: 80upx;
	text-align: center;
}
.steps {
	background-color: #ff3333;
	height: 250rpx;
	padding: 30rpx 20rpx;
	.stepsStatus {
		color: #fff;
		font-size: 32rpx;
		font-weight: 600;
		margin-bottom: 10rpx;
	}
	.stepsitem {
		display: flex;
		align-items: center;
		.itembox {
			text-align: center;
			flex: 1;
			position: relative;
			color: #ffb8b8;
			text {
				display: inline-block;
				width: 35rpx;
				height: 35rpx;
				border-radius: 100%;
				text-align: center;
				line-height: 35rpx;
				background-color: #ffb8b8;
				color: #ff3333;
				font-size: 24rpx;
				position: relative;
				z-index: 2;
				top: 6rpx;
			}
			// &::before{
			// 	content: " ";
			// 	width: 100%;
			// 	height: 1rpx;
			// 	position: absolute;
			// 	left: 50%;
			// 	top: 26rpx;
			// 	background-color: #BDBDBD;
			// }
			.active {
				width: 70%;
				height: 1rpx;
				position: absolute;
				left: 65%;
				top: 26rpx;
				background-color: #ffb8b8;
			}
			&:last-of-type .active {
				width: 0;
				height: 0;
			}
		}
	}
}
.tip {
	display: flex;
	align-items: center;
	padding: 0 30rpx;
	box-sizing: border-box;
	height: 100rpx;
	margin: -50rpx 20rpx 20rpx;
	border-radius: 10rpx;
	background-color: #fff;
	color: #999;
	text {
		font-size: 24rpx;
		margin-left: auto;
		display: inline-block;
	}
}
</style>
