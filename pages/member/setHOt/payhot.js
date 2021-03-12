import {post,toast,navigateBack} from '@/common/util'
let disable = false;
let payType=null;//支付类型0--微信支付，1--余额支付，2--支付宝
let params={}; //参数
// params={
//     orderNo；订单号
//     WxCode
//     WxOpenid
//     TotalPrice;总价
//     payPassword;支付密码
// }
let apiwxurl='Order/WechatPayHotTime',
	apialiurl='Order/HotTimeAliPay';
export function payFn(type,param={}){
    payType = type.id;
    params = param;
	console.log("disable",disable)
    if(!disable){
        disable = true;
        console.log(payType,'支付方式')
        if(payType==0){//微信支付
            // #ifdef  H5
            if(isWeixin()){
               
            }else{
               
            }
            // #endif
            // #ifdef  MP-WEIXIN
            ConfirmWeiXinSmallPay()
            // #endif
            // #ifdef APP-PLUS
            appwxpay()
            // #endif
        }else if(payType==2){//支付宝支付
            // #ifdef APP-PLUS
            zfbapppay()
            // #endif
            // #ifdef H5
            if(isWeixin()){
                uni.showToast({
                    title:"微信暂不支持支付宝支付，请在浏览器中打开！",
                    icon:"none",
                    duration:2500
                })
            }else{
                
            }
            // #endif
        }else if(payType==1){//余额
            
        }
    }
}

//app微信支付
async function appwxpay() {
	disable = false;
    let result = await post(apiwxurl, {
        UserId: uni.getStorageSync('userId'),
        Token: uni.getStorageSync('token'),
        orderNo:params.orderNo,
        paytype:2
    })
	console.log(result)
    if(result.code==0){
        // var payData=JSON.parse(result.data.JsParam)
        uni.requestPayment({
          provider:"wxpay",
          orderInfo:result.data.JsParam,
          success(res) {
              console.log(res)
			  uni.showToast({
			      title:res.msg,
			    icon:"none"
			  })
              uni.redirectTo({
                url: "/pages/member/setHOt/setSuccess"
              })
            },
          fail(err) {console.log(err)
              uni.showToast({
                  title:"支付失败",
                icon:"none",
                duration:4000
              })
          }
        })
    }else {
        uni.showToast({
            title: result.msg,
            icon: "none",
            duration: 1500
        });
    }
}

//支付宝app支付
async function zfbapppay() {
	disable = false;
	console.log(params.attestType,6666666666666)
    let result = await post(apialiurl, {
        UserId: uni.getStorageSync('userId'),
        Token: uni.getStorageSync('token'),
        orderNo:params.orderNo,
        paytype:2
    });
	console.log(result)
    if(result.code==0){
		console.log(result.data)
        // var payData=JSON.parse(result.data.JsParam)
        let _this=this;
        uni.requestPayment({
          provider:"alipay",
          orderInfo:result.data,
          success(res) {
              console.log(res)
              // _this.type = "";
              //   _this.showPay=false;
                uni.showToast({
                    title:res.msg,
                  icon:"none"
                })
                uni.redirectTo({
                  url: "/pages/member/setHOt/setSuccess"
                })
            },
          fail(err) {console.log(err)
              uni.showToast({
              	title:"支付失败",
                icon:"none",
                duration:4000
              })
          }
        })
    }else {
        uni.showToast({
            title: result.msg,
            icon: "none",
            duration: 1500
        });
    }
}

//小程序支付
async function ConfirmWeiXinSmallPay(){
		disable = false;
        let result= await post(apiwxurl,{
            UserId: uni.getStorageSync('userId'),
            Token: uni.getStorageSync('token'),
            OrderNo: params.orderNo,
            WxCode: params.WxCode,
            WxOpenid:params.WxOpenid,
            paytype:4
        });
        var payData=JSON.parse(result.data.JsParam)
        if(result.code===0){
        uni.requestPayment({
            timeStamp: payData.timeStamp,
            nonceStr: payData.nonceStr,
            package: payData.package,
            signType: payData.signType,
            paySign: payData.paySign,
            success(res) {
                // _this.type = "";
                // _this.showPay=false;
                uni.showToast({
                    title:res.msg,
                  icon:"none"
                })
                uni.redirectTo({
                  url: "/pages/member/setHOt/setSuccess"
                })
            },
            fail(res) {}
        })
        }
}

// 判断浏览器环境
function isWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    // 判断是否为微信浏览器
    if (ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}
function GetUrlRelativePath() {
    var urlStr = '';　　　　
    var url = document.location.toString();　　　　
    var arrUrl = url.split("//");　　　　
    var start = arrUrl[1].split("/");
    urlStr = arrUrl[0] + '//' + start[0];　　　　
    return urlStr;　　
}
function callpay(param) {
    if(typeof WeixinJSBridge === 'undefined') {
        if(document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady(), false);
        } else if(document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady());
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady());
        }
    } else {
        onBridgeReady(param);
    }
}
function onBridgeReady(param){
    var parameter = JSON.parse(param);
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', parameter,
        function(res){
        if(res.err_msg == "get_brand_wcpay_request:ok" ){
        // 使用以上方式判断前端返回,微信团队郑重提示：
        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          uni.redirectTo({
            url: "/pages/other/attest/attest?type="+params.attestType
          })
        }else{
            uni.showToast({
                title: "支付失败",
                icon: "none",
                duration: 1500
            });
        } 
    }); 
}