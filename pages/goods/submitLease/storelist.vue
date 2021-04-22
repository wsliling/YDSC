<template>
	<view style="padding-top: 20upx;">
		<view class="line-list">
			<block v-for="(item,index) in 10" :key="index">
				<view class="line-item" @click="checkStore(index)">
					<text class="title uni-ellipsis flex1">运动健身俱乐部</text>
					<view class="check iconfont icon-check" v-if="checkId==index"></view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	export default {
		data() {
			return {
				userId: "",
				token: "",
				checkId:0,
			}
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		methods: {
			checkStore(id){
				this.checkId=id
			},
		}
	}
</script>

<style scoped lang="scss">
	.line-item{
		.title{
			font-size: 32upx;
		}
		.check{
			display: flex;
			align-items: center;
			justify-content: center;
			height: 40upx;
			width: 40upx;
			border-radius: 50%;
			background: $primary;
			color: #fff;
		}
	}
</style>
