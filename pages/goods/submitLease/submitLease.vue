<template>
	<view>
		<view class="leasebox">
			<view class="item flex">
				<view class="img">
					<image src="/static/lease/1.png" mode="aspectFill"></image>
				</view>
				<view class="txtbox flex1">
					<view class="tit uni-ellipsis2">训练服</view>
				</view>
			</view>
			<view class="line-list b_radius">
				<view class="line-item">
					<view class="lab">次数</view>
					<input class="ipt flex1" type="number" v-model="useNum" placeholder="请输入使用次数" />
					<view class="iconfont icon-help" @click="showWin('提示')"></view>
				</view>
				<view class="line-item" @click="goLink('/pages/goods/submitLease/storelist')">
					<view class="lab">门店</view>
					<input class="ipt flex1" type="text" disabled v-model="storeName" placeholder="请选择门店" />
					<view class="iconfont icon-arrow_r fz14"></view>
				</view>
			</view>
		</view>
		<view class="fixedbtn flex-between uni-bg-white">
			<view class="total">
				总计：<text class="price"><text class="fz12">￥</text>128</text>
			</view>
			<view class="next" @click="showWin('下一次')">下一步</view>
		</view>
		<!-- 弹出提示 -->
		<uni-popup ref="tipsWin" type="center">
			<view class="uni-modal-tip uni-bg-white">
				<view class="bottom-title">提示</view>
				<view class="tipstxt">
					剩余次数不足，无法租赁！
				</view>
				<view class="btn" @click="hidePopup">确定</view>
			</view>
		</uni-popup>
		<!-- 弹出提示end -->
		<!-- 弹出输入手机号 -->
		<uni-popup ref="confirmWin" type="center">
			<view class="uni-modal-tel">
				<view class="bottom-title uni-mb10">获取验证码</view>
				<view class="iconfont icon-close closebtn" @click="hidePopup"></view>
				<view class="frombox">
					<view class="from-line">
						<input type="text" class="ipt" v-model="tel" placeholder="输入手机号" />
					</view>
					<view class="from-line flex-between">
						<input type="text" class="ipt flex1" v-model="code" placeholder="输入验证码" />
						<view class="getbtn" @click="getcode">
							获取验证码
						</view>
					</view>
				</view>
				<view class="bottom-btn" @click="confirmFun">确认租赁</view>
			</view>
		</uni-popup>
		<!-- 弹出输入手机号 end-->
	</view>
</template>

<script>
	import {post,toLogin} from '@/common/util.js';
	export default {
		data() {
			return {
				userId: "",
				token: "",
				useNum:'',//次数
				storeName:'',//门店
				tel:'',//电话
				code:"",//验证码
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
			//统一的关闭popup方法
			hidePopup: function() {
				this.$refs.confirmWin.close();
				this.$refs.tipsWin.close();
			},
			showWin(str){
				if(str=="下一次"){
					this.$refs.confirmWin.open();
				}else if(str=='提示'){
					this.$refs.tipsWin.open();
				}
			},
			//确认租赁
			confirmFun(){
				uni.navigateTo({
					url:'/pages/goods/submitLease/leaseResult'
				})
			},
			//获取验证码
			getcode(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.leasebox{
	padding: 30upx;
	.item{
		margin-bottom: 20upx;
		background: #fff;
		padding: 20upx;
		border-radius: 8px;
		.img{
			image{
				background: #f2f2f2;
				width: 140upx;
				height: 140upx;
				border-radius: 12upx;
			}
		}
		.txtbox{
			padding-left: 20upx;
			.tit{
				margin-top: 20upx;
				font-size: 30upx;
				line-height: 1.2;
			}
		}
	}
	.line-item{
		.lab{
			width: 100upx;
		}
		.ipt{
			height: 60upx;
			line-height: 60upx;
		}
		.iconfont{
			color: #999;
		}
		.icon-help{
			padding-left: 20upx;
		}
	}
}
.fixedbtn{
	padding: 20upx 30upx;
	.price{
		font-size: 34upx;
		color: #FF0000;
	}
	.next{
		background: $primary;
		border-radius: 100px;
		color: #fff;
		height: 64upx;
		width: 160upx;
		font-size: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
.uni-modal-tip{
	padding-top: 30upx;
	border-radius: 20upx;
	width: 480upx;
	.tipstxt{
		color: #999;
		margin: 40upx 0;
	}
	.btn{
		padding: 20upx;
		background: none;
		color: #666;
		border-top: 1px solid #E6E6E6;
	}
}
.uni-modal-tel{
	background: #fff;
	border-radius: 20upx;
	padding: 30upx;
	position: relative;
	.closebtn{
		font-size: 40upx;
		line-height: 1;
	}
	.frombox{
		margin-bottom: 40upx;
		.from-line{
			width: 480upx;
			margin-bottom: 20upx;
			border: 1px solid #eee;
			border-radius: 8px;
			.ipt{
				height: 80upx;
				text-align: left;
				padding: 0 20upx;
			}
			.getbtn{
				color: $primary;
				padding: 0 20upx;
			}
		}
	}
}
</style>
