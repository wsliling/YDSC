<template>
	<view class="comment">
		<view class="newsInfo" v-html="Content"></view>
	</view>
</template>
  
<script>
	import {post,get} from '@/common/util.js';
	export default {
		data() {
			return {
				userId: "",
				token: "",
				Content:""
			}
		},
		onLoad: function(e) {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.getinfo()
		},
		onShow(){
		},
		methods: {
			async getinfo(){
				let res=await get('system/GetUserNotice',{})
				if(res.code==0){
					this.Content=res.data.Content.replace(/(\r\n|\n|\r)/gm, "<br />")
				}
			},
		}
	}
</script>
<style scoped>
.comment{
	padding-top: 20upx;
}
.newsInfo{ padding: 30upx; background: #fff;}
</style>