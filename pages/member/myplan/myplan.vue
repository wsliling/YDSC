<template>
	<view>
		<view class="m-wrap">
			<view class="row" v-for="(item,index) in 3" :key="index">
				<view class="titlename"><image class="icon_plan" src="/static/f2_in.png"></image>减体重</view>
				<view class="detail">
					<view class="weight">2.0kg<text class="txt">/4kg</text></view>
					<view class="schedule">
						<view class="wwrap">
							<view class="select" style="width: 10%;"></view>
						</view>
						<view class="percent">10%</view>
					</view>
				</view>
				<view class="evaluate">与目标越来越近了，继续加油哦</view>
			</view>
		</view>
		<view class="flooter">
			<view class="btn" @click="change(0)" :class="{active:btnnum == 0}">删除计划</view>
			<view class="btn" @click="change(1)" :class="{active:btnnum == 1}">修改计划</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
		   return {
		      btnnum: 1,
		  };
		},
		methods:{
		  change(e) {
		     this.btnnum = e
			if(e==0){
				
			}else{
				uni.navigateTo({
					url:'/pages/member/amendplan/amendplan'
				})
			}
		  }
		}
	}
	
</script>

<style lang="scss" scoped >
	.m-wrap{
		height: 85vh;
		overflow: scroll;
	}
	.row{
		width: 690upx;
		height: 216upx;
		background: #FFFFFF;
		border-radius: 20upx;
		margin: 30upx auto;
		padding: 20upx;
		.titlename{
			font-size: 30upx;
			font-weight: bold;
			color: #333333;
			display: flex;
			align-items: center;
			.icon_plan{
				width: 30upx;
				height: 34upx;
				margin-right: 10upx;
			}
		}
		.detail{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.weight{
				font-size: 46upx;
				color: #FA6008;
				.txt{
					color: #999;
					font-size: 24upx;
				}
			}
		}
		.schedule{
			display: flex;
			align-items: center;
			.wwrap{
				width: 172upx;
				height: 10upx;
				background: #FFF2EA;
				border-radius: 6upx;
				overflow: hidden;
				.select{
					height: 100%;
					background: #FA6008;
				}
			}
			.percent{
				font-size: 22upx;
				font-weight: 500;
				color:#FA6008;
				margin-left: 10upx;
			}
		}
		.evaluate{
			font-size: 24upx;
			font-weight: 500;
			color: #999999;
		}
	}
	
	// 底部按钮
.flooter{
	width: 100%;
	position: fixed;
	bottom: 20upx;
	display: flex;
	justify-content: space-around;
	.btn{
		width: 280upx;
		height: 88upx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2upx solid #FA6008;
		border-radius: 50upx;
		font-size: 28upx;
		color:#FA6008;
	}
}	
.btn.active{
	color: #FFFFFF;
	background-color: #fa6008;
}
</style>
