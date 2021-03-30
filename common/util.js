


const host = 'http://yxapi.wtvxin.com/api/';  //测试接口地址
const webUrl = 'http://yx.wtvxin.com';
const wssPath = 'wss://yxapi.wtvxin.com/WebSocketServer.ashx';  //wss接口地址
const wssHost = 'ws://yxapi.wtvxin.com';  //wss接口地址

// const host = 'https://api.yixijiu19.com/api/';  //正试接口地址
// const webUrl = 'http://xcx.yixijiu19.com';
// const wssPath = 'wss://api.yixijiu19.com/WebSocketServer.ashx';  //wss接口地址
// const wssHost = 'ws://api.yixijiu19.com';  //wss接口地址
const dowmappURL='http://xcx.yixijiu19.com/down/android116.apk';//app下载地址安卓
const dowmappURLios='';//app下载地址ios
function formatNumber(n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}
function formatTime(date) {
	date = new Date(date);
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	const t1 = [year, month, day].map(formatNumber).join('/')
	const t2 = [hour, minute, second].map(formatNumber).join(':')
	return `${t1} ${t2}`
}
// 秒格式化 00:00 格式
function formatSecond(second){
	var sec = second % 60;
	var min = Math.floor(second / 60);
	if(min.toString().length < 2){
		min = '0' + min;
	}
	if(sec.toString().length < 2){
		sec = '0' + sec;
	}
	return min + ':' + sec
}
function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function (milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function (dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function (number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '-' + _format(date.getMonth() + 1) + '-' + _format(date.getDate()) + ' ' +
			_format(date.getHours()) + ':' + _format(date.getMinutes())+':'+_format(date.getSeconds());
	},
	parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};
export function G_show_modal(op={}){
	return new Promise((resolve, reject)=>{
	   let ssm=new sj_show_modal({
			...op,
			$event:function(e){
				if(e.res){
					resolve(e);
				}else{
					reject(e);
				}
			 }
			})
			ssm.show();
	})
}
// 判断是否登录了
function toLogin() { 
  const userId = uni.getStorageSync('userId');
  const token = uni.getStorageSync('token');
  if(userId && token){
    return true;
  }else{
	  // #ifdef APP-PLUS
	  G_show_modal({
	  	title:'登录提示',
	  	content: "您还没有登录，是否重新登录？",
	  }).then(res=>{
			 uni.navigateTo({
				url: "/pages/login/login"
			 })
	    }).catch(res=>{
	  	//取消
	    })
	  // #endif
	  // #ifndef APP-PLUS
		uni.showModal({
			title:'登录提示',
			content: "您还没有登录，是否重新登录？",
			confirmColor:"#FF3333",
			success(res) {
				if (res.confirm) {
					uni.navigateTo({
						url: "/pages/login/login"
					})
				} else if (res.cancel) {
				}
			}
		});
	// #endif	
    return false;
  }
}
function toLogin_nvue() { 
  const userId = uni.getStorageSync('userId');
  const token = uni.getStorageSync('token');
  if(userId && token){
    return true;
  }else{
	  // uni.showModal({
	  // 	title:'登录提示',
	  // 	content: "您还没有登录，是否重新登录？",
	  // 	confirmColor:"#FF3333",
	  // 	success(res) {
	  // 		if (res.confirm) {
	  // 			uni.navigateTo({
	  // 				url: "/pages/login/login"
	  // 			})
	  // 		} else if (res.cancel) {
	  // 		}
	  // 	}
	  // });
    return false;
  }
}
// 获取openId
function getStorageOpenid() {
  const openId = uni.getStorageSync("openId");
  if (openId) {
    return openId;
  } else {
    return ''
  }
}

// 获取当前地址
function getCurrentPageUrlWithArgs() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = currentPage.route;
  // #ifndef H5
  const options = currentPage.options;
  // #endif
  // #ifdef H5
  const options = currentPage.$mp.query;
  // #endif
  
  let urlWithArgs = `/${url}?`;
  for (let key in options) {
    const value = options[key]
    urlWithArgs += `${key}=${value}&`
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  return urlWithArgs
}
//每3秒去检查token是否过期
// function checkAccessToken() {
//   setInterval(checkAccessTokenTimeout, 3 * 1000); //这个时间可以自定义。比如 25 * 60 * 1000（代表25分钟）
// }
// function checkAccessTokenTimeout() {
//   var accesstoken = wx.getStorageSync('token');
//   if (accesstoken == null || accesstoken == undefined || accesstoken == "") {
//     return false
//   }
//   var tokenDate = wx.getStorageSync('tokenDate');
//   var aftertimestamp = Date.parse(new Date()); //返回时间毫秒数，比如1489899243209
//   if (aftertimestamp - tokenDate >= 43200000) { //超过了12小时,重新登陆
//     removeLocalToken()
//     return false
//   }
//   return true
// }
//验证手机号
function valPhone(tel) {
	var r_phone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
	// var phoneNumber = $.trim($('#phoneNumber').val());
	if(tel == "") {
		uni.showToast({
          title: "手机号不能为空!",
          icon: "none",
          duration: 2000
        });
		return false;
	}
	if(!r_phone.test(tel)) {
		uni.showToast({
		  title: "请输入正确的手机格式!",
		  icon: "none",
		  duration: 2000
		});
		return false;
	}
	return true;
}
//验证银行卡号
function valbankNo(no) {
	var r_no = /^([1-9]{1})(\d{15}|\d{16}|\d{17}|\d{18}|\d{19}|\d{20})$/;
	if(no == "") {
		uni.showToast({
          title: "请输入银行卡号!",
          icon: "none",
          duration: 2000
        });
		return false;
	}
	if(!r_no.test(no)) {
		uni.showToast({
		  title: "请输入正确的卡号格式!",
		  icon: "none",
		  duration: 2000
		});
		return false;
	}
	return true;
}
//身份证验证
function IdNumber(no){
	var re15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
	//var re18 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
	var re18 =/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
	var res = (re15.test(no) || re18.test(no)); 
	if(no == "") {
		uni.showToast({
	      title: "请输入身份证号!",
	      icon: "none",
	      duration: 2000
	    });
		return false;
	}
	if(!res) {
		uni.showToast({
		  title: "请输入正确的证件格式!",
		  icon: "none",
		  duration: 2000
		});
		return false;
	}
	return true;
}
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var url = window.location.search.substr(1); //.toLowerCase();
	var r = url.match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}
function uncodeUtf16(str){
  　　var reg = /\&#.*?;/g;
  　　var result = str.replace(reg,function(char){
  　　	 var H,L,code;
  　　　　if(char.length == 9 ){
  　　　　　　code = parseInt(char.match(/[0-9]+/g));
  　　　　　　H = Math.floor((code-0x10000) / 0x400)+0xD800;
  　　　　　　L = (code - 0x10000) % 0x400 + 0xDC00;
  　　　　　　return unescape("%u"+H.toString(16)+"%u"+L.toString(16));
  　　　　}else{
  　　　　　　return char;
  　　　　}
  　　});
  　　return result;
 }
// position--类='.class'id='#id'
// function scrollPosition(position){
// 	uni.createSelectorQuery().select(position).boundingClientRect(data=>{//目标节点
// 		　　uni.createSelectorQuery().select(position).boundingClientRect((res)=>{//最外层盒子节点 　　　　
// 		　　　　uni.pageScrollTo({ 　　　　　　
// 		　　　　　　duration: 0,//过渡时间必须为0，否则运行到手机会报错
// 		　　　　　　scrollTop: 位置 //滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离（如res.top - data.top）
// 		　　　　})
// 		　　}).exec()
// 		}).exec()
//  }
//#ifdef MP-WEIXIN
const compareVersion = function(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)
 
  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])
 
    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
 
  return 0
}
 //#endif
//判断是否开启多元内容
function GetOpen(){
	post("System/GetOpen",{},1).then(res=>{
		if(res.code==0){
			if(res.data==1){
				uni.setStorageSync("pageCon",1)
			}else{
				uni.setStorageSync("pageCon",2)
			}
		}
	})
}
GetOpen();
// 判断浏览器环境true:微信内置
function isWeixin() {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i)=="micromessenger") {
		return true;
	} else {
		return false;
	}
}
//获取当前页面的域名
function GetUrlRelativePath() {
	var urlStr = '';　　　　
	var url = document.location.toString();　　　　
	var arrUrl = url.split("//");　　　　
	var start = arrUrl[1].split("/");
	urlStr = arrUrl[0] + '//' + start[0];　　　　
	return urlStr;　　
}
// 字符串长度,中文2个字符,英文1个字符
function strLength(str) {    
    var len = 0;    
    for (var i=0; i<str.length; i++) {    
        if (str.charCodeAt(i)>127 || str.charCodeAt(i)==94) {    
             len += 2;    
         } else {    
             len ++;    
         }    
     }    
    return len;    
}    

import {toast,debounce,throttle,navigateBack,navigate,switchTab,redirect,call,previewImage} from './ans-utils'
import {get,post,requestHideLoading} from './request.js'
import sj_show_modal from '@/components/G_show_modal/index.js';
import permision from './permission.js';
export {
	formatTime,
	formatNumber,
	formatSecond,
	formatLocation,
	dateUtils,
	host,
	dowmappURL,
	dowmappURLios,
	wssHost,
	webUrl,
	get,
	post,
	requestHideLoading,
	toLogin,
	getCurrentPageUrlWithArgs,
	getStorageOpenid,
	valPhone,
	valbankNo,
	IdNumber,
	getUrlParam,
	uncodeUtf16,
	isWeixin,
	GetUrlRelativePath,
	toast,
	debounce,
	throttle,
	navigate,
	switchTab,
	redirect,
	navigateBack,
	call,
	previewImage,
	strLength,
	toLogin_nvue,
	permision
}
