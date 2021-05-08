<template>
	<view class="score">
		<view class="sec">
			<view class="sec1">
				<view class="sec_1">积分</view>
				<view class="sec_2">{{ scoreAll }}</view>
			</view>
			<view class="sec2" @click="register">每日签到</view>
		</view>
		<view class="sec3">
			<view class="score_1" @click="scoreList">
				<view class="listText">积分明细</view>
				<view class="iconfont icon-arrow_r listText_1"></view>
			</view>
			<view class="score_2" @click="scoreArea">
				<view class="listText">兑换专区</view>
				<view class="iconfont icon-arrow_r listText_1"></view>
			</view>
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
			score: 0,
			Score: 0, //会员积分
			scoreAll: 0
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.signIn();
		this.GetMemInfo();
	},
	methods: {
		scoreList() {
			// uni.navigateTo({
			// 	url: '/pages/member/scoreList/scoreList'
			// });
		},
		scoreArea() {
			uni.navigateTo({
				url: '/pages/member/scoreArea/scoreArea'
			});
		},
		register() {
			uni.navigateTo({
				url: '/pages/member/register/register'
			});
		},
		async signIn() {
			let result = await post('User/GetSignInData', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.score = result.data.SumScore;
			}
		},
		//获取账户积分信息
		async GetMemInfo() {
			let result = await post('User/GetMemInfo', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.Score = result.data.Score;
				this.scoreAll = this.score + this.Score;
			}
		}
	}
};
</script>

<style lang="scss">
.score {
	background-color: white;
	padding: 26upx 26upx 0 26upx;
	margin-top: 22upx;
	.sec {
		padding: 40upx 30upx 40upx 50upx;
		background: linear-gradient(to right, #ff9639, #ffb36f, #ffc089);
		border-radius: 10upx;
		color: white;
		display: flex;
		align-items: center;
		.sec1 {
			flex: 2.5;
			.sec_2 {
				font-size: 60upx;
				font-weight: bold;
			}
		}
		.sec2 {
			flex: 1;
			background-color: white;
			color: #ff973b;
			text-align: center;
			height: 68upx;
			line-height: 68upx;
			border-radius: 10upx;
		}
	}
	.sec3 {
		.score_1 {
			display: flex;
			align-items: center;
			height: 120upx;
			line-height: 120upx;
			border-bottom: 1px solid #f5f5f5;
			.listText {
				flex: 3;
			}
			.listText_1 {
				flex: 0.1;
				font-size: 22upx;
			}
		}
		.score_2 {
			display: flex;
			align-items: center;
			height: 120upx;
			line-height: 120upx;
			.listText {
				flex: 3;
			}
			.listText_1 {
				flex: 0.1;
				font-size: 22upx;
			}
		}
	}
}
</style>
