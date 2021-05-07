<template>
	<view>
		<block v-if="IsAudit==9||IsAudit==99">
			<view class="attest">
				<view class="attestItem">
					<view>名称</view>
					<input type="text" v-model="name" placeholder="请输入机构名称"/>
				</view>
				<!-- <view class="attestItem">
					<view>申请区域</view>
					<radio-group @change="bindPickerChange" class="flex-start flex1">
						<label v-for="(i,e) in array" :key="e" class="btn">
							<radio :value="''+e+''" :checked="index==e" color="#ff3333" /><text>{{i.title}}</text>
						</label>
					</radio-group>
				</view> -->
				<view class="attestItem">
					<view>地区</view>
					<input @click="choseSite" type="text" v-model="areadText" :disabled="true" placeholder="请选择地区">
				</view>
				<view class="attestItem">
					<view>详细地址</view>
					<input type="text" v-model="address" placeholder="请输入详细地址" />
				</view>
				<view class="attestItem">
					<view>联系电话</view>
					<input type="number" v-model="mobile" placeholder="请输入联系电话"/>
				</view>
				<view class="attestItem">
					<view>法人代表</view>
					<input type="text" v-model="legal" placeholder="请输入法人代表"/>
				</view>
				<view class="attestItem">
					<view>银行开户行</view>
					<input type="text" v-model="bank" placeholder="请输入银行开户行"/>
				</view>
				<view class="attestItem">
					<view>银行对公账户</view>
					<input type="number" v-model="bankNumber" placeholder="请输入对公账户"/>
				</view>
				<view class="attestItem">
					<view>营业执照</view>
					<view class="chooseImg" @click="chooseImage(0)">
						<image v-if="base64Img" :src="tempbase64Img" mode="aspectFit"></image>
						<block v-else>
							<text class="iconfont icon-fabu"></text>
							<view>上传营业执照</view>
						</block>
					</view>
				</view>
				<view class="attestItem">
					<view>流通许可证</view>
					<view class="chooseImg" @click="chooseImage(1)">
						<image v-if="base64Img1" :src="tempbase64Img1" mode="aspectFit"></image>
						<block v-else>
							<text class="iconfont icon-fabu"></text>
							<view>上传流通许可证</view>
						</block>
					</view>
				</view>
				<view class="attestItem">
					<view>检测报告</view>
					<view class="chooseImg" @click="chooseImage(2)">
						<image v-if="base64Img2" :src="tempbase64Img2" mode="aspectFit"></image>
						<block v-else>
							<text class="iconfont icon-fabu"></text>
							<view>上传检测报告</view>
						</block>
					</view>
				</view>
				<view class="attestItem">
					<view style="width: 100%;">补充资料<text class="c_999">（选填）</text></view>
					<view class="chooseImg" @click="chooseImage(3)">
						<image v-if="base64Img3" :src="tempbase64Img3" mode="aspectFit"></image>
						<block v-else>
							<text class="iconfont icon-fabu"></text>
							<view>上传补充资料</view>
						</block>
					</view>
				</view>
			</view>
			<view class="attestMoney">
				<view class="moneyLeft">
					<view class="icon">
						<text class="iconfont icon-yue"></text>
					</view>
					认证费用
				</view>
				<text class="moneyRight"  v-if="amount">￥{{amount}}</text>
				<text class="moneyRight"  v-else>免费</text>
			</view>
			<view class="defrayBtn" @click="submint('')">支付并提交</view>
			<mpvue-city-picker v-if="hasData" :province="province" :GradeId="array[index].type" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onconfirm="onconfirm" :themeColor="'#007aff'"></mpvue-city-picker>
		</block>
		<block v-else>
			<view class="auditbox">
				<view v-if="IsAudit==0">
					<text class="iconfont icon-shizhong"></text>
					<view>资料将在24小时内审核通过，请耐心等待</view>
				</view>
				<view v-if="IsAudit==1">
					<text class="iconfont icon-xiaoxi-chenggong"></text>
					<view>认证成功</view>
				</view>
				<view v-if="IsAudit==2">
					<text class="iconfont icon-shibai"></text>
					<view>认证失败</view>
					<text>{{AuditReason}}</text>
					<button @click="again">重新认证</button>
				</view>
			</view>
		</block>
		<!-- 支付弹窗 -->
		<uni-popup type="bottom" ref="payWin">
			<pay :total="amount" @onClose="$refs.payWin.close()" @success="paySuccess" 
			:orderNumber="orderNo" :payMode="['wx','balance']"></pay>
		</uni-popup>
	</view>
</template>

<script>
	// import areaList from '@/common/areaList.js';
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker1.vue'
	import {post,valPhone,valbankNo,IdNumber,debounce,getUrlParam,isWeixin,GetUrlRelativePath,permision} from '@/common/util.js'
	import {pathToBase64} from '@/common/image-tools.js'
	import pay from '@/components/paypop.vue';
	import {payFn} from './payvip';
	export default {
		data() {
			return {
				attestType:0,
				cityPickerValueDefault: [0, 0, 0],  //默认选中
				province:{},
				AreaCode:'',//地区代码
				AreaType:0,//0--默认按地区码，1--省不限市，市不限区
				areadText:'',
				name:'',//机构名称
				address:'',//详细地址
				mobile:'',//联系电话
				legal:'',//法人代表
				bank:'',//开户银行
				bankNumber:'',//银行对公账户
				account:'',//账号
				array:[{title:'省级',type:50},{title:'市级',type:30},{title:'区/县级',type:20}],
				index:0,
				base64Img:'',//资质
				base64Img1:'',//许可证
				base64Img2:'',//检测报告
				base64Img3:'',//补充资料
				userId:'',
				token:'',
				amount:'',
				amountType:false,
				IsAudit:9,
				AuditReason:'',
				Idcard:'',
				hasData:false,
				pickerText: '',  //选择的地址值
				pickerTextArr:[],
				code:"",  //地址code
				orderNo:'',
				tempbase64Img:'',
				tempbase64Img1:'',
				tempbase64Img2:'',
				tempbase64Img3:'',
				hasPayPassword:0,
				MemberWallet:0
			}
		},
		components:{
			mpvueCityPicker,pay
		},
		onShow(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.quanxian();
			this.GetMemInfo();
		},
		onLoad(e){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.AuthInfo()
			this.ShopAuthInfo()
			this.getShopArea()
		},
		methods: {
			// 判断是否已开启权限
			async quanxian() {
				let platform = uni.getSystemInfoSync()&&uni.getSystemInfoSync().platform;
				switch (uni.getSystemInfoSync().platform) {
					case 'android':
						var res = await permision.requestAndroidPermission('android.permission.WRITE_EXTERNAL_STORAGE');
						if(res == 1){//已经获取授权开始
							
						}else{
							uni.showToast({
								title: '请先开启相册权限',
								icon: 'none',
								success() {
									// permision.gotoAppPermissionSetting();
								}
							});
						}
						break;
			
					case 'ios':
						var iosresult = await permision.judgeIosPermission('camera');
						var iosres = await permision.judgeIosPermission('photoLibrary');
						if(iosresult&& iosres){//已经获取授权
							
						}else if ((!iosres)||(!iosresult)) {
							uni.showModal({  
								content: '请先开启相机和相册权限！',  
								confirmText: '设置',  
								success: res => {  
									if(res.confirm) {  
										plus.runtime.openURL('app-settings://')  
									} else {  
										uni.navigateBack({  
											delta: 1  
										})  
									}  
								}  
							}); 
						}
					break;
				}
			},
			//获取账户信息
			async GetMemInfo() {
				let result = await post("User/GetMemInfo", {
					UserId: uni.getStorageSync("userId"),
					Token: uni.getStorageSync("token"),
				})
				if (result.code == 0) {
					this.hasPayPassword=result.data.IsSetPayPwd;
					this.MemberWallet=result.data.Wallet;
				}
			},
			choseSite(){
				this.index = 2;
				this.cityPickerValueDefault=[0,0,0]
				this.areadText=""
				this.getShopArea()
			  this.$refs.mpvueCityPicker.show();
			},
			onconfirm(code) {
				console.log(code,"}}}}}}}}}")
				this.provincesCode=code[0];
				this.AreaCode=code[this.index];
				this.areadText=code[3];
				this.pickerTextArr = code[3].split(' ');
				console.log(this.AreaCode)
			},
			// 重新认证
			again(){
				this.IsAudit=9
			},
			// 获取可认证区域
			async getShopArea(){
				this.province = await post('User/GetShopArea',{
					GradeId:this.array[this.index].type,
					Types:'Province'
				})
				this.hasData=true;
				// this.areaList=res.data
			},
			// 获取审核状态
			async ShopAuthInfo(){
				let res = await post('User/ShopAuthInfo',{
					UserId:this.userId,
					Token:this.token,
					IsBusiness:1
				})
				if(res.code==0 && res.data.Id!=0){
					this.IsAudit=res.data.IsAudit;
					this.name=res.data.Name;
				}
			},
			async AuthInfo(){
				let res = await post('User/AuthInfo',{
					UserId:this.userId,
					Token:this.token,
					//GradeId:this.array[this.index].type
				})
				if(res.code==0&&res.data.length>0){
					this.amount=res.data[0].CertFee
				}
			},

			bindPickerChange: function(e) {
				// console.log(e)
			    this.index = e.detail.value;
				this.cityPickerValueDefault=[0,0,0]
				this.areadText=""
				this.AuthInfo()
				this.getShopArea()
			},
			// 上传图片
			async chooseImage(type){
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    success:async (res)=> {
						let base64=await pathToBase64(res.tempFilePaths[0])
						if(type==0){//身份证正面
							this.tempbase64Img=res.tempFilePaths[0];
							this.base64Img=base64
						}else if(type==1){//许可证
							this.tempbase64Img1=res.tempFilePaths[0];
							this.base64Img1=base64
						}else if(type==2){//报告
							this.tempbase64Img2=res.tempFilePaths[0];
							this.base64Img2=base64
						}else{
							this.tempbase64Img3=res.tempFilePaths[0];
							this.base64Img3=base64
						}
				    }
				});
			},
			//打开支付窗口
			submint(ispwd,isPayWallet){
				debounce(()=>{
					if(this.valInfo()){
						this.openPay(ispwd,isPayWallet)
					}
				})
			},
			async openPay(ispwd,isPayWallet){
				//e.id= 0--微信支付.1--余额支付,2--支付宝
				let AuthObj={
					UserId:this.userId,
					Token:this.token,
					//GradeId:this.array[this.index].type,
					AreaCode:this.AreaCode,
					Name:this.name,
					Address:this.address,
					Phone:this.mobile,
					BankAddress:this.bank,
					BankCardNo:this.bankNumber,
					LegalPerson:this.legal,
					BusinessLicense:this.base64Img,
					Licence:this.base64Img1,
					TestReport:this.base64Img2,
					ReplenishInfo:this.base64Img3,
					IsPayWallet:isPayWallet,
					Password:ispwd,
					IsBusiness:1
				}
				let res = await post('User/ShopAuth',AuthObj)
				if(res.code==0){
					console.log(res)
					this.amount=res.data.CertFee
					this.amountType=true
					this.orderNo=res.data.OrderNo;
					if(!ispwd){
						setTimeout(()=>{
							this.$refs.payWin.open();
						},500)
					}
					if(isPayWallet){
						this.$refs.payWin.close();
					}
				}else if(res.code==200){
					this.$refs.payWin.close();
					this.ShopAuthInfo()
				}
			},
			async paySuccess(e,payPassword){
				if(e.id==1&&!this.hasPayPassword){
					//#ifndef APP-PLUS
					uni.showModal({
						content: "您还没有设置支付密码，去设置？",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url:"/pages/other/ChangepayPwd/ChangepayPwd?nopwd=1"
								})
							} else if (res.cancel) {
							}
						}
					});
					//#endif
					//#ifdef APP-PLUS
					this.$showModal({
						content: "您还没有设置支付密码，去设置？",
					}).then(res=>{
						uni.redirectTo({
							url:"/pages/other/ChangepayPwd/ChangepayPwd?nopwd=1"
						})
						//确认
					  }).catch(res=>{
						//取消
					  })
					//#endif
					return false
				}
				// #ifdef H5
				if(e.id==0){//微信
					//this.payweixin(this.orderNo)
				}else if(e.id==1){//余额
					this.submint(payPassword,1)
				}
				else{
					payFn(e,{
						attestType:this.attestType,
						orderNo:this.orderNo,
						TotalPrice:this.amount,
						payPassword
					})
				}
				// #endif
				// #ifndef H5
				if(e.id==1){
					this.submint(payPassword,1)
				}
				else{
					payFn(e,{
						attestType:this.attestType,
						orderNo:this.orderNo,
						TotalPrice:this.amount,
						payPassword
					})
				}
				// #endif
			},
			//微信公众号支付  微信自带浏览器的h5支付
				async payweixin(orderNo) {
				     let NewUrl=GetUrlRelativePath() +'/#/pages/other/attest/attest?type='+params.attestType;
					 let result = await post("User/WeiXinPlus", {
				        UserId: uni.getStorageSync('userId'),
				        Token: uni.getStorageSync('token'),
				        orderNo:orderNo,
				        NewUrl:NewUrl,//支付后的回调地址
				        WxCode:this.WxCode,
				        WxOpenid:this.WxOpenid,
				        paytype:0
				    })
				    if (result.code == 201) { //检测不到openid需要进行微信授权
				        window.location.href=result.data;
				    }else if(result.code == 0){console.log(result.data)
				        uni.setStorageSync('openId', result.data.openid);
				        this.WxOpenid = uni.getStorageSync("openId");
				        if(this.WxOpenid!=""&&this.WxOpenid!="undefined"){
				            this.WxCode="";//每次获取的code只能使用一次，有openid时用openid调起支付数据
				        }
				        this.callpay(result.data.JsParam);
				    }else {
				        uni.showToast({
				            title: result.msg,
				            icon: "none",
				            duration: 1500
				        });
				    }
				},
				//微信公众号支付
				callpay(param) {
					if(typeof WeixinJSBridge === 'undefined') {
						if(document.addEventListener) {
							document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(), false);
						} else if(document.attachEvent) {
							document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady());
							document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady());
						}
					} else {
						this.onBridgeReady(param);
					}
				},
				onBridgeReady(param){
					var _this=this;
					var parameter = JSON.parse(param);
					WeixinJSBridge.invoke(
						'getBrandWCPayRequest', parameter,
						function(res){
						if(res.err_msg == "get_brand_wcpay_request:ok" ){
						// 使用以上方式判断前端返回,微信团队郑重提示：
						//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
							setTimeout(()=>{
								uni.navigateBack();
							},1500)
						}else{
							uni.showToast({
								title: "支付失败",
								icon: "none",
								duration: 1500
							});
						} 
					}); 
				},
			//信息校验
			valInfo(){
				if(!this.name) {
					uni.showToast({
					  title: "请输入名称!",
					  icon: "none",
					  duration: 2000
					});
					return false;
				}
				if(!valPhone(this.mobile)) {
					return false;
				}
				if(!this.areadText) {
					uni.showToast({
					  title: "请选择地区!",
					  icon: "none",
					  duration: 2000
					});
					return false;
				}
				if(!this.address) {
					uni.showToast({
					  title: "请输入详细地址!",
					  icon: "none",
					  duration: 2000
					});
					return false;
				}
				if(!this.legal) {
					uni.showToast({
					  title: "请输入法人代表!",
					  icon: "none",
					  duration: 2000
					});
					return false;
				}
				if(!this.bank) {
					uni.showToast({
					  title: "请输入银行开户行!",
					  icon: "none",
					  duration: 2000
					});
					return false;
				}
				if(!valbankNo(this.bankNumber)) {
					return false;
				}
				if(!this.base64Img) {
					uni.showToast({
					  title: "请上传营业执照!",
					  icon: "none",
					  duration: 2000
					});
					return false;
				}
				if(!this.base64Img1) {
					uni.showToast({
					  title: "请上传流通许可证!",
					  icon: "none",
					  duration: 2000
					});
					return false;
				}
				if(!this.base64Img2) {
					uni.showToast({
					  title: "请上传检测报告!",
					  icon: "none",
					  duration: 2000
					});
					return false;
				}
				return true;
			}
		}
	}
</script>

<style lang="scss" scoped>
.attest{
	background-color: #fff;
	// margin-top: 20rpx;
	border-top: 20rpx solid #f6f6f6;
	padding: 0 30rpx 40rpx 30rpx;
	.attestItem{
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		min-height: 90rpx;
		border-bottom: 1rpx solid #ececec;
		.btn{
			margin-right: 20upx;
			display: flex;
			align-items: center;
			justify-content: center;
			&:last-of-type{
				margin-right: 0;
				padding-right: 0;
			}
		}
		input{
			flex: 1;
			width: 100%;
		}
		&:last-of-type{
			border: none;
		}
		view{
			width: 30%;
			height: 90rpx;
			line-height: 90rpx;
		}
		.chooseImg{
			width: 100%;
			height: 350rpx;
			border: 1px dashed #cccccc;
			border-radius: 10rpx;
			// display: flex;
			// flex-wrap: wrap;
			// align-items: center;
			// justify-content: center;
			text{
				display: inline-block;
				width: 100%;
				font-size: 60rpx;
				color: #cccccc;
				text-align: center;
				height: 45rpx;
				line-height: 300rpx;
			}
			image{
				width: 100%;
				height: 100%;
			}
			view{
				width: 100%;
				height: 45rpx;
				line-height: 45rpx;
				text-align: center;
				color: #ccc;
			}
		}
		input{
			font-size: 28rpx;
		}
	}
}
.attestMoney{
	margin-top: 20rpx;
	height: 140rpx;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30rpx;
	.moneyLeft{
		display: flex;
		align-items: center;
		.icon{
			background-color: #ffc405;
			border-radius: 100%;
			height: 80rpx;
			width: 80rpx;
			text-align: center;
			line-height: 80rpx;
			margin-right: 20rpx;
			text{
				color: #fff;
				font-size: 46rpx;
			}
		}
	}
	.moneyRight{
		color: #f00;
	}
}
.defrayBtn{
	margin: 60rpx 30rpx;
	background-color: #FF3333;
	color: #fff;
	font-size: 32rpx;
	border-radius: 10rpx;
	height: 90rpx;
	text-align: center;
	line-height: 90rpx;
}
picker{
	flex: 1;
	height: 90rpx;
	line-height: 90rpx;
	padding: 0;
}
.auditbox{
	min-height: 445rpx;
	margin-top: 20rpx;
	background-color: #fff;
	padding-bottom: 20rpx;
	view{
		text-align: center;
		font-size: 36rpx;
		font-weight: 600;
	}
	text{
		font-size: 28rpx;
		color: #999;
		font-weight: 100;
	}
	.icon-shizhong{
		font-size: 175rpx;

		color: #ffaa00;
	}
	.icon-xiaoxi-chenggong{
		font-size: 175rpx;
	
		color: #ffaa00;
	}
	.icon-shibai{
		font-size: 160rpx;

		color: #ff3434;
	}
	button{
		height: 90rpx;
		width: 520rpx;
		border-radius: 40rpx;
		margin: 20rpx auto;
		border: 1rpx solid #FF3333;
		color: #FF3333;
		font-size: 32rpx;
		text-align: center;
		line-height: 90rpx;
		background-color: #fff;
	}
}
</style>
