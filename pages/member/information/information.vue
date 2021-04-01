<template>
	<view>
		<view class="m-topbox">
			<view class="exercise">总运动</view>
			<view class="minute">
				86
				<text>分钟</text>
			</view>
			<view class="itemRow">
				<view class="item">
					<view class="name">消耗（千卡）</view>
					<view class="num">123</view>
				</view>
				<view class="item">
					<view class="name">累计（天）</view>
					<view class="num">2</view>
				</view>
				<view class="item">
					<view class="name">连续（天）</view>
					<view class="num">0</view>
				</view>
			</view>
		</view>
		<view class="listBox">
			<view class="tiptitle">身体数据</view>
			<view class="listRow">
				<view class="flex-text left">体重</view>
				<view class="flex-text">52.0kg</view>
			</view>
			<view class="listRow">
				<view class="flex-text left">胸围</view>
				<input class="flex-text" placeholder="请输入" />
			</view>
			<view class="listRow">
				<view class="flex-text left">腰围</view>
				<view class="flex-text">12.0cm</view>
			</view>
			<view class="listRow">
				<view class="flex-text left">臂围</view>
				<input class="flex-text" placeholder="请输入" />
			</view>
			<view class="listRow">
				<view class="flex-text left">身高</view>
				<view class="flex-text">160.0</view>
			</view>
			<view class="listRow">
				<view class="flex-text left">BIM</view>
				<view class="flex-text">21.6</view>
			</view>
			<view class="listRow">
				<view class="flex-text left">静息心律</view>
				<view class="flex-text">70bpm</view>
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

<style lang="scss" scoped>
page{
	background-color: #ffffff;
}
.m-topbox {
	width: 750upx;
	height: 500upx;
	padding: 0 50upx;
	padding-bottom: 20upx;
	background: #2c2d2d;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	.exercise {
		font-size: 32upx;
		margin-top: 70upx;
		font-weight: bold;
		color: #ffffff;
	}
	.minute {
		font-size: 50upx;
		font-weight: 400;
		color: #ffffff;
		text {
			font-size: 26upx;
			font-weight: 500;
			color: #c9c8c8;
		}
	}
	.itemRow {
		display: flex;
		justify-content: space-between;
		.item {
			.name {
				font-size: 26upx;
				font-weight: 500;
				color: #c9c8c8;
			}
			.num {
				font-size: 48upx;
				font-family: 'Hanzipen SC';
				font-weight: 400;
				color: #ffffff;
			}
		}
	}
}
.listBox {
	border-top: solid 30upx #f5f5f5;
	padding: 0 30upx;
	.tiptitle {
		font-size: 32upx;
		line-height: 80upx;
	}
	.listRow {
		display: flex;
		height: 100upx;
		font-size: 30upx;
		color: #333333;
		align-items: center;
		justify-content: space-between;
		border-bottom: solid 2upx #f5f5f5;
	}
	
	.flex-text{
		text-align: right;
		font-weight: bold;
	}
	.left{
	   font-weight: 500 !important;
	}
}
</style>
