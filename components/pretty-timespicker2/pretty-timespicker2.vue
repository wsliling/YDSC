<template>
	<view class="content">
		<view class="container">
			<!-- 日期列表 -->
			<view class="class">排课时间</view>
			<scroll-view class="scroll-view_H b-t b-b" scroll-x>
				<block v-for="(item, index) in dateArr" :key="index">
					<div class="flex-box" @click="selectDateEvent(index, item)">
						<view class="date-box">
							<text class="date" :class="{ active: index == dateActive }" :style="{ color: index == dateActive ? selectedTabColor : '#333' }">
								{{ item.DateDay }}
							</text>
							<text>{{ item.DayWeek }}</text>
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
								:class="{ disable: item.IsFull == 1, active: _index == timeActive }"
								:style="{ color: _index == timeActive ? selectedItemColor : '#333' }"
								@click="selectTimeEvent(_index, item)"
							>
								<text>{{ item.TimeSpan }}</text>
								<text class="all"></text>
								<view class="full" v-show="item.IsFull == 1"><image src="/static/course/course5_8.png"></image></view>
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>
		<view class="bottom" @click="pop">
			<button form-type="submit" type="default" size="mini" class="buybtn">预约</button>
			<uni-popup ref="popup" type="center">
				<view class="popup-content">
					<view class="closebtn uni-icon uni-icon-close" @click="hidePopup"></view>
					<view class="title">预约信息</view>
					<view class="name"><input type="text" v-model="name" placeholder="姓名" /></view>
					<view class="phone"><input type="text" v-model="tel" placeholder="手机号码" /></view>
					<view class="now" @click="now">立即预约</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
import { post, valPhone } from '@/common/util.js';
export default {
	components: {},
	model: {
		prop: 'showPop',
		event: 'change'
	},
	props: {
		reserveId: {
			type: String,
			default: ''
		},
		jsonData: {
			type: Array,
			default() {
				return [];
			}
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
		}
	},
	data() {
		return {
			dateArr: [], //日期数据
			timeArr: [], //时间数据
			dateActive: 0, //选中的日期索引
			timeActive: 0, //选中的时间索引
			selectDate: '', //选择的日期
			selectTime: '', //选择的时间
			selectDateId: 0,
			selectTimeId: 0,
			name: '',
			tel: ''
		};
	},
	created(props) {
		this.dateArr = this.jsonData;
		this.timeArr = this.dateArr[0].TimeList;
		this.selectDate = this.dateArr[0]; //默认选中的日期
		this.selectTime = this.timeArr[0].TimeSpan; //默认选中的时间
		this.selectDateId = this.dateArr[0].Id;
		this.selectTimeId = this.timeArr[0].Id;
	},
	onShow() {},
	methods: {
		pop() {
			this.$refs.popup.open(); // 显示弹窗
		},
		hidePopup() {
			this.$refs.popup.close(); // 关闭弹窗
		},
		// 立即预约
		now() {
			if (this.valOther()) {
				this.getNow();
			}
		},
		valOther() {
			if (this.name == '') {
				uni.showToast({
					title: '请输入姓名!',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (!valPhone(this.tel)) {
				return false;
			}
			return true;
		},
		// 预约
		async getNow() {
			let result = await post('Course/CourseOfflineReg', {
				Id: this.reserveId,
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token'),
				DateId: this.selectDateId,
				HourId: this.selectTimeId,
				FullName: this.name,
				Mobile: this.tel
			});
			if (result.code == 0) {
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/course/nowOrderClass/nowOrderClass?fullDate=' + this.selectDate.FullDate + '&dayWeek=' + this.selectDate.DayWeek + '&timeSpan=' + this.selectTime
					});
				}, 2000);
			}
			// if(result.data.DayWeek)
		},
		selectDateEvent(index, item) {
			this.dateActive = index;
			this.timeArr = item.TimeList;
			this.selectDate = this.dateArr[index];
			this.selectDateId = item.Id;
			// 选出默认值
			this.timeArr.some((item, index) => {
				this.selectTime = this.timeArr[index].TimeSpan; //默认选中的时间  15:00
				this.timeActive = index; //选中的时间索引
				return !item.disable;
			});
		},
		selectTimeEvent(index, item) {
			if (item.IsFull == 1) return;
			this.timeActive = index;
			this.selectTime = this.timeArr[index].TimeSpan;
			this.selectTimeId = item.Id;
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
.buybtn {
	width: 90%;
	height: 80upx;
	line-height: 80upx;
	border-radius: 70upx;
	font-size: 28upx;
	color: white;
	background-color: #fa6008;
	text-align: center;
	margin: 0 auto 40upx;
}
.class {
	padding: 20upx 0 0 30upx;
	text-align: left;
	font-weight: bold;
	font-size: 30upx;
}
.title {
	font-size: 30upx;
	font-weight: bold;
	padding: 30upx;
}
.popup-content {
	background-color: white;
	width: 600upx;
	height: 480upx;
	.name {
		margin: 0 auto;
		width: 80%;
		border: 1px solid #f6f6f6;
		border-radius: 4upx;
		text-align: left;
		padding: 8upx 18upx;
	}
	.phone {
		margin: 40upx auto;
		width: 80%;
		border: 1px solid #f6f6f6;
		border-radius: 6upx;
		text-align: left;
		padding: 8upx 18upx;
	}
	.now {
		width: 80%;
		height: 80upx;
		line-height: 80upx;
		border-radius: 70upx;
		color: white;
		background-color: #fa6008;
		text-align: center;
		margin: 0 auto 40upx;
	}
}
</style>
