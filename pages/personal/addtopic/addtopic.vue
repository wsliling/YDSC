<template>
	<view style="padding-top: 20upx;">
		<view class="line-list">
			<block v-for="(item, index) in topiclist" :key="index">
				<view class="line-item" @click="checkTopic(index)">
					<view class="flex-start">
						<image class="iconimg" src="/static/discover/topic.png" mode="aspectFill"></image>
						<text class="title uni-ellipsis flex1">{{ item.Title }}</text>
						<view class="check iconfont icon-check" v-if="checkId == index"></view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
import { post, get, toLogin } from '@/common/util.js';
export default {
	data() {
		return {
			userId: '',
			token: '',
			checkId: 0,
			topiclist: [],
			topic: ''
		};
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getTopicList();
	},
	methods: {
		checkTopic(id) {
			this.checkId = id;
			this.topic = uni.setStorageSync('topic', this.topiclist[id].Title);
			this.topicId = uni.setStorageSync('topicId', this.topiclist[id].Id);
			setTimeout(() => {
				uni.navigateTo({
					url: '/pages/personal/artPost/topicPost'
				});
			}, 500);
		},
		/*获取话题详情*/
		async getTopicList() {
			let result = await post('Topic/GetTopicList', {
				UserId: uni.getStorageSync('userId'),
				Token: uni.getStorageSync('token')
			});
			if (result.code === 0) {
				this.topiclist = result.data;
			}
		}
	}
};
</script>

<style scoped lang="scss">
.line-item {
	flex-direction: column;
	align-items: start;
	> view {
		width: 100%;
	}
	.iconimg {
		height: 44upx;
		width: 44upx;
		margin-right: 16upx;
	}
	.title {
		font-size: 32upx;
		font-weight: bold;
		line-height: 1;
	}
	.check {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 40upx;
		width: 40upx;
		border-radius: 50%;
		background: $primary;
		color: #fff;
	}
	.info {
		margin-left: 60upx;
		font-size: 26upx;
		color: #999;
		text {
			margin-right: 20upx;
		}
	}
}
</style>
