<template>
	<view>
		<view class="topic-list uni-bg-white uni-mt10">
			<block v-for="(item,index) in 5" :key="index">
			<view class="topic-item" @click="tolink('/pages/personal/topicDetail/topicDetail')">
				<view class="hd flex-between">
					<view class="flex-start flex1">
						<image class="iconimg" src="/static/discover/topic.png" mode="aspectFill"></image>
						<text class="title uni-ellipsis">2021我的运动计划</text>
					</view>
					<view class="flex-end">
						<text class="fz12 c_999">3.8万人参与</text>
						<text class="uni-icon uni-icon-arrowright fz14"></text>
					</view>
				</view>
				<view class="bd flex-between">
					<view class="bd_left flex1">
						<view class="desc uni-ellipsis2">
							春日阳光正好，正式备战训练的好时刻，你又开始
						</view>
						<view class="ft_info flex-start">
							<view class="info-text">
								<text class="iconfont icon-yanjing"></text>54321
							</view>
							<view class="info-text">
								<text class="iconfont icon-pinglun2"></text>543
							</view>
						</view>
					</view>
					<view class="img">
						<image src="/static/of/s1.png" mode="aspectFill"></image>
					</view>
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
			</block>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<noData :isShow="noDataIsShow"></noData>
		<view @click="tolink('/pages/personal/artPost/topicPost','login')" class="uploadbtn flex-column"><text class="uni-icon uni-icon-plusempty"></text></view>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
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
		}
	}
</script>

<style scoped lang="scss">
@import './style';
</style>
