<template>
	<view>
		<view class="moshiBox">
			<view class="icons flex-between">
				<view class="icon">
					<image class="iconimg" src="https://yd.wtanvxin.com/static/shijian1.png" mode="widthFix"></image>
				</view>
				<view class="icon">
					<image class="iconimg" src="https://yd.wtanvxin.com/static/shebei1.png" mode="widthFix"></image>
				</view>
				<view class="icon">
					<image class="iconimg" src="https://yd.wtanvxin.com/static/fenlei.png" mode="widthFix"></image>
				</view>
				<view class="icon">
					<image class="iconimg" src="https://yd.wtanvxin.com/static/shijian2.png" mode="widthFix"></image>
					<view class="num">
						15:36<text class="c_999 fz12">/20:00</text>
					</view>
				</view>
				<view class="icon">
					<image class="iconimg" src="https://yd.wtanvxin.com/static/huo.png" mode="widthFix"></image>
					<view class="num">
						0<text class="c_999 fz12">cal</text>
					</view>
				</view>
			</view>
			<view class="btns flex-start">
				<view class="btn active">YDSC000198</view>
				<view class="btn">YDSC000198</view>
				<view class="btn">YDSC000198</view>
				<view class="btn">All</view>
				<view class="btn">YDSC000198</view>
				<view class="btn">YDSC000198</view>
			</view>
			<view class="centerBox flex-between">
				<view class="flex-between flex1">
					<view class="imgBox flex1 flex-between">
						<view :class="['img',bodyIndex==0?'active':'']">
							<image src="https://yd.wtanvxin.com/static/of/body.png" mode="widthFix"></image>
						</view>
						<view :class="['img',bodyIndex==1?'active':'']">
							<image src="https://yd.wtanvxin.com/static/of/body.png" mode="widthFix"></image>
						</view>
					</view>
					<view class="nextbtn iconfont icon-arrow_r" @click="changeBody"></view>
				</view>
				<view class="valbox">
					<view class="num">0</view>
					<view class="speed"><view class="inner" style="height: 30%;"></view></view>
					<view class="iconfont icon-shan"></view>
					<view class="num">0</view>
				</view>
			</view>
			<view class="sliders flex-between uni-mt10">
				<view class="item">
					<view class="txt flex-between">
						<text>放电</text><text>20s</text>
					</view>
					<slider class="sliderbox" value="50" @change="sliderChange" activeColor="#fa6008" backgroundColor="#fff2ea" block-color="#fa6008" block-size="12" />
				</view>
				<view class="item">
					<view class="txt flex-between">
						<text>间隔</text><text>2s</text>
					</view>
					<slider class="sliderbox" value="40" @change="sliderChange" activeColor="#fa6008" backgroundColor="#fff2ea" block-color="#fa6008" block-size="12" />
				</view>
			</view>
			<view class="ftBtns flex-between uni-mt10">
				<view class="btn0 btn_red">All</view>
				<view class="btn0 btn_grey iconfont icon-jian"></view>
				<view class="btn0 btn_red iconfont icon-jia"></view>
				<view class="btn btn_red">启动</view>
				<view class="btn btn_grey">暂停</view>
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
				headTitle:"YDSC000198",
				bodyIndex:0
			}
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			uni.setNavigationBarTitle({
				title:this.headTitle
			})
		},
		methods: {
			changeBody(){
				this.bodyIndex=this.bodyIndex==0?1:0
			}
		}
	}
</script>

<style lang="scss" scoped>
page{
	background: #fff;
}
.moshiBox{
	padding: 20upx 30upx;
	.icons{
		margin-bottom: 20upx;
		.icon{
			color: #fa6008;
			padding: 10upx;
			display: flex;
			align-items: center;
		}
		.iconimg{
			width: 40upx; height: 40upx;
		}
		.num{margin-left: 6upx; color: #333;}
	}
	.btns{
		flex-wrap: wrap;
		margin-right: -24upx;
		.btn{
			height: 68upx;
			line-height: 68upx;
			padding: 0 20upx;
			background: #eee;
			color: #999;
			border-radius: 4px;
			margin-bottom: 24upx;
			margin-right: 24upx;
			font-size: 26upx;
			&.active{
				background: $primary;
				color: #fff;
			}
		}
	}
	.centerBox{
		.imgBox{
			height: 720upx;
			.img{
				opacity: .5;
				transition: all .35s;
				width: 42%;
				&.active{
					opacity: 1;
					width: 58%;
				}
			}
		}
		.nextbtn{
			padding: 10upx 30upx;
		}
		.valbox{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.speed{
				width: 20upx;
				height: 280upx;
				margin: 10upx 0;
				background: #fff2ea;
				border-radius: 10upx;
				position: relative;
				.inner{
					width: 100%;
					background: #fa6008;
					border-radius: 10upx;
					position: absolute;
					bottom: 0;
				}
			}
			.iconfont{color: #999;
			line-height: 1.5;}
		}
	}
	.sliders{
		.item{ 
			width: 45%;
			.txt{
				font-size: 26upx;
			}
		}
		.sliderbox{
			margin: 0;
			background: none;
			/deep/ .uni-slider-handle-wrapper{
				height: 10upx;
				border-radius: 100px;
			}
		}
	}
	.ftBtns{
		.btn_red{
			background: $primary;
			color: #fff;
		}
		.btn_grey{background: #eee; color:#999}
		.btn0{
			width: 76upx; height: 76upx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.btn{
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 100px;
			height: 76upx;
			width: 160upx;
			font-size: 30upx;
		}
	}
}
</style>
