<template>
	<view>
		<view class="logoBox">
			<view class="logo">
				<image :src="data.WebLogo"></image>
			</view>
			<uParse v-if="content" class="text" :content="content">
			</uParse>
			<view class="list">
				<view class="item">
					<view>客服电话</view>
					<text>{{data.WebTel}}</text>
				</view>
				<view class="item">
					<view>工作日</view>
					<text>09:00-18:00</text>
				</view>
				<view class="item">
					<view>公司邮箱</view>
					<text>{{data.Email}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {post} from '@/common/util.js'
	import uParse from '@/components/uParse/src/wxParse.vue';
	export default {
		data() {
			return {
				content:'',
				data:{}
			}
		},
		components:{
			uParse
		},
		onLoad(){
			this.init()
			this.getInfo()
		},
		methods: {
			async init(){
				let result = await post('System/GetAboutUs')
				// console.log(result)
				this.content=result.data.Content
			},
			async getInfo(){
				let result =await post('System/GetWebConfiguration')
				this.data=result.data
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.logoBox{
		border-top: 20upx solid #f2f2f2;
		padding: 40upx ;
		font-size: 28upx;
		.logo{
			margin: 0 auto;
			width: 120upx;
			height: 120upx;
			border-radius: 20upx;
			margin-bottom: 40upx;
			background-color: #ccc;
			image{
				width: 120upx;
				height: 120upx;
				display: inline-block;
				border-radius: 20upx;
			}
		}
		.item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1upx solid #ececec;
			padding: 40upx 0;
		}
	}
</style>
