<template>
	<view class="content">
		<view class="weui-cells addInvoice__weui-cells uni-mb10 cell-1">
			<view class="weui-cell cell-1">
				<view class="weui-cell__hd flex2"><label class="weui-label">我的余额</label></view>
				<view class="weui-cell__bd">￥{{ MemberWallet }}</view>
			</view>
		</view>
		<view class="weui-cells addInvoice__weui-cells uni-mb10">
			<view class="weui-cell">
				<view class="weui-cell__hd"><label class="weui-label">转账类型：</label></view>
				<view class="weui-cell__bd"><input type="text" class="weui-input" v-model="type" disabled="disabled" /></view>
			</view>
			<view class="weui-cell">
				<view class="weui-cell__hd"><label class="weui-label">用户名：</label></view>
				<view class="weui-cell__bd"><input type="text" class="weui-input" v-model="tel" placeholder="转账到该用户的手机号" /></view>
			</view>
			<view class="weui-cell">
				<view class="weui-cell__hd"><label class="weui-label">金额：</label></view>
				<view class="weui-cell__bd"><input type="text" class="weui-input" v-model="account" placeholder="请输入转账金额" /></view>
			</view>
		</view>
		<view class="ftbtn" style="padding:60upx 30upx"><view class="btn" @click="btnSure">转账</view></view>
	</view>
</template>

<script>
import { post, valPhone } from '@/common/util.js';

export default {
	onLoad() {},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.GetMemInfo();
	},
	data() {
		return {
			userId: '',
			token: '',
			MemberWallet: 0,
			type: '余额',
			tel: '',
			account: ''
		};
	},
	methods: {
		//获取账户信息
		async GetMemInfo() {
			let result = await post('User/GetMemInfo', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.MemberWallet = result.data.Wallet;
			}
		},
		btnSure() {
			if (this.valOther()) {
				this.getUserInfo();
			}
		},
		valOther() {
			if (!valPhone(this.tel)) {
				return false;
			}
			if (this.account == '') {
				uni.showToast({
					title: '请输入转账金额!',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			return true;
		},
		async getUserInfo() {
			let res = await post('DrawMoney/BalanceTransfer', {
				UserId: this.userId,
				Token: this.token,
				Mobile: this.tel,
				Amount: this.account
			});
			if (res.code == 0) {
				uni.showToast({
					title: res.msg,
					icon: 'none',
					duration: 2000
				});
				this.account = '';
				this.tel = '';
			}
		}
	}
};
</script>

<style lang="scss">
.cell-1 {
	margin-bottom: 40upx;
}
.addInvoice__weui-cells .weui-label {
	width: 170upx;
	display: block;
}
.btn {
	background-color: #0ac8db !important;
	border-radius: 10upx;
}
</style>
