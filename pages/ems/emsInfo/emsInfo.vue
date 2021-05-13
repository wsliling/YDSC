<template>
	<view style="padding: 30upx;">
		<block v-if="hasData">
		<view class="ems-item" v-for="(item,index) in info" :key="index">
			<view class="flex-between hd" @click="showDetail(index)">
				<view class="time flex1">报告时间：{{item.created}}</view>
				<view :class="['iconfont',item.active?'icon-iconset0418':'icon-arrow_r']"></view>
			</view>
			<view class="line-list" v-if="item.active">
				<view class="line-item">
					<view class="lab">体重</view>
					<view class="val">{{item.weight/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">肥胖度</view>
					<view class="val">{{item.obesity}}<text class="uidt">%</text></view>
				</view>
				<view class="line-item">
					<view class="lab">BMI</view>
					<view class="val">{{item.bmi}}</view>
				</view>
				<view class="line-item">
					<view class="lab">脂肪重量</view>
					<view class="val">{{item.fatMass/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">体脂率</view>
					<view class="val">{{item.bfr}}<text class="uidt">%</text></view>
				</view>
				<view class="line-item">
					<view class="lab">骨量</view>
					<view class="val">{{item.boneMass}}<text class="uidt">%</text></view>
				</view>
				<view class="line-item">
					<view class="lab">骨骼肌重量</view>
					<view class="val">{{item.skeletalMuscleWeight/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">骨骼肌率</view>
					<view class="val">{{item.skeletalMuscleRate}}<text class="uidt">%</text></view>
				</view>
				<view class="line-item">
					<view class="lab">基础代谢</view>
					<view class="val">{{item.basicMetabolism}}<text class="uidt">卡</text></view>
				</view>
				<view class="line-item">
					<view class="lab">骨盐量</view>
					<view class="val">{{item.bmc}}<text class="uidt">%</text></view>
				</view>
				<view class="line-item">
					<view class="lab">躯干脂肪</view>
					<view class="val">{{item.bodyFat/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">躯干肌肉</view>
					<view class="val">{{item.bodyMuscle/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">去脂体重</view>
					<view class="val">{{item.ffm/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">左上肢脂肪</view>
					<view class="val">{{item.leftArmFat/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">左上肢肌肉</view>
					<view class="val">{{item.leftArmMuscle/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">左下肢脂肪</view>
					<view class="val">{{item.leftLegFat/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">左下肢肌肉</view>
					<view class="val">{{item.leftLegMuscle/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">右上肢脂肪</view>
					<view class="val">{{item.rightArmFat/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">右上肢肌肉</view>
					<view class="val">{{item.rightArmMuscle/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">右下肢脂肪</view>
					<view class="val">{{item.rightLegFat/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">右下肢肌肉</view>
					<view class="val">{{item.rightLegMuscle/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">水分</view>
					<view class="val">{{item.moisture/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">肌肉率</view>
					<view class="val">{{item.muscleRate*100}}<text class="uidt">%</text></view>
				</view>
				<view class="line-item">
					<view class="lab">肌肉重量</view>
					<view class="val">{{item.muscleWeight/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">身体年龄</view>
					<view class="val">{{item.physicalAge}}<text class="uidt">岁</text></view>
				</view>
				<view class="line-item">
					<view class="lab">蛋白质</view>
					<view class="val">{{item.protein/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">内脏脂肪</view>
					<view class="val">{{item.visceralFat/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">水含量</view>
					<view class="val">{{item.waterContent/2}}<text class="uidt">kg</text></view>
				</view>
				<view class="line-item">
					<view class="lab">腰臀比</view>
					<view class="val">{{item.whr}}</view>
				</view>
			</view>
		</view>
		</block>
		<noData :isShow="noDataIsShow" :tips="'暂无训练报告'"></noData>
	</view>
</template>

<script>
	import { post, toLogin } from '@/common/util.js';
	import noData from '@/components/noData.vue'; //暂无数据
	export default {
		components: {
			noData
		},
		data() {
			return {
				hasData: false,
				noDataIsShow: false,
				info:[],
			}
		},
		onLoad() {
			this.GetTrainList();
		},
		methods: {
			async GetTrainList() {
				let result = await post('Ems/GetTrainList', {
					UserId: uni.getStorageSync('userId'),
					Token: uni.getStorageSync('token')
				});
				if (result.code === 0) {
					let _this=this;
					if(result.data.length){
						this.hasData = true;
						this.noDataIsShow = false;
						result.data.forEach(function(item,index){
							_this.$set(item,"active",false)
						})
						this.info = result.data;
					}else{
						this.noDataIsShow = true;
						this.hasData = false;
					}
					
				}
			},
			showDetail(index){
				this.$set(this.info[index],"active",!this.info[index].active)
			}
		}
	}
</script>

<style lang="scss" scoped>
.ems-item{
	background: #fff;
	border-radius: 6px;
	margin-bottom: 20upx;
	.hd{
		padding: 30upx;
		.iconfont{
			color: #999;
			font-size: 32upx;
			&.icon-arrow_r{
				font-size: 28upx;
			}
		}
	}
	.line-list{
		border-top: 1px solid #eee;
		.uidt{
			font-size: 26upx;
			color: #999;
			margin-left: 4upx;
		}
	}
}
</style>
