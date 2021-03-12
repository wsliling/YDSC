<template>
	<view class="uni-popup-share">
		<view class="uni-share-title"><text class="uni-share-title-text">分享到</text></view>
		<view class="uni-share-content">
			<view class="uni-share-content-box">
				<view class="uni-share-content-item" v-for="(item,index) in bottomData" :key="index" @click.stop="appShare(item.name,index)">
					<image class="uni-share-image" :src="item.icon" mode="aspectFill"></image>
					<text class="uni-share-text">{{item.text}}</text>
				</view>

			</view>
		</view>
		<view class="uni-share-button-box">
			<text class="uni-share-button" @click="close">取消</text>
		</view>
	</view>
</template>

<script>
	import {webUrl} from '@/common/util'
	export default {
		name: 'UniPopupShare',
		props: {
			title: {
				type: String,
				default: '亿喜'
			},
			url:{
			    type:String,
			    default:''
			},
			imageUrl:{
				type:String,
				default:'http://xcx.yixijiu19.com/static/logo.png'
			}
		},
		inject: ['popup'],
		data() {
			return {
				bottomData: [
					{
						text: '微信好友',
						icon: 'http://xcx.yixijiu19.com/static/weixin.png',
						name: 'WXSceneSession'
					},
					{
						text: '微信朋友圈',
						icon: 'http://xcx.yixijiu19.com/static/weixinf.png',
						name: 'WXSenceTimeline'
					},
					// {
					// 	text: '复制链接',
					// 	icon: 'http://xcx.yixijiu19.com/static/share_link.png',
					// 	name: ''
					// }
				]
			}
		},
		created() {},
		methods: {
			/**
			 * 选择内容
			 */
			select(item, index) {
				this.$emit('select', {
					item,
					index
				}, () => {
					this.popup.close()
				})
			},
			appShare(Scene,index){
				let _this=this;
				if(Scene){
					uni.share({
					    provider: "weixin",
					    scene: Scene,
					    type: 0,
						title:this.title,
						summary:'我在亿喜发现了好东西，快来看看吧~',
						imageUrl:this.imageUrl,
					    href: webUrl+'/#/pages/dowmApp/dowmApp?url='+encodeURIComponent(this.url),
						// miniProgram:{
						// 	id:'gh_da1c486d94da',
						// 	path: this.url,
						// 	type:2,
						// 	webUrl:"http://xcx.yixijiu19.com"
						// },
					    success: function (res) {
					        console.log("success:" + JSON.stringify(res));
							_this.popup.close()
					    },
					    fail: function (err) {
					        console.log("fail:" + JSON.stringify(err));
					    }
					});
				}else{
					let txt = '【'+this.title+'】'+ webUrl+'/#'+this.url;
					uni.setClipboardData({
					  data: txt,
					  success: function (res) {
						uni.showToast({title:'链接复制成功，快去分享给好友吧~',icon:'none'})
						_this.popup.close()
					  }
					})
				}
			},
			/**
			 * 关闭窗口
			 */
			close() {
				this.popup.close()
			}
		}
	}
</script>
<style lang="scss" scoped>
	.uni-popup-share {
		background-color: #fff;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.uni-share-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 40px;
	}
	.uni-share-title-text {
		font-size: 16px;
		color: #666;
	}
	.uni-share-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		padding-top: 10px;
	}
	
	.uni-share-content-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
		width: 360px;
		margin-bottom: 20px;
	}
	
	.uni-share-content-item {
		width: 90px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		padding: 10px 0;
		align-items: center;
	}
	
	.uni-share-content-item:active {
		background-color: #f5f5f5;
	}
	
	.uni-share-image {
		width: 36px;
		height: 36px;
	}
	
	.uni-share-text {
		margin-top: 10px;
		font-size: 14px;
		color: #3B4144;
	}
	
	.uni-share-button-box {
		border-top-width: 1px;
		border-top-style: solid;
		border-top-color: #eee;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		padding: 15px;
	}
	
	.uni-share-button {
		display: block;
		flex: 1;
		color: #666;
		font-size: 16px;
		text-align: center;
	}
</style>
