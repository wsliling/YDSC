<template>
	<view class="storePage">
		<store-top v-if="hasinfo" :storeinfo="storeinfo" :navcolor="navcolor" :navbg="navbg"></store-top>
		<!-- 信息 -->
		<view class="infobox pd15">
			<view class="item uni-bg-white b_radius uni-mb10">
				<view class="Yi-hd flex-between">
					<view class="title">
						<text>联系电话</text>
					</view>
				</view>
				<view class="bd">
					{{storeinfo.Phone}}
				</view>
			</view>
			<view class="item uni-bg-white b_radius uni-mb10">
				<view class="Yi-hd flex-between">
					<view class="title">
						<text>服务时间</text>
					</view>
				</view>
				<view class="bd">
					{{storeinfo.BusinessHours}}
				</view>
			</view>
			<view class="item uni-bg-white b_radius uni-mb10">
				<view class="Yi-hd flex-between">
					<view class="title">
						<text>店铺简介</text>
					</view>
				</view>
				<view class="bd">
					<view class="detailhtml" v-if="storeinfo.Description">
						<uParse :content="storeinfo.Description" />
					</view>
				</view>
			</view>
			<view class="item uni-bg-white b_radius uni-mb10">
				<view class="Yi-hd flex-between">
					<view class="title">
						<text>法人代表</text>
					</view>
				</view>
				<view class="bd">
					{{storeinfo.LegalPerson}}
				</view>
			</view>
			<view class="item uni-bg-white b_radius uni-mb10">
				<view class="Yi-hd flex-between">
					<view class="title">
						<text>开店时间</text>
					</view>
				</view>
				<view class="bd">
					{{storeinfo.OpenTime}}
				</view>
			</view>
			<view class="item uni-bg-white b_radius uni-mb10">
				<view class="Yi-hd flex-between">
					<view class="title">
						<text>所在地区</text>
					</view>
				</view>
				<view class="bd">
					{{storeinfo.Address}}
				</view>
			</view>
		</view>
		<view style="height: 100upx;"></view>
		<tabbar :current="3"></tabbar>	
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	import uParse from '@/components/uParse/src/wxParse.vue';
	import tabbar from '@/components/tabbar.vue';
	import storeTop from '@/components/storeTop.vue';
	export default {
		components: {
			uParse,
			tabbar,
			storeTop
		},
		data() {
			return {
				userId: "",
				token: "",
				navcolor:"#fff",
				navbg:"transparent",
				ShopId:"",
				hasinfo:false,
				storeinfo:{},
			}
		},
		onLoad(e) {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.ShopId=e.id;
			this.getShopInfo();
		},
		methods: {
			//跳转
			tolink(Url){
				uni.navigateTo({
					url: Url
				})
			},
			async getShopInfo(){
				let result = await post("Shop/ReadShop", {
					UserId: this.userId,
					Token: this.token,
					ShopId:this.ShopId
				});
				if(result.code==0){
					this.storeinfo=result.data;
					this.hasinfo=true;
				}
			},
		},
		onPageScroll(e){
			if(e.scrollTop>44){
				this.navcolor="#333";
				this.navbg="#fff"
			}else{
				this.navcolor="#fff";
				this.navbg="transparent"
			}
		},
	}
</script>

<style lang="scss">
	.infobox{
		position: relative;
		z-index: 4;
		margin-top: -220upx;
		.item{
			padding: 0 20upx 20upx;
			.Yi-hd{
				border-bottom: 1px solid #f5f5f5;
				margin-bottom: 20upx;
				.title{
					font-size: 30upx;
					font-weight: normal;
					display: flex;
					align-items: center;
					&::before{
						content: "";
						display: block;
						height: 28upx;
						width: 6upx;
						background: $primary;
						margin-right: 12upx;
					}
				}
			}
		}
	}
</style>
