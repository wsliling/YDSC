<template>
	<view>
		<view class="topic-Banner">
			<image class="img" src="/static/of/topic.jpg" mode="aspectFill"></image>
			<view class="coverbox">
				<view class="fz18">2021我的运动计划</view>
				<view class="fz12"><text>3万人参与</text><text>12万人讨论</text></view>
			</view>
		</view>
		<view class="topic-info uni-bg-white uni-mb10 pp2">
			<view class="t_hd flex-start">
				<image class="iconimg" src="/static/discover/intro.png" mode="aspectFill"></image>
				<text class="title">话题简介</text>
			</view>
			<view class="desc">
				春日阳光正好，正式备战训练的好时刻，你又开始制定跑步计划了吗
			</view>
		</view>
		<view class="topic-star uni-bg-white uni-mb10 pp2">
			<view class="t_hd flex-start">
				<image class="iconimg" src="/static/discover/star.png" mode="aspectFill"></image>
				<text class="title">话题之星</text>
			</view>
			<view class="topname flex-between">
				<view class="item flex-center">
					<image class="icon" src="/static/discover/top1.png" mode="aspectFill"></image>
					<image class="tx" src="/static/default.png" mode="aspectFill"></image>
					<text class="name uni-ellipsis">可口可乐</text>
				</view>
				<view class="item flex-center">
					<image class="icon" src="/static/discover/top2.png" mode="aspectFill"></image>
					<image class="tx" src="/static/default.png" mode="aspectFill"></image>
					<text class="name uni-ellipsis">可口可乐可口可乐</text>
				</view>
				<view class="item flex-center">
					<image class="icon" src="/static/discover/top3.png" mode="aspectFill"></image>
					<image class="tx" src="/static/default.png" mode="aspectFill"></image>
					<text class="name uni-ellipsis">力量</text>
				</view>
			</view>
		</view>
		<view class="list" v-if="hasData">
			<block v-for="(item,index) in datalist" :key="index">
				<mediaList :datajson="item" Grid="3" @click="goDetail"></mediaList>
			</block>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<noData :isShow="noDataIsShow"></noData>
	</view>
</template>

<script>
	import {post,get,toLogin,dateUtils} from '@/common/util.js';
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	export default {
		components: {
			noData,
			uniLoadMore
		},
		data() {
			return {
				userId: "",
				token: "",
				datalist: [],
				page: 1,
				pageSize: 8,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
			}
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		onLoad() {
			this.FindList();
		},
		methods: {
			//跳转
			tolink(Url,islogin) {
				if(islogin=="login"){
					if(toLogin()){
						uni.navigateTo({
							url: Url
						})
					}
				}else{
					uni.navigateTo({
						url: Url
					})
				}
			},
			/*获取动态列表*/
			async FindList() {
				let result = await post("Find/FindList", {
					"UserId": uni.getStorageSync("userId"),
					"Token": uni.getStorageSync("token"),
					"Page": this.page,
					"PageSize":this.pageSize,
					"myType": 2,
				});
				if (result.code === 0) {
					let _this=this;
					if (result.data.length > 0) {
						this.hasData = true;
						this.noDataIsShow = false;
						result.data.forEach(function(item) {
							item.Addtime=dateUtils.format(item.Addtime);
						})
					}
					if (result.data.length == 0 && this.page == 1) {
						this.noDataIsShow = true;
						this.hasData = false;
					}
					if (this.page === 1) {
						this.datalist = result.data;
					}
					if (this.page > 1) {
						this.datalist = this.datalist.concat(
							result.data
						);
					}
					if (result.data.length <this.pageSize) {
						this.isLoad = false;
						this.loadingType = 2;
					} else {
						this.isLoad = true;
						this.loadingType = 0
					}
				}
			},
			//链接动态详情页
			goDetail(e) {
				uni.navigateTo({
					url:'/pages/personal/replylist/replylist?id='+e.id
				})
			},
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
	}
</script>

<style scoped lang="scss">
@import './style';
</style>
