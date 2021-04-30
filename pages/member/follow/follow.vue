<template>
	<view>
		<scroll-view id="tab-bar" class="index-swiper-tab" scroll-x>
			<view
				style="width: 25%;"
				v-for="(tab, index) in tabnav"
				:key="index"
				:class="['item', tabIndex == index ? 'active' : '']"
				:id="'tabNum' + index"
				:data-current="index"
				@click="tapTab(index, tab.Id)"
			>
				{{ tab.TypeName }}
			</view>
			<view class="bb_line" :style="'left:' + tabStyle + 'rpx'"></view>
		</scroll-view>
		<view style="height:45px"></view>
		<view class="Yi-Userlist bg_fff" v-if="hasData">
			<view class="user-item" v-for="(item, index) in datalist" :key="index">
				<view class="flex-between" v-if="Type == 0">
					<view class="author flex-start" @click="tolink('/pages/homepage/homepage?id=' + item.ToUserId)">
						<view class="tx"><image :src="item.ToMemberHead || 'http://xcx.yixijiu19.com/static/default.png'" mode="aspectFill"></image></view>
						<view class="info">
							<view class="name uni-ellipsis">{{ item.ToMemberName || '匿名用户' }}</view>
							<view class="fz12 c_999 uni-ellipsis">粉丝{{ item.Fans > 9999 ? (item.Fans / 9999).toFixed(1) + 'W' : item.Fans }}</view>
						</view>
					</view>
					<view class="flow" :class="{ active: item.IsFollow > 0 }" @click="getFollowOperation(item.ToUserId, index)">{{ item.IsFollow > 0 ? '已关注' : '关注' }}</view>
				</view>
				<view class="flex-between" v-if="Type == 1">
					<view class="author flex-start" @click="tolink('/pages/homepage/homepage?id=' + item.UserId)">
						<view class="tx"><image :src="item.MemberHead || 'http://xcx.yixijiu19.com/static/default.png'" mode="aspectFill"></image></view>
						<view class="info">
							<view class="name uni-ellipsis">{{ item.MemberName || '匿名用户' }}</view>
							<view class="fz12 c_999 uni-ellipsis">粉丝{{ item.Fans > 9999 ? (item.Fans / 9999).toFixed(1) + 'W' : item.Fans }}</view>
						</view>
					</view>
					<view class="flow" :class="{ active: item.IsFollow > 0 }" @click="getFollowOperation(item.UserId, index)">{{ item.IsFollow > 0 ? '已互关' : '关注' }}</view>
				</view>
				<view class="flex-between" v-if="Type == 2">
					<view class="author flex-start" @click="tolink('/pages/homepage/homepage?id=' + item.UserId)">
						<view class="tx"><image :src="item.MemberHead || 'http://xcx.yixijiu19.com/static/default.png'" mode="aspectFill"></image></view>
						<view class="info">
							<view class="name uni-ellipsis">{{ item.MemberName || '匿名用户' }}</view>
							<view class="fz12 c_999 uni-ellipsis">粉丝{{ item.Fans > 9999 ? (item.Fans / 9999).toFixed(1) + 'W' : item.Fans }}</view>
						</view>
					</view>
					<view class="flow" :class="{ active: item.IsFollow > 0 }" @click="getFollowOperation(item.UserId, index)">{{ item.IsFollow > 0 ? '已互关' : '关注' }}</view>
				</view>
			</view>
		</view>
		<view class="Yi-Userlist bg_fff" v-if="hasData && Type == 3">
			<view class="user-item" v-for="(item, _index) in datalists" :key="_index">
				<view class="flex-between">
					<view class="author flex-start" @click="tolink('/pages/goods/storeIndex/storeIndex?id=' + item.ShopId)">
						<view class="tx"><image :src="item.Logo || 'http://xcx.yixijiu19.com/static/default.png'" mode="aspectFill"></image></view>
						<view class="info">
							<view class="name uni-ellipsis">{{ item.Name || '匿名用户' }}</view>
							<view class="fz12 c_999 uni-ellipsis">粉丝{{ item.FollowNum > 9999 ? (item.FollowNum / 9999).toFixed(1) + 'W' : item.FollowNum }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-tab-bar-loading" v-if="hasData"><uni-load-more :loadingType="loadingType"></uni-load-more></view>
		<noData :isShow="noDataIsShow"></noData>
	</view>
</template>

<script>
import { post, get } from '@/common/util.js';
import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
import noData from '@/components/noData.vue'; //暂无数据
export default {
	data() {
		return {
			barHeight: 0,
			userId: '',
			token: '',
			tabIndex: 0,
			tabnav: [
				{
					Id: 0,
					TypeName: '全部'
				},
				{
					Id: 1,
					TypeName: '用户'
				},
				{
					Id: 2,
					TypeName: '教练'
				},
				{
					Id: 3,
					TypeName: '店铺'
				}
			],
			page: 1,
			pageSize: 16,
			loadingType: 0, //0加载前，1加载中，2没有更多了
			isLoad: false,
			hasData: false,
			noDataIsShow: false,
			Type: 0,
			datalist: [], //列表,
			datalists: [] //店铺列表
		};
	},
	components: {
		uniLoadMore,
		noData
	},
	computed: {
		tabStyle() {
			return (750 / this.tabnav.length) * this.tabIndex + (750 / this.tabnav.length - 68) / 2;
		}
	},
	onLoad(e) {
		// #ifdef APP-PLUS
		var height = plus.navigator.getStatusbarHeight();
		this.barHeight = height;
		// #endif
		// #ifdef H5
		this.barHeight = 0;
		// #endif
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.Type = e.type || 0;
		this.tabIndex = e.type || 0;
		this.getList();
		this.getLists();
	},
	methods: {
		//跳转
		tolink(url) {
			uni.navigateTo({
				url: url
			});
		},
		//点击tab-bar
		tapTab(index, id) {
			this.tabIndex = index;
			this.Type = id;
			this.page = 1;
			this.datalist = [];
			if (this.Type < 3) {
				this.getList();
			}
			if (this.Type == 3) {
				this.getLists();
			}
		},
		/*获取关注列表*/
		async getList() {
			let result = await post('User/UserFollowList', {
				UserId: this.userId,
				Token: this.token,
				page: this.page,
				pageSize: this.pageSize,
				myType: this.Type
			});
			if (result.code === 0) {
				if (result.data.length > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
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
			}
		},
		/*获取店铺列表*/
		async getLists() {
			let result = await post('User/MemberCollections', {
				UserId: this.userId,
				Token: this.token,
				page: this.page,
				pageSize: this.pageSize,
				Type: 1
			});
			if (result.code === 0) {
				if (result.data.length > 0) {
					this.hasData = true;
					this.noDataIsShow = false;
				}
				if (result.data.length == 0 && this.page == 1) {
					this.noDataIsShow = true;
					this.hasData = false;
				}
				if (this.page === 1) {
					this.datalists = result.data;
				}
				if (this.page > 1) {
					this.datalists = this.datalists.concat(result.data);
				}
				if (result.data.length < this.pageSize) {
					this.isLoad = false;
					this.loadingType = 2;
				} else {
					this.isLoad = true;
					this.loadingType = 0;
				}
			}
		},
		// 关注或取消关注
		getFollowOperation(id, index) {
			post('Find/FollowOperation', {
				UserId: this.userId,
				Token: this.token,
				ToMemberId: id
			}).then(res => {
				if (res.code === 0) {
					let _this = this;
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
					if (_this.datalist[index].IsFollow) {
						_this.$set(_this.datalist[index], 'IsFollow', 0);
					} else {
						_this.$set(_this.datalist[index], 'IsFollow', 1);
					}
				}
			});
		}
	},
	// 上拉加载
	onReachBottom: function() {
		if (this.isLoad) {
			this.loadingType = 1;
			this.page++;
			this.getList();
		} else {
			this.loadingType = 2;
		}
	}
};
</script>

<style lang="scss" scoped>
@import './style';
</style>
