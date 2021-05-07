<template>
	<view>
		<view class="lease_list">
			<block v-for="(item,index) in list" :key="index">
			<view class="item flex-between" @click="goLink('/pages/ems/findEquipment/findEquipment?type='+item.Id)">
				<view class="img">
					<image :src="item.logo" mode="aspectFill"></image>
				</view>
				<view class="txt flex1">{{item.name}}</view>
				<view class="iconfont icon-arrow_r"></view>
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
						Id:1,
						name:"训练服",
						logo:'http://yd.wtanvxin.com/static/lease/1.png'
					},
					{
						Id:2,
						name:"裤子",
						logo:'http://yd.wtanvxin.com/static/lease/2.png'
					},
					{
						Id:3,
						name:"腰带",
						logo:'http://yd.wtanvxin.com/static/lease/3.png'
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
	.lease_list{
		padding: 30upx;
		.item{
			margin-bottom: 30upx;
			background-image: linear-gradient(left,#4c444f, #392f39);
			color: #FFFFFF;
			padding: 20upx;
			border-radius: 16upx;
			.img{
				image{
					width: 160upx;
					height: 160upx;
				}
			}
			.txt{
				text-align: right;
				padding: 0 20upx;
				font-size: 32upx;
			}
			.icon-arrow_r{
				font-size: 28upx;
			}
		}
	}
	
</style>
