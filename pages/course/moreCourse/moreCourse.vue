<template>
	<view class="moreCourse">
		<view class="tab">
			<aloys-tab :tabs="tabs">
				<view slot="content0" class="xxx">
					<view class="tab1" v-for="(item, index) in classlist" :key="index">
						<view class="con"><image :src="item.PicImg"></image></view>
					</view>
					<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
					<noData :isShow="noDataIsShow"></noData>
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
import aloysTab from '@/components/aloys-tab2/aloys-tab2.vue';
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
			pageSize: 8,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			Ctype: 0,
			IsLike: 0,
			IsRec: 0,
			classlist: [],
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
		this.getClassList();
	},
	methods: {
		async getClassList() {
			let result = await post('Course/GetCourseOutlineList', {
				page: this.page,
				pageSize: this.pageSize,
				IsRec: 1
			});
			if (result.code == 0) {
				// console.log(result.data);
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
				this.classlist = result.data;
				console.log(this.classlist);
			}
			if (this.page > 1) {
				this.classlist = this.classlist.concat(result.data);
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
