<template>
	<div>
		<div class="jus-b ali-c time-box" v-if="activeIndex == 0">
			<div class="time ali-c jus-c" @tap="choseTime">
				<span>{{ setUpDate }}</span>
				<text class="icon_sj sj-down ml5"></text>
			</div>
		</div>
		<view v-if="hasData && activeIndex == 0">
			<view class="list bp-box flex-between" v-for="(item, index) in datalist" :key="index">
				<view class="flex-start flex1">
					<image :src="item.Avatar || 'http://yd.wtanvxin.com/static/default.png'" class="ava"></image>
					<view class="mr2">
						<view>{{ item.NickName }} {{ item.Title }}</view>
						<view class="fz12 c_999">{{ item.AddTime }}</view>
					</view>
				</view>
				<view class="c_theme">{{ item.Change }}</view>
			</view>
		</view>
		<noData :isShow="noDataIsShow"></noData>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
		<!--时间组件-->
		<pickerTime @success="success" :show.sync="showDate"></pickerTime>
	</div>
</template>

<script>
import { post } from '@/common/util.js';
import noData from '@/components/noData'; //没有数据的通用提示
import pickerTime from '@/components/pickerTime.vue';
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
export default {
	data() {
		return {
			activeIndex: 0,
			showDate: false,
			minDate: new Date().setFullYear(2019, 0, 1),
			currentDate: new Date().getTime(),
			setUpDate: '', //时间
			TypeId: 0, //0默认 1直播 2带货 3经销商
			RechargeNumber: 0, //总数
			userId: '',
			token: '',
			hasData: false,
			noDataIsShow: false, //没有数据的提示是否显示
			page: 1,
			pageSize: 12,
			isLoad: false,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			datalist: []
		};
	},
	components: {
		noData,
		pickerTime,
		uniLoadMore
	},
	onShow() {
		this.setBarTitle();
		//设置当前时间
		this.setDate();
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.queryRecord();
	},
	methods: {
		setBarTitle() {
			uni.setNavigationBarTitle({
				title: '收益明细'
			});
		},
		choseTime() {
			this.showDate = true;
		},
		success(value) {
			this.setUpDate = value;
			this.datalist = [];
			this.page = 1;
			this.queryRecord();
			console.log(value, '{{{{{{{{{{}}}}}}}}}}');
		},
		setDate() {
			let year = new Date().getFullYear();
			let month = new Date().getMonth() + 1;
			month = month < 10 ? '0' + month : month;
			this.setUpDate = year + '-' + month;
		},

		queryRecord() {
			let Object = null;
			if (this.TypeId == 0) {
				Object = {
					UserId: this.userId,
					Token: this.token,
					Page: this.page,
					PageSize: this.pageSize,
					Type: this.TypeId,
					Date: this.setUpDate
				};
			}
			post('Recharge/IncomeDetails', Object).then(res => {
				if (res.code == 0) {
					this.RechargeNumber = res.data.AmountMon_hz;
					let _this = this;
					let len = res.data.list.length;
					if (len > 0) {
						this.hasData = true;
						this.noDataIsShow = false;
					}
					if (len == 0 && this.page == 1) {
						this.noDataIsShow = true;
						this.hasData = false;
					}
					if (this.page === 1) {
						this.datalist = res.data.list;
					}
					if (this.page > 1) {
						this.datalist = this.datalist.concat(res.data.list);
					}
					if (len < this.pageSize) {
						this.isLoad = false;
						this.loadingType = 2;
					} else {
						this.isLoad = true;
						this.loadingType = 0;
					}
				}
			});
		}
	},
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.isOved = false;
			this.page++;
			this.queryRecord();
		} else {
			this.loadingType = 2;
			if (this.page > 1) {
				this.isOved = true;
			} else {
				this.isOved = false;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/common/lz.css';

.list {
	height: 120rpx;
	border-bottom: 1rpx solid #ededed;

	div {
		span {
			font-size: 28rpx;
			color: #333;
			margin-right: 20rpx;
		}

		p {
			/* margin-top: 15rpx; */
			font-size: 20rpx !important;
			color: #999 !important;
		}
	}

	p {
		font-size: 28rpx;
	}
}

.time-box {
	height: 88rpx;
	font-size: 24rpx;
	color: #333;
	padding: 0 30rpx;

	.time {
		width: 170rpx;
		height: 44rpx;
		background-color: #ffffff;
		border-radius: 22rpx;

		img {
			width: 16rpx;
			height: 10rpx;
			margin-left: 10rpx;
		}
	}
}

.order_title {
	padding: 10rpx 0;
}

.active {
	color: #ff3333;
}

.order_title p {
	position: relative;
	width: 50%;
	text-align: center;
	padding: 10rpx;
}

.order_title p.active::after {
	position: absolute;
	content: '';
	height: 2px;
	width: 80rpx;
	background: #ff3333;
	left: 50%;
	transform: translateX(-50%);
	bottom: 0;
}

.ava {
	width: 80rpx;
	height: 80rpx;
	border-radius: 100%;
	margin-right: 10rpx;
}

.comeList {
	background-color: #fff;
	padding: 0 30rpx;
	margin-top: 20rpx;

	.item {
		height: 200rpx;
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid #ececec;

		image {
			width: 160rpx;
			height: 160rpx;
			border-radius: 10rpx;
		}

		&:last-of-type {
			border: none;
		}
	}

	.product {
		margin-left: 20rpx;

		.name {
			font-size: 32rpx;
		}

		.num {
			font-size: 28rpx;

			text {
				margin-left: 20rpx;
			}
		}

		.time {
			font-size: 24rpx;
			color: #999;
		}
	}

	.money {
		color: #ff3333;
		margin-left: auto;
	}
}
</style>
