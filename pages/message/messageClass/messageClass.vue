<template>
	<view class="content">
		<view class="uni-list" v-if="hasData">
			<block v-for="(item,index) in TypeList" :key="index">
				<view class="uni-list-cell" @click="goDetail(item)">
					<view class="uni-media-list">
						<view class="uni-media-list-logo">
							<image class="img" :src="item.TypeImg" mode="aspectFill"></image>
						</view>
						<view  class="uni-media-list-body">
							<view class="uni-media-list-text-top uni-ellipsis">{{item.MsgName}}</view>
							<view  class="uni-media-list-text-bottom uni-ellipsis uni-mt10">
								{{decodeURIComponent(item.NoticeTitle)}}
							</view>
						</view>
						<view class="uni-media-list-r">
							<view class="time">{{item.PubTime}}</view>
							<view class="uni-badge uni-badge-red" v-if="item.unCount!=0">{{item.unCount}}</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		<noData :isShow="noDataIsShow"></noData>
	</view>
</template>

<script>
	import {host,post,get,dateUtils,toLogin} from '@/common/util.js';
	import noData from '@/components/noData.vue'; //暂无数据
	export default {
		components: {
			noData
		},
		data() {
			return {
				userId: "",
				token: "",
				hasData:false,
				noDataIsShow: false,
				TypeList:[]
			};
		},
		onLoad() {
			
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.NoticeTypeList();
		},
		methods:{
			async NoticeTypeList() {
				let result = await post("News/NoticeTypeList", {
					"UserId": this.userId,
					"Token": this.token
				});
				if (result.code === 0) {
					console.log(result,"news")
					this.TypeList=result.data;
					if (result.data.length > 0){
						this.hasData = true;
						result.data.forEach(function(item){
							item.PubTime=dateUtils.format(item.PubTime);
						})
					}else{
						this.noDataIsShow = true;
					}
				} else if (result.code === 2) {
					uni.hideToast();
					toLogin()
				} else {
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
				}
			},
			goDetail(item){
				if(item.MsgType!=8){
					this.tolink('/pages/message/messageList/messageList?type='+item.MsgType+'&keyname='+item.MsgName+'&shopId='+item.ShopId)
				}else{
					this.tolink('/pages/personal/chatList/chatList?id='+item.MemberId+'&keyname='+item.MsgName)
				}
			},
			//跳转
			tolink(Url) {
				uni.navigateTo({
					url: Url
				})
			},
		}
	}
</script>

<style scoped>
	.content{padding-top: 20upx;}
	.uni-media-list-logo{ width: 100upx; height: 100upx;}
	.uni-media-list-body{ padding: 8upx 0; height: auto;}
	.uni-media-list-r{ text-align: right; height: 84upx; padding: 8upx 0;}
	.uni-media-list-r .time{ color: #999; line-height: 36upx; font-size: 24upx;}
	.uni-badge-red{ background: #fa3d34;}
	.uni-list-cell::after{left: 150upx;}
</style>
