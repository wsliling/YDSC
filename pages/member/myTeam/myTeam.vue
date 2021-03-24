<template>
	<view class="myTeam">
		<view class="top">
			<view class="top_1">
				<view class="perAll">
					<view class="per_1">12</view>
					<view class="per_2">总人数</view>
				</view>
				<view class="perAdd">
					<view class="per_1">3</view>
					<view class="per_2">今日新增</view>
				</view>
				<view class="perAddYes">
					<view class="per_1">9</view>
					<view class="per_2">昨日新增</view>
				</view>
			</view>
			<view class="top_2">
				<view class="top_2_img"><image src="/static/my/myTeam_1.png" mode=""></image></view>
				<view class="top_2_right">
					<view class="top_2_right_1">晓枫月忆135****3928</view>
					<view class="top_2_right_2">我的邀请人</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {}
};
</script>

<style lang="scss">
.myTeam {
	background-color: white;
	padding: 20upx;
	.top {
		background-color: #fd4646;
		color: white;
		border-radius: 20upx;
		padding: 30upx 0 200upx 0;
		margin: 10upx;
		position: relative;
		.top_1 {
			display: flex;
			align-items: center;
			text-align: center;
			line-height: 50upx;
			.per_1 {
				font-size: 45upx;
			}
			.per_2 {
				color: #fccfc6;
			}
			.perAll {
				flex: 1;
				border-right: 1px solid #ff7b7b;
			}
			.perAdd {
				flex: 1;
				border-right: 1px solid #ff7b7b;
			}
			.perAddYes {
				flex: 1;
			}
		}
		.top_2 {
			display: flex;
			align-items: center;
			background-color: #ed413a;
			padding: 20upx 0;
			width: 100%;
			position: absolute;
			bottom: 0;
			border-radius: 0 0 20upx 20upx;
			.top_2_img {
				flex: 2;
				text-align: center;
				image {
					width: 120upx;
					height: 120upx;
				}
			}
			.top_2_right {
				flex: 5;
				.top_2_right_1 {
					font-size: 36upx;
				}
				.top_2_right_2 {
					color: #fccfc6;
				}
			}
		}
	}
}
</style>
