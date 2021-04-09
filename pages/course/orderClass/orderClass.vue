<template>
	<view class="orderClass">
		<view class="tab">
			<aloys-tab :tabs="tabs">
				<view slot="content0" class="xxx" v-for="(item, index) in orderclass" :key="index">
					<view class="con">
						<view class="con_1">
							<!-- <image src="/statidc/course/course6_1.png" @click="classDetails"></image> -->
							<image :src="item.PicImg" @click="classDetails"></image>
							</view>
						<view class="con_2">
							<view class="title">{{ item.Title }}</view>
							<view class="title_1">极速燃脂 低强度 {{ item.CourseDuration }}分钟</view>
							<view class="title_2">
								<view class="title2_1">
									<image src="/static/course/course6_7.png" mode=""></image>
									<text>{{ item.CoachNick }}</text>
								</view>
								<view class="title2_2" @click="orderClassDetails">立即预约</view>
							</view>
						</view>
					</view>
					<!-- 		<view class="con">
						<view class="con_1"><image src="/static/course/course6_2.png" mode=""></image></view>
						<view class="con_2">
							<view class="title">帕梅拉10分钟全身燃脂新...</view>
							<view class="title_1">极速燃脂 低强度 60分钟</view>
							<view class="title_2">
								<view class="title2_1">
									<image src="/static/course/course6_8.png" mode=""></image>
									<text>零碎记忆</text>
								</view>
								<view class="title2_2">立即预约</view>
							</view>
						</view>
					</view>
					<view class="con">
						<view class="con_1"><image src="/static/course/course6_3.png" mode=""></image></view>
						<view class="con_2">
							<view class="title">帕梅拉10分钟全身燃脂新...</view>
							<view class="title_1">极速燃脂 低强度 60分钟</view>
							<view class="title_2">
								<view class="title2_1">
									<image src="/static/course/course6_9.png" mode=""></image>
									<text>零碎记忆</text>
								</view>
								<view class="title2_2">立即预约</view>
							</view>
						</view>
					</view>
					<view class="con">
						<view class="con_1"><image src="/static/course/course6_4.png" mode=""></image></view>
						<view class="con_2">
							<view class="title">帕梅拉10分钟全身燃脂新...</view>
							<view class="title_1">极速燃脂 低强度 60分钟</view>
							<view class="title_2">
								<view class="title2_1">
									<image src="/static/course/course6_7.png" mode=""></image>
									<text>零碎记忆</text>
								</view>
								<view class="title2_2">立即预约</view>
							</view>
						</view>
					</view>
					<view class="con">
						<view class="con_1"><image src="/static/course/course6_5.png" mode=""></image></view>
						<view class="con_2">
							<view class="title">帕梅拉10分钟全身燃脂新...</view>
							<view class="title_1">极速燃脂 低强度 60分钟</view>
							<view class="title_2">
								<view class="title2_1">
									<image src="/static/course/course6_8.png" mode=""></image>
									<text>零碎记忆</text>
								</view>
								<view class="title2_2">立即预约</view>
							</view>
						</view>
					</view>
					<view class="con">
						<view class="con_1"><image src="/static/course/course6_6.png" mode=""></image></view>
						<view class="con_2">
							<view class="title">帕梅拉10分钟全身燃脂新...</view>
							<view class="title_1">极速燃脂 低强度 60分钟</view>
							<view class="title_2">
								<view class="title2_1">
									<image src="/static/course/course6_9.png" mode=""></image>
									<text>零碎记忆</text>
								</view>
								<view class="title2_2">立即预约</view>
							</view>
						</view>
					</view> -->
				</view>
				<view slot="content1" class="xxx">B</view>
				<view slot="content2" class="xxx">C</view>
			</aloys-tab>
		</view>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
import noData from '@/components/noData.vue'; //暂无数据
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
import aloysTab from '@/components/aloys-tab3/aloys-tab.vue';
export default {
	components: {
		aloysTab,
		noData,
		uniLoadMore
	},
	data() {
		return {
			userId: '',
			token: '',
			page: 1,
			pageSize: 6,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			orderclass: [],
			tabs: [
				{
					title: '推荐'
				},
				{
					title: '减脂'
				},
				{
					title: '塑形'
				},
				{
					title: '增肌'
				},
				{
					title: '体态'
				},
				{
					title: '热身'
				}
			]
		};
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getOrderClass();
	},
	methods: {
		orderClassDetails(id) {
			uni.navigateTo({
				url: '/pages/course/orderClassDetails/orderClassDetails?orderId'+id
			});
		},
		classDetails() {
			uni.navigateTo({
				url: '/pages/course/classDetails/classDetails'
			});
		},
		async getOrderClass() {
			let result = await post('Course/GetCourseOfflineList', {
				page: this.page,
				pageSize: this.pageSize
			});
			if (result.code == 0) {
				console.log(result.data);
				if (result.data.length > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
				}
			}
			if (result.data.length == 0 && this.page == 1) {
				this.noDataIsShow = true;
				this.hasData = false;
			}
			if (this.page === 1) {
				this.orderclass = result.data;
			}
			if (this.page > 1) {
				this.orderclass = this.orderclass.concat(result.data);
			}
			if (result.data.length < this.pageSize) {
				this.isLoad = false;
				this.loadingType = 2;
			} else {
				this.isLoad = true;
				this.loadingType = 0;
			}
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
