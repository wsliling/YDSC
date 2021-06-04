<template>
  <view class="ticket pw3" v-if="hasData">
      <view class="bg_statu pp3 boxSize">
          <view class="order_statu mt1">{{info.StatusName}}</view>
          <!-- <p class="font22 mt1">剩余00:59:13自动取消订单</p> -->
      </view>
      <view class="or_list">
        <!-- <div class="pp2 flex justifyContentBetween  bg_fff bor_tit flexAlignEnd">
            <image src="https://yd.wtanvxin.com/static/images/icons/kc.png" alt="" class="kc_icon">
            <div class="flex flex1 flexAlignCenter">
                <div class="flex1">
                    <p class="cr">
                         [深圳市] 投递并签收，签收人：他人收 韵达，感谢使用 EMS经济快递，期待...
                    </p>
                    <p class=" cg mt1">2019-09-26 18:52:10</p>
                </div>
                <image src="https://yd.wtanvxin.com/static/images/icons/right.png" alt="" class="icon_right mr2">
            </div>
        </div> -->
        <view class="pp2 flex-between b_radius bg_fff ">
            <image src="https://yd.wtanvxin.com/static/lc.png" mode="aspectFit" alt="" class="icon_lc"></image>
            <div class="flex1">
                <p>
                    <span>{{info.ContactName}}</span><span class="ml5">{{info.Tel}}</span>
                </p>
                <p class="font24 cg mt1">{{info.Addr}}</p>
            </div>
        </view>
        <view class="or_item uni-mb10">
			<view class="bg_fff b_radius">
				<!-- <view class="flex-between pp2">
					<view class="shopbox flex flex-start" @click="goUrl('/pages/goods/storeIndex/storeIndex?id='+info.ShopId)">
						<view class="iconfont icon-shop mr1"></view>
						<text class="shopName uni-ellipsis">{{info.ShopName}}</text>
						<view class="iconfont icon-arrow_r fz12"></view>
					</view>
				</view> -->
				<view class="pp3 flex" v-for="(item, index) in info.OrderDetails" :key="index" @click="goUrl('/pages/goods/productDetail/productDetail?proId='+item.ProductId)">
				    <image mode="aspectFit" :src="item.PicNo" alt="" class="shop mr2"></iamge>
				    <view class="flex1 flex">
				        <view class="or_left flex flex1 flexColumn justifyContentBetween">
				          <view class="uni-ellipsis">{{item.ProductName}}</view>
				          <view class="c_999 fz12">{{item.SpecText}}</view>
				          <view class="c_theme fz16"><text class="fz12">￥</text>{{item.UnitPrice}}</view>
				        </view>
				        <view class="mr3 flex flexColumn flexAlignEnd" style="margin-left: auto;">
				          <span>x{{item.Number}}</span>
				          <span class="tui_pill mt2" v-if="item.IsRefund==1" @click.stop="navigate('member/afterSaleType/afterSaleType',{indexId:index,id:info.OrderNumber})">{{item.OrderStatusName=="已发货"?'申请售后':'退款'}}</span>
						  <text class="tui_pill mt2" v-else-if="item.IsComment==1" @click.stop="goUrl('/pages/member/addComment/addComment?id='+info.OrderNumber+'&detailId='+item.Id)">去评价</text>
						  <text class="c_blue fz12" v-else>{{item.OrderStatusName}}</text>
				        </view>
				    </view>
				</view>
				
			</view>
			<div class="bor_tit pp2 bg_fff ">
                <p class="flex justifyContentBetween">
                    <span>支付方式</span>
                    <span>在线支付</span>
                </p>
                <p class="flex justifyContentBetween mt1">
                    <span>商品总价</span>
                    <span>¥{{info.TotalAmount}}</span>
                </p>
                <p class="flex justifyContentBetween">
                    <span>优惠</span>
                    <span>¥{{info.DiscountedAmount}}</span>
                </p>
                <p class="flex justifyContentBetween mt1" v-if="info.IsNeedAudit==0">
                    <span>运费</span>
                    <span>¥{{info.ExpressPrice}}</span>
                </p>
            </div>
            <div class="flex justifyContentBetween pp2 bg_fff" style="border-radius: 0 0 14rpx 14rpx;">
                <span>实付</span>
                <span class="cr">¥{{info.Total}}</span>
            </div>
        </view>
      </view>
      <!---订单信息-->
      <view class="bg_fff mt2 pp3 bor_tit b_radius order_posi">
          <div class="">
              <span class="order_title">订单信息</span>
          </div>
          <view class="mt2 order_info font24">
			  <!-- #ifdef H5 -->
			  <input type="text" class="font20 yy_ma mt1" @focus="blur()" :disabled="disabled" 
			   v-model="info.OrderNumber" style="opacity: 0;position: fixed;top: -10000px;">
			  <!-- #endif -->
              <view class="txt">订单编号：{{info.OrderNumber}} <text class="copy" @click="cop()">复制</text> </view>
              <view class="txt">下单时间：{{info.OrderTime}}</view>
			  <view class="txt" v-if="info.Payment">支付方式：{{info.Payment}}</view>
			  <view class="txt">支付时间：{{info.Paytime}}</view>
              <view class="txt">买家留言：{{info.Remarks}}</view>
			  <view v-if="info.OrderDetails[0].ConsumeCode">特 权 码  ：{{info.OrderDetails[0].ConsumeCode}}</view>
          </view>
      </view>
	  <!-- #ifndef MP-WEIXIN -->
      <view class="bg_fff pp2 flex-center b_radius mt2 order_posi" @click="goUrl('/pages/member/kefu/kefu?qqnum=996889692')">
         <text class="iconfont icon-kf mr1"></text>
          <span>联系客服</span>
      </view>
	  <!-- #endif -->
	  <!-- #ifdef MP-WEIXIN -->
	  <button open-type="contact" @contact="btnConcat" class="bg_fff pp2 flex-center b_radius mt2 order_posi"
	   style="border:0!important;padding:20upx 0;background: #ffffff;line-height:1.9" >
			<text class="iconfont icon-kf mr1"></text>
	      <span class="font26">联系客服</span>
	  </button>
	  <!-- <button open-type="contact" class="WEIXIN_btn"></button> -->
	  <!-- #endif -->
      <view class="flex-end bg_fff mt2 bb_fix btnbox">
          <p class="btn btn_gray" v-if="info.StatusName=='已发货'||info.StatusName=='已收货'" @click="goUrl('/pages/member/logistics/logistics?orderNo='+info.OrderNumber)">查看物流</p>
          <p class="btn btn_gray" v-if="info.IsCancel==1" @click="chooseOrders(info.OrderNumber,1)">取消订单</p>
          <p class="btn btn_gray" v-if="info.IsDel==1" @click="chooseOrders(info.OrderNumber,2)">删除订单</p>
          <p class="btn btn_red" v-if="info.Ispay==1" @click="goUrl('/pages/pay/pay?orderNo='+info.OrderNumber)">立即支付</p>
          <p class="btn btn_red" v-if="info.IsConfirmReceipt==1" @click="chooseOrders(info.OrderNumber,3)">确认收货</p>
      </view>
  </view>
</template>

<script>
import {switchPath,post,navigate} from '@/common/util.js'
export default {

  data () {
    return {
      navigate,
	  hasData:false,
      info:{},
	  OrderNo:'',
	  disabled:false,
    }
  },
  onShow(){
	  // #ifndef APP-PLUS
	  this.OrderNo = this.$mp.query.id
	  // #endif
     this.getDetail()
  },
  onLoad(e){
	  // #ifdef APP-PLUS
		this.OrderNo = e.id
	 // #endif
  },
  methods: {
	  btnConcat(e){
		  console.log(e)
	  },
    getDetail(){
      post('Order/OrderDetails',{
        UserId:uni.getStorageSync("userId"),
        Token:uni.getStorageSync("token"),
        OrderNo:this.OrderNo
      }).then(res=>{
		  if(res.code==0){
			  this.hasData=true
			  this.info = res.data;
		  }else{
			   this.hasData=false
		  }
      })
    },
    //微信支付需参数
    async ConfirmWeiXinSmallPay(no){
      let result = await post('Order/ConfirmWeiXinSmallPay',{
        OrderNo:no,
        UserId:uni.getStorageSync("userId"),
        Token:uni.getStorageSync("token"),
        WxCode:uni.getStorageSync("wxCode"),
		WxOpenid:uni.getStorageSync("openId")
      })
      let payData=JSON.parse(result.data.JsParam)
      if(result.code==0){
        let _this=this;
        uni.requestPayment({
          timeStamp: payData.timeStamp,
          nonceStr: payData.nonceStr,
          package: payData.package,
          signType: payData.signType,
          paySign: payData.paySign,
          success(res) {
              uni.redirectTo({
                url: "/pages/goodsSon/paysuccess/main?OrderNo="+no
              })
            },
          fail(res) {
            console.log(res);
            uni.redirectTo({
              url: "/pages/goodsSon/paysuccess/main?OrderNo="+no+"&msg=fail"
            })
          }
        })
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
		post(url,{
		  UserId:uni.getStorageSync("userId"),
		  Token:uni.getStorageSync("token"),
		  OrderNo:OrderNo,
		}).then(res=>{
		  uni.showToast({
		    icon:'none',
		    title:res.msg,
			success() {
				uni.navigateBack({})
			}
		  })
		})
	},
	blur() {
		this.disabled = true;
	},
    cop(){
		// #ifdef  H5
		let url = document.getElementsByTagName("input")[0];
		url.select(); // 选择对象
		document.execCommand("Copy");
		uni.showToast({
			icon: "none",
			title: "复制成功"
		})
		// #endif
		// #ifdef  MP-WEIXIN
		let _this = this;
		// console.log( _this.info.OrderNumber)
		uni.setClipboardData({
			data: _this.info.OrderNumber,
			success: function() {
				// console.log(123)
				uni.showToast({
					icon: 'none',
					title: "复制成功"
				})
			}
		});
		// #endif
        // uni.showToast({
        //   icon:'none',
        //   title: '复制成功',
        // })
        uni.setClipboardData({
          data: this.info.OrderNumber,
          success: function (res) {
            uni.getClipboardData({ 
              success: function (res) {
                console.log(res.data) // data
              }
            })
          }
        })
    },
    goUrl(url){
      uni.navigateTo({
        url:url
      })
    },
  },
  onShareAppMessage: function( options ){
  　　var that = this;
  　　// 设置菜单中的转发按钮触发转发事件时的转发内容
  　　var shareObj = {
  　　　　title: "转发的标题",        // 默认是小程序的名称(可以写slogan等)
  　　　　path: '/pages/tabBar/index/index',        // 默认是当前页面，必须是以‘/’开头的完整路径
  　　　　imageUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
  　　　　success: function(res){
  　　　　　　// 转发成功之后的回调
  　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
  				console.log("1111111111111111")
  　　　　　　}
  　　　　},
  　　　　fail: function(){
  		console.log("22222222222")
  　　　　　　// 转发失败之后的回调
  　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
  　　　　　　　　// 用户取消转发
  　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
  　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
  　　　　　　}
  　　　　},
  　　　　complete: function(){
  　　　　　　// 转发结束之后的回调（转发成不成功都会执行）
  			console.log("33333333333333")
  　　　　}
  　　};
  　　// 来自页面内的按钮的转发
  // 　　if( options.from == 'button' ){
  // 　　　　var eData = options.target.dataset;
  // 　　　　console.log( eData.name );     // shareBtn
  // 　　　　// 此处可以修改 shareObj 中的内容
  // 　　　　shareObj.path = '/pages/btnname/btnname?btn_name='+eData.name;
  // 　　}
  　　// 返回shareObj
  　　return shareObj;
  }
}
</script>

<style scoped lang='scss'>
	@import './style';
  
</style>
