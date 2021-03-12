<template>
	<view>
		<uni-nav-bar fixed="true" color="#333333" background-color="#ffffff"  :border="false">
			<block slot="center" class="flex1 color_fff">
				<view class="input-view">
					<uni-icons class="input-uni-icon" type="search" size="22" color="#b8b8b8" />
					<input confirm-type="search" v-model="searchText" @confirm="inputBlur" @blur="inputBlur" class="nav-bar-input" type="text" placeholder="请输入你要搜索的商品">
				</view>
			</block>
		</uni-nav-bar>
		<view class="classify">
			<view class="classify-left">
				<view v-for="(item,index) in TypeList" :key="index" @click="selType(item.Id,index)" :class="selIndex==index?' active':''">{{item.Name}}</view>
			</view>
			<view class="classify-right">
				<view class="classify-goods" v-for="(item,index) in goodList" :key="index">
					<image :src="item.PicNo"></image>
					<view class="goods">
						<view class="title">{{item.Name}}</view>
						<view class="price">
							<view>￥{{item.Price}}</view>
							<view class="btnBox">
								<button @click="addGoods(item.Id)">添加</button>
								<button @click="delGoods(item.Id)" v-if="goodsIdArr.indexOf(item.Id)!=-1">删除</button> 
							</view>
						</view>
					</view>
				</view>
				<noData :isShow="noDataIsShow"></noData>
				<!-- <view class="uni-tab-bar-loading" v-if="hasData">
					<uni-load-more :loadingType="loadingType" v-if="noDataIsShow == false"></uni-load-more>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	import UniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	import {post} from '@/common/util.js'
	// import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import noData from '@/components/noData.vue'; //暂无数据
	export default {
		data() {
			return {
				searchText:'',
				TypeList:'',
				selIndex:0,
				Id:0,
				Page:1,
				goodList:[],
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				goodsIdArr:[],
				showDelBtn:false
			}
		},
		components:{
			UniNavBar,
			// uniLoadMore,
			noData
		},
		onLoad(){
			this.getTypeList()
		},
		methods: {
			async getTypeList(){
				let res = await post('Goods/TypeList',{
					Type:0
				})
				if(res.code==0){
					this.TypeList=res.data
					this.Id=this.TypeList[0].Id
					this.getGoodsList()
				}
			},
			async getGoodsList(){
				let res = await post('Goods/GoodsList',{
					Page:this.Page,
					// PageSize:this.PageSize,
					TypeId:this.Id,
				})
				if (res.count > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
				}
				if (res.count == 0 && this.Page == 1) {
					this.noDataIsShow = true;
					this.hasData = false;
				}
				if (this.Page === 1) {
					this.goodList = res.data;
				}
				// if (this.Page > 1) {
				// 	this.goodList = this.goodList.concat(
				// 		res.data
				// 	);
				// }
				// if (res.count <this.PageSize) {
				// 	this.isLoad = false;
				// 	this.loadingType = 2;
				// } else {
				// 	this.isLoad = true;
				// 	this.loadingType = 0
				// }
				
				
			},
			selType(id,index){
				this.selIndex=index
				this.Id=id
				this.goodList=[]
				this.getGoodsList()
			},
			// 添加关联商品
			addGoods(id){
				this.goodsIdArr.push(id)
				uni.setStorageSync('goodsId',this.goodsIdArr)
				uni.navigateBack({})
			},
			// // 删除关联商品
			// delGoods(id){
			// 	let index=this.goodsIdArr.indexOf(id)
			// 	this.goodsIdArr.splice(index,1)
			// 	console.log(this.goodsIdArr)
			// },
			// 搜索
			async inputBlur(){
				if(this.searchText!=''){
					let res = await post('Goods/GoodsList',{
						Page:this.Page,
						Keywords:this.searchText,
					})
					if (res.code === 0) {
						this.goodList = res.data;
					}
				}else{
					this.goodList=[]
					this.selType( this.Id,this.selIndex)
				}
				
			},
			
		},
		// // 上拉加载
		// onReachBottom: function() {
		// 	if (this.isLoad) {
		// 		this.loadingType = 1;
		// 		this.Page++;
		// 		this.getGoodsList();
		// 	} else {
		// 		this.loadingType = 2;
		// 	}
		// }
	}
</script>

<style scoped lang="scss">

.uni-navbar__header-container{
	width: 100%;
	.input-view{
		width: 100%;
		background-color: #f1f2f6;
	}
}
.classify{
	display: flex;
	align-items: center;
	margin-top: 20rpx;
	justify-content: space-between;
	.classify-left{
		width: 180rpx;
		height: 92vh;
		overflow-y: auto;
		background-color: #fff;
		view{
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			position: relative;
			&:after{
				content: '';
				width: 10rpx;
				height: 40rpx;
				position: absolute;
				left: 0;
				top: 30%;
				background-color: #ffffff;
				transform: translate(-50%);
			}
		}
		.active{
			background-color: #f6f6f6;
			color: #FF3333;
			&:after{
				background-color: #FF3333;
			}
		}
	}
	.classify-right{
		width: 530rpx;
		height: 92vh;
		margin-right: 20rpx;
		background-color: #fff;
		border-radius: 30rpx ;
		padding: 20rpx;
		// display: flex;
		overflow-y: auto;
		// flex-wrap: wrap;
		.classify-goods{
			height: 180rpx;
			width: 100%;
			display: flex;
			align-items: center;
			margin: 20rpx 0;
			image{
				width: 180rpx;
				height: 180rpx;
				margin-right: 20rpx;
			}
			.goods{
				flex: 1;
				.title{
					height: 100rpx;
					font-size: 28rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.price{
					font-size: 36rpx;
					color: #FF3333;
					font-weight: 600;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
				.btnBox{
					display: flex;
				}
				button{
					color: #FF3333;
					border: 1rpx solid #FF3333;
					border-radius: 30rpx;
					width: 86rpx;
					height: 44rpx;
					font-size: 24rpx;
					background-color: #fff;
					padding: 0;
					line-height: 44rpx;
					margin-left: 10rpx;
				}
			}
		}
	}
}
.emptybox,.uni-tab-bar-loading{
	margin: 0 auto;
}
uni-input{
	margin-left: 10rpx;
}

</style>
