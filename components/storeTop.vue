<template>
	<view class="storeTop">
		<view class="bigimg"><image :src="info.BannerPicNo||'https://via.placeholder.com/750x480'" mode="aspectFill"></image></view>
		<uni-nav-bar fixed="true" :color="navcolor" :background-color="navbg" left-icon="arrowleft" @clickLeft="back" :border="false">
			<block slot="center">
			<view :class="['input-view',navbg!='transparent'?'bg':'']" @click="tolink('/pages/goods/ProductList/storeSearch?shopid='+ShopId)">
				<uni-icons class="input-uni-icon" type="search" size="22" color="#999" />
				<input confirm-type="search" disabled="" class="nav-bar-input" type="text" placeholder="搜本店">
			</view>
			</block>
			<block slot="right">
				<view class="iconfont icon-home" @click="tolink('/pages/tabBar/shop/shop',1)" style="font-size: 22px;"></view>
			</block>
		</uni-nav-bar>
		<view class="storeinfo flex-between" :style="{paddingTop:barHeight+'px'}">
			<view class="s_logo">
				<image :src="info.Logo||'https://via.placeholder.com/100x100'" mode="aspectFill"></image>
			</view>
			<view class="flex1 txtbox">
				<view class="name flex-start flexWrap">
					{{info.ShopNick}}
					<view class="tag tag-zy ml5" v-if="info.IsPlatform">{{info.IsPlatform}}</view>
				</view>
				<view class="datanum">
					关注人数：{{info.FollowNum}}
				</view>
			</view>
			<view :class="['flowbtn',IsCollect?'ed':'']" @click="flowFn">{{IsCollect?'已关注':'关注'}}</view>
		</view>
	</view>
</template>

<script>
	import {post,toLogin} from '@/common/util.js';
	export default {
		props:{
			storeinfo:{
				type: Object,
				default: function(e) {
					return {}
				}
			},
			navbg:{
				type:String,
				default:"transparent"
			},
			navcolor:{
				type:String,
				default:"#fff"
			}
		},
		data() {
			return {
				barHeight: 0,
				userId: "",
				token: "",
				info:{},
				IsCollect:0,
				ShopId:''
			}
		},
		created(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			// #ifdef APP-PLUS
			this.barHeight = plus.navigator.getStatusbarHeight();
			// #endif
			// #ifdef H5
			this.barHeight = 0;
			// #endif
			this.info=this.storeinfo;
			this.IsCollect=this.info.IsCollection.Value;
			this.ShopId=this.info.ShopId;
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			//跳转
			tolink(Url,tab){
				if(tab==1){
					uni.switchTab({
						url:Url
					})
				}else{
					uni.navigateTo({
						url: Url
					})
				}
			},
			//关注、取消
			async flowFn(){
				let objUrl = ''
				if(this.IsCollect){
					objUrl = "User/ReCollections"
				}else{
					objUrl = "User/AddCollections"
				}
				let result = await post(objUrl, {
					ShopId: this.ShopId,
					userId:this.userId,
					token:this.token,
					Type:1
				  });
				if(result.code==0){
					if(this.IsCollect){
						uni.showToast({
							title: "已取消关注！",
							icon:"none",
							duration: 1500
						});
						this.IsCollect=0;
					}else{
						uni.showToast({
							title: "添加关注成功！",
							icon:"none",
							duration: 1500
						});
						this.IsCollect=1;
					}
				};
				if(result.code==2){
					uni.hideToast();
					toLogin()
				}
			},
		}
	}
</script>

<style lang="scss">
	.storeTop{
		position: relative;
		.bigimg{
			height: 400upx;
			position: relative;
			image{
				width: 100%;
				height: 100%;
			}
			&::after{
				display: block;
				content: "";
				width: 100%;
				height: 80%;
				position: absolute;
				left: 0;
				bottom: 0;
				background: -moz-linear-gradient(top, rgba(0, 0, 0, 0) 0, #f5f5f5 100%);
				background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0) 0, #f5f5f5 100%);
				background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0, #f5f5f5 100%);
				z-index: 2;
			}
			&::before{
				display: block;
				content: "";
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				background: rgba(0,0,0,.5);
				z-index: 1;
			}
		}
		/deep/ .uni-navbar--fixed{
			top: 0;
			.input-view{
				background: rgba(255,255,255,.6);
				&.bg{
					background: #f2f2f2;
				}
			}
		}
		/deep/ .uni-input-placeholder{
			color: #898989;
		}
		/* #ifdef MP-WEIXIN */
		.input-view{
			width: 630rpx;
			background: rgba(255,255,255,.6);
			&.bg{
				background: #f2f2f2;
			}
		}
		/* #endif*/
		.storeinfo{
			position: absolute;
			width: 100%;
			left: 0;
			top: 130upx;
			padding: 30upx;
			z-index: 3;
			.s_logo{
				width: 100upx;
				height: 100upx;
				border-radius: 12upx;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
					background: #fff;
				}
			}
			.txtbox{
				padding: 0 20upx;
				.name{font-size: 36upx;color: #fff;
				line-height: 1.5;}
				.datanum{
					font-size: 24upx;color: #fff;line-height: 1.5;
				}
			}
			.flowbtn{
				color: #fff;
				background: $primary;
				border-radius: 100px;
				width: 128upx;
				height: 52upx;
				line-height: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 26upx;
				&.ed{
					border: 1px solid #fff;
					background: transparent;
				}
			}
		}
	}
</style>
