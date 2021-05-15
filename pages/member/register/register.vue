<template>
	<view class="register">
		<view class="top">
			<view class="score">{{ score.SumScore }}</view>
			<view class="haveScore">已累计获得积分</view>
			<view class="rule" @click="rule">签到规则</view>
		</view>
		<view class="cenAll">
			<view class="cen">
				<view class="total">已累计签到</view>
				<view class="total_1">
					<view class="total_1_1">{{ score.SignDayNum }}</view>
					<view class="total_1_2">天</view>
				</view>
			</view>
			<view class="day">
				<view v-for="(item, index) in scoreAdd" :key="index" :class="item.IsSign == 1 ? 'one' : 'one2'">
					<view class="one_1">{{ item.Name }}</view>
					<view class="one_2">+{{ item.Score }}</view>
				</view>
			</view>
			<view class="rig" @click="rig">签到</view>
		</view>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
export default {
	components: {},
	data() {
		return {
			userId: '',
			token: '',
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			IsSign: 0,
			score: [],
			scoreAdd: [],
			sign: 0 //连续签到
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.signIn();
	},
	methods: {
		rule() {
			uni.navigateTo({
				url: '/pages/member/rule/rule'
			});
		},
		rig() {
			this.getsignIn();
		},
		// 签到
		async getsignIn() {
			let result = await post('User/CreateSign', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/member/register/register'
					});
				}, 500);
			}
		},
		// 签到详情
		async signIn() {
			let result = await post('User/GetSignInData', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.score = result.data;
				this.scoreAdd = result.data.SignData;
				for (var i = 0; i < this.scoreAdd.length; i++) {
					if (this.scoreAdd[i].IsSign == 1) {
						this.sign++;
					}
				}
				uni.showToast({
					title: '已连续签到' + this.sign + '天',
					icon: 'none',
					duration: 2000
				});
			}
		}
	}
};
</script>

<style lang="scss">
.register {
	.top {
		color: white;
		background: linear-gradient(to bottom, #ffbf85, #ff9f4a);
		line-height: 80upx;
		padding: 50upx 0 100upx 0;
		position: relative;
		.score {
			font-size: 80upx;
			text-align: center;
		}
		.haveScore {
			color: #fff2e7;
			text-align: center;
		}
		.rule {
			position: absolute;
			right: 0;
			top: 35upx;
			background-color: #f98d2d;
			border-radius: 30upx 0 0 30upx;
			padding: 0 25upx;
			height: 65upx;
			line-height: 65upx;
		}
	}
	.cenAll {
		background-color: white;
		border-radius: 30upx;
		box-shadow: 0 0 5upx #d5d5d6;
		margin: 30upx;
		position: absolute;
		top: 215upx;
		width: 92%;
		.cen {
			text-align: center;
			.total {
				font-size: 35upx;
				margin: 30upx;
			}
			.total_1 {
				width: 30%;
				margin: 0 auto;
				display: flex;
				align-items: baseline;
				.total_1_1 {
					flex: 1;
					font-size: 70upx;
					padding: 1upx 0;
					margin: 10upx;
					color: white;
					background-color: #ffa04c;
					border-radius: 10upx;
				}
				.total_1_2 {
					font-size: 38upx;
					margin: 10upx;
					color: #7f7f7f;
				}
			}
		}

		.day {
			margin-top: 30upx;
			display: flex;
			.one {
				flex: 1;
				text-align: center;
				.one_1 {
					color: #b3b3b3;
					font-size: 26upx;
				}
				.one_2 {
					background-color: #fe7c32;
					color: white;
					border: 1upx solid #f0a376;
					border-radius: 50%;
					padding: 5upx;
					margin: 20upx 18upx;
				}
			}
			.one2 {
				flex: 1;
				text-align: center;
				.one_1 {
					color: #b3b3b3;
					font-size: 26upx;
				}
				.one_2 {
					background-color: #ffffff;
					color: #bbbbbb;
					border: 1upx solid #bbbbbb;
					border-radius: 50%;
					padding: 4upx;
					margin: 20upx 18upx;
				}
			}
		}
		.rig {
			background-color: #fe7c32;
			border-radius: 60upx;
			text-align: center;
			width: 80%;
			margin: 60upx auto 80upx auto;
			font-size: 30upx;
			color: white;
			height: 95upx;
			line-height: 95upx;
		}
		.rig1 {
			background-color: #cccccc;
			border-radius: 60upx;
			text-align: center;
			width: 80%;
			margin: 60upx auto 80upx auto;
			font-size: 30upx;
			color: white;
			height: 95upx;
			line-height: 95upx;
		}
		.popup-content {
			padding: 50upx;
			text-align: center;
			.title {
				font-size: 40upx;
			}
			.con {
				color: #ff662a;
				font-size: 70upx;
			}
			.con_1 {
				color: gray;
			}
		}
	}
}
</style>
