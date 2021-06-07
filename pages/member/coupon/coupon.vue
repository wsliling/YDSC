<template>
  <view class="ticket">
      <view class="tab flex">
        <view class="flex1 flexc" :class="{'active':tabIndex==index}" v-for="(item, index) in tabList" :key="index" @click="cliTab(index)">{{item}}</view>
        <!-- #ifndef MP-WEIXIN -->
        <span :style="{'left':tabStyle+'upx'}"></span>
        <!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<span :style="{'left':tabStyle+'rpx'}"></span>
		<!-- #endif -->
      </view>
      <block v-if="hasData">
        <view class="list " v-for="(item,index) in datalist" :key="index">
          <image class="couponbg" v-if="couponStatus==1" src="https://yd.wtanvxin.com/static/couponbg.png"></image>
		  <image class="couponbg" v-else src="https://yd.wtanvxin.com/static/couponbg1.png"></image>
		  <view class="coupon1">
			  <view class="money" v-if="item.DiscountType==1">
				  <text>￥</text>
				  <view>{{item.Denomination}}</view>
			  </view>
			  <view class="money" v-else>
				  <view>{{item.Denomination*100/10}}折</view>
			  </view>
			  <view class="explain">{{item.DiscountType==1?'满减':'折扣'}}券</view>
		  </view>
		  <view class="useInfo">
			  <view class="use">
				 <view class="info">
					 <view class="fz15">{{item.Title}}</view>
					 <view class="time">
					 	<text></text>
					 	有效期至{{item.EndTime}}
					 </view>
				 </view>
				 <view class="btn" v-if="couponStatus==1" @click="goUrl('/pages/goods/ProductList/ProductList?couponId='+item.Id)">立即使用</view>
			  </view>
			  <view class="limit">
				  <text class="uni-ellipsis" v-if="item.ShopId!=0">仅限{{item.ShopName}}店铺可用</text>
				  <text class="uni-ellipsis" v-else-if="item.ProTypeName!=0">仅限{{item.ProTypeName}}产品可用</text>
			  </view>
		  </view>
        </view>
      </block>
	  <view class="btn_de" @click="goUrl('/pages/member/couponCenter/couponCenter')">领券中心</view>
      <noData :isShow="noDataIsShow"></noData>
      <view class="loading" v-if="hasData">
        <load-more :loadingType="loadingType"></load-more>
      </view>
  </view>
</template>

<script>
import {post} from '@/common/util.js'
import noData from "@/components/noData"; //没有数据的通用提示
import LoadMore from '@/components/uni-load-more.vue';
export default {
  data () {
    return {
		tabList:['未使用','已使用','已失效'],
		tabIndex:0,
		couponStatus:1,//0全部，1可用，2已使用，3已失效
		userId:"",
		token:"",
		hasData:false,
		noDataIsShow: false,//没有数据的提示是否显示
		page: 1,
		pageSize: 8,
		isLoad: false,
		isOved:false,       //显示已经到底了
		loadingType: 0, //0加载前，1加载中，2没有更多了
		datalist:{},
    }
  },
  computed: {
    tabStyle(){
		console.log(((750/this.tabList.length)*this.tabIndex)+(((750/this.tabList.length)-50)/2))
      return ((750/this.tabList.length)*this.tabIndex)+(((750/this.tabList.length)-50)/2)
    }
  },
  onShow(){
    this.userId = uni.getStorageSync("userId")
    this.token = uni.getStorageSync("token")
    this.page=1;
    this.CouponList()
  },
  components: {
    noData,LoadMore
  },
  methods: {
    goUrl(url){
      uni.navigateTo({
        url:url
      })
    },
    cliTab(index){
      this.tabIndex = index;
      this.couponStatus=index+1;
      this.page=1;
      this.noDataIsShow=false;
      this.hasData=false;
      this.CouponList();
    },
    //我的优惠券
    CouponList(){
      post('User/CouponList',{
          UserId:this.userId,
          Token:this.token,
          Page:this.page,
          PageSize:this.pageSize,
          Status:this.couponStatus
      }).then(res=>{
        if(res.code==0){
          let _this = this;
          let len=res.data.length;
          if (len > 0) {
            this.hasData = true;
            this.noDataIsShow = false;
            res.data.map(item=>{
              item.AddTime=item.AddTime.split("T")[0];
              item.EndTime=item.EndTime.split(" ")[0];
            })
          }
          if (len == 0&&this.page==1) {
            this.noDataIsShow = true;
            this.hasData = false;
          }
          if (this.page === 1) {
            this.datalist = res.data;
          }
          if (this.page > 1) {
            this.datalist = this.datalist.concat(
              res.data
            );
          }
          if (len < this.pageSize) {
            this.isLoad = false;
            this.loadingType = 2;
          } else {
            this.isLoad = true;
            this.loadingType = 0
          }
          
        }
      })
    },

  },
  onReachBottom: function() {
    if (this.isLoad) {
      this.loadingType = 1;
      this.isOved = false;
      this.page++;
      this.CouponList();
    } else {
      this.loadingType = 2;
      if (this.page > 1) {
        this.isOved = true;
      } else {
        this.isOved = false;
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.list{
	background-color: #fff;
	margin: 30rpx;
	height: 200rpx;
	display: flex;
	align-items: center;
	position: relative;
	border-radius: 0 10rpx 10rpx 0;
	.couponbg{
		height: 200rpx;
		width: 200rpx;
		background-color: #f6f6f6;
		position: absolute;
		left: 0;
		top: 0;
	}
	.coupon1{
		position: relative;
		z-index: 2;
		.money{
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			width: 200rpx;
			font-weight: 600;
			text{
				font-size: 40rpx;
			}
			view{
				font-size: 60rpx;
			}
		}
		.explain{
			color: #fff;
			text-align: center;
			font-size: 24rpx;
		}
	}
	.useInfo{
		flex: 1;
		height: 100%;
		.use{
			padding: 0 20rpx;
			border-bottom: 1rpx solid #ececec;
			font-size: 30rpx;
			flex: 1;
			display: flex;
			align-items: center;
			.info{
				view{
					margin: 15rpx 0;
				}
				.time{
					margin: 0;
				}
			}
			.btn{
				margin-left: auto;
				color: #fff;
				font-size: 26rpx;
				text-align: center;
				border-radius: 5rpx;
				width: 130rpx;
				height: 50rpx;
				background-color: #FF3333;
			}
		}
		.time,.limit{
			/* margin: 0; */
			display: flex;
			align-items: center;
			font-size: 24rpx;
			height: 60rpx;
			line-height: 60rpx;
			color: #999;
			&::before{
				display: block;
				content: "";
				width: 5px;
				height: 5px;
				border-radius: 100%;
				background-color: #dbdbdb;
				margin-right: 10rpx;
			}
		}
		.limit{
			padding: 0 20rpx;
		}
	}
}
.tab{
  height: 92upx;
  background-color: #fff;
  position: relative;
  .active{
    color: #f00
  }
  view{
	  text-align: center;
	  line-height: 92rpx;
  }
  span{
    position: absolute;
    bottom: 0;
    transition: all .2s;
    height: 5upx;
    width: 50upx;
    background-color: #f00
  }
}
.back_col{
  background-color: #FF3737!important;
}
.btn_de{
  width:100%;position: fixed;bottom:0;
  height:88upx;line-height: 88upx;background: #FF3737;
  color:#ffffff;text-align: center;
}
</style>
