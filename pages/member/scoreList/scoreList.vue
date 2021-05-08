<template>
	<view class="scoreList">
		<view class="sec" v-for="(item, index) in time" :key="index">
			<block v-if="(item.IsSign = 1)">
				<view class="sec_2">
					<view class="title">每日签到</view>
					<view class="title_2">{{ item.SignTime }}</view>
				</view>
				<view class="sec_3">+{{ item.Score }}</view>
			</block>
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
			time: []
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.signIn();
	},
	methods: {
		// 签到详情
		async signIn() {
			let result = await post('User/GetSignInData', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.time = result.data.SignData;
			}
		}
	}
};
</script>

<style lang="scss">
.scoreList {
	margin-top: 22upx;
	background-color: white;
	height: 100vh;
	.sec {
		padding: 25upx;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #f5f5f5;
		.sec_2 {
			flex: 6;
			padding-left: 20upx;
			.title {
				font-size: 30upx;
				font-weight: bold;
			}
			.title_2 {
				color: gray;
				font-size: 26upx;
			}
		}
		.sec_1 {
			flex: 1;
			text-align: right;
			font-size: 30upx;
			color: #ff4545;
		}
		.sec_3 {
			flex: 1;
			text-align: right;
			font-size: 30upx;
			color: #fe8441;
		}
	}
}
</style>
