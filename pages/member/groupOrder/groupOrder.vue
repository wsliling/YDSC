<template>
	<view>
		<view class="List">
			<view class="order_item bg_fff mt2" v-for="(item,index) in groupOrder" :key="index">
				<view class="flex justifyContentBetween flexAlignCenter">
					<view class="shopbox flex flex-start" @click.stop="golink('/pages/goods/storeIndex/storeIndex?id='+item.ShopId)">
						<view class="iconfont icon-shop" style="margin-right: 20rpx;"></view>
						<text class="shopName uni-ellipsis">{{item.ShopName}}</text>
						<!-- <view class="iconfont icon-arrow_r"></view> -->
					</view>
					<!-- <view class="color_red font26">燕之屋旗舰店</view> -->
				</view>
				<view class="flex justifyContentBetween mt2" v-for="(ite,i) in item.OrderDetails" :key="i" @click="golink('/pages/member/groupOrderDetail/groupOrderDetail?Id='+item.OrderNumber)">
					<image :src="ite.PicNo" mode="aspectFit" class="img mr2"></image>
					<view class="flex1 order_info">
						<view>{{ite.ProductName}}</view> 
						<view class="color_gray font18">{{ite.SpecText}}&nbsp; &nbsp;X{{ite.Number}}</view>
						 <!-- <view class="color_gray font18"></view> -->
						<view class="flex flexAlignCenter mt1">
							<view class="color_red">¥
								<text style="font-size: 40rpx;margin-right: 20rpx;">{{ite.ActualPay}}</text>
							</view>
							<text class="color_gray" style="text-decoration:line-through;">¥{{ite.UnitPrice}}</text>
						</view>
					</view>
				</view>
				<view class="flex flex-between flexAlignCenter">
					<view class="text_right mt2 color_red">{{item.StatusName}}</view>
					<view class="btn flex justifyContentEnd">
						
						<view class="btn_g" v-if="item.IsCancel==1" @click.stop="chooseOrders(item.OrderNumber,1)">取消订单</view>
						<view class="btn_g" v-if="item.IsDel==1" @click.stop="chooseOrders(item.OrderNumber,2)">删除</view>
						<view class="btn_r" v-if="item.Ispay==1" @click.stop="golink('/pages/pay/pay?orderNo='+item.OrderNumber)">立即支付</view>
						<view class="btn_r" v-if="item.OrderDetails[0].IsComment==1" @click.stop="golink('/pages/member/addComment/addComment?id='+item.OrderNumber+'&detailId='+item.OrderDetails[0].Id)">去评价</view>
						<view class="btn_r" v-if="item.IsConfirmReceipt==1" @click.stop="chooseOrders(item.OrderNumber,3)">确认收货</view>
						<view class="btn_r" v-if="item.GroupRecordId>0" @click.stop="golink('/pages/member/groupDetail/groupDetail?Id='+item.GroupRecordId)">拼团详情</view>
					</view>
				</view>
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
				groupOrder:[],
				Page:1,
				PageSize:12,
				loadingType: 0, //0加载前，1加载中，2没有更多了
				isLoad: false,
				hasData: false,
				noDataIsShow: false,
				userId:'',
				token:''
			}
		},
		components:{
			uniLoadMore,
			noData
		},
		onShow(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			// uni.getLocation({
			//     type: 'wgs84',
			//     success: function (res) {
			//         console.log('当前位置的经度：' + res.longitude);
			//         console.log('当前位置的纬度：' + res.latitude);
			//     }
			// });
			this.getOrderList()
		},
		methods: {
			golink(url){
				uni.navigateTo({
					url:url
				})
			},
			async getOrderList(){
				let result = await post('Order/OrderList',{
					UserId:this.userId,
					Token:this.token,
					Page:this.Page,
					PageSize:this.PageSize,
					Status:7
					// Lat:this.Lat
					// Lng:this.Lng
				})
				if (result.count > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
				}
				if (result.count == 0 && this.Page == 1) {
					this.noDataIsShow = true;
					this.hasData = false;
				}
				if (this.Page === 1) {
					this.groupOrder = result.data;
				}
				if (this.Page > 1) {
					this.groupOrder = this.groupOrder.concat(
						result.data
					);
				}
				if (result.data.length <this.PageSize) {
					this.isLoad = false;
					this.loadingType = 2;
				} else {
					this.isLoad = true;
					this.loadingType = 0
				}
			},
			
			chooseOrders(OrderNo,type){//确认取消
				let _this=this,content="",url="";
			  if(type==1){
				content="您确定要取消此订单吗？"
				url="Order/CancelOrders"
			  }else if(type==2){
				content="您确定要删除此订单吗？"
				url="Order/DeleteOrders"
			  }else{
				content="您确定收货成功吗？"
				url="Order/ConfirmReceipt"
			  }
			  //#ifndef APP-PLUS
			  uni.showModal({
			    title: '提示',
			    cancelText:"再想想",
			    content: content,
			    success (res) {
			      if (res.confirm) {
			        _this.chooseOrdersFn(url,OrderNo)
			      } else if (res.cancel) {
			        console.log('用户点击取消')
			      }
			    }
			  })
			  //#endif
			  //#ifdef APP-PLUS
			  this.$showModal({
			  	title:'提示',
			  	cancelVal: "再想想",
			  	content: content,
			  }).then(res=>{
			  	 _this.chooseOrdersFn(url,OrderNo)
			  	//确认
			    }).catch(res=>{
			  	//取消
			    })
			  //#endif
			},
			chooseOrdersFn(url,OrderNo){
				let _this=this;
				post(url,{
				  UserId:uni.getStorageSync("userId"),
				  Token:uni.getStorageSync("token"),
				  OrderNo:OrderNo,
				}).then(res=>{
				  _this.showCancel = false;
				  _this.list = [];
				  _this.noDataIsShow = false;
				  _this.getOrderList();
				  uni.showToast({
						icon:'none',
						title:res.msg,
					})
				})
			}
		},
		// 下拉刷新
		onPullDownRefresh(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.Page=1;
			this.groupOrder=[]
			this.getOrderList(); 
			uni.stopPullDownRefresh();
		},
		// 上拉加载
		onReachBottom() {
			if (this.isLoad) {
				this.loadingType = 1;
				this.Page++;
				this.getOrderList();
			} else {
				this.loadingType = 2;
			}
		}
	}
</script>

<style lang="scss" scoped>
@import './style';
.color_red{
	color: #FF3333;
}
</style>
