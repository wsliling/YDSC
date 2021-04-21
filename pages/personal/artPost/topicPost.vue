<template>
	<view class="content">
		<view style="height: 20upx;"></view>
		<form>
			<view class="uni-textarea">
				<textarea maxlength="200" @input="limitInput" placeholder-style="color:#999" placeholder="分享你的故事和体验~" v-model="title" />
				<view class="counter">
					<text class="num">{{ inputTxtLength }}</text>
					/200
				</view>
			</view>
			<view class="uni-list list-pd">
				<view class="uni-list-cell cell-pd">
					<view class="uni-uploader">
						<view class="uni-uploader-body">
							<view class="uni-uploader__files">
								<block v-for="(image, index) in imageList" :key="index">
									<view class="uni-uploader__file">
										<view class="iconfont icon-cha delbtn" @click="delImg(index)"></view>
										<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage" mode="aspectFit"></image>
									</view>
								</block>
								<view class="uni-uploader__input-box" v-if="isShowBtnUpload" @click="chooseImage"></view>
							</view>
						</view>
						<view class="uni-uploader-head">
							<view class="uni-uploader-title"></view>
							<view class="uni-uploader-info">{{ imageList.length }}/9</view>
						</view>
					</view>
				</view>
			</view>
			<view class="flex-between uni-bg-white uni-pd10 uni-mt10" @click="tolink('/pages/personal/addtopic/addtopic')">
				<view class="flex-start flex1">
					<text class="iconfont icon-ziyuan131 mr1"></text>
					添加话题
				</view>
				<view class="topicTitle c_theme">
					<text class="uni-ellipsis">{{ topic }}</text>
				</view>
				<text class="uni-icon uni-icon-arrowright fz14"></text>
			</view>
		</form>
		<!--底部-->
		<view style="height: 110upx;"></view>
		<view class="fixedbtn" style="background: #f5f5f5;"><view class="btn" @click="Submit">发布</view></view>
	</view>
</template>

<script>
import { host, post, get, formatLocation, formatTime, toLogin, debounce, permision } from '@/common/util.js';
import { pathToBase64 } from '@/common/image-tools.js';
export default {
	data() {
		return {
			showmsk: 0,
			userId: '',
			token: '',
			hasLocation: false,
			isShowBtnUpload: true,
			location: {},
			locationAddress: '',
			imageList: [],
			base64Arr: [],
			countIndex: 8,
			count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
			inputTxtLength: 0, //当前输入字数
			role: 0, //观看权限
			roletxt: ['公开', '好友', '私密'],
			title: '',
			ContentAbstract: '',
			ContentDetails: ''
		};
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.topic = uni.getStorageSync('topic');
		this.topicId = uni.getStorageSync('topicId');
	},
	onShow() {
		this.showmsk = uni.getStorageSync('showmsk2') || 1;
		this.quanxian();
	},
	onUnload() {
		(this.imageList = []), (this.base64Arr = []), (this.title = ''), (this.isShowBtnUpload = true), this.clearlocation();
	},
	methods: {
		// 判断是否已开启权限
		async quanxian() {
			let platform = uni.getSystemInfoSync() && uni.getSystemInfoSync().platform;
			switch (uni.getSystemInfoSync().platform) {
				case 'android':
					var res = await permision.requestAndroidPermission('android.permission.WRITE_EXTERNAL_STORAGE');
					if (res == 1) {
						//已经获取授权开始
					} else {
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
					if (iosresult && iosres) {
						//已经获取授权
					} else if (!iosres || !iosresult) {
						uni.showModal({
							content: '请先开启相机和相册权限！',
							confirmText: '设置',
							success: res => {
								if (res.confirm) {
									plus.runtime.openURL('app-settings://');
								} else {
									uni.navigateBack({
										delta: 1
									});
								}
							}
						});
					}
					break;
			}
		},
		toback() {
			uni.navigateBack();
		},
		showmskFn() {
			this.showmsk = 2;
			uni.setStorageSync('showmsk2', 2);
		},
		//跳转
		tolink(Url) {
			uni.navigateTo({
				url: Url
			});
		},
		async chooseImage() {
			let _this = this;
			uni.chooseImage({
				count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: async res => {
					// tempFilePath可以作为img标签的src属性显示图片
					//let tempFilePaths = res.tempFilePaths[0];
					_this.imageList = _this.imageList.concat(res.tempFilePaths);
					if (_this.imageList.length >= 9) {
						_this.isShowBtnUpload = false;
						_this.imageList.splice(9);
					}
					_this.base64Arr = await _this.base64Img(_this.imageList);
				}
			});
		},
		async base64Img(arr) {
			let base64Arr = [];
			for (let i = 0; i < arr.length; i += 1) {
				const res = await pathToBase64(arr[i]);
				base64Arr.push({
					PicUrl: res
				});
			}
			return base64Arr;
		},
		isFullImg() {
			//#ifndef APP-PLUS
			uni.showModal({
				content: '已经有9张图片了,是否清空现有图片？',
				success: e => {
					if (e.confirm) {
						this.imageList = [];
						res(true);
					} else {
						res(false);
					}
				},
				fail: () => {
					res(false);
				}
			});
			//#endif
			// #ifdef APP-PLUS
			this.$showModal({
				content: '已经有9张图片了,是否清空现有图片？'
			})
				.then(_res => {
					this.imageList = [];
					res(true);
					//确认
				})
				.catch(_res => {
					//取消
					res(false);
				});
			// #endif
		},
		previewImage: function(e) {
			var current = e.target.dataset.src;
			uni.previewImage({
				current: current,
				urls: this.imageList
			});
		},
		chooseLocation: function() {
			var _this = this;
			//#ifdef MP-WEIXIN
			uni.openSetting();
			uni.getSetting({
				success(res) {
					console.log(res);
					if (!res.authSetting['scope.userLocation']) {
						//3.1 每次进入程序判断当前是否获得授权，如果没有就去获得授权，如果获得授权，就直接获取当前地理位置
						_this.getAuthorizeInfo();
					} else {
						_this.getLocationInfo();
					}
				}
			});
			//#endif
			//#ifndef MP-WEIXIN
			_this.getLocationInfo();
			//#endif
		},
		getLocationInfo() {
			uni.chooseLocation({
				success: res => {
					console.log(res)((this.hasLocation = true)), (this.location = formatLocation(res.longitude, res.latitude)), (this.locationAddress = res.address);
				}
			});
		},
		getAuthorizeInfo() {
			//1. uniapp弹窗弹出获取授权（地理，个人微信信息等授权信息）弹窗
			var _this = this;
			uni.authorize({
				scope: 'scope.userLocation',
				success() {
					//1.1 允许授权
					_this.getLocationInfo();
				},
				fail() {
					//1.2 拒绝授权
					console.log('你拒绝了授权，无法获得周边信息');

					//uni.openSetting();
				}
			});
		},
		//删除图片
		delImg(index) {
			this.imageList.splice(index, 1);
			this.base64Arr.splice(index, 1);
			if (this.imageList.length < 9) {
				this.isShowBtnUpload = true;
			}
		},
		//清空当前地址
		clearlocation: function() {
			this.hasLocation = false;
		},
		//设置观看权限
		selectRole(index) {
			this.role = index;
		},
		limitInput() {
			this.inputTxtLength = this.title.length;
		},
		//发布
		async UserPublishFind() {
			let result = await post('Topic/UserPublishTopicDynamic', {
				UserId: this.userId,
				Token: this.token,
				TopicId: this.topicId,
				Title: encodeURIComponent(this.title),
				PicList: JSON.stringify(this.base64Arr)
			});
			if (result.code === 0) {
				let _this = this;
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 1500
				});
				setTimeout(function() {
					_this.clearData();
					uni.navigateTo({
						url: '/pages/personal/topic/topic'
					});
				}, 2000);
			} else if (result.code === 2) {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 2000
				});
			} else {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 2000
				});
			}
		},
		//发布验证
		verifysubmint() {
			if (this.title == '') {
				uni.showToast({
					title: '内容不能为空',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			return true;
		},
		async Submit() {
			let _this = this;
			debounce(() => {
				if (_this.verifysubmint()) {
					_this.UserPublishFind();
					_this.clearData();
				}
			});
		},
		//清除数据
		clearData() {
			(this.imageList = []), (this.base64Arr = []), (this.title = ''), (this.isShowBtnUpload = true), (this.inputTxtLength = 0), this.clearlocation();
			this.topic = uni.setStorageSync('topic', '');
		}
	}
};
</script>

<style scoped lang="scss">
@import './style';
.topicTitle {
	display: flex;
	align-items: center;
	text {
		display: block;
		max-width: 300upx;
	}
}
</style>
