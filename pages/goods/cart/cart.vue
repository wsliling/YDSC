<template>
	<view class="content">
		<!--  #ifndef  MP-WEIXIN -->
		<uni-nav-bar fixed="true" color="#000000" background-color="#FFFFFF" left-icon="arrowleft" title="购物车" @clickLeft="back" :border="false">
		</uni-nav-bar>
		<!--  #endif -->
		<!--  #ifdef  MP-WEIXIN -->
		<view class="wxcarthead" v-if="hascartlist">
			<text @click="ManageCart">{{isEdittxt}}</text>
		</view>
		<view  :style="{'height':barHeight+40+'px'}"></view>
		<!--  #endif --> 
		<view class="hasContentPage" v-if="hascartlist">
			<!-- 全选 -->
			<view class="row">
				<view class="left">
					<view :class="['IconsCK IconsCK-radio',allSelect?'checked':'']" @click="Allcheck"></view>全选
				</view>
				<view @click="ManageCart">{{isEdittxt}}</view>
			</view>
			<view class="cartGroupList">
				<view class="item" v-for="(item,index) in cartlist" :key="index">
					<view class="item__hd flex-between">
						<view :class="['IconsCK IconsCK-radio',item.select?'checked':'']" @click="shopcheck(index)"></view>
						<view class="shop flex1 flex-start" @click="golink('/pages/goods/storeIndex/storeIndex?ShopId='+item.ShopId)">
							<view class="shopName uni-ellipsis mr1">{{item.ShopName}}</view>
							<view class="iconfont icon-arrow_r fz12"></view>
						</view>
						<!-- <view class="btn_receive" @click="showCoupon(item.ShopId)">领券</view> -->
					</view>
					<view class="column levelPanel">
						<view class="item" v-for="(item2,index2) in item.ProData" :key="index2">
							<view class="outside uni-pd10 flex">
								<view class="IconsCK IconsCK-radio" :class="{'disabled':item2.disBuy,'checked':item2.select}" @click="selectStyle(index,index2,item2.select,item2.disBuy,$event)"></view>
								<view class="pictrueAll" @click="gotoDetail(item2.ProductId,item2.Isinvalid)">
									<view class="pictrue">
										<image :src="item2.PicNo||'http://via.placeholder.com/800x800'" mode="aspectFill"></image>
									</view>
								</view>
								<view class="txtBox">
									<view class="title uni-ellipsis2" @click="gotoDetail(item2.ProductId,item2.Isinvalid)">{{item2.Name}}</view>
									<view class="flex skuBox uni-mb10" v-if="item2.SpecText">
										<view class="flex-item flex1" @click="showSku(item2.ProductId,item2.Id,item2.Number,0)">
											<view class="type">{{item2.SpecText}}<view style="color: #999; font-size: 28upx;" class="uni-icon uni-icon-arrowdown"></view>
											</view>
										</view>
										<view class="flex-item"></view>
									</view>
									<view class="flex mt5 flexAlignCneter">
										<view class="flex-item flex1">
											<view class="new-price"><text class="yuan">￥</text>{{item2.Price}}
											<!-- <text class="fz12">返两万</text> -->
										</view>
										</view>
										<view class="flex-item selNumRow">
											<uni-number-box :disabled="false" :value="item2.Number" :min="item2.MinBuyNum" :max="item2.MaxBuyNum" v-on:change="change" :shopindex="index" :index="index2"></uni-number-box>
										</view>
									</view>
									<view class="flex">
										<view class="red fz12" v-if="item2.MinBuyNum>1">{{item2.MaxBuyNum}}件起购</view>
										<view class="red fz12" v-if="item2.MaxBuyNum>0">限购{{item2.MaxBuyNum}}件</view>
										<view class="red fz12" v-if="item2.Stock>0&&item2.Stock<10">仅剩{{item2.Stock}}件</view>
										<view class="red fz12" v-if="item2.Isinvalid>0">{{Isinvalidstr[item2.Isinvalid]}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cartFoot">
				<view class="inner flex flexAlignCneter">
					<view class="right flex1 text_r">
						<view class="inner1 flex-end">
							<view>
								<view class="hj">总计:<text class="allPrice"><text class="fz12">￥</text>{{allPrice}}</text></view>
								<!-- <view class="red fz12">返2万</view> -->
							</view>
						</view>
						<view class="deletbox">
							<view class="delet2" v-if="isEdit" @click="golink('/pages/tabBar/my/collect')">我的收藏</view>
							<view  v-if="!isEdit" class="btnPay" @click="settle">结算({{selectlen}})</view>
							<view  v-if="isEdit" class="delet" @click="DelCartBtn">删除</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 没有数据的时候 --> 
		<view class="noConPage table bg_fff nodatalocal" v-if="noDataIsShow">
			<view class="table-cell">
				<view class="noDataImg">
					<image src="http://yd.wtanvxin.com/static/nocart.png" mode="widthFix"></image>
				</view>
				<view class="tips">购物车空空如也~</view>
				<view class="btnBox flex-center">
					<view class="btn" style="padding:0 40upx;" @click="goIndex">去逛逛</view>
					<view class="btn btn-active" v-if="gologin" style="padding:0 40upx;" @click="golink('/pages/login/login')">去登录</view>
				</view>
			</view>
		</view>
		<!-- SKU弹框 --> 
		<popupsku :proInfo="proInfo" v-if="isProData" :show="showPopupSku" :fromcart="fromcart" :showbtntype="1" :h5Top="true" :isPlus="isPLUS" v-on:hidePopup="hidePopup" v-on:selectSku="selectSku" :isLimint="isLimint"></popupsku>
		<!-- 弹出优惠券 -->
		<uni-popup ref="CouponWin" type="bottom">
			<view class="uni-modal-Coupon">
				<view class="closebtn uni-icon uni-icon-close" @click="hidePopup"></view>
				<view class="bottom-title uni-mb10">优惠</view>
				<view class="bottom-content">
					<view class="couponlist">
						<view class="coupon-item uni-mb10" v-for="(item,index) in CouponList" :key="index">
							<view class="flex-between">
								<view class="couponleft flex1">
									<view class="title">
										<view class="price" v-if="item.DiscountType=='1'"><text>￥</text><text class="num">{{item.Denomination}}</text></view>
										<view class="price" v-if="item.DiscountType=='2'"><text class="num">{{item.Denomination*100/10}}</text><text>折</text></view>
										<view class="couponname">{{item.Name}}</view>
									</view>
									<view class="txt">{{item.MeetConditions!='0'?'满'+item.MeetConditions+'元可用':'无门槛'}}</view>
									<view class="txt fz12">{{item.StartEndTimeStr}}</view>
								</view>
								<view class="couponbtn">
									<view class="btn" v-if="item.IsMyAlready==0" @click="ReceiveCoupon(item.Id,index)">立即领取</view>
									<view class="btn dis" v-if="item.IsMyAlready==1">已领取</view>
									<view class="rightimg" v-if="item.IsMyAlready==1"><image src="http://yd.wtanvxin.com/static/ylq.png" mode=""></image></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="bottom-btn" @click="hidePopup">完成</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {post,get,toLogin} from '@/common/util.js';
	import popupsku from '@/components/popupSku.vue';
	// import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';
	export default {
		components: {
			// uniNumberBox,
			popupsku
		},
		data() {
			return {
				userId:"",
				barHeight:0,
				token:"",
				gologin:false,
				memberInfo:{},//会员信息
				isPLUS:0,//会员是否是plus
				proInfo:{},      //单个商品信息
				isProData:false, //有商品信息
				showPopupSku:false,//sku弹框显示
				showPopupCoupon:false,//优惠券弹出
				skunumber:1,//选sku的商品数量
				skuCartId:"",//选sku的购物车id
				SpecText:"",//选sku的商品规格
				fromcart:true,//SKU显示确定不显示加入购物车
				cartinfo:{},//购物车信息
				cartlist:[], //购物车列表
				hascartlist:true, //购物车有商品
				noDataIsShow: false,
				isEdit:false,//是否编辑购物车
				isEdittxt:"编辑",//是否编辑购物车按钮文字
				allSelect:false,//判断是否全选
				cartlen:0,//全部购物车数量
				checklen:0,//有效产品数量
				selectlen:0,//累计选中的产品
				allPrice:0,//累计选中产品的金额
				CouponList:{},//弹出优惠券列表
				isLimint:0,//0非限时购产品，1限时购产品
				Isinvalidstr:['可购买','告罄','已下架','预售','库存不足','规格不存在']
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			var height = plus.navigator.getStatusbarHeight();
			this.barHeight = height;
			// #endif
			// #ifdef H5
			this.barHeight = 0;
			// #endif
		},
		onShow() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			//this.getMemberInfo();
			this.allPrice=0;
			this.cartlist=[];
			this.getCartList();
			this.isEdit=false;
			this.isEdittxt="编辑";
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			golink(url){
				uni.navigateTo({
					url:url
				})
			},
			// 跳转商品详情页
			gotoDetail(pid,Isinvalid){
				if(Isinvalid!=2){
					uni.navigateTo({
						url:'/pages/goods/productDetail/productDetail?proId='+pid
					})
				}else{
					uni.showToast({
						title: "该产品已下架！",
						icon: "none",
						duration: 2000
					});
				}
			},
			//加减商品的数量
			change(msg){
				let number=msg.number;
				let index1=msg.index1;
				let index2=msg.index2;
				if(this.cartlist[index1].ProData[index2].Isinvalid==0){
					let dataArr=[],json = {};
					json["CartId"] = this.cartlist[index1].ProData[index2].Id;
					json["Total"] = number;
					json["SpecText"] = this.cartlist[index1].ProData[index2].SpecText;
					dataArr.push(json);
					this.eaditCart(dataArr,index1,index2,number);
				}
			},
			//编辑商品规格数量
			async eaditCart(Arr,index1,index2,number) {
				let res = await post("Cart/EditCart", {
					UserId: this.userId,
					Token: this.token,
					data: Arr
				});
				if (res.code === 0) {
					if(number){
						this.cartlist[index1].ProData[index2].Number = number;
						this.cartlist[index1].ProData[index2].select = true;
					}
					else{
						this.getCartList()
					}
				    this.AllPrice();
				} 
			},
			//删除购物车
			async DelCart(Arr){
				let result = await post("Cart/DelCart",{
					UserId: this.userId,
					Token: this.token,
					data: Arr
				})
				if (result.code === 0){
					this.getCartList();
				}
			},
			//删除按钮
			DelCartBtn(){
				let _this = this;
				let dataArr=[];
				_this.cartlist.forEach(function(item){
					item.ProData.forEach(function(item2){
						if(item2.select==true){
							let id = item2.Id;
							let json = {};
							json["CartId"] = id;
							dataArr.push(json);
						}
					})
					
				})
				if(dataArr.length){
					let that = this;
					//#ifndef APP-PLUS
					uni.showModal({
						content: "您确定要删除所选商品吗？",
						confirmColor:"#ff3333",
						success: function(res) {
							if (res.confirm) {
								_this.DelCart(dataArr);
							} else if (res.cancel) {
							}
						}
					});
					// #endif
					// #ifdef APP-PLUS
					this.$showModal({
						content: "您确定要删除所选商品吗？",
					}).then(res=>{
						_this.DelCart(dataArr);
						//确认
					  }).catch(res=>{
						//取消
					  })
					// #endif
				}else{
					uni.showToast({
						title: "请选择你要删除的数据！",
						icon: "none",
						duration: 1500
					});
				}
			},

		//获取购物车列表
			async getCartList(){
				let result = await post("Cart/ShopsCartList", {
					UserId: this.userId,
					Token: this.token
				});
				if(result.code==0){
					this.gologin=false
					this.cartinfo=result.data;
					this.cartlist=result.data.CartList;
					this.selectlen=0;
					this.cartlen=0;
					if(result.data.CartData.length>0){
						this.checklen=result.data.CartData.length;
						this.hascartlist=true;
						this.noDataIsShow=false;
						this.allSelect=false;
						//this.allPrice=0;
						let _this = this;
						_this.$nextTick(function() {
							_this.cartlist.forEach(function(item) {
								_this.$set(item, "select", false);
								item.ProData.forEach(function(item2){
									_this.cartlen++;
									_this.$set(item2, "select", false);
									if(item2.Isinvalid!=0){//0-可以购买 1-售罄 2-下架 3-预售 4-库存不足 5-规格不存在
										_this.$set(item2, "disBuy", true);
										_this.$set(item2, "select", false);
									}else{
										_this.$set(item2, "disBuy", false);
									}
								})
							}); 
						});
						
					}else{
						this.noDataIsShow=true;
						this.hascartlist=false;
					}
				}else if(result.code==2){
					uni.hideToast()
					this.noDataIsShow=true;
					this.hascartlist=false;
					this.gologin=true
				}
			},
			//合计 金额、数量
			AllPrice(){
				let _this = this;
				let eaditallPrice =0;//全部合计
				let eaditnum =0;//选中累计
				let singelPrice=0;//单个合计
				if(!this.isEdit){//未打开编辑按钮
					_this.cartlist.forEach(function(item){
						let singelnum=0,//店铺有效购物车数量
							editsingelnum=0;//选中数量
						item.ProData.forEach(function(item2){
							if(item2.Isinvalid==0){
								singelnum++;
								if(item2.select==true){
									singelPrice =Number(item2.Price)*parseInt(item2.Number);
									eaditallPrice += singelPrice;
									eaditnum++;
									editsingelnum++;
								}
							}
							
						})
						if(singelnum==editsingelnum){
							 _this.$set(item, "select", true);	
						}else{
							 _this.$set(item, "select", false);
						}
					});
					this.selectlen=eaditnum;
					if(eaditnum==this.checklen){
							this.allSelect=true;
					}else{
						this.allSelect=false;
					}
					this.allPrice= parseFloat(eaditallPrice).toFixed(2);
				}else{
					_this.cartlist.forEach(function(item){
						let singelnum=0,//店铺购物车数量
							editsingelnum=0;//选中数量
						item.ProData.forEach(function(item2){
							singelnum++;
							if(item2.select==true){
								if(item2.Isinvalid==0){
									singelPrice =Number(item2.Price)*parseInt(item2.Number);
									eaditallPrice += singelPrice;
								}
								eaditnum++;
								editsingelnum++;
							}
						})
						if(singelnum==editsingelnum){
							 _this.$set(item, "select", true);	
						}else{
							 _this.$set(item, "select", false);
						}
					});
					this.selectlen=eaditnum;
					if(eaditnum==this.cartlen){
							this.allSelect=true;
					}else{
						this.allSelect=false;
					}
				}
			},
			//全选、反选
			Allcheck() {
				this.allSelect=!this.allSelect;
				let _this = this;
				if(!this.isEdit){//未打开编辑按钮的全选
					if(this.allSelect){
						this.selectlen = this.checklen;
						_this.cartlist.forEach(function(item) {
							_this.$set(item, "select", true); 
							item.ProData.forEach(function(item2){
								if(item2.Isinvalid==0){
									_this.$set(item2, "select", true); 
								}
							})
						}); 
					}else{
						this.selectlen = 0;
						_this.cartlist.forEach(function(item) {
							_this.$set(item, "select", false); 
							item.ProData.forEach(function(item2){
								if(item2.Isinvalid==0){
									_this.$set(item2, "select", false); 
								}
							})
						}); 
					}
					this.AllPrice();//合计   
				}else{//打开编辑按钮的全选
					if(this.allSelect){
						_this.selectlen = _this.cartlist.length;
						_this.cartlist.forEach(function(item) {
							_this.$set(item, "select", true); 
							item.ProData.forEach(function(item2){
								_this.$set(item2, "select", true);
							})
						}); 
					}else{
						this.selectlen = 0;
						_this.cartlist.forEach(function(item) {
							_this.$set(item, "select", false); 
							item.ProData.forEach(function(item2){
								_this.$set(item2, "select", false); 
							})
						}); 
					} 
					this.AllPrice();//合计  
				} 
			},
			//单选
			selectStyle(index,index2,select,disBuy,event) {
				let _this=this;
				let item=_this.cartlist[index];
				let item2=item.ProData[index2];
				if(!this.isEdit){//未打开编辑按钮的单选
					if(disBuy){
						this.$set(item2, "select", false);
						event.preventDefault();
					}else{   
						if(select){
							this.$set(item2, "select", false);
						}else{
							this.$set(item2, "select", true);
						}
						this.AllPrice();//合计
					}
				}else{
					if(select){
						this.$set(item2, "select", false);
					}else{
						this.$set(item2, "select", true);
					}
					this.AllPrice();//合计
				}
			},
			//店铺全选
			shopcheck(index){
				let _this=this;
				let item=_this.cartlist[index];
				_this.$set(item, "select", !item.select);
				if(!_this.isEdit){//未打开编辑按钮的单选
					if(item.select){
						item.ProData.forEach(function(e){
							if(e.Isinvalid==0){
								_this.$set(e, "select", true);
							}
						})
					}else{
						item.ProData.forEach(function(e){
							if(e.Isinvalid==0){
								_this.$set(e, "select", false);
							}
						})
					}
					_this.AllPrice();//合计
				}else{
					if(item.select){
						item.ProData.forEach(function(e){
							_this.$set(e, "select", true);
						})
					}else{
						item.ProData.forEach(function(e){
							_this.$set(e, "select", false);
						})
					}
					_this.AllPrice();//合计
				}
			},

			//打开编辑购物车
			ManageCart(){
				this.isEdit=!this.isEdit;
				let _this=this;
				if(this.isEdit==false){
					this.isEdittxt="编辑";
					_this.cartlist.forEach(function(item) {
						item.ProData.forEach(function(item2){
							if(item2.Isinvalid!=0){
								_this.$set(item2, "disBuy", true);
								_this.$set(item2, "select", false);
							}
						})
					}); 
				}else{
					this.isEdittxt="完成";
					_this.cartlist.forEach(function(item) {
						 item.ProData.forEach(function(item2){
							_this.$set(item2, "disBuy", false);
						 })
					}); 
				}
				this.AllPrice();//合计
			},
			//点击结算
			settle(){
				let _this = this;
				let dataArr=[];
				 uni.setStorageSync("addressinfo",'');
				 uni.setStorageSync("invoiceinfo","");
				_this.cartlist.forEach(function(item){
					item.ProData.forEach(function(item2){
						if(item2.select==true){
							let id = item2.Id;
							dataArr.push(id);
						}
					})
				});
				if(dataArr.length){
					uni.navigateTo({ 
						url: "/pages/goods/submitOrder/submitOrder?cartItem=" + dataArr.join(",") +'&orderSType=1'
					});
				}else{
					uni.showToast({
						title: "请选择你要购买的产品！",
						icon: "none",
						duration: 1500
					});
				}
			},
			goIndex(){
				uni.switchTab({
					url: '/pages/tabBar/shop/shop'
				})
			},
			showSku(proId,skuCartId,skunumber,isflash){
				this.isLimint=isflash;
				this.isProData=false
				this.showPopupSku=true;
				this.skuCartId=skuCartId;
				this.skunumber=skunumber;
				this.getProductInfo(proId);
			},
			selectSku(msg){
				//console.log(msg)
				this.SpecText=msg;
				let dataArr=[],json = {};
				json["CartId"] = this.skuCartId;
				json["Total"] = this.skunumber;
				json["SpecText"] = this.SpecText;
				dataArr.push(json);
				this.eaditCart(dataArr);
			},
			//商品详情信息
			async getProductInfo(proId){
				let result = await post("Goods/Goodsxq", {
					Id: proId,
					userId:this.userId,
					token:this.token
				});
				if(result.code==0){
					this.proInfo=result.data;
					this.isProData = true;
				}
			},
			//统一的关闭popup方法
			hidePopup: function() {
				this.showPopupSku=false;
				if(this.showPopupCoupon){
					this.showPopupCoupon=false;
					this.$refs.CouponWin.close();
				}
			},
			//弹出优惠券
			/*获取优惠券列表*/
			async showCoupon(Shopid){
				let result = await post("Coupon/CouponCenter", {
					"UserId": this.userId,
					"Token": this.token,
					"page": 1,
					"pageSize": 100,
					"ShopId": Shopid//
				});
				if (result.code === 0){
					if(result.data.length>0){
						this.showPopupCoupon=true;
						this.CouponList=result.data;
						this.CouponList.forEach(function(item){
							if(item.DiscountType==2){
								item.Denomination=item.Denomination*10;
							}
						})
						this.$refs.CouponWin.open();
					}else{
						uni.showToast({
							title: "该店铺暂无优惠券！",
							icon: "none",
							duration: 2000
						});
					}
				}else if (result.code === 2) {
					uni.hideToast();
					toLogin()
				}

			},
			//领取优惠券
			async ReceiveCoupon(Couponid,index){
				let result =await post("Coupon/GetCoupon", {
					"UserId": this.userId,
					"Token": this.token,
					"CouponId": Couponid
				});
				if (result.code === 0){
					uni.showToast({
						title: result.msg,
						icon: "none",
						duration: 2000
					});
					this.CouponList[index].Limit--;
					if(this.CouponList[index].Limit==0){
						this.$set(this.CouponList[index],'IsMyAlready',1);
					}
				}
			},
			//获取会员信息
			async getMemberInfo() {
				let result = await post("User/GetMemberInfo", {
					"UserId": this.userId,
					"Token": this.token
				})
				if (result.code === 0) {
					this.memberInfo = result.data;
					this.isPLUS=this.memberInfo.IsPlus;
				} else if (result.code === 2) {
					
				}
			}
		},
		onPullDownRefresh() {
			//监听下拉刷新动作的执行方法，每次手动下拉刷新都会执行一次
			let _this=this;
				_this.cartlist = [];
			setTimeout(function () {
				_this.getCartList();
				uni.stopPullDownRefresh();  //停止下拉刷新动画
			}, 1000);
		}
	}
</script>

<style lang="scss" scoped>
	@import './style';
	.content /deep/ .uni-navbar__header-btns-right{
		width: auto !important;
	}
</style>
