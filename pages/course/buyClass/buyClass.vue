<template>
	<view class="scoreExchange">
		<view class="line"></view>
		<view class="con">
			<view class="con_1"><image :src="classdetail.PicImg"></image></view>
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
			<view class="payPic">
				<view class=" iconfont icon-weixinzhifu wx"></view>
				<view class=" iconfont icon-zhifubao zfb"></view>
				<view class=" iconfont icon-qianbao qb"></view>
			</view>
			<view class="payWay">
				<view class="text">微信支付</view>
				<view class="text">支付宝支付</view>
				<view class="text">钱包支付</view>
			</view>
			<view class="payRadio">
				<radio-group>
					<view>
						<label class="radio"><radio checked="true" value="" color="#fa6008" /></label>
					</view>
					<view>
						<label class="radio"><radio value="" color="#fa6008" /></label>
					</view>
					<view>
						<label class="radio"><radio value="" color="#fa6008" /></label>
					</view>
				</radio-group>
			</view>
		</view>
		<view class="foot">
			总计：
			<view class="score">￥{{ classdetail.Price }}</view>
			<view class="payfor" @click="buyClassSuc">提交</view>
		</view>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
export default {
	data() {
		return {
			userId: '',
			token: '',
			classdetail: {},
			Id: 0
		};
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Id = e.classId;
		this.getClassDetail();
	},
	methods: {
		buyClassSuc() {
			this.getCourseBuy();
			// uni.navigateTo({
			// 	url: '/pages/course/buyClassSuc/buyClassSuc'
			// });
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
				console.log(this.classdetail);
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
		// 购买课程
		async getCourseBuy() {
			let result = await post('Course/CourseBuy', {
				OutlineId: this.Id,
				UserId: this.userId,
				Token: this.token,
				IsPayWallet: 1,
				IsPayScore: 0,
				Password: ''
			});
			if (result.code == 0) {
				uni.navigateTo({
					url: '/pages/course/buyClassSuc/buyClassSuc'
				});
			}
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
