<template>
	<view class="content">
		<view class="container">
			<!-- 日期列表 -->
			<view class="class">排课时间</view>
			<scroll-view class="scroll-view_H b-t b-b" scroll-x>
				<block v-for="(item, index) in dateArr" :key="index">
					<div class="flex-box" @click="selectDateEvent(index, item)">
						<!-- <view class="date-box" 
						:style="{ color: index == dateActive ? selectedTabColor : '#333' }"
						> -->
						<view class="date-box">
							<text class="date" :class="{ active: index == dateActive }" :style="{ color: index == dateActive ? selectedTabColor : '#333' }">{{ item.date1 }}</text>
							<text>{{ item.week }}</text>
						</view>
					</div>
				</block>
			</scroll-view>
			<!-- 时间选项 -->
			<view class="time-box_1">
				<view class="begin">课程时长60分钟(请选择起始时问)</view>
				<view class="time-box">
					<block v-for="(item, _index) in timeArr" :key="_index">
						<view class="item">
							<view
								class="item-box"
								:class="{ disable: item.disable, active: _index == timeActive }"
								:style="{ color: _index == timeActive ? selectedItemColor : '#333' }"
								@click="selectTimeEvent(_index, item)"
							>
								<text>{{ item.time }}</text>
								<text class="all"></text>
								<view class="full" v-show="item.disable"><image src="/static/course/course5_8.png" mode=""></image></view>
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>
		<view class="bottom" @click="pop">
			<!-- <view class="show_time">
				预约时间:{{ordertime}}
			</view> -->
			<button form-type="submit" type="default" size="mini" class="buybtn" @click="getTime">预约</button>
			<wyb-popup ref="popup" type="center" height="490" width="600" radius="6" :showCloseIcon="true">
				<view class="popup-content">
					<view class="title">预约信息</view>
					<view class="name"><input type="text" placeholder="姓名" /></view>
					<view class="phone"><input type="text" placeholder="手机号码" /></view>
					<view class="now" @click="now">立即预约</view>
				</view>
			</wyb-popup>
		</view>
	</view>
</template>

<script>
import { dateData, timeData, timeStamp, currentTime } from '../utils/date.js';
import wybPopup from '@/components/wyb-popup/wyb-popup.vue';
export default {
	components: {
		wybPopup
	},
	name: 'times',
	model: {
		prop: 'showPop',
		event: 'change'
	},
	props: {
		disableText: {
			//禁用显示的文本
			type: String,
			default: '满'
		},
		undisableText: {
			//未禁用显示的文本
			type: String,
			default: ''
		},
		timeInterval: {
			// 时间间隔，小时为单位
			type: Number,
			default: 1
		},
		selectedTabColor: {
			// 日期栏选中的颜色
			type: String,
			default: '#fa6008'
		},
		selectedItemColor: {
			// 时间选中的颜色
			type: String,
			default: '#fa6008'
		},

		appoTime: {
			// 预约的时间
			type: Array,
			default() {
				return ['2020-12-05 17:00:00', '2020-12-06 09:00:00'];
			}
		}
	},
	data() {
		return {
			ordertime: '暂无选择', // 选中时间
			dateArr: [], //日期数据
			timeArr: [], //时间数据
			nowdata: '', // 当前日期
			timeQuery: '', // 用于日期对比,选中的日期
			dateActive: 0, //选中的日期索引
			timeActive: 0, //选中的时间索引
			selectDate: '', //选择的日期
			selectTime: '', //选择的时间
			currentTime: '' //当前时分秒
		};
	},
	created(props) {
		this.nowdata = currentTime();
		this.timeQuery = currentTime();
		this.setOnload();
	},
	methods: {
		pop() {
			this.$refs.popup.show(); // 显示
		},
		now() {
			uni.navigateTo({
				url: '/pages/course/now/now'
			});
		},
		setOnload() {
			this.dateArr = dateData(); // 日期栏初始化
			this.timeArr = timeData('08:00:00', '22:00:00', 2); //时间选项初始化
			this.selectDate = `${this.dateArr[this.dateActive]['date']}`; //默认选中的日期
			this.currentTime = timeStamp(Date.now()).hour; //当前时分秒
			let ifFullTime = true;
			this.timeArr.forEach((item, index) => {
				if (this.timeQuery == this.nowdata) {
					//判断是当前这一天
					if (this.currentTime > item.time) {
						//选中时间小于当前时间则禁用
						item.disable = 1;
					}
				}
				// 将预约的时间禁用
				this.appoTime.forEach(items => {
					// console.log(items.split(' ')[0], this.selectDate);
					if (items.split(' ')[0] == this.selectDate) {
						if (item.time == items.split(' ')[1]) {
							item.disable = 1;
						}
					}
				});
				if (item.disable == 0) {
					// 判断是否当前日期时间都被预约
					ifFullTime = false;
				}
			});
			if (ifFullTime) {
				this.ordertime = this.timeQuery;
				this.timeActive = -1;
			}

			// 选出默认值
			this.timeArr.some((item, index) => {
				this.selectTime = this.timeArr[index]['time']; //默认选中的时间  15:00
				this.ordertime = this.timeQuery + ' ' + this.selectTime;
				this.timeActive = index; //选中的时间索引
				return !item.disable;
			});
		},
		selectDateEvent(index, item) {
			this.dateActive = index;
			this.timeArr = [];
			this.timeQuery = item.date;
			this.selectDate = `${this.dateArr[index]['date']}`;
			this.setOnload();
		},

		selectTimeEvent(index, item) {
			if (item.disable) return;
			this.timeActive = index;
			this.selectTime = this.timeArr[index]['time'];
			this.ordertime = this.timeQuery + ' ' + item.time;
		},
		getTime() {
			let time = `${this.dateArr[this.dateActive]['date']}` + ' ' + this.selectTime; //默认选中的日期
			this.$emit('change', time);
		}
	}
};
</script>
<style lang="scss" scoped>
@import './pretty-timespicker.scss';

page {
	height: 100%;
}
.content {
	text-align: center;
	height: 100%;
}
/* 两个按钮 */
.bottom {
	display: flex;
	flex-direction: row;
	top: auto;
	left: 0px;
	width: 100%;
	background-color: #f3f3f3;
}

// .show_time {
// 	width: 70%;
// 	height: 47px;
// 	color: #505050;
// 	background-color: #f3f3f3;
// 	font-size: 15px;
// 	line-height: 47px;
// 	text-align: center;
// }

.buybtn {
	width: 90%;
	height: 38px;
	line-height: 38px;
	border-radius: 30px;
	font-size: 14px;
	color: white;
	background-color: #fa6008;
	text-align: center;
	margin: 0 auto 20px;
}
.class {
	padding: 10px 0 0 15px;
	text-align: left;
	font-weight: bold;
	font-size: 15px;
}
.title {
	font-size: 15px;
	font-weight: bold;
	padding: 15px;
}
.popup-content {
	.name {
		margin: 0 auto;
		width: 80%;
		border: 1px solid #f6f6f6;
		border-radius: 2px;
		text-align: left;
		padding: 3px 8px;
	}
	.phone {
		margin: 20px auto;
		width: 80%;
		border: 1px solid #f6f6f6;
		border-radius: 3px;
		text-align: left;
		padding: 3px 8px;
	}
	.now {
		width: 80%;
		height: 35px;
		line-height: 35px;
		border-radius: 30px;
		color: white;
		background-color: #fa6008;
		text-align: center;
		margin: 0 auto 20px;
	}
}
</style>
