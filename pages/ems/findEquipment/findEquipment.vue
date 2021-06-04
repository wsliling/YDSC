<template>
	<view>
		<view class="find" v-if="hasData">
			<view class="Yi-hd flex-between">
				<view class="title">
					选择您的设备
				</view>
				<view class="iconfont icon-shuaxin c_999"></view>
			</view>
			<view class="shebei-list">
				<block v-for="(item,index) in 5" :key="index">
				<view class="item flex-between" @click="checkStore(index)">
					<view :class="['check iconfont',checkId==index?'icon-check':'']"></view>
					<view class="flex-start flex1">
						<image class="shebei" src="https://yd.wtanvxin.com/static/shebei.png" mode="aspectFill"></image>
						<view class="name uni-ellipsis flex1">
							YDSC00256
						</view>
						<view class="iconfont icon-wifi fz18"></view>
					</view>
				</view>
				</block>
			</view>
			<view class="fixedbtn">
				<view class="btn" @click="connet">
					连接
				</view>
			</view>
		</view>
		<view v-else class="nodata">
			<view class="iconbox quan">
				<view class="quan quan1">
					<view class="quan quan2">
						<image src="https://yd.wtanvxin.com/static/lanya.png" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<view class="txt center">
				正在搜索…
			</view>
			<view class="btn">
				<view class="iconfont icon-shuaxin"></view>
			</view>
		</view>
		<!-- 弹出设备连接 -->
		<uni-popup ref="confirmWin" type="center">
			<view class="uni-modal-connet">
				<view class="bottom-title uni-mb10">设备连接</view>
				<view class="iconfont icon-close closebtn" @click="hidePopup"></view>
				<view class="list">
					<view class="item flex-between">
						<view class="name flex1 uni-ellipsis">YDSC00256</view>
						<view class="icon uni-icon uni-icon-spinner-cycle"></view>
					</view>
					<view class="item flex-between">
						<view class="name flex1 uni-ellipsis">YDSC00256</view>
						<view class="icon uni-icon uni-icon-close"></view>
					</view>
					<view class="item flex-between">
						<view class="name flex1 uni-ellipsis">YDSC00256</view>
						<view class="icon iconfont icon-gou"></view>
					</view>
				</view>
				<view :class="['bottom-btn',disable?'dis':'']" @click="confirmFun">开始</view>
			</view>
		</uni-popup>
		<!-- 弹出设备连接 end-->
	</view>
</template>

<script>
	import {post,toLogin} from '@/common/util.js';
	export default {
		data() {
			return {
				userId: "",
				token: "",
				hasData:true,//
				checkId:0,
				disable:false,//是否可点击
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
			checkStore(id){
				this.checkId=id
			},
			//连接
			connet(){
				this.$refs.confirmWin.open();
			},
			//统一的关闭popup方法
			hidePopup: function() {
				this.$refs.confirmWin.close();
			},
			//开始
			confirmFun(){
				if(!this.disable){
					uni.navigateTo({
						url:'/pages/ems/startTrain/startTrain'
					})
				}
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.nodata{
		background: #fff; height: 100%; width: 100%; padding-top: 100upx;
		border-top: 20upx solid #f5f5f5;
		position: absolute;
		.quan{
			display: flex;
			align-items: center;
			justify-content: center;
			border: 1px solid #eee;
			box-shadow: 0px 0px 30upx rgba(241,241,241,.5) inset;
			border-radius: 50%;
			image{
				width: 100upx;height: 100upx;
			}
		}
		.iconbox{width: 500upx; height: 500upx;margin: 0 auto 60upx;}
		.quan1{width: 380upx; height: 380upx;}
		.quan2{width: 260upx; height: 260upx;}
		.txt{
			font-size: 32upx;
		}
		.btn{
			margin: 60upx auto;
			width: 240upx;
			height: 88upx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: $primary;
			color: #fff;
			border-radius: 100px;
			box-shadow: 0 10upx 30upx rgba(250,96,8,.5);
			.iconfont{
				font-size: 48upx;
				line-height: 1;
			}
		}
	}
	
	.find{
		.Yi-hd{
			padding: 20upx 30upx;
			.iconfont{font-size: 40upx;}
		}
		.shebei-list{
			padding: 0 30upx;
			.item{
				background: #fff;
				border-radius: 12upx;
				margin-bottom: 20upx;
				padding: 30upx;
				.name{
					padding-right: 20upx;
					font-size: 30upx;
				}
			}
			.shebei{
				width: 44upx; height:44upx;
				margin-right: 20upx;
			}
			.check {
			    display: flex;
			    align-items: center;
			    justify-content: center;
			    height: 40upx;
			    width: 40upx;
			    border-radius: 50%;
			    border: 1px solid #ddd;
				margin-right: 20upx;
				&.icon-check{
					border: none;
					background: $primary;
					color: #fff;
				}
			}
		}
	}
	.uni-modal-connet{
		background: #fff;
		border-radius: 20upx;
		padding: 30upx;
		position: relative;
		width: 520upx;
		.closebtn{
			font-size: 40upx;
			line-height: 1;
		}
		.bottom-title{
			font-size: 36upx;
		}
		.list{
			margin-bottom: 60upx;
			.item{
				margin-bottom: 30upx;
				.name{
					text-align: left;
				}
				.icon{
					color: #999;
				}
				.iconfont{
					font-size: 42upx;
					line-height: 1;
				}
				.icon-gou{
					color: $primary;
				}
				.uni-icon-close{
					color: #FF0000;
				}
			}
		}
		.bottom-btn.dis{
			background: #b6b6b6;
		}
	}
</style>
