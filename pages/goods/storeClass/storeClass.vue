<template>
	<view class="storePage">
		<store-top v-if="hasinfo" :storeinfo="storeinfo" :navcolor="navcolor" :navbg="navbg"></store-top>
		<!-- 分类 -->
		<view class="classifybox pd15" v-if="hasData">
			<block v-for="(item,index) in typeList" :key="index">
			<view class="item uni-bg-white b_radius uni-mb10">
				<view class="Yi-hd flex-between" @click="tolink('/pages/goods/ProductList/storeSearch?shopid='+ShopId+'&cid='+item.Id)">
					<view class="title">
						<text>{{item.ClassName}}</text>
					</view>
					<view class="more"><text class="arrow uni-icon uni-icon-arrowright"></text></view>
				</view>
				<view class="btns flex flexWrap">
					<view class="btn" v-for="(item2,index2) in item.data" :key="index2">
						<text @click="tolink('/pages/goods/ProductList/storeSearch?shopid='+ShopId+'&cid='+item2.Id)">{{item2.ClassName}}</text>
					</view>
				</view>
			</view>
			</block>
		</view>
		<view style="height: 100upx;"></view>
		<tabbar :current="2"></tabbar>	
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	import tabbar from '@/components/tabbar.vue';
	import storeTop from '@/components/storeTop.vue';
	export default {
		components: {
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
				typeList:[],
				classlylist:[],//分类
				hasData:false
			}
		},
		onLoad(e) {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.ShopId=e.id;
			this.getShopInfo();
			this.GetProductClass();
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
					this.bannerlist=result.data.PicData;
					this.hasinfo=true;
				}
			},
			//分类
			async GetProductClass(){
				let _this=this;
				let res = await post("Goods/GetProductClass", {
					ShopId:this.ShopId
				});
				if(res.code==0&&res.data.length){
					_this.typeList=res.data
				}
				let result = await post("Goods/GetProductClass", {
					ShopId:this.ShopId,
					ParentId:-1
				});
				if(result.code==0){
					if(result.data.length){
						let data = result.data;
						_this.typeList.forEach(function(e){
							let arr=[]
							data.forEach(function(item){
								if(e.Id==item.FatherId){
									arr.push(item)
								}
							})
							_this.$set(e,'data',arr)
							_this.hasData=true;
						})
					}
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
	.classifybox{
		position: relative;
		z-index: 4;
		margin-top: -220upx;
		.item{
			padding: 0 20upx 20upx;
			.Yi-hd .title{
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
			.btns{
				margin-right: -20upx;
			}
			.btn{
				width: 50%;
				padding-right: 20upx;
				margin-bottom: 20upx;
				text{
					display: block;
					background: #f2f2f2;
					border-radius: 12upx;
					height: 76upx;
					line-height: 76upx;
					padding: 0 20upx;
				}
			}
		}
	}
</style>
