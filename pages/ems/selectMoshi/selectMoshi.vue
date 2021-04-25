<template>
	<view>
		<view class="selst_list">
			<block v-for="(item,index) in list" :key="index">
			<view class="item">
				<image class="imgbg" :src="item.logo" mode="aspectFill"></image>
				<view class="txtbox flex-between" @click="goLink('/pages/ems/moshi/moshi?id='+item.Id)">
					<view class="set iconfont icon-shezhi" @click.stop="goLink('/pages/ems/setMoshi/setMoshi?id='+item.Id)"></view>
					<view class="txt flex1">{{item.name}}</view>
					<view class="iconfont icon-arrow_r"></view>
				</view>
			</view>
			</block>
		</view>
	</view>
</template>

<script>
	import {post,toLogin} from '@/common/util.js';
	export default {
		data() {
			return {
				userId: "",
				token: "",
				list:[
					{
						Id:0,
						name:"热身模式1",
						logo:'/static/of/ms4.png'
					},
					{
						Id:1,
						name:"热身模式2",
						logo:'/static/of/ms5.png'
					},
					{
						Id:2,
						name:"热身模式3",
						logo:'/static/of/ms6.png'
					}
				]
			}
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		methods: {
			//跳转
			goLink(url){
				uni.navigateTo({
					url:url
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.selst_list{
		padding: 30upx;
		.item{
			margin-bottom: 30upx;
			color: #FFFFFF;
			border-radius: 16upx;
			position: relative;
			overflow: hidden;
			.imgbg{
				width: 100%;
				height: 220upx;
			}
			.txtbox{
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				padding: 20upx;
				z-index: 2;
				background: rgba(0,0,0,.2);
				.txt{
					text-align: right;
					padding: 0 20upx;
					font-size: 32upx;
				}
				.icon-arrow_r{
					font-size: 28upx;
				}
				.set{
					font-size: 52upx;
					position: absolute;
					left: 0;
					top: 0;
					padding: 20upx;
					line-height: 1;
				}
			}
			
		}
	}
	
</style>
