<template>
	<view>
		<view class="editInfo">
			<view class="editItem" @click="chooseImg">
				<view class="editTitle">头像</view>
				<view class="editBox">
					<image v-if="img" :src="img"></image>
					<image v-else src="http://xcx.yixijiu19.com/static/default.png"></image>
					<text class="iconfont icon-arrow_r"></text>
				</view>
			</view>
			<view class="editItem" @click="editName">
				<view class="editTitle">昵称</view>
				<view class="editBox" >
					<view>{{data.NickName}}</view>
					<text class="iconfont icon-arrow_r"></text>
				</view>
			</view>
			<view class="editItem">
				<view class="editTitle">账号</view>
				<view class="editBox">
					<view>{{data.Id}}</view>
					<!-- <text class="iconfont icon-arrow_r"></text> -->
				</view>
			</view>
			<!-- <view class="editItem" v-if="data.AreaSite">
				<view class="editTitle">经销商所属区域</view>
				<view class="editBox">
					<view>{{data.AreaSite}}</view>
				</view>
			</view> -->
			<view class="editItem"  @click="getSex">
				<view class="editTitle">性别</view>
				<view class="editBox">
					<view v-if="sex>0">{{sex==1?'女':'男'}}</view>
					<view v-else>保密</view>
					<text class="iconfont icon-arrow_r"></text>
				</view>
			</view>
			<view class="editItem"  >
				<view class="editTitle">生日</view>
				<view class="editBox">
					<view class="uni-list-cell-db">
					    <picker mode="date" :value="birthday" @change="bindDateChange">
					        <view>{{birthday?birthday:'未设置'}}</view>
					    </picker>
					</view>
					<text class="iconfont icon-arrow_r"></text>
				</view>
			</view>
			
			<view class="editItem border_no" @click="showArea">
				<view class="editTitle">所在地</view>
				<view class="editBox" >
					
					<view >{{address?address:'请选择城市'}}</view>
					<text class="iconfont icon-arrow_r"></text>
				</view>
			</view>
		</view>
		<view class="editItem border_top">
			<view class="editTitle">简介</view>
			<textarea v-model="Introduction" @blur="getIntroduction" placeholder="请填写个人简介" />
		</view>
		<view class="mask" @click="nameCancel" v-if="showEditName"></view>
		<view class="editNameBox" v-if="showEditName">
			<view class="title">
				填写昵称
			</view>
			<input type="text" v-model="editname">
			<view class="btn">
				<view @click="nameCancel">取消</view>
				<view @click="nameConfirm">确定</view>
			</view>
		</view>
		<view class="save" @click="save">
			<view>
				保存
			</view>
		</view>
		<wpicker
			mode="linkage"
			:level="2" 
			:defaultVal="areaDefault"
			@confirm="areaOk"
			@cancel="areaCancel"
			ref="area"
			:linkList="areaList"
			themeColor="#f00"
			>
		</wpicker>
	</view>
</template>

<script>
	import areaList from '@/common/areaList.js'
	import wpicker from "@/components/w-picker/w-picker.vue";
	import {post,permision} from "@/common/util.js"
	import {pathToBase64} from "@/common/image-tools.js"
	export default {
		data() {
			return {
				areaDefault:['广东省','深圳市'],
				areaList:areaList,
				address:'',
				name:'ashhdah',
				sex:0,
				Introduction:'',
				showEditName:false,
				editname:'',
				userId: "",
				token: "",
				data:{},
				img:'',
				birthday:''
			}
		},
		onLoad(){
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			this.GetMemInfo()
		},
		components:{
			wpicker
		},
		methods: {
			// 初始化获取用户基本信息
			async GetMemInfo(){
				let res = await post('User/GetMemInfo',{
					"UserId": this.userId,
					"Token": this.token
				})
				if(res.code==0){
					this.data=res.data
					this.sex=this.data.Sex
					this.address=this.data.City
					this.Introduction=this.data.Introduction
					this.img=this.data.Avatar
				}
			},
			bindDateChange: function(e) {
			    this.birthday = e.target.value
			},
			showArea(){
				this.$refs.area.show()
			},
			areaOk(e){
				console.log(e)
				this.address=e.checkArr[1]
			},
			areaCancel(){},
			getSex(){
				uni.showActionSheet({
					itemList:['保密','女','男'],
					success: (res) => {
						console.log(res)
						this.sex=res.tapIndex
					},
					fail(res) {
					  console.log(res.errMsg);
					}
				})
			},
			editName(){
				this.showEditName=true
				this.editname = this.data.NickName
			},
			async nameConfirm(){
				this.showEditName=false
				let res = await post('User/EditUserNick',{
					"UserId": this.userId,
					"Token": this.token,
					"UserNick":this.editname
				})
				if(res.code==0){
					this.GetMemInfo()
					uni.showToast({
						title:res.msg,
						icon:'success'
					})
				}
			},
			nameCancel(){
				this.showEditName=false
				this.editname = ''
			},
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
						var strStatus;
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
			async chooseImg(){
				this.quanxian();
				uni.chooseImage({
				    count:1, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    success:async (res) => {
				    	let base64=await pathToBase64(res.tempFilePaths[0])
				    		//console.log(base64);
							let result = await post('User/UploadPhoto',{
								UserId:this.userId,
								Token:this.token,
								Avatar:base64
							})
							if(result.code==0){
								uni.showToast({
									title:result.msg
								})
								this.img=result.data
							}
				    }
				});
			},
			async getIntroduction(){
				let res =await post('User/EditUserIntroduction',{
					UserId:this.userId,
					Token:this.token,
					Introduction:this.Introduction
				})
				if(res.code==0){
					console.log(11)
				}
			},
			async save(){
				let res = await post('User/EditUserInfo',{
					UserId:this.userId,
					Token:this.token,
					Sex:this.sex,
					City:this.address,
					Introduction:this.Introduction,
					Birthday:this.birthday
				})
				if(res.code==0){
					this.GetMemInfo()
					uni.showToast({
						title:res.msg,
						icon:'success',
						duration:1500,
						success() {
							setTimeout(function(){
								uni.navigateBack({
									
								},1500)
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.save{
		position: fixed;
		bottom: 30upx;
		left: 0;
		width: 100%;
		padding: 0 30upx;
		// margin: 0 30upx;
		height: 88upx;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		view{
			background-color: $primary;
			width: 100%;
			border-radius: 20upx;
			text-align: center;
			line-height: 88upx;
			height: 100%;
			font-size: 32upx;
		}
		
	}
.editInfo{
	margin-top: 20rpx;
	background-color: #fff;
	padding:10rpx 30rpx;
	
}
	.editItem{
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100rpx;
		border-bottom: 1rpx solid #ececec;
		.editBox{
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: #999;
			image{
				width: 80rpx;
				height: 80rpx;
				border-radius: 100%;
			}
			text{
				margin-left: 20rpx;
				font-size: 26rpx;
			}
			
		}
	}
.border_top{
	border-bottom: none;
	border-top: 20rpx solid #f6f6f6;
	padding:10rpx 30rpx;
	height: auto;
	flex-wrap: wrap;
	.editTitle{
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		border-bottom: 1rpx solid #ececec;
	}
	textarea{
		margin-top: 20rpx;
		height: 110rpx;
		font-size: 28rpx;
	}
}
.editNameBox{
	position: fixed;
	left: 50%;
	top: 50%;
	z-index: 100;
	transform: translate(-50%,-50%);
	background-color: #fff;
	width: 680rpx;
	padding-top: 30rpx;
	border-radius: 20rpx;
	.title{
		text-align: center;
		margin-bottom: 20rpx;
		font-size: 32rpx;
	}
	input{
		background-color: #f6f6f6;
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 20rpx;
		border-radius: 20rpx;
		margin: 0 30rpx;
	}
	.btn{
		
		margin-top: 30rpx;
		// height: 90rpx;
		box-sizing: border;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 1rpx solid #ececec;
		view{
			box-sizing: border;
			width: 50%;
			text-align: center;
			line-height: 90rpx;
			font-size: 32rpx;
			&:last-of-type{
				color: #f00;
				border-radius: 0 0 20rpx 0;
			}
			&:first-of-type{
				border-right: 1rpx solid #ececec;
				border-radius: 20rpx 0 0 0;
			}
		}
	}
}
</style>
