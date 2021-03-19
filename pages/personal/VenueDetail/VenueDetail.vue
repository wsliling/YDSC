<template>
	<view>
		<view class="itembox pp3">
			<view class="userbox flex-between">
				<view class="author"><image src="/static/default.png" mode="aspectFill"></image></view>
				<view class="name flex1">动体能健身工作室</view>
			</view>
		</view>
		<view class="itembox line-list">
			<view class="line-item">
				<text class="iconfont icon-dizhi mr2"></text>
				<view class="flex1">深圳展滔科技大厦c座716</view>
			</view>
			<view class="line-item">
				<text class="uni-icon uni-icon-phone mr2"></text>
				<view class="flex1">0755-256-5963</view>
			</view>
			<view class="line-item">
				<text class="iconfont icon-shijian mr2"></text>
				<view class="flex1">09:00-22:00</view>
			</view>
		</view>
		<view class="itembox pd15">
			<view class="Yi-hd">
				<view class="title">机构简介</view>
			</view>
			<view class="desc fz14 c_666" style="padding-bottom: 20upx;">
				春日正好，正是备战训练的好时刻你有开始制定跑步计划了吗
			</view>
		</view>
		<view class="itembox" style="padding: 0 0 30upx 30upx;">
			<view class="Yi-hd">
				<view class="title">场馆展示</view>
			</view>
			<view class="bd">
				<scroll-view class="image-list" scroll-x="true">
					<view class="img" v-for="(i,e) in 8" :key="e">
						<image src="/static/of/s1.png" mode="aspectFill"></image>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="itembox pd15">
			<view class="Yi-hd">
				<view class="title">设备</view>
			</view>
			<view class="bd shebei-list">
				<view class="item flex-between" v-for="(item,index) in 2" :key="index">
					<view class="img">
						<image src="/static/health/change/jian_5.png" mode="aspectFill"></image>
					</view>
					<view class="item_r flex-between flex1">
						<view class="name uni-ellipsis flex1">训练服</view>
						<view class="btn">租赁</view>
					</view>
				</view>
			</view>
		</view>
		<view class="itembox pd15">
			<view class="Yi-hd">
				<view class="title">课程</view>
			</view>
			<view class="bd course-list">
				<view class="item flex-between" v-for="(item,index) in 3" :key="index">
					<view class="img">
						<image src="/static/of/s3.png" mode="aspectFill"></image>
					</view>
					<view class="item_r flex1">
						<view class="title uni-ellipsis">帕梅拉10分钟全身燃脂新体验</view>
						<view class="desc">K2 初学 . 10分钟</view>
						<view class="flex-start uni-mt10">
							<image class="tx" src="/static/default.png" mode="aspectFill"></image>
							<text class="author">可乐加冰</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	export default {
		data() {
			return {
				userId: "",
				token: "",
			}
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
		},
		onLoad() {
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
@import './style';
</style>
