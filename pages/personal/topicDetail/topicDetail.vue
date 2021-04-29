<template>
	<view>
		<view class="topic-Banner">
			<image class="img" :src="topicdetail.CoverLogo"></image>
			<view class="coverbox">
				<view class="fz18">{{ topicdetail.Title }}</view>
				<view class="fz12">
					<text>{{ topicdetail.PartNum }}人参与</text>
					<text>{{ topicdetail.CommentNum }}人讨论</text>
				</view>
			</view>
		</view>
		<view class="topic-info uni-bg-white uni-mb10 pp2">
			<view class="t_hd flex-start">
				<image class="iconimg" src="/static/discover/intro.png" mode="aspectFill"></image>
				<text class="title">话题简介</text>
			</view>
			<view class="desc">{{ topicdetail.TopicIntro }}</view>
		</view>
		<view class="topic-star uni-bg-white uni-mb10 pp2">
			<view class="t_hd flex-start">
				<image class="iconimg" src="/static/discover/star.png" mode="aspectFill"></image>
				<text class="title">话题之星</text>
			</view>
			<view class="topname flex-between">
				<view class="item flex-center" v-for="(item, index) in topicdetail.UserList" :key="index">
					<image class="icon" :src="'/static/discover/top' + (index + 1) + '.png'" mode="aspectFill"></image>
					<image class="tx" :src="item.Avatar || '/static/default.png'"></image>
					<text class="name uni-ellipsis">{{ item.UserNick }}</text>
				</view>
			</view>
		</view>
		<view class="list" v-if="hasData">
			<block v-for="(item, index) in datalist" :key="index">
				<mediaListTopic :datajson="item" Grid="3" @click="goDetail"></mediaListTopic></block>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
		<noData :isShow="noDataIsShow"></noData>
	</view>
</template>

<script>
import { post, get, toLogin, dateUtils } from '@/common/util.js';
import noData from '@/components/noData.vue'; //暂无数据
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
export default {
	components: {
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
			datalist: [],
			topicdetail: {},
			Id: 0
		};
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
	},
	onLoad(e) {
		this.Id = e.topicId;
		this.getTopicDetail();
		this.FindList();
	},
	methods: {
		//跳转
		tolink(Url, islogin) {
			if (islogin == 'login') {
				if (toLogin()) {
					uni.navigateTo({
						url: Url
					});
				}
			} else {
				uni.navigateTo({
					url: Url
				});
			}
		},
		/*获取话题详情*/
		async getTopicDetail() {
			let result = await post('Topic/GetTopicInfo', {
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token'),
				Id: this.Id
			});
			if (result.code === 0) {
				this.topicdetail = result.data;
			}
		},
		/*获取动态列表*/
		async FindList() {
			let result = await post('Topic/TopicDynamicList', {
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token'),
				Page: this.page,
				PageSize: this.pageSize,
				TopicId: this.Id
			});
			if (result.code === 0) {
				let _this = this;
				if (result.data.length > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
					result.data.forEach(function(item) {
						item.Addtime = dateUtils.format(item.Addtime);
					});
				}
				if (result.data.length == 0 && this.page == 1) {
					this.noDataIsShow = true;
					this.hasData = false;
				}
				if (this.page === 1) {
					this.datalist = result.data;
				}
				if (this.page > 1) {
					this.datalist = this.datalist.concat(result.data);
				}
				if (result.data.length < this.pageSize) {
					this.isLoad = false;
					this.loadingType = 2;
				} else {
					this.isLoad = true;
					this.loadingType = 0;
				}
			}
		},
		//链接动态详情页
		goDetail(e) {
			uni.navigateTo({
				url: '/pages/personal/replylistTopic/replylist?id=' + e.id
			});
		}
	},
	// 上拉加载
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.page++;
			this.FindList();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style scoped lang="scss">
@import './style';
</style>
