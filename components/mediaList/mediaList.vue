<template>
	<view class="list-cell" v-if="isdata">
		<view class="media-list">
			<view class="media-hd" v-if="dataitem.FindType != 2">
				<view class="media-author" @click="gotoPensonal">
					<image class="img" v-if="dataitem.Avatar" :src="dataitem.Avatar" mode="aspectFill"></image>
					<image class="img" v-else-if="dataitem.FindType == 2" src="https://yd.wtanvxin.com/static/logo.png" mode="aspectFill"></image>
					<image class="img" v-else src="https://yd.wtanvxin.com/static/default.png"></image>
				</view>
				<view class="author-name uni-ellipsis" @click="gotoPensonal">
					<block v-if="dataitem.NickName">{{ dataitem.NickName }}</block>
					<block v-else-if="dataitem.FindType == 1">店铺动态</block>
					<block v-else-if="dataitem.FindType == 2">英达思创</block>
				</view>
				<block v-if="dataitem.IsMy == 0 && dataitem.FindType != 2 && isBtn == true">
					<view
						:class="['flow-btn', dataitem.IsFollow == 0 ? '' : 'flowed']"
						@click="
							flow(
								dataitem.FindType,
								dataitem.ShopId,
								dataitem.MemberId
							)
						"
					>
						{{ dataitem.IsFollow == 0 ? '关注' : '已关注' }}
					</view>
				</block>
				<view v-if="dataitem.IsMy == 1 && isdel == true" class="delbtn iconfont icon-ziyuanxhdpi fr" @click="Del(dataitem.Id)"></view>
			</view>
			<view @click="bindClick(dataitem.FindType, dataitem.Id)">
				<view class="media-title" v-if="dataitem.Title">{{ decodeURIComponent(dataitem.Title) }}</view>
				<view class="media-title" v-else-if="dataitem.ContentDetails">{{ decodeURIComponent(dataitem.ContentDetails) }}</view>
				<!-- 一排两列 -->
				<block v-if="Grid === '2'">
					<view
						v-if="imgArr"
						:class="[
							'image-section',
							imgArr.length == 1 ? 'image-section-one' : '',
							imgArr.length == 2 ? 'image-section-two' : '',
							imgArr.length == 3 ? 'image-section-three' : '',
							imgArr.length > 3 ? 'image-section-four' : ''
						]"
					>
						<view class="image-list" v-if="imgArr && i < 4" v-for="(source, i) in imgArr" :key="i">
							<image class="img" :src="source" :mode="imgArr.length == 1 ? 'widthFix' : 'aspectFill'" @click.stop="previewImg(imgArr, i)" />
						</view>
						<view v-if="imgArr.length > 4" class="count">{{ imgArr.length }}</view>
					</view>
				</block>
				<!-- 一排3列 -->
				<block v-else>
					<view v-if="imgArr" :class="['image-section Grid3', imgArr.length == 1 ? 'image-section-one' : '']">
						<view class="image-list" v-if="imgArr && i < 3" v-for="(source, i) in imgArr" :key="i">
							<image class="img" :src="source" :mode="imgArr.length == 1 ? 'widthFix' : 'aspectFill'" @click.stop="previewImg(imgArr, i)" />
						</view>
						<view v-if="imgArr.length > 3" class="count">{{ imgArr.length }}</view>
					</view>
				</block>
				<view class="media-location" v-if="dataitem.Location">
					<text class="info-text iconfont icon-dizhi1">{{ dataitem.Location }}</text>
				</view>
				<view class="media-foot">
					<view class="media-info">
						<text class="info-text">{{ dataitem.Addtime }}</text>
					</view>
					<view class="media-info-r">
						<text class="info-text">
							<text class="iconfont icon-liulan"></text>
							{{ dataitem.BrowseNum }}
						</text>
						<text class="info-text">
							<text class="iconfont icon-pinglun1"></text>
							{{ dataitem.CommentNum }}
						</text>
						<text class="info-text" @click.stop="like(dataitem.Id)">
							<text :class="['iconfont', dataitem.IsLike > 0 ? 'icon-zan1' : 'icon-zan']"></text>
							{{ dataitem.LikeNum }}
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import { host, post, toLogin } from '@/common/util.js';
export default {
	props: {
		Grid: {
			type: String,
			default: '2'
		},
		isBtn: {
			type: Boolean,
			default: true
		},
		isdel: {
			type: Boolean,
			default: false
		},
		datajson: {
			type: Object,
			default: function(e) {
				return {};
			}
		}
	},
	created() {
		// this.userId = uni.getStorageSync("userId");
		// this.token = uni.getStorageSync("token");
		this.dataitem = this.datajson;
	},
	data() {
		return {
			// userId: "",
			// token: "",
			dataitem: {},
			isdata: true
		};
	},
	computed: {
		imgArr() {
			if (this.dataitem.ImgList) {
				return this.dataitem.ImgList.split(',');
			}
		}
	},
	onLoad() {},
	methods: {
		bindClick(artType, id) {
			this.$emit('click', { artType, id });
		},
		Del(id) {
			//this.$emit('Del',id);
			let _this = this;
			// #ifdef APP-PLUS
			this.$showModal({
				content: '确定删除该条动态？'
			})
				.then(res => {
					_this.DelFind(id);
					//确认
				})
				.catch(res => {
					//取消
				});
			// #endif
			// #ifndef APP-PLUS
			uni.showModal({
				content: '确定删除该条动态？',
				confirmColor: '#FF3333',
				success(res) {
					if (res.confirm) {
						_this.DelFind(id);
					} else if (res.cancel) {
					}
				}
			});
			// #endif
		},
		async DelFind(id) {
			let result = await post('Find/DelFind', {
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token'),
				FindId: id
			});
			if (result.code == 0) {
				let _this = this;
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 2000
				});
				this.isdata = false;
			} else {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 2000
				});
			}
		},
		gotoPensonal() {
			if (this.dataitem.FindType == 0) {
				//指定用户个人主页
				uni.navigateTo({
					url: '/pages/homepage/homepage?id=' + this.dataitem.MemberId
				});
			}
			// if (this.dataitem.FindType == 1) {
			// 	//指定店铺主页
			// 	uni.navigateTo({
			// 		url: '/pages/goods/storeIndex/storeIndex?id=' + this.dataitem.ShopId
			// 	});
			// }
		},
		//全部评论
		gotocommentlist() {
			uni.navigateTo({
				url: '/pages/personal/replylist/replylist?id=' + this.dataitem.Id
			});
		},
		//预览图片
		previewImg(imgurls, index) {
			this.$emit('previewImg', { imgurls, index });
		},
		//点赞/取消点赞
		async like(id) {
			let result = await post('Find/FindlikeOperation', {
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token'),
				FindId: id,
				TypeStatu: 0
			});
			if (result.code === 0) {
				uni.showToast({
					title: result.msg,
					icon: 'none'
				});
				if (this.dataitem.IsLike > 0) {
					this.dataitem.IsLike = 0;
					this.dataitem.LikeNum--;
				} else {
					this.dataitem.IsLike = 1;
					this.dataitem.LikeNum++;
				}
			} else if (result.code === 2) {
				uni.hideToast();
				toLogin();
			} else {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 2000
				});
			}
		},
		async flow(FindType, ShopId, MemberId) {
			let result;
			if (FindType == 0) {
				result = await post('Find/FollowOperation', {
					UserId: uni.getStorageSync('userId'),
					Token: uni.getStorageSync('token'),
					ToMemberId: MemberId
				});
			} else if (FindType == 1) {
				result = await post('Goods/ShopCollection', {
					UserId: uni.getStorageSync('userId'),
					Token: uni.getStorageSync('token'),
					ShopId: ShopId
				});
			}
			if (result.code === 0) {
				uni.showToast({
					title: result.msg,
					icon: 'none'
				});
				if (this.dataitem.IsFollow == 0) {
					this.dataitem.IsFollow = 1;
				} else {
					this.dataitem.IsFollow = 0;
				}
			} else if (result.code === 2) {
				uni.hideToast();
				toLogin();
			} else {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 2000
				});
			}
		}
	}
};
</script>

<style scoped lang="scss">
view {
	box-sizing: border-box;
}
.delbtn {
	height: 80upx;
	line-height: 80upx;
	padding: 0 10upx;
}
.list-cell {
	width: 750upx;
	padding: 0 20upx;
	margin-bottom: 16upx !important;
	background: #fff;
}

.uni-list-cell-hover {
	background-color: #eeeeee;
}

.media-list {
	flex: 1;
	flex-direction: column;
	padding: 20upx 0;
}
/* #ifndef MP-WEIXIN */
.list-cell:last-child .media-list {
	border-bottom: none;
}
/* #endif */
media-list:last-child .media-list {
	border-bottom: none;
}
.media-hd {
	height: 80upx;
	margin-bottom: 10upx;
}

.media-hd .media-author {
	float: left;
	height: 80upx;
	width: 80upx;
}

.media-hd .media-author .img {
	width: 100%;
	height: 100%;
	border-radius: 50%;
}

.media-hd .author-name {
	font-size: 30upx;
	color: #333;
	float: left;
	max-width: 60%;
	margin-left: 20upx;
	line-height: 80upx;
}

.media-hd .flow-btn {
	float: right;
	margin-top: 10upx;
	color: $primary;
	border-radius: 100px;
	width: 120upx;
	text-align: center;
	background: #fff2ea;
}

.media-hd .flow-btn.flowed {
	background: #f2f2f2;
	color: #999;
}

.media-title {
	font-size: 32upx;
	word-break: break-all;
	display: -webkit-box;
	overflow: hidden;
	line-height: 1.5;
	-o-text-overflow: ellipsis;
	text-overflow: ellipsis;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

.image-section {
	margin-top: 20upx;
	flex-direction: row;
	justify-content: space-between;
	position: relative;
}

.image-section .image-list {
	height: 350upx;
}
.image-section .image-list .img {
	width: 100%;
	height: 100%;
	border-radius: 6px;
}
.image-section-one {
	display: block;
}
.image-section-one .image-list {
	width: 100%;
	height: auto;
	display: block;
	max-height: 710upx;
	overflow: hidden;
	border-radius: 12upx;
}
.image-section-one .image-list .img {
	display: block;
	height: auto;
}
.image-section-two,
.image-section-three,
.image-section-four {
	margin-right: -12upx;
	margin-bottom: -12upx;
	overflow: hidden;
}
.image-section-two .image-list,
.image-section-four .image-list,
.image-section-three .image-list {
	width: 50%;
	float: left;
	padding-right: 12upx;
	margin-bottom: 12upx;
	box-sizing: border-box;
	overflow: hidden;
}

.image-section-three .image-list:last-child {
	width: 100%;
}

.image-section .count {
	position: absolute;
	right: 30upx;
	bottom: 16upx;
	font-size: 40upx;
	color: #fff;
}
.media-foot {
	display: flex;
	flex-direction: row;
	margin-top: 20upx;
	justify-content: space-between;
	line-height: 1.2;
}
.media-info {
	display: flex;
	flex-direction: row;
}

.info-text {
	display: flex;
	color: #999999;
	font-size: 24upx;
	align-items: center;
}
.media-location {
	margin-top: 20upx;
}
.media-location .icon-dizhi1 {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
}
.media-location .icon-dizhi1:before {
	color: #999;
	font-size: 32upx;
	line-height: 1;
	margin-right: 8upx;
}
.media-info-r {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}
.media-info-r .info-text {
	margin-left: 20upx;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}
.media-info-r .info-text .iconfont {
	margin-right: 8upx;
}
.media-info-r .info-text .iconfont.icon-zan1 {
	color: #ff3333;
}
/*3列样式*/
.Grid3.image-section {
	margin-top: 20upx;
	margin-right: -12upx;
	margin-bottom: -12upx;
	flex-direction: row;
	justify-content: space-between;
	position: relative;
	overflow: hidden;
}
.Grid3.image-section .image-list {
	height: 230upx;
	width: 33.3%;
	float: left;
	padding-right: 12upx;
	margin-bottom: 12upx;
	box-sizing: border-box;
	overflow: hidden;
}
.Grid3.image-section.image-section-one {
	display: block;
}
.Grid3.image-section.image-section-one .image-list {
	width: 60%;
	height: auto;
	display: block;
}
.Grid3.image-section.image-section-one .image-list .img {
	display: block;
	height: auto;
}
</style>
