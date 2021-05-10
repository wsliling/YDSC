<template>
	<view class="order">
		<view class="bg_fff tabList flex">
			<view v-for="(item,index) in tabList" :key="index" class="item" :class="{'active':item.id==tabIndex}"  @click="cliTab(item.id)">{{item.name}}</view>
		</view>
		<view class="list pw3" style="padding-top: 80upx;" v-if="hasData">
			<!--
			等待买家付款:取消订单 立即支付
			买家已付款/交易关闭:无状态
			卖家已发货：查看物流 确认收货
			交易成功：查看物流 评价
			退款成功/退款中：退款详情
			-->
			<block v-for="(item,index) in list" :key="index">
			<view class="order_item bg_fff mt2" @click="todetail(item.OrderNumber,item.GroupRecordId)">
				<!-- <view class="flex-between">
					<view class="shopbox flex flex-start" @click.stop="goUrl('/pages/goods/storeIndex/storeIndex?id='+item.ShopId)">
						<view class="iconfont icon-shop"></view>
						<text class="shopName uni-ellipsis">{{item.ShopName}}</text>
						<view class="iconfont icon-arrow_r"></view>
					</view>
					<view class="c_theme font26">{{item.StatusName}}</view>
				</view> -->
				<block v-if="item.OrderDetails.length>2">
					<view class="flex-between mt2">
						<image :src="ite.PicNo" mode="aspectFit" class="img mr2 b_radius" v-for="(ite, ind) in item.OrderDetails" :key="ind"></image>
						<text class="c_999 fz12">共{{item.countNum}}件</text>
					</view>
				</block>
				<block v-else>
					<view class="flex justifyContentBetween mt2" v-for="(ite, ind) in item.OrderDetails" :key="ind">
						<image :src="ite.PicNo" mode="aspectFit" class="img mr2 b_radius"></image>
						<view class="flex1 order_info">
							<view class="uni-ellipsis">{{ite.ProductName}}</view> 
							<view class="c_999 fz12">{{ite.SpecText}}</view> 
							<view class="flex justifyContentBetween flexAlignCenter mt1">
								<text class="c_999 fz12">x{{ite.Number}}</text>
								<text>¥{{ite.UnitPrice}}</text>
							</view>
						</view>
					</view>
				</block>
				<view class="text_right mt2">总计：<text class="fz12">¥</text><text class="font32 uni-bold">{{item.Total}}</text></view>
				<view class="btn flex justifyContentEnd">
					<view class="btn_g" v-if="item.IsCancel==1" @click.stop="chooseOrders(item.OrderNumber,1)">取消订单</view>
					<view class="btn_g" v-if="item.IsDel==1" @click.stop="chooseOrders(item.OrderNumber,2)">删除</view>
					<view class="btn_g" v-if="item.StatusName=='已发货'||item.StatusName=='已收货'" @click.stop="goUrl('/pages/member/logistics/logistics?orderNo='+item.OrderNumber)">查看物流</view>
					<view class="btn_r" v-if="item.Ispay==1" @click.stop="goUrl('/pages/pay/pay?orderNo='+item.OrderNumber)">立即支付</view>
					<view class="btn_r" v-if="item.IsComment==1" @click.stop="goPinJia(item.OrderDetails,item.OrderNumber)">去评价</view>
					<view class="btn_r" v-if="item.IsConfirmReceipt==1" @click.stop="chooseOrders(item.OrderNumber,3)">确认收货</view>
					<view class="btn_r" v-if="item.GroupRecordId>0" @click.stop="goUrl('/pages/member/groupDetail/groupDetail?Id='+item.GroupRecordId)">拼团详情</view>
				</view>
			</view>
			</block>
		</view>
		<noData :isShow="noDataIsShow"></noData>
		<view class="uni-tab-bar-loading" v-if="hasData">
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<!-- 选择评价商品 -->
		  <view class="change-goods flex-center" v-if="showChange" @click="showChange=false">
			<view class="main">
			  <view class="tit">请选择要操作的商品</view>
			  <view class="list flex-between" v-for="(item, index) in needChangeGoods" @click.stop="changeGoods(item.Id)" :key="index">
				<image :src="item.PicNo" mode="aspectFit" alt=""></image>
				<view class="flex1 uni-ellipsis">{{item.ProductName}}</view>
			  </view>
			</view>
		  </view>
	</view>
</template>

<script>
	import {host,post,get,toLogin} from '@/common/util.js';
	import noData from '@/components/noData.vue'; //暂无数据
	import uniLoadMore from '@/components/uni-load-more.vue';
	export default{
		components: {
			noData,
			uniLoadMore
		},
		data(){
			return{
				tabList:[{id:0,name:'全部'},{id:1,name:'待付款'},{id:2,name:'待发货'},{id:3,name:'待收货'},{id:4,name:'待评价'}],
				tabIndex:0,
				page:1,
				pagesize:8,
				list:[],
				loadingType: 0, //0加载前，1加载中，2没有更多了
				hasData: false,
				noDataIsShow:false,
				isLoad: false,
				// isOver:false,
				needChangeGoods:[],
				showChange:false,
				changeNumId:'',//评价多商品订单时选中的订单no
			}
		},
		onLoad(e) {
			console.log(e.tabIndex)
			// #ifdef APP-PLUS
			this.tabIndex =e.tabIndex
			// #endif
		},
		onShow() {	
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			// // #ifndef APP-PLUS
			// this.tabIndex = this.$mp.query.tabIndex
			// // #endif
			this.list = []
			this.page = 1
			this.noDataIsShow = false;
			this.hasData = false;
			if (toLogin()) {
			    this.getList();
			}
		},
		onLoad(e){
			// #ifdef APP-PLUS
				 this.tabIndex = e.tabIndex
			// #endif
		},
		methods:{
			goUrl(url){
			  uni.navigateTo({
				url:url
			  })
			},
			todetail(id,type){
				if(type>0){
					uni.navigateTo({
						url:'/pages/member/groupOrderDetail/groupOrderDetail?Id='+id
					})
				}else{
					uni.navigateTo({
						url:'/pages/member/orderDetail/orderDetail?id='+id
					})
				}
			},
			cliTab(index){
			  this.tabIndex = index
			  this.page=1;
			  this.list=[];
			  this.noDataIsShow = false;
			  this.hasData = false;
			  this.getList()
			},
			getList(){
			  post('Order/OrderList',{
				UserId:uni.getStorageSync("userId"),
				Token:uni.getStorageSync("token"),
				Page:this.page,
				PageSize:this.pagesize,
				Status:this.tabIndex,
				// Type:0,
			  }).then(res=>{
				if(res.code===0){
				  let _this=this;
				  if (res.data.length > 0) {
				  	this.hasData = true;
					this.noDataIsShow = false;
					res.data.forEach(function(item){
						let num=0;
						for(let i=0;i<item.OrderDetails.length;i++){
							num+=item.OrderDetails[i].Number
						}
						_this.$set(item,"countNum",num)
					})
				  }
				  if (res.data.length == 0&&this.page==1) {
				  	this.noDataIsShow = true;
					this.hasData = false;
				  }
				  if (this.page === 1) {
				  	this.list = res.data;
				  }
				  if (this.page > 1) {
				  	this.list.push(...res.data)
				  }
				  if (res.data.length <this.pagesize) {
				  	this.isLoad = false;
				  	this.loadingType = 2;
				  } else {
				  	this.isLoad = true;
				  	this.loadingType = 0
				  }
				}
			  })
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
				  _this.getList();
				  uni.showToast({
					icon:'none',
					title:res.msg?res.msg:'操作成功！'
				  })
				})
			},
			goPinJia(goods,id){
				let num=0,data=[]
				goods.forEach(function(item){
					if(item.IsComment==1){
						num++;
						data.push(item)
					}
				})
			  if(num==1){
				this.goUrl('/pages/member/addComment/addComment?id='+id+'&detailId='+goods[0].Id)
			  }else{
				this.showChange = true
				this.needChangeGoods = data
				this.changeNumId = id
			  }
			},
			changeGoods(detailId){
			  this.goUrl('/pages/member/addComment/addComment?id='+this.changeNumId+'&detailId='+detailId)
			},
		},
		onReachBottom(){
			if (this.isLoad) {
				this.loadingType = 1;
				this.page++;
				this.getList();
			} else {
				this.loadingType = 2;
			}
		}
	}
	
</script>

<style lang="scss" scoped>
	@import './style';
</style>
