<template>
	<view>
		<view class="top">
			<view class="top_1" v-for="(item, index) in modetypelist" :key="index" @click="tolink('/pages/index/pickMode/pickMode?typeId=' + item.Id)">
				<view class="typeBac">
					<image :src="item.CoverLogo"></image>
					<view class="type_1">
						{{ item.TypeName }}
						<text class="iconfont icon-arrow_r"></text>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom">
			<text class="iconfont icon-shezhi icon"></text>
			我的模式
		</view>
	</view>
</template>

<script>
import { post, toLogin } from '@/common/util.js';
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
import noData from '@/components/noData.vue'; //暂无数据
export default {
	data() {
		return {
			userId: '',
			token: '',
			Page: 1,
			PageSize: 4,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			modetypelist: []
		};
	},
	components: {
		uniLoadMore,
		noData
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.getTraininModeTypeList();
	},
	methods: {
		//跳转
		tolink(Url) {
			uni.navigateTo({
				url: Url
			});
		},
		async getTraininModeTypeList() {
			let result = await post('Device/GetTraininModeTypeList', {
				UserId: this.userId,
				Token: this.token,
				Page: this.Page,
				PageSize: this.PageSize
			});
			if (result.code == 0) {
				this.modetypelist = result.data;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.top {
	margin: 15upx;
	.top_1 {
		display: inline-block;
		.typeBac {
			padding: 15upx;
			position: relative;
			image {
				width: 333upx;
				height: 240upx;
			}
			.type_1 {
				color: white;
				font-size: 38upx;
				position: absolute;
				top: 90upx;
				left: 90upx;
				text {
					margin-left: 10upx;
				}
			}
		}
	}
}
.bottom {
	color: #ff7226;
	width: 100%;
	height: 90upx;
	line-height: 90upx;
	text-align: center;
	font-size: 32upx;
	background-color: white;
	position: fixed;
	bottom: 0;
	.icon {
		font-size: 45upx;
		vertical-align: bottom;
		margin-right: 10upx;
	}
}
</style>
