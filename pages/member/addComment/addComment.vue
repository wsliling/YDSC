<template>
	<div class="foot_list">
		<div class="or_item">
			<view class=" uni-mt10">
				<view class="product-comment bg_fff">
					<view class="pictrue">
						<image class="img" :src="shopInfo.PicNo" mode="aspectFill"></image>
						<view>
							<view class="shopName">{{ shopInfo.ProductName }}</view>
							<text>{{ shopInfo.SpecText }}</text>
							<view class="price">
								<text class="c_theme fz12">￥</text>
								{{ shopInfo.ActualPay }}
							</view>
						</view>
					</view>
					<view class="rate-item">
						<view class="title">描述相符</view>
						<uni-rate size="18" margin="10" color="#bbb" :starType="1" :showtxt="true" active-color="#ff0000" value="5" @change="onChange"></uni-rate>
					</view>
					<view class="rate-item">
						<view class="title">物流服务</view>
						<uni-rate size="18" margin="10" color="#bbb" :starType="2" :showtxt="true" active-color="#ff0000" value="5" @change="onChange"></uni-rate>
					</view>
					<view class="rate-item">
						<view class="title">服务态度</view>
						<uni-rate size="18" margin="10" color="#bbb" :starType="3" :showtxt="true" active-color="#ff0000" value="5" @change="onChange"></uni-rate>
					</view>
				</view>
				<!--遇到的问题-->
				<!-- <div class="mt2">
		  	      <p class="cg font24">请选择您遇到的问题</p>
		  	      <div class="mt2 flex flexWrap">
		  	          <p v-for="(item,oll) in plist" :key="oll" class="pp_item" :class="{'active':oll==1}">{{item.name}}</p>
		  	      </div>
		  	  </div> -->
				<textarea cols="30" rows="10" maxlength="299" class="com_text bg_fff" v-model="text" placeholder="填写您对商品的评价~"></textarea>
				<view class="counter bg_fff">
					<text class="num">{{ inputTxtLength }}</text>
					/300
				</view>
				<div class="p3 bg_fff" style="padding-bottom: 30upx;">
					<!-- <div>上传图片（不超过5张）</div> -->
					<div class="fed_pic flex flexWrap">
						<div v-for="(item, index) in imageList" :key="index" class="picbox">
							<span class="" @click="delImg(index)">×</span>
							<image :src="item" alt="" class="pic_itim"></image>
						</div>
						<!-- <div class="picbox upBtnImg" @click="chooseImage()" v-if="isShowBtnUpload">
							<img src="http://yd.wtanvxin.com/static/add2.png" alt="" class="pic_itim">
						</div> -->
						<view class="uni-uploader__input-box" v-if="isShowBtnUpload" @click="chooseImage"></view>
					</div>
				</div>
			</view>
			<!-- 	<view class="uni-bg-white uni-mt10">
				<view class="appraiseContent__hd">
					<view class="title">
						店铺评分
					</view>
				</view>
				<view class="rateContent">
					<view class="rate-item flex flex-start">
						<view class="title">物流服务</view>
						<view class="grade">
							<uni-rate size="18" margin="10" color="#bbb" :starType="2" :showtxt="true" active-color="#ffc405" value="5"
							 @change="onChange"></uni-rate>
						</view>
					</view>
					<view class="rate-item flex flex-start">
						<view class="title">服务态度</view>
						<view class="grade">
							<uni-rate size="18" margin="10" color="#bbb" :starType="3" :showtxt="true" active-color="#ffc405" value="5"
							 @change="onChange"></uni-rate>
						</view>
					</view>
				</view>
			</view> -->
			<view class="isIncognito" @click="getIncognito">
				<view :class="isIncognito == 1 ? 'active' : ''"><text class="iconfont icon-gou1"></text></view>
				是否匿名
			</view>
			<div class="porela" @click="pub()">提交</div>
		</div>
	</div>
</template>

<script>
import { switchPath, post, permision } from '@/common/util.js';
import { pathToBase64, base64ToPath } from '@/common/image-tools.js';
import uniRate from '@/components/uni-rate.vue';
var sourceType = [['camera'], ['album'], ['camera', 'album']];
var sizeType = [['compressed'], ['original'], ['compressed', 'original']];
export default {
	components: {
		uniRate
	},
	data() {
		return {
			// plist:[{id:1,name:'商品问题'},{id:1,name:'客服问题'},{id:1,name:'包装问题'},{id:1,name:'物流问题'},{id:1,name:'其他'}],
			shopInfo: {},
			text: '',
			imageList: [],
			sourceTypeIndex: 2,
			sourceType: ['拍照', '相册', '拍照或相册'],
			sizeTypeIndex: 2,
			sizeType: ['压缩', '原图', '压缩或原图'],
			countIndex: 4,
			imgs: [],
			isShowBtnUpload: true,
			count: [1, 2, 3, 4, 5],
			proRank: 5, //产品评价等级
			serRank: 5, //服务评价等级
			logRank: 5, //物流评价等级
			inputTxtLength: 0, //当前输入字数
			OrderNo: '',
			OrderDetailId: '',
			isIncognito: 1
		};
	},
	onLoad(e) {
		this.imgList = [];
		// #ifdef APP-PLUS
		this.OrderNo = e.id;
		this.OrderDetailId = e.detailId;
		// #endif
	},
	onShow() {
		this.sourceTypeIndex = 2;
		this.sourceType = ['拍照', '相册', '拍照或相册'];
		this.sizeTypeIndex = 2;
		this.sizeType = ['压缩', '原图', '压缩或原图'];
		this.countIndex = 4;
		// #ifndef APP-PLUS
		(this.OrderNo = this.$mp.query.id), (this.OrderDetailId = this.$mp.query.detailId);
		// #endif
		this.quanxian();
		this.getDetail();
	},
	watch: {
		imgList(e) {
			console.log(e, ';;;;;;;;;;;;');
		},
		text(e) {
			console.log(e);
			this.inputTxtLength = e.length;
		}
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
							title: '请先开启相机和相册权限',
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
		// 是否匿名
		getIncognito() {
			if (this.isIncognito == 1) {
				this.isIncognito = 0;
			} else {
				this.isIncognito = 1;
			}
		},
		async pub() {
			if (this.text) {
				let imgList = await this.base64Img(this.imageList);
				// console.log(imgList)
				post('Order/CommentProduct', {
					UserId: uni.getStorageSync('userId'),
					Token: uni.getStorageSync('token'),
					OrderNo: this.OrderNo,
					OrderDetailId: this.OrderDetailId,
					Content: this.text,
					PicList: JSON.stringify(imgList),
					ProductStarNum: this.proRank,
					ServiceStarNum: this.serRank,
					LogisticsStarNum: this.logRank,
					Isanonymous: this.isIncognito
				}).then(res => {
					if (res.code === 0) {
						uni.showToast({
							icon: 'none',
							title: res.msg
						});
						setTimeout(() => {
							uni.navigateBack();
						}, 300);
					}
				});
			} else {
				uni.showToast({
					icon: 'none',
					title: '您还没输入评论内容呢~'
				});
			}
		},
		//删除图片
		delImg(index) {
			this.imageList.splice(index, 1);
			this.imgs.splice(index, 1);
			if (this.imageList.length < 5) {
				this.isShowBtnUpload = true;
			}
		},
		chooseImage: async function() {
			if (this.imageList.length >= 5) {
				let isContinue = await this.isFullImg();
				console.log('是否继续?', isContinue);
				if (!isContinue) {
					return;
				}
			}
			uni.chooseImage({
				sourceType: sourceType[this.sourceTypeIndex],
				sizeType: sizeType[this.sizeTypeIndex],
				count: this.imageList.length + this.count[this.countIndex] > 5 ? 5 - this.imageList.length : this.count[this.countIndex],
				success: res => {
					this.imageList = this.imageList.concat(res.tempFilePaths);
					if (this.imageList.length >= 5) {
						this.isShowBtnUpload = false;
						this.imageList.splice(5);
					}
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
		isFullImg: function() {
			return new Promise(res => {
				//#ifndef APP-PLUS
				uni.showModal({
					content: '已经有5张图片了,是否清空现有图片？',
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
				// #endif
				// #ifdef APP-PLUS
				this.$showModal({
					content: '已经有5张图片了,是否清空现有图片？'
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
			});
		},
		//设置评价等级
		onChange(e) {
			if (e.type === 1) {
				this.proRank = e.value;
			}
			if (e.type === 2) {
				this.serRank = e.value;
			}
			if (e.type === 3) {
				this.logRank = e.value;
			}
		},

		getDetail() {
			post('Order/OrderDetails', {
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token'),
				OrderNo: this.OrderNo
			}).then(res => {
				res.data.OrderDetails.forEach(item => {
					if (item.Id == this.OrderDetailId) {
						this.shopInfo = item;
					}
				});
			});
		},
		goUrl(url, param) {
			uni.navigateTo({
				url: url + '?id=' + param
			});
		}
	}
};
</script>

<style scoped lang="scss">
.product-comment {
	margin: 20rpx 0;
	/* 	display: flex;
		flex-direction: row;
		justify-content: flex-start; */
	border-bottom: 1px solid #f2f2f2;
	padding: 20upx;

	.pictrue {
		display: flex;
		align-items: center;

		/* margin-right: 20upx; */
		overflow: hidden;
		display: flex;
		flex-direction: row;
		border-bottom: 1rpx solid #ececec;
		padding-bottom: 40rpx;
		.img {
			width: 160upx;
			height: 160upx;
			margin-right: 20rpx;
		}
		.shopName {
			font-size: 30rpx;
		}
		text {
			font-size: 24rpx;
			color: #999;
		}
		.price {
			font-size: 36rpx;
			color: #ff3333;
		}
		view {
			line-height: 1.8;
		}
	}

	.rate-item {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	uni-view {
		line-height: 80upx;
	}

	.uni-rate {
		height: 48upx;
	}
}

.pp_item {
	font-size: 24upx;
	padding: 8upx 20upx;
	border: 1upx solid #ededed;
	border-radius: 10upx;
	margin-right: 25upx;
	margin-top: 10upx;

	&:nth-child(4n) {
		margin-right: 0;
	}

	&.active {
		border: 1upx solid #f00;
		color: #f00;
	}
}

.com_text {
	padding: 20upx;
	height: 200upx;
	width: 100%;
}

.picbox {
	width: 33%;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	margin-top: 20upx;
	position: relative;

	span {
		position: absolute;
		width: 32upx;
		height: 32upx;
		background-color: #999;
		color: #fff;
		border-radius: 50%;
		top: -12upx;
		right: 0upx;
		/* transform: rotate(45deg);
      font-weight: 900; */
		font-size: 34upx;
		line-height: 24upx;
		text-align: center;
		z-index: 99;
	}
}

.pic_itim {
	width: 220upx;
	height: 220upx;
}

.porela {
	width: 690upx;
	margin: 0 auto;
	background: #ff3333;
	color: #ffffff;
	height: 80upx;
	line-height: 80upx;
	text-align: center;
	border-radius: 12upx;
	margin-top: 60upx;
}

.appraiseContent__hd {
	padding: 20upx;
	border-bottom: 1px solid #f2f2f2;
}

.appraiseContent__hd .title {
	font-size: 30upx;
	color: #333;
}

.rateContent {
	padding: 20upx 0;
	margin: 0 20upx;
}

.rateContent .rate-item {
	margin: 10upx 0;
}

.rateContent .rate-item .title {
	color: #333;
}

.counter {
	padding: 0 20upx;
	text-align: right;
	font-size: 24upx;
	color: #b2b2b2;
}
.isIncognito {
	height: 88rpx;
	width: 100%;
	margin-top: 20rpx;
	background-color: #fff;
	padding: 0 30rpx;
	line-height: 88rpx;
	display: flex;
	align-items: center;
	view {
		width: 40rpx;
		height: 40rpx;
		border-radius: 100%;
		margin-right: 20rpx;
		background-color: #fff;
		border: 1rpx solid #999;
		line-height: 40rpx;
		text-align: center;
		box-sizing: border-box;
		text {
			/* line-height: 40rpx; */
			color: #fff;
		}
		&.active {
			background-color: #ff3333;
			border-color: #ff3333;
		}
	}
}
</style>
