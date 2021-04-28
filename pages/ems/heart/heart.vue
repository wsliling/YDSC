<template>
	<view class="fatPage">
		<view class="tabTime flex-center">
			<block v-for="(item, index) in tab" :key="index">
				<view :class="['item', item.type == activeType ? 'active' : '']" @click="tabFn(item.type)">{{ item.name }}</view>
			</block>
		</view>
		<view class="dateTime flex-center">
			<view class="iconfont icon-arrow c_999 fz14"></view>
			<view class="time center">2021年2月24日-2021年3月02日</view>
			<view class="iconfont icon-arrow_r c_999 fz14" v-if="false"></view>
		</view>
		<view class="nowInfo">
			<view class="time c_999">09:34</view>
			<view class="weight">
				86
				<text class="c_999 fz14">次/分钟</text>
			</view>
		</view>
		<view class="itembox">
			<view class="flex-center"><canvas canvas-id="canvasRing" id="canvasRing" class="charts" @touchstart="touchPie($event, 'canvasRing')"></canvas></view>
		</view>
		<view class="itemlist_1">
			<view class="itemlist">
				<view class="itembox">
					<view class="txtName">心率范围</view>
					<view class="val">56-126次/分钟</view>
				</view>
				<view class="itembox">
					<view class="txtName">心率范围</view>
					<view class="val">56-126次/分钟</view>
				</view>
				<view class="itembox">
					<view class="txtName">心率范围</view>
					<view class="val">56-126次/分钟</view>
				</view>
			</view>
		</view>
		<view class="bottom">静息心牢是指在清醒不活动的安静状态下，每分钟心跳次数，是衡量心脏健康的重要指标之一,理想的静的息心率是50-80次/分钟</view>
	</view>
</template>

<script>
import { post, toLogin } from '@/common/util.js';
import uCharts from '@/components/u-charts/u-charts.js';
var _self;
var canvasObj = {};
export default {
	data() {
		return {
			userId: '',
			token: '',
			tab: [{ type: 0, name: '日' }, { type: 1, name: '周' }, { type: 2, name: '月' }, { type: 3, name: '年' }],
			activeType: 1,
			cWidth: '',
			cHeight: '',
			pixelRatio: 1,
			chartData: {
				categories: ['00:00', '06:00', '12:00', '18:00', '00:00'],
				series: [
					{
						name: '心跳',
						data: [80, 120, 85, 107, 90]
					}
				]
			}
		};
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
	},
	onLoad() {
		_self = this;
		this.cWidth = uni.upx2px(680);
		this.cHeight = uni.upx2px(400);
	},
	onReady() {
		this.getData();
	},
	methods: {
		tabFn(type) {
			this.activeType = type;
		},
		getData() {
			_self.fillData(_self.chartData.series);
		},
		fillData(data) {
			//自定义文案示例，需设置format字段
			for (let i = 0; i < data.length; i++) {
				data[i].format = () => {
					return data[i].data;
				};
			}
			this.showRing('canvasRing');
		},
		showRing(canvasId) {
			canvasObj[canvasId] = new uCharts({
				$this: _self,
				type: 'area',
				canvasId: canvasId,
				canvas2d: false,
				background: 'none',
				animation: false,
				timing: 'easeOut',
				duration: 1000,
				color: ['#1890FF', '#91CB74', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452', '#9A60B4', '#ea7ccc'],
				padding: [15, 15, 15, 0],
				rotate: false,
				reserve: false,
				fontSize: 11,
				fontColor: '#666666',
				enableScroll: false,
				touchMoveLimit: 60,
				enableMarkLine: false,
				dataLabel: false,
				dataPointShape: false,
				dataPointShapeType: 'solid',
				xAxis: {
					disabled: false,
					axisLine: false,
					axisLineColor: '#CCCCCC',
					calibration: false,
					fontColor: '#666666',
					fontSize: 13,
					rotateLabel: false,
					itemCount: 5,
					boundaryGap: 'center',
					disableGrid: true,
					gridColor: '#CCCCCC',
					gridType: 'solid',
					dashLength: 4,
					gridEval: 1,
					scrollShow: false,
					scrollAlign: 'left',
					scrollColor: '#A6A6A6',
					scrollBackgroundColor: '#EFEBEF'
				},
				yAxis: {
					disabled: false,
					disableGrid: false,
					splitNumber: 4,
					gridType: 'solid',
					dashLength: 2,
					gridColor: '#CCCCCC',
					padding: 10,
					showTitle: false,
					data: [
						{
							position: 'right',
							disabled: false,
							axisLine: true,
							axisLineColor: '#CCCCCC',
							calibration: false,
							fontColor: '#666666',
							fontSize: 13,
							textAlign: 'right',
							title: '',
							titleFontSize: 13,
							titleOffsetY: 0,
							titleOffsetX: 0,
							titleFontColor: '#666666',
							min: 30,
							max: 200,
							tofix: null,
							unit: '',
							format: ''
						}
					]
				},
				legend: {
					show: false,
					position: 'bottom',
					float: 'center',
					padding: 5,
					margin: 5,
					backgroundColor: 'rgba(0,0,0,0)',
					borderColor: 'rgba(0,0,0,0)',
					borderWidth: 0,
					fontSize: 13,
					fontColor: '#666666',
					lineHeight: 11,
					hiddenColor: '#CECECE',
					itemGap: 10
				},
				extra: {
					area: {
						type: 'straight',
						opacity: 0.2,
						addLine: true,
						width: 1.2,
						gradient: false
					},
					tooltip: {
						showBox: true,
						showArrow: true,
						borderWidth: 0,
						borderRadius: 0,
						borderColor: '#000000',
						borderOpacity: 0.7,
						bgColor: '#000000',
						bgOpacity: 0.7,
						gridType: 'solid',
						dashLength: 4,
						gridColor: '#CCCCCC',
						fontColor: '#FFFFFF',
						splitLine: true,
						horizentalLine: false,
						xAxisLabel: false,
						yAxisLabel: false,
						labelBgColor: '#FFFFFF',
						labelBgOpacity: 0.7,
						labelFontColor: '#666666'
					},
					markLine: {
						type: 'solid',
						dashLength: 4
					}
				},
				series: _self.chartData.series,
				categories: _self.chartData.categories,
				width: _self.cWidth * _self.pixelRatio,
				height: _self.cHeight * _self.pixelRatio
			});
		},
		touchPie(e, id) {
			canvasObj[id].showToolTip(e, {
				format: function(item) {
					return item.name + ':' + item.data;
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import './style';
.charts {
	width: 100%;
	height: 400rpx;
}
</style>
