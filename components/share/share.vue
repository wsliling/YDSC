<template>
<view>
	<button open-type="share" @click.stop="share" class="button" :data-param="param">
	    <slot>
	        分享
	    </slot>
	</button>
    <!-- #ifdef APP-PLUS -->
   <uni-popup type="bottom" ref="shareWin">
	   <view class="uni-popup-main">
		   <view class="pop-hd">分享到</view>
			<view class="sharelist flex-center-between">
				<view class="share-item" @click.stop="appShare('WXSceneSession')">
					<image class="imgico" src="http://yd.wtanvxin.com/static/weixin.png" mode="aspectFit"></image>
					<text class="txt">微信好友</text>
				</view>
				<view class="share-item" @click.stop="appShare('WXSenceTimeline')">
					<image class="imgico" src="http://yd.wtanvxin.com/static/weixinf.png" mode="aspectFit"></image>
					<text class="txt">微信朋友圈</text>
				</view>
				<view class="share-item" @click.stop="appShare()">
					<image class="imgico" src="http://yd.wtanvxin.com/static/share_link.png" mode="aspectFit"></image>
					<text class="txt">复制链接</text>
				</view>
			</view>
			<view style="height: 100upx;"></view>
			<view class="uni-close-bottom" @click.stop="$refs.shareWin.close()">取消</view>
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
		title:{
            type:String,
            default:'聚乐旅居'
        },
        // 小程序分享在button里传参，解决列表拿不到当前参数问题
        param:{
            type:String,
            default:''
        }
    },
    data(){
        return {
			data:{},
			offsetTop:0
        }
    },
    methods:{
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
			this.data[params] += `i=${uni.getStorageSync('ReferralCode')}`
		},
        // h5复制链接，app调用分享api
        share(e){
			this.editUrl('h5Url')
			this.editUrl('wxUrl')
			this.editUrl('appUrl')
			this.editUrl('url')
            // #ifdef APP-PLUS
			this.$refs.shareWin.open();
				// uni.shareWithSystem({
				// 	summary:'DanceOne',
				// 	type:'image',
				// 	// href:this.data.appUrl?webUrl+'/#'+this.data.appUrl:webUrl+'/#'+this.data.url,
				// 	imageUrl:'http://yd.wtanvxin.com/static/logo.png',
				// 	success(res){
				// 	   console.log("success:" + JSON.stringify(res));
				// 	},
				// 	fail(err){
				// 	   console.log("fail:" + JSON.stringify(err));
				// 	}
				// })
            // #endif
            // #ifdef H5
            // console.log(window.location.origin)
			let h5url = '【'+this.title+'】';
			if(this.data.h5Url){
				h5url += window.location.origin+'/#'+this.data.h5Url
			}else if(this.data.url){
				h5url += window.location.origin+'/#'+this.data.url
			}else{
				let href = window.location.href;
				(href.indexOf('?')==-1)?(href +='?'):(href+='&');
				console.log(href)
				h5url += href + `i=${uni.getStorageSync('ReferralCode')}`
			}
			console.log(h5url)
            const status = h5Copy(h5url)
            if(status){
                uni.showToast({title:'链接复制成功，快去分享给好友吧~',icon:'none'})
            }else{
                uni.showToast({title:'分享失败',icon:'none'})
            }
            //#endif
        },
		appShare(Scene){
			if(Scene){
				uni.share({
				    provider: "weixin",
				    scene: Scene,
				    type: 0,
					title:this.title,
					summary:'我在英达思创发现了好东西，快来看看吧~',
					imageUrl:'http://yd.wtanvxin.com/static/logo.png',
				    href: this.data.appUrl?webUrl+'/#'+this.data.appUrl:webUrl+'/#'+this.data.url,
				    success: function (res) {
				        console.log("success:" + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log("fail:" + JSON.stringify(err));
				    }
				});
			}else{
				let txt = '【'+this.title+'】'+ this.data.appUrl?webUrl+'/#'+this.data.appUrl:webUrl+'/#'+this.data.url;
				uni.setClipboardData({
				  data: txt,
				  success: function (res) {
					uni.showToast({title:'链接复制成功，快去分享给好友吧~',icon:'none'})
				  }
				})
			}
		}
    },
    // #ifdef MP-WEIXIN
     //转发
	onShareAppMessage: function(e) {
		let url = editShareUrl('/pages/buttonType/kuailelvyou/detail/detail?id='+this.id)
		if (e.from === 'button') {}
		return {
			title: '英达思创',
			path: url,
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
	.uni-popup-main {
		// position: fixed;
		// z-index: 999999;
		background-color: #ffffff;
		box-shadow: 0 0 30upx rgba(0, 0, 0, .1);text-align:center;
		// left: 0;
		// bottom: 0;
		// width: 100%;
		// text-align: center;
		border-radius: 20upx 20upx 0 0;
		.pop-hd{ font-size: 32upx;line-height:2;}
	}
	.sharelist{ padding: 20upx 30upx;}
	.sharelist .share-item{ width: 25%; margin-bottom: 20upx;}
	.imgico{ display: block; width: 100upx; height: 100upx; margin: 0 auto;}
	.txt{ color: #333; font-size: 26upx;line-height:1.6;margin-top:10upx;}
	.uni-close-bottom{ height: 100upx; line-height: 100upx; width: 100%; position: absolute;bottom: 0; left: 0; font-size: 30upx; border-top: 1px solid #eee;color: #999;}
	.uni-popup{
		position:fixed;
	}
</style>