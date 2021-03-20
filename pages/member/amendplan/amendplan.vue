<template>
	<view>
		<view class="m-wrap">
			<view class="row" v-for="(item, index) in list" :key="index">
				<view class="toprow">
					<view class="titlename">
						<image class="icon_plan" :src="item.icon"></image>
						{{item.title}}(kg)
					</view>
					<switch checked @change="switchChange" color="#fa6008" style="transform:scale(0.8) !important;" />
				</view>
				<view class="detail" style="width: 100%;">
						<carousel :img-list="item.number" url-key="item" @selected="selectedBanner" :verticals="false" :distance="'276upx'"/>
				</view>
				<view class="evaluate">{{item.detail}}</view>
			</view>
		</view>
		<view class="btn" @click="tolink">下一步</view>
	</view>
</template>

<script>
import carousel from '@/components/vear-carousel/vear-carousel';
export default {
	components: {
		carousel
	},
	data() {
		return {
			list:[{
				icon:'../../../static/planIcon.png',
				title:"减体重",
				number:['1','2','3','4','5','6','7','8','9'],
				detail:"当前体重52.0kg"
			},{
				icon:'../../../static/planIcon1.png',
				title:"减脂",
				number:['1.0','2.0','3.0','4.0','5.0','6.0','7.0','8.0','9.0'],
				detail:"当前体脂2.0kg"
			},{
				icon:'../../../static/planIcon2.png',
				title:"增肌",
				number:['1.0','1.1','1.2','1.3','1.4','1.5','1.6','1.7','1.8','1.9'],
				detail:"当前肌肉总量0.0kg"
			}]
		};
		
	},
	methods: {
		// 下一步
		tolink() {
			uni.navigateTo({
				url: '/pages/member/endTime/endTime'
			});
		},

		switchChange: function(e) {
			console.log(e.target.value);
		},

		selectedBanner(item, index) {
			console.log('-------', item, index);
		}
	}
};
</script>

<style lang="scss" scoped>
.m-wrap {
	height: 84vh;
	overflow: scroll;
}
.image-container{
	height: 70rpx;
}
.row {
	width: 690upx;
	height: 216upx;
	background: #ffffff;
	border-radius: 20upx;
	margin: 30upx auto;
	padding: 20upx;
	.titlename {
		font-size: 30upx;
		font-weight: bold;
		color: #333333;
		display: flex;
		align-items: center;
		.icon_plan {
			width: 30upx;
			height: 34upx;
			margin-right: 10upx;
		}
	}
	.toprow {
		display: flex;
		justify-content: space-between;
	}
	.detail {
	height: 70rpx;
	}
	.evaluate {
		font-size: 24upx;
		font-weight: 500;
		color: #999999;
		text-align: center;
	}
}
.btn {
	width: 690upx;
	height: 98upx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 28rpx;
	color: #ffffff;
	margin: auto;
	background: #fa6008;
	border-radius: 50upx;
}

</style>
