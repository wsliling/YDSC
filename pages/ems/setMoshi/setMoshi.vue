<template>
	<view>
		<view class="itemlist">
			<view class="item flex-between">
				<view class="lab">脉宽</view>
				<view class="val flex1">
					<slider class="sliderbox" value="50" @change="sliderChange" activeColor="#fa6008" backgroundColor="#fff2ea" block-color="#fa6008" block-size="18" />
				</view>
				<view class="uidt">{{ modeinfo.PulseWidth }}us</view>
			</view>
			<view class="item flex-between">
				<view class="lab">频率</view>
				<view class="val flex1">
					<slider class="sliderbox" value="33" @change="sliderChange" activeColor="#fa6008" backgroundColor="#fff2ea" block-color="#fa6008" block-size="18" />
				</view>
				<view class="uidt">{{ modeinfo.Frequency }}Hz</view>
			</view>
			<view class="item flex-between">
				<view class="lab">放电</view>
				<view class="val flex1">
					<slider class="sliderbox" value="20" @change="sliderChange" activeColor="#fa6008" backgroundColor="#fff2ea" block-color="#fa6008" block-size="18" />
				</view>
				<view class="uidt">{{ modeinfo.Discharge }}s</view>
			</view>
			<view class="item flex-between">
				<view class="lab">间隔</view>
				<view class="val flex1">
					<slider class="sliderbox" value="33" @change="sliderChange" activeColor="#fa6008" backgroundColor="#fff2ea" block-color="#fa6008" block-size="18" />
				</view>
				<view class="uidt">{{ modeinfo.Interval }}s</view>
			</view>
			<view class="item flex-between">
				<view class="lab">训练时长</view>
				<view class="val flex1">
					<slider class="sliderbox" value="33" @change="sliderChange" activeColor="#fa6008" backgroundColor="#fff2ea" block-color="#fa6008" block-size="18" />
				</view>
				<view class="uidt">{{ modeinfo.TrainDuration }}min</view>
			</view>
			<view class="item flex-between">
				<view class="lab">缓冲时长</view>
				<view class="val flex1">
					<slider class="sliderbox" value="33" @change="sliderChange" activeColor="#fa6008" backgroundColor="#fff2ea" block-color="#fa6008" block-size="18" />
				</view>
				<view class="uidt">{{ modeinfo.BufferDuration }}s</view>
			</view>
			<view class="item flex-between" @click="showPicker(1)">
				<view class="lab">基波</view>
				<view class="val flex1">{{ modeinfo.BasicWaveName }}</view>
				<!-- {{ bolistbasic }} -->
				<view class="uni-icon uni-icon-arrowright"></view>
			</view>
			<view class="item flex-between" @click="showPicker(2)">
				<view class="lab">载波</view>
				<view class="val flex1">{{ modeinfo.CarrierName }}</view>
				<!-- {{ bolistcarrier }} -->
				<view class="uni-icon uni-icon-arrowright"></view>
			</view>
		</view>
		<view style="height: 130upx;"></view>
		<view class="fixedbtn">
			<view class="btns flex-between">
				<view class="btn btn_line">保存</view>
				<view class="btn">使用</view>
			</view>
		</view>
		<pickers :arr="bolistbasic" :show.sync="isShow" @success="gettype"></pickers>
		<pickers :arr="bolistcarrier" :show.sync="isShowTwo" @success="gettype"></pickers>
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
			modeinfo: [],
			baseinfo: []
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
		showPicker(type) {
			if (type == 1) {
				this.isShow = true;
			}
			if (type == 2) {
				this.isShowTwo = true;
			}
		},
		gettype(e) {
			console.log(e, '//');
			if (e.code) {
				// this.bolistbasic = e.code;
			}
		},
		async getTraininModeInfo() {
			let result = await post('Device/GetTraininModeInfo', {
				UserId: this.userId,
				Token: this.token,
				ModeId: this.Id
			});
			if (result.code == 0) {
				this.modeinfo = result.data;
				this.bolistbasic = result.data.BaseInfo.BasicWaveData;
				this.bolistcarrier = result.data.BaseInfo.CarrierData;
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
