<template>
	<view>
		<view class="my_list">
			<block v-for="(item,index) in 5" :key="index">
			<view class="item flex-between" @click="goLink('/pages/ems/moshi/moshi?id=')">
				<view class="txt flex1">快速模式</view>
				<view class="iconfont icon-bainji" @click.stop="Edit(index)"></view>
			</view>
			</block>
		</view>
		<!-- 弹出编辑名称 -->
		<uni-popup ref="confirmWin" type="center">
			<view class="uni-modal-edit">
				<view class="bottom-title uni-mb10">编辑名称</view>
				<view class="iconfont icon-close closebtn" @click="hidePopup"></view>
				<view class="uni-modal-connet">
					<input type="text" v-model="changName" class="ipt" />
				</view>
				<view class="bottom-btn" @click="confirmFun">确定</view>
			</view>
		</uni-popup>
		<!-- 弹出编辑名称 end-->
	</view>
</template>

<script>
	import {post,toLogin} from '@/common/util.js';
	export default {
		data() {
			return {
				userId: "",
				token: "",
				changName:'快速模式'
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
			//弹出编辑
			Edit(index){
				this.$refs.confirmWin.open();
			},
			//统一的关闭popup方法
			hidePopup: function() {
				this.$refs.confirmWin.close();
			},
			//编辑名称
			confirmFun(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my_list{
		padding: 30upx;
		.item{
			margin-bottom: 30upx;
			background: #fff;
			padding: 30upx;
			border-radius: 16upx;
			.txt{
				padding: 0 20upx;
				font-size: 32upx;
			}
			.iconfont{
				font-size: 40upx;
				color: #999;
				padding-left: 20upx;
			}
		}
	}
	.uni-modal-edit{
		background: #fff;
		border-radius: 20upx;
		padding: 30upx 40upx 50upx;
		position: relative;
		width: 520upx;
		.closebtn{
			font-size: 40upx;
			line-height: 1;
		}
		.ipt{
			height: 90upx;
			border: 1px solid #ddd;
			border-radius: 6px;
		}
		.bottom-title{
			font-size: 36upx;
		}
		.bottom-btn{margin-top: 60upx;}
	}
</style>
