<template>
	<view>
		<view class="m-topbox">
			<view class="exercise">总运动</view>
			<view class="minute">
				86
				<text>分钟</text>
			</view>
			<view class="itemRow">
				<view class="item">
					<view class="name">消耗（千卡）</view>
					<view class="num">123</view>
				</view>
				<view class="item">
					<view class="name">累计（天）</view>
					<view class="num">2</view>
				</view>
				<view class="item">
					<view class="name">连续（天）</view>
					<view class="num">0</view>
				</view>
			</view>
		</view>
		<view class="line-list uni-bg-white">
			<view class="Yi-hd"><text class="title pd15">身体数据</text></view>
			<view class="line-item">
				<view class="lab">体重</view>
				<view class="item_r flex1"><input class="ipt" v-model="Weight" placeholder="请输入" /></view>
				<text class="uidt">kg</text>
			</view>
			<view class="line-item">
				<view class="lab">胸围</view>
				<view class="item_r flex1"><input class="ipt" v-model="Bust" placeholder="请输入" /></view>
				<text class="uidt">cm</text>
			</view>
			<view class="line-item">
				<view class="lab">腰围</view>
				<view class="item_r flex1"><input class="ipt" v-model="Waist" placeholder="请输入" /></view>
				<text class="uidt">cm</text>
			</view>
			<view class="line-item">
				<view class="lab">臂围</view>
				<view class="item_r flex1"><input class="ipt" v-model="Hipline" placeholder="请输入" /></view>
				<text class="uidt">cm</text>
			</view>
			<view class="line-item">
				<view class="lab">身高</view>
				<view class="item_r flex1"><input class="ipt" v-model="Height" placeholder="请输入" /></view>
				<text class="uidt">cm</text>
			</view>
			<view class="line-item">
				<view class="lab">BIM</view>
				<view class="item_r flex1">{{Info.BMI}}</view>
			</view>
			<!-- <view class="line-item">
				<view class="lab">静息心律</view>
				<view class="item_r flex1"><input class="ipt" placeholder="请输入" /></view>
				<text class="uidt">bpm</text>
			</view> -->
		</view>
		<view class="ftbtn">
			<view class="btn" @click="EditUserData">
				保存
			</view>
		</view>
	</view>
</template>

<script>
import { post, get, toLogin } from '@/common/util.js';
export default {
	data() {
		return {
			Info:{},
			Weight:0,
			Bust:0,
			Waist:0,
			Hipline:0,
			Height:0,
		};
	},
	onShow() {
		this.GetUserData()
	},
	methods: {
		async GetUserData() {
			let result = await post('Device/GetUserData', {
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token')
			});
			if (result.code === 0) {
				this.Info = result.data;
				this.Weight=result.data.Weight;
				this.Bust=result.data.Bust;
				this.Waist=result.data.Waist;
				this.Hipline=result.data.Hipline;
				this.Height=result.data.Height;
			}
		},
		async EditUserData(){
			//if(!this.valOther()) return;
			let result = await post('Device/EditUserData', {
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token'),
				Weight:this.Weight,				Bust:this.Bust,				Waist:this.Waist,				Hipline:this.Hipline,				Height:this.Height
			});
			if (result.code === 0) {
				uni.showToast({
				  title: result.msg,
				  icon: "none"
				})
				setTimeout(()=>{
					this.GetUserData()
				},2000)
			}
		},
		valOther(){
			if(!this.Weight){
				uni.showToast({
				  title: "请输入体重!",
				  icon: "none",
				  duration: 2000
				});
				return false;
			}
			if(!this.Bust){
				uni.showToast({
				  title: "请输入胸围!",
				  icon: "none",
				  duration: 2000
				});
				return false;
			}
			if(!this.Waist){
				uni.showToast({
				  title: "请输入腰围!",
				  icon: "none",
				  duration: 2000
				});
				return false;
			}
			if(!this.Hipline){
				uni.showToast({
				  title: "请输入臂围!",
				  icon: "none",
				  duration: 2000
				});
				return false;
			}
			if(!this.Height){
				uni.showToast({
				  title: "请输入身高!",
				  icon: "none",
				  duration: 2000
				});
				return false;
			}
			return true
		}
	}
};
</script>

<style lang="scss" scoped>
.m-topbox {
	width: 100%;
	height: 500upx;
	padding: 0 50upx;
	padding-bottom: 20upx;
	background: #2c2d2d;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	.exercise {
		font-size: 32upx;
		/* #ifndef MP-WEIXIN */
		margin-top: 70upx;
		/* #endif */
		font-weight: bold;
		color: #ffffff;
	}
	.minute {
		font-size: 50upx;
		font-weight: 400;
		color: #ffffff;
		text {
			font-size: 26upx;
			font-weight: 500;
			color: #c9c8c8;
		}
	}
	.itemRow {
		display: flex;
		justify-content: space-between;
		.item {
			.name {
				font-size: 26upx;
				font-weight: 500;
				color: #c9c8c8;
			}
			.num {
				font-size: 48upx;
				font-family: 'Hanzipen SC';
				font-weight: 400;
				color: #ffffff;
			}
		}
	}
}
.line-item{
	.lab{font-size: 30upx;}
	.item_r{
		text-align:right;font-size: 32upx;padding: 0 20upx;
	}
	.uidt{
		color: #999;
	}
}
.ftbtn{padding: 40upx 30upx 20upx;}
</style>
