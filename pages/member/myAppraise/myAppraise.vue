<template>
	<view class="content commet">
		<view class="comment-content">
			<view class="commentList" v-if="hasData">
				<view class="line"></view>
				<block v-for="(item, index) in Commentlist" :key="index">
					<view class="comment-head weui-cell">
						<image class="tx" v-if="Userinfo.Avatar" :src="Userinfo.Avatar" mode="aspectFill"></image>
						<image class="tx" v-else src="https://yd.wtanvxin.com/static/default.png" mode="aspectFill"></image>
						<text class="name uni-ellipsis">{{ Userinfo.NickName }}</text>
					</view>
					<view class="item" @click="commentDetail(item.Id)">
						<view class="time">{{ item.AddTime }}</view>
						<view class="con">{{ item.ContentText }}</view>
						<view v-if="item.CommentPic" class="image-section">
							<view class="image-list" v-if="item.imgArr && i < 3" v-for="(source, i) in item.imgArr" :key="i">
								<image class="img" :src="source" mode="aspectFill" @click.stop="previewImg(item.imgArr, i)"></image>
							</view>
							<view v-if="item.imgArr.length > 3" class="count">{{ item.imgArr.length }}</view>
						</view>
						<view class="column levelPanel">
							<view class="item">
								<view class="outside" @click.stop="gotoDetail(item.ProductId)">
									<view class="pictrueAll">
										<view class="pictrue"><image :src="item.ProductPic" mode="aspectFill"></image></view>
									</view>
									<view class="txtBox">
										<view class="title">{{ item.ProductTitle }}</view>
										<view class="flex skuBox">
											<text class="sku">{{ item.ProductSpecification }}</text>
										</view>
										<view class="flex">
											<text class="new-price">￥{{ item.ProductPrice }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="line"></view>
				</block>
				<view class="uni-tab-bar-loading"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
			</view>
			<noData :isShow="noDataIsShow"></noData>
		</view>
	</view>
</template>

<script>
import { host, post, get, toLogin } from '@/common/util.js';
import noData from '@/components/noData.vue'; //暂无数据
import uniLoadMore from '@/components/uni-load-more.vue';
export default {
	components: {
		noData,
		uniLoadMore
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
	},
	onShow() {
		if (toLogin()) {
			this.getMemberInfo();
			this.CommentList();
		}
	},
	data() {
		return {
			userId: '',
			token: '',
			curPage: '',
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			page: 1,
			pageSize: 6,
			allPage: 0,
			count: 0,
			Userinfo: {}, //用户数据
			Commentlist: {} //评价列表
		};
	},
	methods: {
		//写评价
		gotoOrder() {
			uni.navigateTo({
				url: '/pages/member/order/order?tabIndex=4'
			});
		},
		gotoDetail(id) {
			uni.navigateTo({
				url: '/pages/homePage/details?id=' + id
			});
		},
		commentDetail(id) {
			uni.navigateTo({
				url: '/pages/commentsDetail/commentsDetail?commentId=' + id
			});
		},
		//获取用户信息
		async getMemberInfo() {
			let result = await post('User/GetCenterInfo', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code === 0) {
				this.Userinfo = result.data;
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
		//我的评价列表
		async CommentList() {
			let result = await post('User/CommentList', {
				UserId: this.userId,
				Token: this.token,
				page: this.page,
				pageSize: this.pageSize
			});
			if (result.code === 0) {
				let _this = this;
				if (result.data.length > 0) {
					this.hasData = true;
					result.data.forEach(function(item) {
						let arr = item.CommentPic.split(',');
						if (arr[arr.length - 1] == '') {
							arr.splice(arr.length - 1, 1);
						}
						_this.$set(item, 'imgArr', arr);
					});
				}
				this.count = result.count;
				if (this.count == 0) {
					this.noDataIsShow = true;
				}
				if (parseInt(this.count) % this.pageSize === 0) {
					this.allPage = this.count / this.pageSize;
				} else {
					this.allPage = parseInt(this.count / this.pageSize) + 1;
				}
				if (this.page === 1) {
					this.Commentlist = result.data;
				}
				if (this.page > 1) {
					this.Commentlist = this.Commentlist.concat(result.data);
				}
				if (this.allPage <= this.page) {
					this.isLoad = false;
					this.loadingType = 2;
				} else {
					this.isLoad = true;
					this.loadingType = 0;
				}
			} else {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 2000
				});
			}
		},
		//预览图片
		previewImg(imgurls, index) {
			uni.previewImage({
				current: imgurls[index],
				urls: imgurls,
				indicator: imgurls.length
			});
		}
	},
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.page++;
			this.CommentList();
		} else {
			this.loadingType = 2;
		}
	},
	onPullDownRefresh() {
		//下拉刷新
		//监听下拉刷新动作的执行方法，每次手动下拉刷新都会执行一次
		let _this = this;
		_this.page = 1;
		_this.loadingType = 1;
		setTimeout(function() {
			_this.getMemberInfo();
			_this.CommentList();
			uni.stopPullDownRefresh(); //停止下拉刷新动画
		}, 1000);
	}
};
</script>

<style lang="scss">
.weui-cell {
	padding: 20upx;
	position: relative;
	display: -webkit-box;
	display: -webkit-flex;
	display: -moz-flex;
	display: -ms-flex;
	display: -o-flex;
	display: flex;
	-webkit-box-align: center;
	-webkit-align-items: center;
	-moz-align-items: center;
	-ms-align-items: center;
	-o-align-items: center;
	align-items: center;
	font-size: 30upx;
}

.column .pictrueAll .pictrue {
	position: relative;
	width: 100%;
	padding-top: 100%;
	background-color: #f5f5f5;
}

.column .pictrueAll .pictrue image {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 2;
}

.levelPanel .item .outside {
	padding: 20upx;
	display: -webkit-box;
	display: -webkit-flex;
	display: -moz-flex;
	display: -ms-flex;
	display: -o-flex;
	display: flex;
	-webkit-box-align: center;
	-webkit-align-items: center;
	-moz-align-items: center;
	-ms-align-items: center;
	-o-align-items: center;
	align-items: center;
	position: relative;
}

.levelPanel .item .outside .pictrueAll {
	width: 30%;
	margin-bottom: 0;
	margin-right: 20upx;
}

.levelPanel .item .outside .txtBox {
	-webkit-box-flex: 1;
	-webkit-flex: 1;
	flex: 1;
	overflow: hidden;
}

.levelPanel .item .outside .txtBox .title {
	line-height: 1.4;
	margin-bottom: 10upx;
	font-size: 30upx;
}

.levelPanel .item .outside .txtBox .skuBox {
	font-size: 26upx;
	color: #999999;
	padding: 0;
	border-bottom: none;
}

.levelPanel .item .outside .txtBox .skuBox * {
	font-size: 26upx;
}

.levelPanel .item .outside .txtBox .new-price {
	color: #ff6666;
	font-size: 36upx;
	font-family: arial;
}
.comment-head .tx {
	width: 80upx;
	height: 80upx;
	border-radius: 50%;
	vertical-align: middle;
}
.commet button[type='primary'][plain] {
	vertical-align: middle;
	border-color: #ff6666;
	color: #ff6666;
	line-height: 2;
	width: 160upx;
	padding: 0;
	text-align: center;
}
.comment-content__hd {
	background: #fff;
	font-size: 32upx;
	padding: 20upx;
	border-bottom: 1px solid #f2f2f2;
}
.commentList {
	background-color: white;
}
.commentList > .item {
	padding: 10upx 20upx 0;
	background-color: #fff;
	margin-bottom: 20upx;
}
.commentList > .item .time {
	color: #999;
}
.commentList > .item .con {
	line-height: 1.4;
	margin-bottom: 30upx;
	font-size: 30upx;
}
.commentList > .item > .item__ft {
	padding: 0 0 20upx 0;
	color: #999;
	font-size: 24upx;
}
.commentList > .item > .item__ft .txt *,
.commentList > .item > .item__ft .txt {
	font-size: 26upx;
}
.commentList > .item > .item__ft .txt {
	margin-right: 30upx;
}
.li_33 .item {
	width: 33.333333%;
}
.li_25 .item {
	width: 25%;
}
.imgLise {
	margin-right: -20upx;
	padding-bottom: 20upx;
}
.imgLise .item {
	float: left;
	margin-bottom: 20upx;
}
.imgLise .item .pictrueAll {
	margin-right: 20upx;
}
.imgLise .item .pictrue {
	width: 100%;
	padding-top: 100%;
	position: relative;
}
.imgLise .item .pictrue image {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 2;
	top: 0;
	left: 0;
}
.commet button {
	background: none;
	border: none;
	color: #bebebe !important;
	width: 180upx !important;
}
.commet .time {
	float: right;
	margin-top: -47px;
}
.commet .line {
	background-color: #f5f5f5;
	height: 22upx;
	margin-top: 22upx;
}
.comment-content {
	margin-top: -20upx;
}
.comment-head {
	margin-top: 22upx;
}
.comment-head .tx {
	margin-right: 20upx;
}
.comment-head .name {
	display: inline-block;
	vertical-align: middle;
	max-width: 60%;
}
.levelPanel .item .outside {
	background-color: #f6f6f6;
}
.levelPanel .item .outside .pictrueAll {
	width: 27%;
}
.image-section {
	margin-right: -12upx;
	margin-bottom: 10upx;
	flex-direction: row;
	justify-content: space-between;
	position: relative;
	overflow: hidden;
}
.image-section .image-list {
	height: 230upx;
	width: 33.3%;
	float: left;
	padding-right: 12upx;
	margin-bottom: 12upx;
	box-sizing: border-box;
	overflow: hidden;
}
.image-section .image-list .img {
	width: 100%;
	height: 100%;
	border-radius: 6px;
}
.image-section .count {
	position: absolute;
	right: 30upx;
	bottom: 16upx;
	font-size: 40upx;
	color: #fff;
}
.bb_tba {
	view {
		width: 50%;
		padding: 20upx;
		text-align: center;
		&.active {
			border-bottom: 1upx solid #ff3333;
			color: #ff3333;
		}
	}
}
</style>
