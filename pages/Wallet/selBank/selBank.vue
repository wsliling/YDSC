<template>
	<view class="uni-bg-white uni-mt10">
		<view class="title">
			推荐银行
		</view>
		<view class="item" v-for="(item,index) in bankList " :key="index" @click="getsel(index,item.BankName)">
			<image :src="item.BankLogo"></image>
			<view>{{item.BankName}}</view>
			<text class="iconfont icon-gou1 right" v-if="selIndex==index"></text>
			<!-- <image class="right" src="https://yd.wtanvxin.com/static/dui.png" ></image> -->
		</view>
		
	</view>
</template>

<script>
	import {post} from '@/common/util.js'
	export default {
		data() {
			return {
				selIndex:null,
				bankList:[]
			}
		},
		onLoad(){
			this.init()
		},
		methods: {
			getsel(index,name){
				this.selIndex=index
				uni.setStorageSync('bankName',name)
				setTimeout(function(){
					uni.navigateBack({
						
					})
				},500)
			},
			async init(){
				let result = await post('Bank/BankinfoList')
				if(result.code==0){
					this.bankList=result.data
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f2f2f2;
	}
	.title,.item{
		height: 88upx;
		border-bottom: 1upx solid #eee;
		margin: 0 30upx;
		display: flex;
		font-size: 32upx;
		align-items: center;
	}
	.item{
		font-size: 28upx;
		image{
			width: 40upx;
			height: 40upx;
			margin-right: 20upx;
		}
	
		.right{
			margin-left: auto;
			color: #dfb388;
		}
	}
</style>
