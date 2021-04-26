<template>
	<view>
		<view class="mode">
			<view class="mode_1" v-for="(item, index) in modelist" :key="index">
				<view class="modeBac">
					<image :src="item.CoverLogo"></image>
					<view class="mode_2">
						{{ item.TypeName }}
						<text class="iconfont icon-arrow_r"></text>
					</view>
				</view>
			</view>
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
			modelist: [],
			Id: 0
		};
	},
	components: {
		uniLoadMore,
		noData
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Id = e.typeId;
		this.getTraininModeList();
	},
	methods: {
		async getTraininModeList() {
			let result = await post('Device/GetTraininModeList', {
				UserId: this.userId,
				Token: this.token,
				Page: this.Page,
				PageSize: this.PageSize,
				TypeId: this.Id
			});
			if (result.code == 0) {
				this.modelist = result.data;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.mode {
	margin: 15upx;
	.mode_1 {
		display: inline-block;
		.modeBac {
			padding: 15upx;
			position: relative;
			image {
				width: 700upx;
				height: 240upx;
			}
			.mode_2 {
				color: white;
				font-size: 38upx;
				position: absolute;
				top: 90upx;
				right: 50upx;
				text {
					margin-left: 10upx;
				}
			}
		}
	}
}
</style>
