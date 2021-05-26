<template>
	<view>
		<view class="topic-list uni-bg-white uni-mt10">
			<block v-for="(item, index) in topiclist" :key="index">
				<view class="topic-item" @click="tolink('/pages/personal/topicDetail/topicDetail?topicId=' + item.Id)">
					<view class="hd flex-between">
						<view class="flex-start flex1">
							<image class="iconimg" src="http://yd.wtanvxin.com/static/discover/topic.png" mode="aspectFill"></image>
							<text class="title uni-ellipsis">{{ item.Title }}</text>
						</view>
						<view class="flex-end">
							<text class="fz12 c_999">{{ item.PartNum > 9999 ? (item.PartNum / 9999).toFixed(1) + '万' : item.PartNum }}人参与</text>
							<text class="uni-icon uni-icon-arrowright fz14"></text>
						</view>
					</view>
					<view class="bd flex-between">
						<view class="bd_left flex1">
							<view class="desc uni-ellipsis2">{{ item.TopicIntro }}</view>
							<view class="ft_info flex-start">
								<view class="info-text">
									<text class="iconfont icon-yanjing"></text>
									{{ item.HitsNum > 9999 ? (item.HitsNum / 9999).toFixed(1) + '万' : item.HitsNum }}
								</view>
								<view class="info-text">
									<text class="iconfont icon-pinglun2"></text>
									{{ item.CommentNum > 9999 ? (item.CommentNum / 9999).toFixed(1) + '万' : item.CommentNum }}
								</view>
							</view>
						</view>
						<view class="img"><image :src="item.CoverLogo"></image></view>
					</view>
					<view class="topname flex-start" v-if="item.IsShowTopicStar">
						<view class="item flex-center" v-for="(items, index) in item.UserList" :key="index">
							<image class="icon" :src="'http://yd.wtanvxin.com/static/discover/top' + (index + 1) + '.png'" mode="aspectFill"></image>
							<image class="tx" :src="items.Avatar || 'http://yd.wtanvxin.com/static/default.png'"></image>
							<text class="name uni-ellipsis">{{ items.UserNick }}</text>
						</view>
					</view>
				</view>
			</block>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
		<noData :isShow="noDataIsShow"></noData>
		<view @click="tolink('/pages/personal/artPost/topicPost', 'login')" class="uploadbtn flex-column"><text class="uni-icon uni-icon-plusempty"></text></view>
	</view>
</template>

<script>
import { post, get, toLogin } from '@/common/util.js';
import noData from '@/components/noData.vue'; //暂无数据
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
export default {
	components: {
		noData,
		uniLoadMore
	},
	data() {
		return {
			userId: '',
			token: '',
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			topiclist: [],
			userlist: [],
			userlistOne1: {},
			userlistOne2: {},
			userlistOne3: {}
		};
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
	},
	onLoad() {
		this.getProList();
	},
	methods: {
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
		// 话题排行榜
		async getProList() {
			let result = await post('Topic/GetTopicRankList', {
				UserId: this.userId,
				Token: this.token
			});
			if (result.code == 0) {
				this.topiclist = result.data;
			}
		}
	}
};
</script>

<style scoped lang="scss">
@import './style';
</style>
