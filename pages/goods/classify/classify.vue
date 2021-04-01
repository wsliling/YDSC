<template>
	<view class="content" style="height: 100%;">
		<!-- 	<uni-nav-bar fixed="true" color="#333333" background-color="#ffffff" :border="true">
			<block slot="center" class="flex1 color_fff">
				<view class="input-view" @click="tolink('/pages/ProductList/search')">
					<uni-icons class="input-uni-icon" type="search" size="22" color="#b8b8b8" />
					<text class="c_999 fz15 ml5">搜索产品</text>
				</view>
			</block>
		</uni-nav-bar> -->
		<view class="classify">
			<scroll-view class="classify-left" scroll-y :style="'height:' + height + 'px'">
				<view @click="getclassIndex(index, item.Id)" v-for="(item, index) in typeList" :key="index" :class="classIndex == index ? 'active' : ''">{{ item.Name }}</view>
			</scroll-view>
			<scroll-view class="classify-right flex1" scroll-y :scroll-top="scrollTop" :style="'height:' + height + 'px'" scroll-with-animation>
				<block v-if="hasData" v-for="(tab, tindex) in subCategoryList" :key="tindex">
					<view class="title">{{ tab.FatherName }}</view>
					<view class="goodsBox">
						<block v-for="(item, index) in tab.data" :key="index">
							<view class="goods" @click="tolink('/pages/ProductList/ProductList?cid=' + item.Id + '&keyname=' + item.ClassName)">
								<view class="icon flex-center"><image :src="item.PicUrl || 'http://via.placeholder.com/100x100'" mode="widthFix"></image></view>
								<view class="uni-ellipsis">{{ item.ClassName }}</view>
							</view>
						</block>
					</view>
				</block>
				<view v-if="hasProData" class="uni-product-list level__product-list uni-mt10" style="padding-left: 20upx;">
					<block v-for="(item, index) in prolist" :key="index"><product :datajson="item" v-on:goDetail="goDetail"></product></block>
				</view>
				<view class="center c_theme uni-mt10" v-if="showMore" @click="tolink('/pages/ProductList/ProductList?cid=' + cid)">查看更多→</view>
				<noData :isShow="noDataIsShow"></noData>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { post } from '@/common/util.js';
import UniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import UniIcons from '@/components/uni-icons/uni-icons.vue';
import noData from '@/components/noData.vue'; //暂无数据
import product from '@/components/product.vue';
export default {
	data() {
		return {
			barHeight: 0,
			height: 0,
			scrollTop: 0,
			scrollHeight: 0,
			TypeId: '',
			cid: '',
			typeList: [],
			classIndex: 0,
			subCategoryList: [],
			prolist: [],
			selName: '',
			hasData: false, //是否有下级分类
			hasProData: false, //是否有产品
			noDataIsShow: false,
			showMore: false
		};
	},
	components: { UniNavBar, UniIcons, noData, product },
	onLoad(e) {
		// #ifdef APP-PLUS
		var height1 = plus.navigator.getStatusbarHeight();
		this.barHeight = height1;
		this.height = uni.getSystemInfoSync().windowHeight - 44 - height1;
		// #endif
		// #ifndef APP-PLUS
		this.barHeight = 0;
		this.height = uni.getSystemInfoSync().windowHeight - 44;
		// #endif
		this.getTypeList();
	},
	onShow() {},
	methods: {
		//跳转
		tolink(Url) {
			uni.navigateTo({
				url: Url
			});
		},
		async getTypeList() {
			let result = await post('Goods/TypeList', { BrandEnum: 26 });
			if (result.code === 0) {
				this.typeList = result.data;
				this.typeId = result.data[0].Id;
				this.getsubClass();
			}
		},
		getclassIndex(index, id) {
			this.showMore = false;
			this.scrollTop = -this.scrollHeight * index;
			this.classIndex = index;
			this.typeId = id;
			this.getsubClass();
		},
		//获取二级分类
		async getsubClass() {
			let result = await post('Goods/GetProductClass', {
				TypeId: this.typeId,
				ParentId: -1
			});
			if (result.code === 0) {
				if (result.data.length) {
					this.hasData = true;
					this.hasProData = false;
					this.noDataIsShow = false;
					let data = result.data;
					let Arr1 = {},
						dest = []; //分别是原数组，重组后数组
					data.forEach(function(item) {
						if (!Arr1[item.FatherId]) {
							dest.push({
								FatherName: item.FatherName,
								FatherId: item.FatherId,
								data: [item]
							});
							Arr1[item.FatherId] = item;
						} else {
							dest.forEach(function(item2) {
								if (item2.FatherId == item.FatherId) {
									item2.data.push(item);
									return;
								}
							});
						}
					});
					if (dest.length) {
						if (dest.length > 1) {
							dest = dest.slice(1, dest.length);
						}
						this.subCategoryList = dest;
					}
					console.log(this.subCategoryList);
				} else {
					this.hasData = false;
					this.getGoodsList();
				}
			}
		},

		async getGoodsList() {
			let result = await post('Goods/GoodsList', {
				TypeId: this.typeId,
				AreaCode: uni.getStorageSync('AreaCode'),
				Page: 1,
				PageSize: 12
			});
			if (result.code === 0) {
				let len = result.data.length;
				if (len > 0) {
					this.hasProData = true;
					this.noDataIsShow = false;
					this.prolist = result.data;
					if (len > 12) {
						this.showMore = true;
					}
				} else {
					this.noDataIsShow = true;
					this.hasProData = false;
				}
			}
		},
		goDetail(id) {
			uni.navigateTo({
				url: '/pages/productDetail/productDetail?proId=' + id
			});
		},
		scroll(e) {
			this.scrollHeight = e.detail.scrollHeight;
		}
	}
};
</script>

<style lang="scss">
@import './style';
</style>
