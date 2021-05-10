<template>
	<view class="pagehome">
		<view class="homeBackground p_re">
			<image :src="HomeCover || 'http://yd.wtanvxin.com/static/topic.jpg'" mode="aspectFill"></image>
			<view class="btn flex-center" v-if="myType == 1" @click="changebanner" style="z-index: 2;">
				<text class="iconfont icon-fabu fz16"></text>
				<!-- 设置封面 -->
			</view>
			<!-- <view v-if="myType != 0" class="btn flex-center">
				<image class="mesg" src="http://yd.wtanvxin.com/static/message.png"></image>
			</view> -->
		</view>
		<view class="userInfo">
			<view class="headerInfo">
				<image @click="lookImg" class="userImg" :src="Info.Avatar || 'http://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image>
				<view class="fansBtn" v-if="myType != 0">
					<view class="btn" @click="tolink('/pages/member/editinfo/editinfo')">
						<!-- <text class="iconfont icon-fankui mr1"></text> -->
						编辑资料
					</view>
				</view>
				<block v-if="myType == 0">
					<view class="followBtn flex-center" v-if="Info.IsFollow == 0" @click="flowbtn">
						<!-- <text class="iconfont icon-jia"></text> -->
						关注
					</view>
					<view class="fansBtn" v-else>
						<view class="position" @click="tolink('/pages/personal/chat/chat?id=' + memberId + '&nick=' + Info.NickName, 'login')">
							<image style="width: 72upx; height: 72upx;" src="http://yd.wtanvxin.com/static/message.png"></image>
						</view>
						<view class="btn" @click="flowbtn">取消关注</view>
					</view>
				</block>
			</view>
			<view class="user">
				<view class="username-flex">
					<view class="name">{{ Info.NickName }}</view>
					<view class="userId" v-if="false">用户ID: 683286829</view>
					<view class="userTip">
						<view>
							<text v-if="Info.Sex == 1" class="iconfont icon-nv" style="color: #FF3333;"></text>
							<text v-if="Info.Sex == 2" class="iconfont icon-nan" style="color: #07bdff;"></text>
							<text v-if="Info.Sex == 0" class="iconfont icon-suo" style="color: #ffaa00;"></text>
							{{ Info.Sex == 1 ? '女' : Info.Sex == 2 ? '男' : '保密' }}
						</view>
						<view v-if="Info.Age">{{ Info.Age }}</view>
						<view v-if="Info.City">{{ Info.City }}</view>
					</view>
				</view>

				<view class="userSign uni-ellipsis2" v-if="Info.Introduction">{{ Info.Introduction }}</view>
				<view class="userSign" v-else @click="toMylink('/pages/member/editinfo/editinfo')">
					{{ myType ? '填写个人介绍更容易获得关注，点击此处添加' : '这个人很懒，什么都没留下~' }}
				</view>
				<!-- <view class="flex" v-if="Info.FanGroup">
					<view class="fansCard">
						<image :src="Info.Avatar || 'http://yd.wtanvxin.com/static/default.png'"></image>
						<view class="fansName">
							<view class="p1">{{ Info.NickName }}【粉丝团】</view>
							<view class="p2">粉丝 | {{ Info.FanGroup }}人</view>
						</view>
					</view>
				</view> -->
			</view>
			<view class="fans">
				<view class="fansNum">
					<view class="item-num" @click="toMylink('/pages/member/follow/follow?type=1')">
						<view class="num">{{ Info.Fans > 9999 ? (Info.Fans / 9999).toFixed(1) + 'W' : Info.Fans }}</view>
						<view>粉丝</view>
					</view>
					<view class="item-num" @click="toMylink('/pages/member/follow/follow?type=0')">
						<view class="num">{{ Info.Follow }}</view>
						<view>关注</view>
					</view>
					<view class="item-num" @click="toMylink('/pages/member/follow/follow?type=2')">
						<view class="num">{{ Info.Follow }}</view>
						<view>获赞</view>
					</view>
				</view>
			</view>
		</view>

		<view style="overflow-x: hidden;">
			<view class="tabdiv" v-if="pageCon == 1">
				<view :class="['item', tabIndex == 1 ? 'active' : '']" @click="tapTab(1)" v-show="false">
					<text class="num">{{ Info.VideoNum }}</text>
					<text class="txt">视频</text>
				</view>
				<view :class="['item', tabIndex == 2 ? 'active' : '']" @click="tapTab(2)">
					<text class="num">{{ Info.TrendsNum }}</text>
					<text class="txt">动态</text>
				</view>
				<view :class="['item', tabIndex == 3 ? 'active' : '']" @click="tapTab(3)">
					<text class="num">{{ Info.TrendsNum }}</text>
					<text class="txt">课程</text>
				</view>
				<view :class="['item', tabIndex == 0 ? 'active' : '']" @click="tapTab(0)" v-show="false">
					<text class="num">{{ Info.LiveNum }}</text>
					<text class="txt">直播</text>
				</view>
			</view>
			<!-- <view class="tabCon tab-img flex flexWrap" v-if="tabIndex == 0">
				<block v-for="(item, index) in datalist" :key="index">
					<view class="item" @longtap="longtap(item, index, 0)">
						<image :src="item.Logo || 'http://via.placeholder.com/400x400'" mode="aspectFill" @click.stop="goLivePlay(item, index)"></image>
						<view class="tag">{{ item.Flag == 0 ? '预告' : item.Flag == 1 ? '直播中' : '回放' }}</view>
						<view class="delbox flex-center" v-if="item.isDel" @click.stop="hidedel(item, index)">
							<text class="delbtn" @click.stop="delData(item.Id, index)">删除</text>
						</view>
					</view>
				</block>
			</view> 
			<view class="tabCon tab-img flex flexWrap" v-if="tabIndex == 1">
				<block v-for="(item, index) in datalist" :key="index">
					<view class="item" @longtap="longtap(item, index, 1)">
						<image
							:src="item.Logo || 'http://via.placeholder.com/400x400'"
							mode="aspectFill"
							@click.stop="tolink('/pages/hwDetails/hwDetails?id=' + item.Id + '&MemberId=' + item.MemberId)"
						></image>
						<view class="delbox flex-center" v-if="item.isDel" @click.stop="hidedel(item, index)">
							<text class="delbtn" @click.stop="delData(item.Id, index)">删除</text>
						</view>
					</view>
				</block>
			</view>-->
			<view class="tabCon tab-find" v-if="tabIndex == 2 && hasData">
				<block v-for="(item, index) in datalist" :key="index">
					<view class="media-item flex" @click="tolink('/pages/personal/replylist/replylist?id=' + item.Id)">
						<view class="media-hd">
							<text class="day">{{ item.day }}</text>
							<text>/{{ item.month }}月</text>
						</view>
						<view class="media-bd flex1">
							<view class="media-title">{{ item.Title }}</view>
							<view v-if="item.imgArr" :class="['image-section Grid3', item.imgArr.length == 1 ? 'image-section-one' : '']">
								<view class="image-list" v-if="item.imgArr && i < 3" v-for="(source, i) in item.imgArr" :key="i">
									<image class="img" :src="source" :mode="item.imgArr.length == 1 ? 'widthFix' : 'aspectFill'" @click.stop="previewImg(item.imgArr, i)" />
								</view>
								<view v-if="item.imgArr.length > 3" class="count">{{ item.imgArr.length }}</view>
							</view>
							<view class="ftbox text_right uni-mt10" v-if="item.IsMy == 1">
								<text class="del iconfont icon-del c_999" @click.stop="delData(item.Id, index)"></text>
							</view>
						</view>
					</view>
				</block>
			</view>
			<!-- 课程 -->
			<view class="course" v-if="tabIndex == 3">
				<view class="listcourse" v-for="(item, index) in datalist" :key="index" @click="classDetails(item.Id)"><image :src="item.PicImg"></image></view>
			</view>
			<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
			<noData :isShow="noDataIsShow"></noData>
		</view>
		<!-- 弹出更换封面 -->
		<uni-popup v-if="myType == 1" ref="bannerWin" type="center">
			<view class="uni-modal-banner" @click="hidePopup">
				<view class="img"><image :src="HomeCover || 'http://yd.wtanvxin.com/static/homeBg.png'" mode="aspectFill"></image></view>
				<view class="btn btn_red" @click.stop="chooseImg">更换封面</view>
				<view class="btn" @click.stop="hidePopup">取消</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { post, toLogin, dateUtils, permision } from '@/common/util.js';
import noData from '@/components/noData.vue'; //暂无数据
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
import { pathToBase64 } from '@/common/image-tools.js';
export default {
	data() {
		return {
			pageCon: 0,
			userId: '',
			token: '',
			tabIndex: 2,
			memberId: '',
			myType: 0, //0TA人主页，1我的主页
			Info: {},
			HomeCover: '', //封面
			page: 1,
			pageSize: 12,
			noDataIsShow: false,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			datalist: []
		};
	},
	components: {
		noData,
		uniLoadMore
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.memberId = e.id;
	},
	onShow() {
		this.pageCon = uni.getStorageSync('pageCon');
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		if (this.pageCon == 2) {
			this.tabIndex == 2;
		}
		this.UserHomePageInfo();
		this.GetdateList();
	},
	methods: {
		classDetails(id) {
			uni.navigateTo({
				url: '/pages/course/classDetails/classDetails?detailId=' + id
			});
		},
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
		//跳转
		tolink(Url, islogin) {
			if (islogin == 'login') {
				if (toLogin()) {
					uni.navigateTo({
						url: Url
					});
				}
			} else {
				uni.navigateTo({
					url: Url
				});
			}
		},
		// 预览头像
		lookImg() {
			let tempFilePaths = [];
			tempFilePaths.push(this.Info.Avatar);
			uni.previewImage({
				urls: tempFilePaths,
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
		},
		toMylink(Url) {
			if (this.myType == 1) {
				uni.navigateTo({
					url: Url
				});
			}
		},
		tapTab(index) {
			//点击tab-bar
			if (this.tabIndex === index) {
				return false;
			} else {
				this.tabIndex = index;
				this.hasData = false;
				this.noDataIsShow = false;
				this.page = 1;
				this.datalist = [];
				this.GetdateList();
			}
		},
		//获取个人主页信息
		async UserHomePageInfo() {
			let result = await post('User/OtherHomePage', {
				UserId: this.userId,
				Token: this.token,
				MemberId: this.memberId
			});
			if (result.code === 0) {
				this.Info = result.data;
				this.myType = result.data.IsMy;
				this.HomeCover = result.data.HomeCover;
				uni.setNavigationBarTitle({
					title: this.myType ? '我的主页' : 'TA的主页'
				});
			} else if (result.code == 2) {
				uni.hideToast();
			}
		},
		async flowbtn() {
			if (toLogin()) {
				let result = await post('Find/FollowOperation', {
					UserId: this.userId,
					Token: this.token,
					ToMemberId: this.memberId
				});
				if (result.code === 0) {
					uni.showToast({
						title: result.msg,
						icon: 'none'
					});
					if (this.Info.IsFollow == 0) {
						this.Info.IsFollow = 1;
					} else {
						this.Info.IsFollow = 0;
					}
					if (uni.getStorageSync('followMid')) {
						uni.setStorageSync('homeInfo', { mid: this.memberId, IsFollow: this.Info.IsFollow });
					}
				}
			}
		},
		//获取用户发布列表
		async GetdateList() {
			let url = '',
				json = {};
			if (this.tabIndex == 0) {
				url = 'LivePreview/PreviewList';
				json = {
					UserId: this.userId,
					Token: this.token,
					Page: this.page,
					PageSize: this.pageSize,
					MemberId: this.memberId
					//"Type":9
				};
			} else if (this.tabIndex == 1) {
				url = 'News/BrandgoodsList';
				json = {
					UserId: this.userId,
					Token: this.token,
					Page: this.page,
					PageSize: this.pageSize,
					MemberId: this.memberId
					//"Type":9
				};
			} else if (this.tabIndex == 2) {
				url = 'Find/FindList';
				json = {
					UserId: this.userId,
					Token: this.token,
					Page: this.page,
					PageSize: this.pageSize,
					myType: 1, //指定用户
					MemberId: this.memberId
				};
			} else if (this.tabIndex == 3) {
				url = 'Course/MemberViewCourseList';
				json = {
					UserId: this.userId,
					Token: this.token,
					Page: this.page,
					PageSize: this.pageSize,
					MemberId: this.memberId
				};
			}
			let result = await post(url, json);
			if (result.code == 0) {
				let _this = this;
				if (result.data.length > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
					if (this.tabIndex == 0) {
						result.data.forEach(function(item) {
							if (item.Flag == 0) {
								_this.$set(item, 'isDel', false);
							}
						});
					}
					if (this.tabIndex == 2) {
						result.data.forEach(function(item) {
							item.Title = decodeURIComponent(item.Title);
							let date = new Date(item.Addtime);
							let day = date.getDate();
							let month = date.getMonth() + 1;
							_this.$set(item, 'day', day);
							_this.$set(item, 'month', month);
							let imgurls = [];
							if (item.ImgList) {
								imgurls = item.ImgList.split(',');
								_this.$set(item, 'imgArr', imgurls);
							}
						});
					}
				}
				if (result.data.length == 0 && this.page == 1) {
					this.noDataIsShow = true;
					this.hasData = false;
				}
				if (this.page === 1) {
					this.datalist = result.data;
				}
				if (this.page > 1) {
					this.datalist = this.datalist.concat(result.data);
				}
				if (result.data.length < this.pageSize) {
					this.isLoad = false;
					this.loadingType = 2;
				} else {
					this.isLoad = true;
					this.loadingType = 0;
				}
			} else if (result.code == 2) {
				uni.hideToast();
			}
		},
		//预览图片
		previewImg(arr, i) {
			uni.previewImage({
				current: arr[i],
				urls: arr,
				indicator: arr.length
			});
		},
		//更换封面
		changebanner() {
			if (this.myType == 0) return;
			this.$refs.bannerWin.open();
		},
		hidePopup() {
			this.$refs.bannerWin.close();
		},
		async chooseImg() {
			let _this = this;
			this.quanxian();
			uni.chooseImage({
				count: 1, //默认1
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				success: async res => {
					let base64 = await pathToBase64(res.tempFilePaths[0]);
					this.UploadHomeCover(base64);
				}
			});
		},
		async UploadHomeCover(base64) {
			let _this = this;
			let result = await post('User/UploadHomeCover', {
				UserId: this.userId,
				Token: this.token,
				HomeCover: base64
			});
			if (result.code == 0) {
				uni.showToast({
					title: result.msg,
					icon: 'none'
				});
				this.HomeCover = result.data;
				setTimeout(() => {
					_this.$refs.bannerWin.close();
				}, 2000);
			}
		},
		// 跳转直播
		goLivePlay(item, i) {
			if (item.Flag == 1) {
				uni.navigateTo({
					url: '/pages/liveplay/live?MemberId=' + this.memberId
				});
			} else {
				uni.navigateTo({
					url: '/pages/upLoadDetail/upLoadDetail?id=' + item.Id
				});
			}
		},
		longtap(item, i, type) {
			if (type == 0) {
				// if(item.IsMy==1&&item.Flag==0){
				// 	this.$set(item,'isDel',true);
				// }
			} else {
				if (item.IsMy == 1) {
					this.$set(item, 'isDel', true);
				}
			}
		},
		hidedel(item, i) {
			this.$set(item, 'isDel', false);
		},
		delData(id, i) {
			let _this = this;
			let constr = '';
			let url = '';
			if (_this.tabIndex == 0) {
				constr = '确定删除该视频？';
				url = 'LivePreview/DelPreview';
			} else if (_this.tabIndex == 1) {
				constr = '确定删除该视频？';
				url = 'News/DelBrandgoods';
			} else if (_this.tabIndex == 2) {
				constr = '确定删除该动态？';
				url = 'Find/DelMyFind';
			}
			//#ifndef APP-PLUS
			uni.showModal({
				content: constr,
				confirmColor: '#FF3333',
				success(res) {
					if (res.confirm) {
						post(url, {
							UserId: _this.userId,
							Token: _this.token,
							IdArr: id
						}).then(res => {
							if (res.code == 0) {
								uni.showToast({
									title: '删除成功！',
									icon: 'none'
								});
								_this.datalist.splice(i, 1);
							}
						});
					} else if (res.cancel) {
					}
				}
			});
			//#endif
			//#ifdef APP-PLUS
			this.$showModal({
				content: constr
			})
				.then(res => {
					post(url, {
						UserId: _this.userId,
						Token: _this.token,
						IdArr: id
					}).then(res => {
						if (res.code == 0) {
							uni.showToast({
								title: '删除成功！',
								icon: 'none'
							});
							_this.datalist.splice(i, 1);
						}
					});
					//确认
				})
				.catch(res => {
					//取消
				});
			//#endif
		}
	},
	onPullDownRefresh() {
		//下拉刷新
		//监听下拉刷新动作的执行方法，每次手动下拉刷新都会执行一次
		let _this = this;
		_this.Info = {};
		_this.datalist = [];
		this.page = 1;
		setTimeout(function() {
			_this.UserHomePageInfo();
			_this.GetdateList();
			uni.stopPullDownRefresh(); //停止下拉刷新动画
		}, 1000);
	},
	// 上拉加载
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.page++;
			this.GetdateList();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss" scoped>
@import './style.scss';
.pagehome /deep/.emptybox {
	background: #fff;
}
</style>
