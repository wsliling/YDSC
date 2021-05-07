<template>
	<view>
		<view class="set-list">
			<view class='set-item' @click="goLink('/pages/member/editinfo/editinfo')">
				<view>编辑个人信息</view>
				<text class="iconfont icon-arrow_r"></text>
			</view>
			<view class='set-item' @click="goLink('/pages/member/accountSafe/accountSafe')">
				<view>账号安全</view>
				<text class="iconfont icon-arrow_r"></text>
			</view>
			<view class='set-item' v-if="false" @click="goLink('/pages/member/feedback/feedback')">
				<view>意见反馈</view>
				<text class="iconfont icon-arrow_r"></text>
			</view>
			<view class='set-item' v-if="false" @click="goLink('/pages/member/question/question')">
				<view>常见问题</view>
				<text class="iconfont icon-arrow_r"></text>
			</view>
			<view class='set-item' @click="goLink('/pages/message/agreement/agreement')">
				<view>用户协议</view>
				<text class="iconfont icon-arrow_r"></text>
			</view>
			<view class='set-item' @click="goLink('/pages/message/agreement2/agreement2')">
				<view>隐私政策</view>
				<text class="iconfont icon-arrow_r"></text>
			</view>
			
			<!-- #ifdef APP-PLUS -->
			<view class='set-item' @click="clearCache">
				<view>清除缓存</view>
				<text>{{fileSizeString}}</text>
			</view>
			<view class='set-item' @click="update">
				<view>检查更新</view>
				<text>{{version}}<text class="iconfont icon-arrow_r"></text></text>
				
			</view>
			<!-- #endif -->
			<view class='set-item' @click="goLink('/pages/member/about/about')">
				<view>关于我们</view>
				<text class="iconfont icon-arrow_r"></text>
			</view>
		</view>
		<view class="sign-out" @click="loginOut">
			<view>退出登录</view>
		</view>
	</view>
</template>

<script>
	import {dowmappURLios} from '@/common/util.js';
	export default {
		data() {
			return {
				fileSizeString:'',
				os:'',
				version:'',
				newversion:'',
			}
		},
		onLoad(){
			// #ifdef APP-PLUS
			this.formatSize()
			console.log( this.fileSizeString)
			// #endif
		},
		onShow(){
			// #ifdef APP-PLUS
			this.version = plus.runtime.version
			this.newversion=uni.getStorageSync("VersionNo");
			// #endif
		},
		methods: {
			goLink(url){
				uni.navigateTo({
					url:url
				}) 
			},
			update(){
				if(this.newversion!=this.version){
					//检测系统
					let system = uni.getSystemInfoSync().platform;
					// 提醒用户更新
					this.$showModal({
						title:'更新提示',
						content: "检测到有新的版本是否选择更新？",
					}).then(res=>{
						//确认
						let version=this.newversion.split('.').join('');
						const dowmappURL='http://yd.wtanvxin.com/down/android'+version+'.apk';//app下载地址安卓
						plus.runtime.openURL(system=="ios"?dowmappURLios:dowmappURL);
											
					  }).catch(res=>{
						//取消
					}) 
				}else{
					uni.showToast({
					  title: "已是最新版本!",
					  icon: "none",
					  duration: 2000
					});
				}
			},
			 formatSize() {  
			     let that = this;  
			     plus.cache.calculate(function(size) {  
			         let sizeCache = parseInt(size);  
			         if (sizeCache == 0) {  
			             that.fileSizeString = "0B";  
			         } else if (sizeCache < 1024) {  
			             that.fileSizeString = sizeCache + "B";  
			         } else if (sizeCache < 1048576) {  
			             that.fileSizeString = (sizeCache / 1024).toFixed(2) + "KB";  
			         } else if (sizeCache < 1073741824) {  
			             that.fileSizeString = (sizeCache / 1048576).toFixed(2) + "MB";  
			         } else {  
			             that.fileSizeString = (sizeCache / 1073741824).toFixed(2) + "GB";  
			         }  
			     });  
			 },
			clearCache() {  
				let that = this;  
				let os = plus.os.name;  
				if (os == 'Android') {  
					let main = plus.android.runtimeMainActivity();  
					let sdRoot = main.getCacheDir();  
					let files = plus.android.invoke(sdRoot, "listFiles");  
					let len = files.length;  
					for (let i = 0; i < len; i++) {  
						let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径  
						plus.io.resolveLocalFileSystemURL(filePath, function(entry) {  
							if (entry.isDirectory) {  
								entry.removeRecursively(function(entry) { //递归删除其下的所有文件及子目录  
									uni.showToast({  
										title: '缓存清理完成',  
										duration: 2000  
									});  
									that.formatSize(); // 重新计算缓存  
								}, function(e) {  
									console.log(e.message)  
								});  
							} else {  
								entry.remove();  
							}  
						}, function(e) {  
							console.log('文件路径读取失败')  
						});  
					}  
				} else { // ios暂时未找到清理缓存的方法，以下是官方提供的方法，但是无效，会报错  
					plus.cache.clear(function() {  
						uni.showToast({  
							title: '缓存清理完成',  
							duration: 2000  
						});  
						that.formatSize();  
					});  
				}  
			},
			loginOut(){
				// #ifndef APP-PLUS
				uni.showModal({
					title:'提示',
					content:'是否确认退出登录?',
					confirmColor:"#FF3333",
					success: (res) => {
						if(res.confirm){
							 uni.setStorageSync("userId",'');
							 uni.setStorageSync("token",'');
							 uni.setStorageSync("isIssue",'');
							 uni.setStorageSync("IsShop",'');
							 uni.showToast({
							 	title:'退出登录成功',
								icon:'success',
								duration:2000,
								success: () => {
									setTimeout(function(){
										uni.navigateBack({
											
										})
									},2000)
								}
							 })
						}
					}
				})
				//#endif
				//#ifdef APP-PLUS
				this.$showModal({
					title:'退出登录',
					content: "是否确认退出登录?",
				}).then(res=>{
					uni.setStorageSync("userId",'');
					uni.setStorageSync("token",'');
					uni.setStorageSync("isIssue",'');
					uni.setStorageSync("IsShop",'');
					uni.showToast({
						title:'退出登录成功',
						icon:'success',
						duration:2000,
						success: () => {
							setTimeout(function(){
								uni.navigateBack({
									
								})
							},2000)
						}
					})
					//确认
				  }).catch(res=>{
					//取消
				  })
				//#endif
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f2f2f2;
}
.set-list{
	margin: 20upx 0;
	padding: 0 25upx;
	background-color: #fff;
	.set-item{
		height: 110upx;
		// line-height: 110upx;
		font-size: 30upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1upx solid #ececec;
		text{
			color: #999;
		}
		image{
			width: 12upx;
			height: 24upx;
			display: inline-block;
			margin-left: 20upx;
		}
	}
	.set-item:last-of-type{
		border: none;	
	}
}
.sign-out{
	margin: 80upx 30upx 0;
	view{
		background-color: $primary;
		color: #fff;
		height: 88upx;
		border-radius: 10upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30upx;
	}
}

</style>
