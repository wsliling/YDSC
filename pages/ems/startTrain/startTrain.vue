<template>
	<view>
		<view class="moshi_list">
			<block v-for="(item,index) in list" :key="index">
				<view class="item" @click="goLink('/pages/ems/selectMoshi/selectMoshi?type='+item.type)">
					<image class="imgbg" :src="item.logo" mode="aspectFill"></image>
					<view class="txtbox flex-center">
						<view class="txt">{{item.name}}</view>
						<view class="iconfont icon-arrow_r"></view>
					</view>
				</view>
			</block>
		</view>
		<view class="fixedbtn">
			<view class="btn_my flex-center" @click="goLink('/pages/ems/myMOSHI/myMOSHI')">
				<view class="iconfont icon-moshi"></view>我的模式
			</view>
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
						type:0,
						name:"热身模式",
						logo:'/static/of/ms0.png'
					},
					{
						type:1,
						name:"有氧模式",
						logo:'/static/of/ms1.png'
					},
					{
						type:2,
						name:"力量模式",
						logo:'/static/of/ms2.png'
					},
					{
						type:3,
						name:"恢复模式",
						logo:'/static/of/ms3.png'
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
	.moshi_list{
		padding: 30upx;
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		justify-content: space-between;
		.item{
			width: 330upx;
			margin-bottom: 30upx;
			color: #FFFFFF;
			border-radius: 16upx;
			position: relative;
			overflow: hidden;
			.imgbg{
				width: 100%;
				height: 240upx;
			}
			.txtbox{
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				z-index: 2;
				background: rgba(0,0,0,.2);
				.txt{
					padding-right:10upx;
					font-size: 36upx;
				}
				.icon-arrow_r{
					font-size: 28upx;
				}
			}
		}
	}
	.fixedbtn{
		padding: 0;
		.btn_my{
			background: #fff;
			padding: 20upx 30upx;
			font-size: 32upx;
			color: $primary;
			.iconfont{
				font-size: 40upx;
				line-height: 1;
				margin-right: 10upx;
			}
		}
	}
</style>
