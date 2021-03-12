<template>
<view>
	<button open-type="share" @click.stop="share" class="button" :data-param="param">
	    <slot>
	        分享
	    </slot>
	</button>
    <!-- #ifdef APP-PLUS --> 
	
   <uni-popup type="bottom" ref="appShare">
	   <view class="uni-popup">
		   <text class="pop-hd">分享</text>
			<view class="sharelist flex-center">
				<view class="share-item" @click.stop="appShare('WXSceneSession')">
					<image class="imgico" src="http://xcx.yixijiu19.com/static/wx.png" mode="aspectFit"></image>
					<text class="txt">微信好友</text>
				</view>
				<view class="share-item" @click.stop="appShare('WXSenceTimeline')">
					<image class="imgico" src="http://xcx.yixijiu19.com/static/ico_quan.png" mode="aspectFit"></image>
					<text class="txt">微信朋友圈</text>
				</view>
				<view class="share-item" @click.stop="appShare()" v-if="false">
					<image class="imgico" src="http://xcx.yixijiu19.com/static/share_link.png" mode="aspectFit"></image>
					<text class="txt">复制链接</text>
				</view>
			</view>
			<view style="height: 100upx;"></view>
			<text class="uni-close-bottom" @click.stop="hide">取消</text>
	   </view>
   </uni-popup>
   <!-- #endif -->
</view>
</template>
<script>
import {webUrl} from '@/common/util'
import h5Copy from '@/common/junyi-h5-copy'
export default {
	components: {
	},
    props:{
        h5Url:{
            type:String,
            default:''
        },
        wxUrl:{
            type:String,
            default:''
        },
        appUrl:{
            type:String,
            default:''
        },
		url:{
            type:String,
            default:''
        },
        // 小程序分享在button里传参，解决列表拿不到当前参数问题
        param:{
            type:String,
            default:''
        },
		title:{
            type:String,
            default:'亿喜-直播'
		},
		shareid1:{
			type:String,
			default:''
		},
		shareid2:{
			type:String,
			default:''
		}
    },
    data(){
        return {
			data:{},
			showPopupShare:false,
			offsetTop:0,
			invite1:'',
			invite2:'',
        }
    },
	
    methods:{
		//统一的关闭popup方法
		hide() {
			this.$refs.appShare.close();
		},
		moveHandle() {},
		editUrl(params){
			console.log(params)
			if(!this[params])return;
			if(this[params].indexOf('?')==-1){
				this.data[params] =this[params]+'?'
			}else{
				this.data[params] =this[params]+'&'
			}
			console.log(this.data[params],params,'111')
			this.data[params] += `inviteCode='${uni.getStorageSync('ReferralCode')}'`;
			console.log(this.data.url)
		},
        // h5复制链接，app调用分享api
        share(e){
			if(this.shareid1&&!this.shareid2){
				this.invite1=this.shareid1;
				this.invite2=uni.getStorageSync('ReferralCode');
			}else{
				
				this.invite1=uni.getStorageSync('ReferralCode');
				this.invite2='';
			}
			this.data['url']=this.url+'&inviteCode='+this.invite1+'&inviteCode2='+this.invite2
			console.log(this.data.url)
			
            // #ifdef APP-PLUS
			  this.$refs.appShare.open();
				// uni.shareWithSystem({
				// 	summary:'我在亿喜发现了好东西，快来看看吧~',
				// 	type:'image',
				// 	// href:this.data.appUrl?webUrl+'/#'+this.data.appUrl:webUrl+'/#'+this.data.url,
				// 	imageUrl:'http://xcx.yixijiu19.com/static/logo.png',
				// 	success(res){
				// 	   console.log("success:" + JSON.stringify(res));
				// 	},
				// 	fail(err){
				// 	   console.log("fail:" + JSON.stringify(err));
				// 	}
				// })
            // #endif
            // #ifdef H5
            const status = h5Copy(this.data.h5Url?window.location.origin+'/#'+this.data.h5Url:window.location.origin+'/#'+this.data.url)
            if(status){
                uni.showToast({title:'链接复制成功，快去分享给好友吧~'})
            }else{
                uni.showToast({title:'分享失败',icon:'none'})
            }
            //#endif
        },
		appShare(Scene){
			if(Scene){
				// uni.share({
				//     provider: "weixin",
				//     scene: Scene,
				//     type: 5,
				// 	title:this.title,
				// 	summary:'我在亿喜发现了好东西，快来看看吧~',
				// 	imageUrl:'http://xcx.yixijiu19.com/static/logo.png',
				//     // href: this.data.appUrl?webUrl+'/#'+this.data.appUrl:webUrl+'/#'+this.data.url,
				// 	miniProgram:{
				// 		id:'gh_da1c486d94da',
				// 		path: this.data.url,
				// 		type:2,
				// 		webUrl:"http://xcx.yixijiu19.com"
				// 	},
				//     success: function (res) {
				//         console.log("success:" + JSON.stringify(res));
				//     },
				//     fail: function (err) {
				//         console.log("fail:" + JSON.stringify(err));
				//     }
				// });
				uni.share({
				    provider: "weixin",
				    scene: Scene,
				    type: 0,
					title:this.title,
					summary:'我在亿喜发现了好东西，快来看看吧~',
					imageUrl:'http://xcx.yixijiu19.com/static/logo.png',
				    // href: webUrl+'/#/pages/dowmApp/dowmApp?url='+encodeURIComponent(this.data.url),
					href: webUrl+'/#'+this.data.url,
				    success: function (res) {
				        console.log("success:" + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log("fail:" + JSON.stringify(err));
				    }
				});
			}else{
				let txt = this.data.appUrl?webUrl+'/#'+this.data.appUrl:webUrl+'/#'+this.data.url;
				uni.setClipboardData({
				  data: txt,
				  success: function (res) {
				    uni.getClipboardData({ 
				      success: function (res) {
				        console.log(res.data) // data
				      }
				    })
				  }
				})
			}
		}
    },
    // #ifdef MP-WEIXIN
     //转发
    onShareAppMessage: function(e) {
        let res = wx.getStorageSync('user');
        if (res.from === 'button') {}
        return {
        title: this.title,
        path: this.data.url,
        success: function(res) {}
        }
    }
    // #endif
}
</script>
<style scoped lang="scss">
.button{
    background-color:transparent;
    padding-left:0;
    padding-right:0;
    line-height:1;
    border-radius: 0;
	border-width: 0;
	border-style: none;
	border-color: transparent;
}
.button::after{
	border-width: 0;
	border-style: none;
	border-color: transparent;
	border:none;
}
.uni-mask {
		position: fixed;
		z-index: 99999;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, .4);
	}
	.uni-popup {
		// position: fixed;
		// z-index: 999999;
		background-color: #ffffff;
		box-shadow: 0 0 30upx rgba(0, 0, 0, .1);
		// left: 0;
		// bottom: 0;
		// width: 100%;
		// text-align: center;
		border-radius: 20upx 20upx 0 0;
		padding:0 30upx;
	}
	.pop-hd{ font-size: 32upx;
		text-align:center;
		line-height:100upx;
	}
	.sharelist{ padding: 20upx 30upx;
	flex-direction: row;
	}
	.share-item{  margin-bottom: 20upx;
		display: flex;
		flex-direction:column;
		align-items:center;
		width: 375rpx;
	}
	.imgico{ display: block; width: 80upx; height: 80upx; margin: 0 auto 10rpx;}
	.txt{ color: #333; line-height:35upx;font-size: 26upx;text-align:center;}
	.uni-close-bottom{ 
		height: 100upx; line-height: 100upx; 
		width: 750upx; 
		text-align:center;
		// margin:0  30upx;
		position: absolute;bottom: 0; left: 0; 
		background-color: #eee;
		font-size: 30upx;
		 border-top: 1px solid #eee;
		 border-radius:10upx;
		 color: #999;}
</style>