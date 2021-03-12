<template>
	<view class="common-part">
        <view class="common-dialog pay-dialog">
            <text class="dialog-title">请输入支付密码</text>
            <text class="pay-money">￥{{allprice}}</text>
            <view class="pay-password">
				<input type="number" maxlength="6" class="real-ipt" v-model="Password" :focus="true">
                <view class="surface-ipts">
                    <view class="surface-ipt">
                        <input type="password" class="surface-input" disabled v-model="PasswordArr[0]">
                        <input type="password" class="surface-input" disabled v-model="PasswordArr[1]">
                        <input type="password" class="surface-input" disabled v-model="PasswordArr[2]">
                        <input type="password" class="surface-input" disabled v-model="PasswordArr[3]">
                        <input type="password" class="surface-input" disabled v-model="PasswordArr[4]">
                        <input type="password" class="surface-input" disabled v-model="PasswordArr[5]">
					 </view>
                </view>
            </view>
            <view class="btns">
                <text class="cancel-btn" @click="hide">取消</text>
                <text class="confirm-btn" @click="paybtn">付款</text>
            </view>
        </view>
    </view>
</template>

<script>
	export default {
		props:{
			allprice:{
				type: String,
				default: "0.00"
			},
			isJifen:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				Password:"",//密码
				PasswordArr:[],//密码数组
			};
		},
		watch: {
			Password(newVal) {
				console.log(newVal)
				this.PasswordArr=newVal.split("");
				if(this.PasswordArr[0]==undefined){//app兼容
					this.PasswordArr[0]=''
				}else if(this.PasswordArr[1]==undefined){
					this.PasswordArr[1]=''
				}else if(this.PasswordArr[2]==undefined){
					this.PasswordArr[2]=''
				}else if(this.PasswordArr[3]==undefined){
					this.PasswordArr[3]=''
				}else if(this.PasswordArr[4]==undefined){
					this.PasswordArr[4]=''
				}else if(this.PasswordArr[5]==undefined){
					this.PasswordArr[5]=''
				}
			},
			allprice(newVal) {
				console.log(newVal)
			},
		},
		methods:{
			hide(){
				this.$emit('hidePay',1);//关闭弹窗
			},
			paybtn(){
				if(this.PasswordArr.length===6){
					this.$emit('hidePay',0);
					this.$emit('getPassword',this.Password);
				}else{
					uni.showToast({
						title: "请输入支付密码！",
						icon: "none",
						duration: 1500
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.common-part{
 //    position: fixed;
 //    width: 100%;
 //    height: 100%;
 //    top: 0;
	// z-index: 18;
 //    background: rgba(0,0,0,0.4);
	// display: flex;
	// justify-content: center;
	// align-items: center;
}
.common-dialog{
    width: 680upx;
    text-align: center;
    background-color: #ffffff;
    border-radius: 12upx;
	// border-style:solid;
	// border-width:1upx;
	// border-color:#f2f2f2;
}
.dialog-title{
    height: 120upx;
    line-height: 100upx;
    color: #333333;
    font-size: 35upx;
	text-align:center;
    // border-bottom: 1px solid #f2f2f2;
	border-style:solid;
	border-bottom-width:2upx;
	border-color:#f2f2f2;
}
.pay-money{
    color: #333333;
    font-size: 50upx;
    margin: 40upx 0;
    font-weight: bold;
	text-align:center;
}
.pay-password{
    width: 600upx;
    height: 102upx;
	border-style:solid;
	border-width:1upx;
	border-color:#999;
	border-right: none;
    margin: 0 40upx;
    position: relative;
}

.real-ipt{
    position: absolute;
    top: 0;
    right: 0;
    width: 150%;
    height: 100upx;
    opacity: 0;
    z-index: 3;
	background-color: rgba(0,0,0,0);
	border-width:none;
	box-sizing: border-box;
	font-size: 1upx;
	color: transparent;
	text-align: left;
}
.pay-password /deep/ .real-ipt input{ color: transparent;}
.surface-ipts{
    position: absolute;
    top: 0;
    left: 0;
    width: 600upx;
    height: 100upx;
    z-index: 1;
	opacity: 1;
    overflow: hidden;
}
.surface-ipt{
    width: 600upx;
    height: 100upx;
    line-height: 100upx;
    display: flex;
	flex-direction:row;
    justify-content: space-between;
}
.surface-input{
    width: 100upx;
    height: 100upx;
    line-height: 100upx;
    border-width: 0;
    // border-right: 1upx solid #999999;
	border-right-width:1upx;
	border-style:solid;
	border-color:#999;
    color: #333333;
    font-size: 80upx;
    text-align: center;
    padding: 0;
}
/* #ifdef MP-WEIXIN */
.pay-password .surface-ipts .surface-ipt input{
    width: 100upx;
    height: 100upx;
    line-height: 100upx;
    border: 0;
    border-right: 1upx solid #999999;
    color: #333333;
    font-size: 40upx;
    text-align: center;
    padding: 0;
}
/* #endif */
.btns{
	margin-top: 60upx;
	margin-bottom: 80upx;
	display: flex;
	flex-direction:row;
	justify-content: space-around;
	align-items: center;
}
.cancel-btn{
    width: 240upx;
    height: 100upx;
    line-height: 100upx;
    color: $primary;
    font-size: 40upx;
    /* border: #2AA8E1 1upx solid; */
	border: #fff;
	text-align:center;
	background-color: #f2f2f2;
}
.confirm-btn{
    width: 240upx;
    height: 100upx;
    line-height: 100upx;
    background-size: 100%;
    color: #ffffff;
    font-size: 40upx;
	background-color: $primary;
	text-align:center;
}
</style>
