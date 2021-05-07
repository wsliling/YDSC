<template>
  <div class="page">
    <div class="weui-cells card__weui-cells">
      <div class="weui-cell"  @click.stop="showSelbankCard">
        <img :src="bankLogo||'http://yd.wtanvxin.com/static/bankcard.png'" class="cardpic" alt>
        <div class="weui-cell__bd" v-if="hasData">
          <p class="name">{{bankCardName}}</p>
          <p class="cardnnum">尾号{{bankCardNo}}储蓄卡</p>
        </div>
        <div class="weui-cell__bd" v-else>
          <p class="name">请选择银行卡</p>
        </div>
        <span class="iconfont icon-arrow_r"></span>
      </div>
    </div>
    <div class="widthdrawBox bg_fff mt10">
      <div class="charge">
        <p class="apoint" style="padding-top:20upx;">提现金额</p>
        <p class="flex flexAlignCenter" style="padding-top:10upx;padding-bottom:20upx;">
          <span class="fh">￥</span>
          <input v-model="amount" type="digit" @input="checkPrice" class="inputPrice flex1">
        </p>
      </div>
      <div class="tips" style="padding:20upx 0;border-top:1px solid #f2f2f2;">
		 <!-- {{wType==3?`可提现余额：${userInfo.Wallet}`:`可提现喜币：${userInfo.Wallet*10} (¥${userInfo.Wallet})`}} -->
		  可提现金额：￥{{Wallet}}
        <span class="red" style="margin-left: 20rpx;" v-if="Wallet>0" @click="Allwithdraw">全部提现</span>
      </div>
	 <!-- <div class="tips" style="padding:20upx 0;border-top:1px solid #f2f2f2;" v-else>
		  可提现佣金：{{Wallet}}
		  <span class="red" style="margin-left: 20rpx;" v-if="Wallet>0" @click="Allwithdraw">全部提现</span>
	  </div> -->
    </div>
    <div class="btns">
      <div class="btn boxSize bg_ff952e color_fff center" @click="submitWithdraw">确认提现</div>
    </div>
	<view class="mask" v-if="showselbox" @click.stop="showSelbankCard">
		
	</view>
	<view class="selbankCard" v-if="showselbox">
		<view class="selBoxTitle">
			<text class="iconfont icon-arrow" @click.stop="showSelbankCard"></text>
			<view>选择到账银行卡</view>
		</view>
		<view class="bankCardList">
			<view class="listItem" v-for="(item,index) in bankList" :key="index" @click="getcardId(item.Id,index)">
				<view class="listLeft" >
					<image :src="item.BankLogo||'http://yd.wtanvxin.com/static/bankcard.png'"></image>
					<view>{{item.BankName}}({{item.BankCardNo.substring(item.BankCardNo.length-4)}})</view>
				</view>
				<view class="listRight " :class="bankCardId==item.Id?'active':''">
					<text class="iconfont icon-gou1"></text>
				</view>
			</view>
		</view>
		<view class="addBankCard" @click="golink('/pages/Wallet/bankList/bankList')">
			<view>
				<text class="iconfont icon-jia"></text>
				添加新卡提现
			</view>
			<view>
				<text class="iconfont icon-arrow_r"></text>
			</view>
		</view>
	</view>
  </div>
</template>
<script>
import { post} from "@/common/util.js";
export default {
  onLoad(e) {
	  // #ifdef APP-PLUS
	  this.wType=e.type||0;
	  // #endif
	  
  },
  onShow() {
    // this.Wallet = this.$store.state.Wallet;
	// #ifndef APP-PLUS
	this.wType=this.$root.$mp.query.type||0;
	// #endif
	// if(this.wType==3){
	// 	uni.setNavigationBarTitle({
	// 	  title: "提现"
	// 	}); 
	// }else if(this.wType==2){
	// 	uni.setNavigationBarTitle({
	// 	  title: "提现喜币"
	// 	}); 
	// }else if(this.wType==1){
	// 	uni.setNavigationBarTitle({
	// 	  title: "佣金提现"
	// 	}); 
	// }
    this.amount = '';
    //  console.log("余额"+this.Wallet);
	// if(this.$store.state.myCardInfo.id){
	// 	this.hasData = true
	// 	this.bankCardId = this.$store.state.myCardInfo.id;
	// 	this.bankLogo = this.$store.state.myCardInfo.bankLogo;
	// 	this.bankCardName = this.$store.state.myCardInfo.bankCardName;
	// 	this.bankCardNo = this.$store.state.myCardInfo.bankCardNo.substring(
	// 	  this.$store.state.myCardInfo.bankCardNo.length - 4,
	// 	  this.$store.state.myCardInfo.bankCardNo.length
	// 	);
	// }
   
    this.userId = uni.getStorageSync("userId");
    this.token = uni.getStorageSync("token");
	// console.log(this.$store.state.selectMyCard.status,"this.$store.state.selectMyCard.status")
	this.getBankList();
	this.getUserInfo()
     //获取提现的限制条件
    this.getLimitationOfWithdrawal()
     
  },
  data() {
    return {
      Wallet:0,//可提现金额
      userId: "",
      token: "",
	  wType:0,//提现类型，3余额，1佣金 2喜币
      hasData: false,
      bankCardId: "",
      bankLogo: "",
      bankCardName: "",
      bankCardNo: "",
      hasDefaultCard: false,
      amount: "" ,//提现的金额
      MinWithdrawal:'',	//每次提现最小额度
      MaxWithdrawal:'',	//每次提现最大额度
      WithdrawalFee:'',	//提现手续费百分比（100为顶）
      CashWithdrawalTime:'',	//提现审核时间（单位：小时）
      DayWithdrawalMaxNum:'',	//会员每日提现最大次数
      DaySurplusNum:'',//当天剩余提现次数
	  showselbox:false,
	  userInfo:[],
	  bankList:[]
    };
  },
  methods: {
	  // 监听是否打开银行卡选择
	  showSelbankCard(){
	  	this.showselbox=!this.showselbox
	  },
	  golink(url){
	  	console.log(url)
	  	uni.navigateTo({url:url})
	  },
    //获取提现限制条件
    getLimitationOfWithdrawal(){
      post('DrawMoney/LimitationOfWithdrawal',{
          UserId: this.userId,
          Token: this.token
      }).then(res=>{
          // console.log(res)
          this.MinWithdrawal =res.data.MinWithdrawal //每次提现最小额度
          this.MaxWithdrawal =res.data.MaxWithdrawal  //每次提现最大额度
          this.WithdrawalFee =res.data.WithdrawalFee //提现手续费百分比（100为顶）
          this.CashWithdrawalTime =res.data.CashWithdrawalTime //提现审核时间（单位：小时）
          this.DayWithdrawalMaxNum =res.data.DayWithdrawalMaxNum	//会员每日提现最大次数
          this.DaySurplusNum = res.data.DaySurplusNum//当天剩余提现次数
      })
    },
    shiftCardList() {
      this.hasDefaultCard = false;
	  console.log(this.hasDefaultCard,"shiftCardList")
      this.$store.commit("setSelectMyCard", {
        url: "/pages/other/withdraw/withdraw?type="+this.type,
        status: true
      });
      uni.redirectTo({ url: "/pages/Wallet/bankCard/bankCard" });
    },
	checkPrice(e){
		this.$nextTick(() => {
		  let val = e.target.value.toString();
		  val=val.replace(/^\D*(\d*(?:\.\d{0,1})?).*$/g, '$1');	//保留1位小数	 
		 this.amount=val
		});
	},
    valOther() {
      let price = Number(this.amount);
	  if(price == ''){
		  uni.showToast({
		  	title:"请输入提现金额！",
			icon: "none",
			duration: 1500
		  })
		   return false;
	  }
      if (price < this.MinWithdrawal) {
        uni.showToast({
          title: `最低提现金额为${this.MinWithdrawal}元!`,
          icon: "none",
          duration: 1500
        });
        return false;
      }
      if (this.MaxWithdrawal>0 && price > this.MaxWithdrawal) {
        uni.showToast({
          title: `最高提现金额为${this.MaxWithdrawal}元!`,
          icon: "none",
          duration: 1500
        });
        return false;
      }
      if (!this.bankCardId) {
        uni.showToast({
          title: "请选择提现的银行卡!",
          icon: "none",
          duration: 1500
        });
        return false;
      }
      if (this.DaySurplusNum<=0) {
        uni.showToast({
          title: "今日提现次数已使用完！",
          icon: "none",
          duration: 1500
        });
        return false;
      }
      return true;
    },
    submitWithdraw() {
      //提现
      if (this.valOther()) {
		this.DrawMoneyApply();//佣金提现
      }
    },
   getcardId(id,index){
	   this.bankCardId=id
	   this.bankLogo = this.bankList[index].BankLogo;
	   this.bankCardName = this.bankList[index].BankName;
	   this.bankCardNo = this.bankList[index].BankCardNo.substring(
	     this.bankList[index].BankCardNo.length - 4,
	     this.bankList[index].BankCardNo.length
	   );
	   this.showselbox=false
   },
    getBankList() {
      //获取银行卡
      let that = this;
      post(
        "Bank/BankList",
        {
          UserId: that.userId,
          Token: that.token
        }).then(result => {
        if (result.code === 0) {
          if (result.data.length > 0) {
            that.hasData = true
			that.bankList=result.data
            that.bankCardId = result.data[0].Id;
            that.bankLogo = result.data[0].BankLogo;
            that.bankCardName = result.data[0].BankName;
            that.bankCardNo = result.data[0].BankCardNo.substring(
              result.data[0].BankCardNo.length - 4,
              result.data[0].BankCardNo.length
            );
          }
        }
      });
    },
    Allwithdraw(){
      this.amount=this.Wallet;
    },
	async getUserInfo(){
		// if(this.wType!=1){
		// 	let res = await post('User/GetMemInfo',{
		// 		UserId:this.userId,
		// 		Token:this.token
		// 	})
		// 	if(res.code==0){
		// 		this.userInfo=res.data
		// 	}
		// }else{
			let res = await post('Recharge/IncomeDetailsTZ',{
				UserId:this.userId,
				Token:this.token
			})
			if(res.code==0){
				this.Wallet=res.data.KTAmount
			}
		// }
	},
	//佣金提现
    DrawMoneyApply() {
      let that = this;
	  let objUrl = ''
	   // if(this.wType==1){
		  //  objUrl = 'DrawMoney/memberDrawMoneyApply'
	   // }else{
		  //  objUrl = 'DrawMoney/memberDrawMoneyApply123'
	   // }
      post(
        'DrawMoney/memberDrawMoneyApply123',
        {
          UserId: that.userId,
          Token: that.token,
          Amount: that.amount,
          BankId: that.bankCardId
        }).then(result => {
        if (result.code === 0) {
          //提现成功
          uni.showToast({
            title: "申请成功！",
            icon: "none",
            duration: 1500,
            success: function() {
              setTimeout(function() {
                // uni.redirectTo({
                //   url: "/pages/tabBar/my/wallet"
                // });
				uni.navigateBack()
              }, 1500);
            }
          });
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.cardpic {
  width: 58upx;
  height: 58upx;
  margin-right: 10upx;
}
.widthdrawBox{
  padding:0 30upx;
}
.card__weui-cells{
  .weui-cell{
    line-height: 1.5;
	margin-bottom: 20rpx;
  }
}
.cardnnum{
  font-size: 24upx;
  color: #999;
}
.charge {
  .apoint {
    padding: 10upx 0;
    font-size: 30upx;
  }
  input {
    /* flex-grow: 1; */
    margin-left: 20upx;
  }
}

.tips {
  color: #999;
}
.fh{
  font-size: 32upx;
}
.inputPrice {
  margin-left: 0 !important;
  font-size: 50upx;
}
.btns{
	margin: 0 30rpx;
	height:88upx;line-height: 88upx;color:#ffffff;
	margin-top:60upx;
  .btn{
	  height:88upx;line-height: 88upx;
    border-radius: 16upx;margin:0 auto;
  }
  .bg_ff952e{
    background: #ff3333;
  }
}
.selbankCard{
	background-color: #fff;
	height: 50vh;
	width: 100%;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 100;
	.selBoxTitle{
		position: relative;
		padding: 30rpx 0;
		margin: 0 30rpx;
		border-bottom: 1rpx solid #dedede;
		text{
			position: absolute;
			left: 0rpx;
			top: 30rpx;
		}
		view{
			text-align: center;
			font-size: 32rpx;
			font-weight: 600;
		}
	}
	.bankCardList{
		margin: 0 30rpx;
		max-height: 360rpx;
		overflow: auto;
		.listItem{
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #dedede;
			.listLeft{
				display: flex;
				align-items: center;
			}
			image{
				width: 40rpx;
				height: 40rpx;
				margin-right:10rpx;
			}
			.listRight{
				color: #fff;
				box-sizing: border-box;
				border-radius: 100%;
				width: 40rpx;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				border:1rpx solid #dedede;
				margin-right: 10rpx;
				&.active{
					background-color: #FF3333;
					border-color: #FF3333;
				}
			}
		}
		
	}
	.addBankCard{
		display: flex;
		margin: 0 30rpx;
		height: 120rpx;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #dedede;
		text{
			margin-right: 10rpx;
		}
	}
}
</style>