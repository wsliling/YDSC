<template>
	<view>
		<view class="tab flex" v-if="type!=1">
			<view class="flex1 flexc" :class="{ active: tabIndex == index }" 
			v-for="(item, index) in tabList" :key="index" @click="cliTab(index)">{{ item.name }}</view>
			<span :style="'left:' + tabStyle + 'rpx'"></span>
		</view>
		<view style="height: 92rpx;" v-if="type!=1"></view>
		<view class="recordList"  v-if="hasData">
			<view class="listItem" v-for="(item,index) in RechargeList"  :key="index">
				<view class="itemRight">
					<view>{{item.Title}}</view>
					<text>{{item.AddTime}}</text>
				</view>
				<text v-if="parseFloat(item.Change)>0" class="itemLeft active">{{item.Change}}</text>
				<text v-else class="itemLeft">{{item.Change}}</text>
			</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<noData :isShow="noDataIsShow"></noData>
	</view>
</template>

<script>
	import {post} from '@/common/util.js'
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import noData from '@/components/noData.vue'; //暂无数据
	export default {
		data() {
			return {
				tabList: [{name:'全部',type:1},{name:'充值',type:2}, {name:'提现',type:3}],
				tabIndex: 0,
				userId:'',
				token:'',
				PageSize:10,
				Page:1,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				RechargeList:[],
				type:0
			}
		},
		computed: {
			tabStyle() {
				return (750 / this.tabList.length) * this.tabIndex + (750 / this.tabList.length - 88) / 2;
			}
		},
		components:{
			uniLoadMore,
			noData
		},
		onLoad(e) {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			if(e.type){
				this.type=e.type
				uni.setNavigationBarTitle({
				  title: "提现记录"
				}); 
			}
			this.init()
		},
		methods: {
			cliTab(index){
				this.tabIndex=index
				this.Page=1
				this.init()
			},
			async init(){
				
				let res = await post('Recharge/GetRechargeList',{
					UserId:this.userId,
					Token:this.token,
					Page:this.Page,
					PageSize:this.PageSize,
					// Type:this.type!=1?this.tabList[this.tabIndex].type : 6
					Type:this.type!=1?this.tabList[this.tabIndex].type : 3
				})
				if (res.data.list.length > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
				}
				if (res.data.list.length == 0 && this.Page == 1) {
					this.noDataIsShow = true;
					this.hasData = false;
				}
				if (this.Page === 1) {
					this.RechargeList = res.data.list;
				}
				if (this.Page > 1) {
					this.RechargeList = this.RechargeList.concat(
						res.data.list
					);
				}
				if (res.data.list.length <this.PageSize) {
					this.isLoad = false;
					this.loadingType = 2;
				} else {
					this.isLoad = true;
					this.loadingType = 0
				}
			}
		},
		// 下拉刷新
		onPullDownRefresh(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.Page=1;
			this.RechargeList=[]
			this.init(); 
			uni.stopPullDownRefresh();
		},
		// 上拉加载
		onReachBottom() {
			if (this.isLoad) {
				this.loadingType = 1;
				this.Page++;
				this.init();
			} else {
				this.loadingType = 2;
			}
		}
	}
</script>

<style scoped lang="scss">
	.tab {
		height: 92upx;
		background-color: #fff;
		position: fixed;
		left: 0;
		/* #ifdef H5 */
		top: 44px;
		/* #endif */
		/* #ifndef H5 */
		top: 0;
		/* #endif */
		width: 100%;
		z-index: 11;
		border-bottom: 1px solid #eee;
		.active {
			color: #fd6306;
		}
		span {
			position: absolute;
			bottom: 0;
			transition: all 0.2s;
			height: 5upx;
			width: 88upx;
			background-color: #fd6306;
		}
	}
	.flexc {
		display: flex;
		justify-content: center;
		align-items: center;
		// margin-right: 20upx;
	}
	.recordList{
		margin-top: 20rpx;
		background-color: #fff;
		padding: 20rpx;
		.listItem{
			padding: 0 20rpx;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #ececec;
			.itemRight{
				font-size: 32rpx;
				text{
					font-size: 24rpx;
					color: #999;
				}
			}
			.itemLeft{
				font-size: 32rpx;
				&.active{
					color: #fd6306;
				}
			}
		}
	}
</style>
