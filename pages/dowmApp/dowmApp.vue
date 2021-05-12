<template>
	<view>
		<!-- #ifndef MP-WEIXIN -->
		<uni-nav-bar fixed="true" color="#333333" background-color="#ffffff" title="下载APP" :border="false">
		</uni-nav-bar>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<a v-if="!iswx" class="alink flex-center" :href="urlstr">
			<span>已安装，请点击此处打开App</span><span class="btn">点击</span>
		</a>
		<!-- #endif -->
		
		<view class="btns">
			<view class="logo">
				<image class="logoimg" src="http://yd.wtanvxin.com/static/logo.png" mode="widthFix"></image>
			</view>
			<view class="btn btn_1" @click="dowmapp(0)">
				Android版下载
			</view>
			<view class="btn btn_2" @click="dowmapp(1)" v-if="false">
				Ios版下载
			</view>
			
		</view>
		<view class="coverbox" v-if="iswx">
			<view class="box">
				<image src="http://yd.wtanvxin.com/static/jtwx.png" mode="widthFix"></image>
				<view class="txt">
					点击右上角使<br>用浏览器打开
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {post,dowmappURLios,webUrl,isWeixin} from '@/common/util.js'
	export default {
		data() {
			return {
				dowmappURL:'',
				urlstr:'',
				iswx:false,//是否微信内置
				
			}
		},
		onLoad(e) {
			this.urlstr="yixijiu:/"+decodeURIComponent(e.url)
			this.iswx=isWeixin();
			const system = uni.getSystemInfoSync().platform;
			if(system!="ios"){
				
			}
		},
		methods: {
			async GetWebConfiguration(){
				let res=await post('System/GetWebConfiguration')
				if(res.code==0){
					let version=_res.data.VersionNo.split('.').join('');
					this.dowmappURL=webUrl+'/down/android'+version+'.apk'
				}
			},
			dowmapp(type){
				if(type==0){
					window.location.href=this.dowmappURL;
				}else{
					window.location.href=dowmappURLios;
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.coverbox{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.5);
		z-index: 999;
		.box{
			padding: 40rpx 60rpx;
			text-align: right;
			image{
				width: 200rpx;
				margin-bottom: 20rpx;
			}
			.txt{
				font-size: 40rpx;
				color: #fff;
				margin-right: 100rpx;
				line-height: 1.5;
			}
		}
	}
.alink{
	background: #fdf9d8;
	padding: 20rpx 30rpx;
	span{color: #ff9800;}
	.btn{
		height: 60upx;
		width: 100rpx;
		border-radius: 8upx;
		background: $primary;
		color: #fff;
		font-size: 28upx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 30rpx;
	}
}
.btns{
	position: relative;
	padding: 100upx 60upx;
	.logoimg{
		display: block;
		width: 200upx;
		height: 200upx;
		border-radius: 46upx;
		margin: 0 auto 60upx;
	}
	.btn{
		height: 90upx;
		width: 100%;
		border-radius: 12upx;
		background: $primary;
		color: #fff;
		font-size: 32upx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 40upx;
		&.btn_2{
			color: $primary;
			border: 1px solid $primary;
			background-color: #fff;
		}
	}
}
</style>
