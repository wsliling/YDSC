<template>
	<view class="content">
		<view class="invoiceList" v-if="list.length > 0">
			<view class="item uni-bg-white uni-mb10" v-for="(item, index) in list" :key="index">
				<view class="item__bd" @click="choseInvoice(index)">
					<view class="remarks">
						<text class="name">抬头名称：{{ item.HeaderName }}</text>
					</view>
					<view class="type">类型：{{ item.InvoiceTitleStr }}</view>
					<view class="type" v-if="item.InvoiceTitle != 1">税号：{{ item.TaxNumber }}</view>
				</view>
				<view class="item__ft flex-between">
					<view class="flexItem checkedLabel flex flexAlignCneter" @click="setDefaultInvoice(index, item.Id)">
						<view class="IconsCK IconsCK-radio" :class="{ checked: item.IsDefault === 1 }"></view>
						<text v-if="item.IsDefault === 1">已设为默认</text>
						<text v-else>设为默认</text>
					</view>
					<view class="flexItem flex-start">
						<view class="iconText flex-start" @click="gotoAddInvoice(item.Id)">
							<view class="icon uni-icon uni-icon-compose" style="font-size: 40upx;"></view>
							编辑
						</view>
						<view class="iconText flex-start" @click="deleteBtn(index, item.Id)">
							<view class="icon iconfont icon-del"></view>
							删除
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 没有数据的时候 -->
		<noData :isShow="noDataIsShow" tips="抱歉，您还没有添加发票哦~"></noData>
		<!-- 没有数据的时候 end -->
		<view style="height: 90upx;"></view>
		<view class="fixedbtn">
			<view class="btn flex-center" @click="gotoAddInvoice()">
				<view class="uni-icon uni-icon-plus mr1"></view>
				<text>新增发票信息</text>
			</view>
		</view>
	</view>
</template>

<script>
import { host, post, get, toLogin } from '@/common/util.js';
import noData from '@/components/noData.vue'; //暂无数据
export default {
	components: {
		noData
	},
	data() {
		return {
			InvoiceId: 0,
			pagetype: '', //页面来源
			userId: '',
			token: '',
			list: [],
			shopIndex: 0,
			noDataIsShow: false
		};
	},
	// #ifdef APP-PLUS
	onLoad(e) {
		this.pagetype = e.pagetype || '';
		this.shopIndex = e.shopIndex || 0;
	},
	// #endif
	onShow() {
		this.list = [];
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		// #ifndef APP-PLUS
		this.pagetype = this.$root.$mp.query.pagetype || '';
		this.shopIndex = this.$root.$mp.query.shopIndex || 0;
		// #endif
		this.getInvoice();
	},
	methods: {
		choseInvoice(index) {
			let _this = this;
			if (this.pagetype == 'confirm') {
				this.$set(_this.list[index], 'shopIndex', _this.shopIndex);
				uni.setStorageSync('invoiceinfo', this.list[index]);
				uni.navigateBack();
			}
		},
		gotoAddInvoice(id) {
			let goUrl = '';
			if (id) {
				goUrl = '/pages/member/addInvoice/addInvoice?id=' + id;
			} else {
				goUrl = '/pages/member/addInvoice/addInvoice';
			}
			uni.navigateTo({
				url: goUrl
			});
		},
		async getInvoice() {
			//获取发票列表
			let result = await post('Invoice/invoiceList', {
				//发票列表最多只能有10个，不用做分页
				userId: this.userId,
				token: this.token
			});
			let _this = this;
			if (result.code === 0) {
				if (result.data.length > 0) {
					this.noDataIsShow = false;
					_this.list = _this.list.concat(result.data);
				} else {
					this.noDataIsShow = true;
				}
			} else if (result.code === 2) {
				uni.hideToast();
				toLogin();
			} else {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 1500
				});
			}
		},
		async setDefaultInvoice(index, id) {
			//设为默认
			let result = await post('Invoice/SetDefaultInvoice', {
				UserId: this.userId,
				Token: this.token,
				Id: id
			});
			if (result.code === 0) {
				for (let i = 0; i < this.list.length; i++) {
					if (index === i) {
						this.$set(this.list[i], 'IsDefault', 1);
					} else {
						this.$set(this.list[i], 'IsDefault', 0);
					}
				}
			} else {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 1500
				});
			}
		},
		deleteBtn(index, fId) {
			let _this = this;
			//#ifndef APP-PLUS
			uni.showModal({
				title: '提示',
				content: '您确定要删除该发票信息吗？',
				success: function(res) {
					if (res.confirm) {
						_this.Deleteinvoice(index, fId);
					} else if (res.cancel) {
					}
				}
			});
			//#endif
			//#ifdef APP-PLUS
			this.$showModal({
				title: '提示',
				content: '您确定要删除该发票信息吗？'
			})
				.then(res => {
					_this.Deleteinvoice(index, fId);
					//确认
				})
				.catch(res => {
					//取消
				});
			//#endif
		},
		async Deleteinvoice(index, fId) {
			//删除发票
			let result = await post('Invoice/Deleteinvoice', {
				userId: this.userId,
				token: this.token,
				Id: fId
			});
			if (result.code === 0) {
				let _this = this;
				uni.showToast({
					title: '删除成功！',
					icon: 'none',
					duration: 1500,
					success: function() {
						_this.$nextTick(function() {
							_this.list.splice(index, 1);
						});
					}
				});
			} else if (result.code === 2) {
				uni.hideToast();
				toLogin();
			} else {
				uni.showToast({
					title: result.msg,
					icon: 'none',
					duration: 1500
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	height: 100%;
	padding-top: 20upx;
}

.invoiceList .item .IconsCK {
	margin-right: 8upx;
}
.IconsCK.IconsCK-radio.checked:after {
	color: #89674c;
}
.invoiceList .item .item__bd {
	padding: 30upx 20upx;
}

.invoiceList .item .item__bd .remarks {
	font-size: 30upx;
}

.invoiceList .item .item__bd .remarks .tel {
	color: #999;
	margin-left: 20upx;
}

.invoiceList .item .item__bd .address {
	font-size: 28upx;
	color: #333333;
	line-height: 1.4;
	margin-top: 6upx;
}
.invoiceList .item .item__bd .type {
	color: #999;
}
.invoiceList .item .item__ft {
	border-top: 1px solid #f2f2f2;
	padding: 10upx 20upx;
	line-height: 60upx;
	color: #999999;
}

.invoiceList .item .item__ft .iconText {
	margin-left: 30upx;
}

.invoiceList .item .item__ft .icon {
	font-size: 36upx;
	margin-right: 10upx;
}
.fixedbtn {
	padding: 0;
	.btn {
		border-radius: 0;
		background-color: #89674c;
	}
}
</style>
