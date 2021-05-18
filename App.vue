<script>
	import {host,post,dowmappURLios} from '@/common/util.js';
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef APP-PLUS
			//检测系统
			const system = uni.getSystemInfoSync().platform;
			// App平台检测升级，服务端代码是通过uniCloud的云函数实现的，详情可参考：https://ext.dcloud.net.cn/plugin?id=2226
			if(plus.runtime.appid !== 'HBuilder'){ // 真机运行不需要检查更新，真机运行时appid固定为'HBuilder'，这是调试基座的appid
				uni.request({
				    url: host+'System/GetWebConfiguration', //检查更新的服务器地址
					method: 'POST',
				    success: (e) => {console.log(e)
						let _res=e.data;
						let _this=this;
				        if (_res.code==0) {
							uni.setStorageSync("VersionNo",_res.data.VersionNo);
							if(_res.data.VersionNo!=plus.runtime.version){
								// 提醒用户更新
								_this.$showModal({
									title:'更新提示',
									content: "检测到有新的版本是否选择更新？",
								}).then(res=>{
									//确认
									let version=_res.data.VersionNo.split('.').join('');
									const dowmappURL='http://yd.wtanvxin.com/down/android'+version+'.apk';//app下载地址安卓
									plus.runtime.openURL(system=="ios"?dowmappURLios:dowmappURL);
						
								  }).catch(res=>{
									//取消
								}) 
							}
				        }
				    }
				})
			}
			// #endif
			//判断是否开启审核内容
			post("System/GetOpen",{},1).then(res=>{
				if(res.code==0){
					if(res.data==1){
						uni.setStorageSync("pageCon",1)
					}else{
						uni.setStorageSync("pageCon",2)
					}
				}
			})
		},
		onShow: function() {
			console.log('App Show')
			//#ifdef APP-PLUS
			var args= plus.runtime.arguments;  
			if(args){  
				// 处理args参数，如直达到某新页面等 
				 console.log(args)
				 args=args.substring(9);
				 uni.navigateTo({
				 	url:args
				 })
			}  
			//#endif
		},
		onHide: function() {
			console.log('App Hide')
			uni.setStorageSync("isIssue",'')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import './common/uni.css';
	@import './common/iconfont.css';
	@import './common/common.scss';
	@import './components/uParse/src/wxParse.css';
	/* 自定义顶部导航栏样式 */
	page {
		background-color: #F5F5F5;
		font-size: 28upx;
		line-height: 1.8;
		color: #333;
	}
	uni-swiper .uni-swiper-wrapper{
		border-radius: 10upx;
	}
</style>
