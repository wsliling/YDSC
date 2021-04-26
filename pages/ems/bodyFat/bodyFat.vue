<template>
	<view class="fatPage">
		<view class="tabTime flex-center">
			<block v-for="(item,index) in tab" :key="index">
			<view :class="['item',item.type==activeType?'active':'']" @click="tabFn(item.type)">{{item.name}}</view>
			</block>
		</view>
		<view class="dateTime flex-center">
			<view class="iconfont icon-arrow c_999 fz14"></view>
			<view class="time center">
				2021年2月24日-2021年3月02日
			</view>
			<view class="iconfont icon-arrow_r c_999 fz14" v-if="false"></view>
		</view>
		<view class="nowInfo">
			<view class="time c_999">
				09:34
			</view>
			<view class="weight">
				52.5<text class="c_999 fz14">/kg</text>
			</view>
		</view>
		<view class="itembox flex">
			<view class="box_l">
				<view class="txtName uni-mb10">身体得分</view>
				<view class="num">
					78<text class="c_999 fz14">分</text>
				</view>
			</view>
			<view class="box_r flex1">
				您的身体状况属于良好的状态，基本上很不错但是内脏脂肪略多，建议控制油盐及热量高的摄入，适当增加跑步，进行游泳等有氧运动
			</view>
		</view>
		<view class="itemlist flex">
			<!-- type1：标准，type2：过高，type3：偏低，type4：超重 -->
			<view class="itembox">
				<view class="txtName">去脂体重</view>
				<view class="val">54kg</view>
				<view class="type type1">标准</view>
			</view>
			<view class="itembox">
				<view class="txtName">身体年龄</view>
				<view class="val">24岁</view>
			</view>
			<view class="itembox">
				<view class="txtName">心率</view>
				<view class="val">95bpm</view>
				<view class="type type2">过高</view>
			</view>
			<view class="itembox">
				<view class="txtName">水分率</view>
				<view class="val">47%</view>
				<view class="type type3">偏低</view>
			</view>
			<view class="itembox">
				<view class="txtName">骨盐量</view>
				<view class="val">2kg</view>
				<view class="type type1">标准</view>
			</view>
			<view class="itembox">
				<view class="txtName">蛋白质</view>
				<view class="val">23%</view>
				<view class="type type2">过高</view>
			</view>
			<view class="itembox">
				<view class="txtName">内脏脂肪率</view>
				<view class="val">8.0级</view>
				<view class="type type1">标准</view>
			</view>
			<view class="itembox">
				<view class="txtName">身体类型</view>
				<view class="val">健康型</view>
			</view>
			<view class="itembox">
				<view class="txtName">基础代谢率</view>
				<view class="val">1.445千卡/日</view>
				<view class="type type2">过高</view>
			</view>
			<view class="itembox">
				<view class="txtName">BMI</view>
				<view class="val">23.8</view>
				<view class="type type4">超重</view>
			</view>
			<view class="itembox">
				<view class="txtName">脂肪率</view>
				<view class="val">23.85</view>
				<view class="type type2">过高</view>
			</view>
			<view class="itembox">
				<view class="txtName">骨骼肌量</view>
				<view class="val">32.1kg</view>
				<view class="type type1">标准</view>
			</view>
		</view>
		<view class="itembox">
			<view class="hd center fz18">
				人体成分
			</view>
			<view class="flex-center">
				<canvas canvas-id="canvasRing" id="canvasRing" class="charts" @touchstart="touchPie($event,'canvasRing')"></canvas>
			</view>
			<view class="c_999 center">
				组成(kg)：水分+蛋白质+脂肪量+骨盐量
			</view>
		</view>
	</view>
</template>

<script>
	import {post,toLogin} from '@/common/util.js';
	import uCharts from '@/components/u-charts/u-charts.js';
	var _self;
	var canvasObj = {};
	export default {
		data() {
			return {
				userId: "",
				token: "",
				tab:[
					{type:0,name:"日"},
					{type:1,name:"周"},
					{type:2,name:"月"},
					{type:3,name:"年"}
				],
				activeType:1,
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				series:[
				  {
				    "name": "水分",
				    "data": 36.5
				  },
				  {
				    "name": "蛋白质",
				    "data": 18.6
				  },
				  {
				    "name": "脂肪量",
				    "data": 20.8
				  },
				  {
				    "name": "骨盐量",
				    "data": 12.8
				  }
				]
			}
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		onLoad() {
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
		},
		onReady() {
			this.getData();
		},
		methods: {
			tabFn(type){
				this.activeType=type
			},
			getData() {
				_self.fillData(_self.series);
			},
			fillData(data) {
				//自定义文案示例，需设置format字段
				for (let i = 0; i < data.length; i++) {
					data[i].format = () => {
						return data[i].name + data[i].data
					};
				}
				this.showRing("canvasRing");
			},
			showRing(canvasId) {
				canvasObj[canvasId] = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'ring',
					fontSize: 11,
					padding: [5, 5, 5, 5],
					legend: {
						show: true,
						position: 'right',
						float: 'center',
						itemGap: 10,
						padding: 5,
						lineHeight: 26,
						margin: 5,
						//backgroundColor:'rgba(41,198,90,0.2)',
						//borderColor :'rgba(41,198,90,0.5)',
						borderWidth: 1
					},
					title: {
						name: '',
						color: '#7cb5ec',
						fontSize: 25 * _self.pixelRatio,
					},
					subtitle: {
						name: '',
						color: '#666666',
						fontSize: 15 * _self.pixelRatio,
					},
					extra: {
						pie: {
							lableWidth: 15,
							ringWidth: 30 * _self.pixelRatio, //圆环的宽度
							offsetAngle: 0 //圆环的角度
						}
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: _self.series,
					animation: false,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					disablePieStroke: true,
					dataLabel: true,
				});

			},
			touchPie(e, id) {
				canvasObj[id].showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				});
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
	.charts {
		width:100%;
		height: 500rpx;
	}
</style>
