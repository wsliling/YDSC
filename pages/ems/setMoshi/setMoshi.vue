<template>
	<view>
		<view class="itemlist">
			<view class="item flex-between">
				<view class="lab">脉宽</view>
				<view class="val flex1">
					<slider class="sliderbox" v-model="one" @change="sliderChange" activeColor="#fa6008" backgroundColor="#fff2ea" block-color="#fa6008" block-size="18" />
				</view>
				<view class="uidt">{{ modeinfo.PulseWidth }}us</view>
			</view>
			<view class="item flex-between">
				<view class="lab">频率</view>
				<view class="val flex1">
					<slider class="sliderbox" v-model="two" @change="sliderChange" activeColor="#fa6008" backgroundColor="#fff2ea" block-color="#fa6008" block-size="18" />
				</view>
				<view class="uidt">{{ modeinfo.Frequency }}Hz</view>
			</view>
			<view class="item flex-between">
				<view class="lab">放电</view>
				<view class="val flex1">
					<slider class="sliderbox" v-model="three" @change="sliderChange" activeColor="#fa6008" backgroundColor="#fff2ea" block-color="#fa6008" block-size="18" />
				</view>
				<view class="uidt">{{ modeinfo.Discharge }}s</view>
			</view>
			<view class="item flex-between">
				<view class="lab">间隔</view>
				<view class="val flex1">
					<slider class="sliderbox" v-model="four" @change="sliderChange" activeColor="#fa6008" backgroundColor="#fff2ea" block-color="#fa6008" block-size="18" />
				</view>
				<view class="uidt">{{ modeinfo.Interval }}s</view>
			</view>
			<view class="item flex-between">
				<view class="lab">训练时长</view>
				<view class="val flex1">
					<slider class="sliderbox" v-model="five" @change="sliderChange" activeColor="#fa6008" backgroundColor="#fff2ea" block-color="#fa6008" block-size="18" />
				</view>
				<view class="uidt">{{ modeinfo.TrainDuration }}min</view>
			</view>
			<view class="item flex-between">
				<view class="lab">缓冲时长</view>
				<view class="val flex1">
					<slider class="sliderbox" v-model="six" @change="sliderChange" activeColor="#fa6008" backgroundColor="#fff2ea" block-color="#fa6008" block-size="18" />
				</view>
				<view class="uidt">{{ modeinfo.BufferDuration }}s</view>
			</view>
			<view class="item flex-between" @click="showPicker(1)">
				<view class="lab">基波</view>
				<view class="val flex1">{{ ba }}</view>
				<view class="uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item flex-between" @click="showPicker(2)">
				<view class="lab">载波</view>
				<view class="val flex1">{{ ca }}</view>
				<view class="uni-icon uni-icon-arrowright"></view>
			</view>
		</view>
		<view style="height: 130upx;"></view>
		<view class="fixedbtn">
			<view class="btns flex-between">
				<view class="btn btn_line" @click="saveMyTrain">保存</view>
				<view class="btn">使用</view>
			</view>
		</view>
		<pickers :arr="bolistbasic" :show.sync="isShow" @success="gettype"></pickers>
		<pickers :arr="bolistcarrier" :show.sync="isShowTwo" @success="gettypeTwo"></pickers>
	</view>
</template>

<script>
import { post, toLogin } from '@/common/util.js';
import pickers from '@/components/pickersWave';
export default {
	components: {
		pickers
	},
	data() {
		return {
			userId: '',
			token: '',
			isShow: false,
			isShowTwo: false,
			bolistbasic: [], //基波
			bolistcarrier: [], //载波
			Id: 0,
			mode: [],
			modeinfo: [], //初始模式信息
			ba: '',
			ca: '',
			one: 0,
			two: 0,
			three: 0,
			four: 0,
			five: 0,
			six: 0
		};
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
	},
	onLoad(e) {
		this.Id = e.modeId;
		this.getTraininModeInfo();
	},
	methods: {
		//跳转
		goLink(url) {
			uni.navigateTo({
				url: url
			});
		},
		sliderChange(e) {
			console.log('value 发生变化：' + e.detail.value);
		},
		//弹出picker
		showPicker(type) {
			if (type == 1) {
				this.isShow = true;
			}
			if (type == 2) {
				this.isShowTwo = true;
			}
		},
		//picker切换
		gettype(e) {
			if (e.Id) {
				this.ba = e.Name;
			}
		},
		gettypeTwo(e) {
			if (e.Id) {
				this.ca = e.Name;
			}
		},
		saveMyTrain() {
			this.saveMyTraininMode();
		},
		//模式详情
		async getTraininModeInfo() {
			let result = await post('Device/GetTraininModeInfo', {
				UserId: this.userId,
				Token: this.token,
				ModeId: this.Id
			});
			if (result.code == 0) {
				this.one = result.data.PulseWidth;
				this.two = result.data.Frequency;
				this.three = result.data.Discharge;
				this.four = result.data.Interval;
				this.five = result.data.TrainDuration;
				this.six = result.data.BufferDuration;
				this.mode = result.data;
				this.modeinfo = result.data.BaseInfo;
				this.bolistbasic = result.data.BaseInfo.BasicWaveData;
				this.ba = this.bolistbasic[0].Name;
				this.bolistcarrier = result.data.BaseInfo.CarrierData;
				this.ca = this.bolistcarrier[0].Name;
			}
		},
		async saveMyTraininMode() {
			let result = await post('Device/SaveMyTraininMode', {
				UserId: this.userId,
				Token: this.token,
				ModelName: this.mode.Name,
				BasicWave: this.bolistbasic,
				BufferDuration: this.six,
				Carrier: this.bolistcarrier,
				Discharge: this.three,
				Frequency: this.two,
				Interval: this.four,
				TypeId: this.mode.TypeId,
				ModeId: this.mode.ModeId,
				PulseWidth: this.one,
				TrainDuration: this.five
			});
			if (result.code == 0) {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 2000
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.itemlist {
	padding: 30upx;
	.item {
		background: #fff;
		border-radius: 16upx;
		margin-bottom: 20upx;
		padding: 30upx;
		.lab {
			font-size: 30upx;
			width: 120upx;
		}
		.val {
			padding: 0 20upx;
			font-size: 30upx;
		}
		.sliderbox {
			margin: 0;
			background: none;
			height: 40upx;
			/deep/ .uni-slider-handle-wrapper {
				height: 10upx;
				border-radius: 100px;
			}
		}
		.uidt {
			width: 120upx;
			text-align: right;
		}
		.uni-icon {
			font-size: 32upx;
			color: #666;
		}
	}
}
.fixedbtn {
	padding: 20upx 30upx;
	background: #f5f5f5;
	.btn {
		width: 48%;
		&.btn_line {
			border: 1px solid $primary;
			color: $primary;
			background: none;
		}
	}
}
</style>
