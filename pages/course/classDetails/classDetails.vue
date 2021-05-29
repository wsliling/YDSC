<template>
	<view class="classDetails">
		<view class="top">
			<view class="videobox">
				<video
					v-if="classdetail.IsShowBuy == 0"
					:src="classdetail.Video"
					:poster="classdetail.PicImg"
					controls
					object-fit="cover"
					id="video"
					@play="playVideo"
					@pause="pauseVideo"
				></video>
				<view class="tipbox" v-if="classdetail.IsShowBuy == 1">
					<image :src="classdetail.PicImg" mode="aspectFill"></image>
					<view class="txt flex-column">该视频为付费视频，请点击下方购买按钮进行购买，谢谢合作！</view>
				</view>
			</view>
			<!-- <view class="photo"><image :src="classdetail.PicImg" mode="aspectFill"></image></view> -->
			<view class="info">
				<view class="name">{{ classdetail.Name }}</view>
			</view>
			<view class="detail flex-between">
				<view class="detail_1 flex1">
					{{ classdetail.TargetName }} | {{ classdetail.DifficultyName }}
					<text style="padding-left: 10upx;" v-if="classdetail.CourseDuration != 0">| {{ classdetail.CourseDuration }}分钟</text>
				</view>
				<view class="detail_2">{{ classdetail.Hits }}人看过</view>
			</view>
			<view class="info1 flex-between">
				<view class="info1_3" @click="tolink('/pages/personal/VenueDetail/VenueDetail?gymId=' + classdetail.StoreId)">
					<image :src="classdetail.StoreLogo || 'http://yd.wtanvxin.com/static/default.png'" mode="aspectFill"></image>
				</view>
				<view class="info1_4 flex1">{{ classdetail.StoreNick }}</view>
				<view :class="['info1_2', Isfollow ? 'ed' : '']" @click="followfun">{{ Isfollow ? '已关注' : '关注' }}</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="con">
			<view class="title">课程简介</view>
			<view class="con1_1"><uParse v-if="classdetail.Content" :content="classdetail.Intro" /></view>
		</view>
		<view class="line"></view>
		<view class="con">
			<view class="title">训练部位</view>
			<view class="con1_1">
				<text v-for="(item, index) in classdetails" :key="index">{{ item.Name }}</text>
			</view>
		</view>
		<view class="line"></view>
		<view class="con">
			<view class="title">训练准备</view>
			<view class="con1_1">{{ classdetail.TrainingPreparation }}</view>
		</view>
		<view class="line"></view>
		<view class="con">
			<view class="title">注意事项</view>
			<view class="con1_1">{{ classdetail.Note }}</view>
		</view>
		<view class="line"></view>
		<view class="con">
			<view class="title">购买须知</view>
			<view class="con1_1">购买此课程后，可观看视频教程进行训练</view>
		</view>
		<view class="line last_line"></view>
		<view class="foot flex-between">
			<view :class="['foot_1', classdetail.IsShowBuy == 0 ? 'flex1' : '']">
				<view class="iconfont" :class="[IsCollect ? 'icon-collect bd' : 'icon-collect1']" @click="collect"></view>
				收藏
			</view>
			<view :class="['foot_2', classdetail.IsShowBuy == 0 ? 'flex1' : '']" @click="share">
				<button class="sharebtn" open-type="share"><view class="iconfont icon-share"></view></button>
				分享
			</view>
			<block v-if="classdetail.IsShowBuy == 1">
				<view class="foot_3" @click="tolink('/pages/course/scoreExchange/scoreExchange?classId=' + classdetail.Id, 'login')">{{ classdetail.Score }}积分兑换</view>
				<view class="foot_4" @click="tolink('/pages/course/buyClass/buyClass?classId=' + classdetail.Id + '&inCode=' + inviteCode, 'login')">
					￥{{ classdetail.Price }}购买
				</view>
			</block>
			<block v-if="classdetail.IsShowBuy == 2"><view class="foot_3" style="opacity: .5;">已购买</view></block>
		</view>
		<!-- 弹出分享 -->
		<uni-popup ref="popupShare" type="bottom">
			<nvue-share
				:title="classdetail.Name"
				:imageUrl="classdetail.PicImg"
				:url="'/pages/course/classDetails/classDetails?detailId=' + this.Id + '&inCode=' + this.ReferralCode"
			></nvue-share>
		</uni-popup>
	</view>
</template>

<script>
import { post, toLogin } from '@/common/util.js';
import uParse from '@/components/uParse/src/wxParse.vue';
import nvueShare from '@/components/uni-popup/nvue-share.vue';
import h5Copy from '@/common/junyi-h5-copy';
export default {
	components: {
		uParse,
		nvueShare
	},
	data() {
		return {
			userId: '',
			token: '',
			ReferralCode: '', //自己的邀请码
			inviteCode: '', //他人的邀请码
			Id: 0,
			classdetail: {}, // 课程详情
			classdetails: [], //训练部位
			IsCollect: false, //是否收藏
			Isfollow: false, //是否关注
			StoreId: '', //门店加密id
			onHidePage: false,
			videoContext: null,
			playnow: false
		};
	},
	onLoad(e) {
		this.Id = e.detailId;
		if (e.inCode) {
			this.inviteCode = e.inCode;
			// #ifdef MP-WEIXIN
			uni.setStorageSync('inviteCode', e.inCode);
			// #endif
		}
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.ReferralCode = uni.getStorageSync('ReferralCode'); //自己的邀请码
		this.getClassDetail();
	},
	onHide() {
		if (this.playnow) {
			this.videoContext = uni.createVideoContext('video');
			this.videoContext.pause();
		}
	},
	methods: {
		playVideo() {
			this.playnow = true;
		},
		pauseVideo() {
			this.playnow = false;
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
		// 课程详情
		async getClassDetail() {
			let result = await post('Course/GetCourse_Outline_xq', {
				OutlineId: this.Id,
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.classdetail = result.data;
				this.classdetails = result.data.TrainingSiteInfo;
				this.IsCollect = result.data.IsCollect;
				this.Isfollow = result.data.IsFollow;
				this.StoreId = result.data.StoreId;
			}
		},
		//分享
		share() {
			//#ifdef APP-PLUS
			this.$refs.popupShare.open();
			//#endif
			//#ifdef H5
			const status = h5Copy(window.location.origin + '/#' + '/pages/course/classDetails/classDetails?detailId=' + this.Id + '&inCode=' + this.ReferralCode);
			if (status) {
				uni.showToast({ title: '链接复制成功，快去分享给好友吧~', icon: 'none' });
			} else {
				uni.showToast({ title: '分享失败', icon: 'none' });
			}
			//#endif
		},
		//添加取消收藏
		async collect() {
			let result = await post('Course/CourseCollection', {
				OutlineId: this.Id,
				userId: this.userId,
				token: this.token
			});
			if (result.code == 0) {
				if (this.IsCollect) {
					uni.showToast({
						title: '已取消收藏！',
						icon: 'none',
						duration: 1500
					});
					this.IsCollect = false;
				} else {
					uni.showToast({
						title: '添加收藏成功！',
						icon: 'none',
						duration: 1500
					});
					this.IsCollect = true;
				}
			}
			if (result.code == 2) {
				uni.hideToast();
				toLogin();
			}
		},
		async followfun() {
			let url = this.Isfollow ? 'User/ReCollections' : 'User/AddCollections';
			let result = await post(url, {
				StoreId: this.StoreId,
				userId: this.userId,
				token: this.token,
				Type: 2
			});
			if (result.code == 0) {
				if (this.Isfollow) {
					uni.showToast({
						title: '已取消关注！',
						icon: 'none',
						duration: 1500
					});
					this.Isfollow = false;
				} else {
					uni.showToast({
						title: '关注成功！',
						icon: 'none',
						duration: 1500
					});
					this.Isfollow = true;
				}
			}
			if (result.code == 2) {
				uni.hideToast();
				toLogin();
			}
		}
	},
	// #ifdef MP-WEIXIN
	onShareAppMessage: function(e) {
		// 设置菜单中的转发按钮触发转发事件时的转发内容
		var shareObj = {
			title: this.classdetail.Name, // 默认是小程序的名称(可以写slogan等)
			path: '/pages/course/classDetails/classDetails?detailId=' + this.Id + '&inCode=' + this.ReferralCode, // 默认是当前页面，必须是以‘/’开头的完整路径
			imageUrl: this.classdetail.PicImg,
			success: function(res) {
				// 转发成功之后的回调
				if (res.errMsg == 'shareAppMessage:ok') {
					console.log('1111111111111111');
				}
			},
			fail: function() {
				console.log('22222222222'); // 转发失败之后的回调
				if (res.errMsg == 'shareAppMessage:fail cancel') {
					// 用户取消转发
				} else if (res.errMsg == 'shareAppMessage:fail') {
					// 转发失败，其中 detail message 为详细失败信息
				}
			},
			complete: function() {
				// 转发结束之后的回调（转发成不成功都会执行）
				console.log('33333333333333');
			}
		};
		return shareObj;
	}
	// #endif
};
</script>

<style lang="scss">
@import './style';
.sharebtn {
	background-color: white;
	line-height: 66upx;
	color: #7c7c8a;
}
.sharebtn::after {
	border: none;
}
</style>
