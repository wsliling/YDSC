<template>
	<view class="applyShop">
		<block v-if="IsAudit == 9 || IsAudit == 99">
			<view class="line"></view>
			<view class="form">
				<view class="name">
					<text class="name_1">地区</text>
					<view class="name_2"><input @click="choseSite" type="text" v-model="areadText" :disabled="true" placeholder="请选择地区" /></view>
				</view>
				<view class="name">
					<text class="name_1">名称</text>
					<view class="name_2"><input type="text" v-model="name" placeholder="请输入机构名称" /></view>
				</view>
				<view class="name">
					<text class="name_1">地址</text>
					<view class="name_2"><input type="text" v-model="address" placeholder="请输入机构地址" /></view>
				</view>
				<view class="name">
					<text class="name_1">联系电话</text>
					<view class="name_2"><input type="number" v-model="mobile" placeholder="请输入联系电话" /></view>
				</view>
				<view class="name">
					<text class="name_1">法人代表</text>
					<view class="name_2"><input type="text" v-model="legal" placeholder="请输入法人代表" /></view>
				</view>
				<view class="name">
					<text class="name_1">银行开户行</text>
					<view class="name_2"><input type="text" v-model="bank" placeholder="请输入银行开户行" /></view>
				</view>
				<view class="name">
					<text class="name_1">银行对公账户</text>
					<view class="name_2"><input type="number" v-model="bankNumber" placeholder="请输入对公账户" /></view>
				</view>
				<view class="upImg">
					<view class="upImg_1">合法资质证明</view>
					<view class="upImg_2">
						<view class="chooseImg" @click="chooseImage">
							<image v-if="base64Img" :src="tempbase64Img" mode="aspectFit"></image>
							<block v-else>
								<text class="iconfont icon-fabu"></text>
								<view>上传资质证明</view>
							</block>
						</view>
					</view>
				</view>
			</view>
			<view class="upBtn" @click="submit">提交</view>
			<mpvue-city-picker
				v-if="hasData"
				:province="province"
				ref="mpvueCityPicker"
				:pickerValueDefault="cityPickerValueDefault"
				@onconfirm="onconfirm"
				:themeColor="'#007aff'"
			></mpvue-city-picker>
		</block>
		<block v-else>
			<view class="auditbox">
				<view v-if="IsAudit == 0">
					<text class="iconfont icon-shizhong"></text>
					<view>资料将在24小时内审核通过，请耐心等待</view>
				</view>
				<view v-if="IsAudit == 1">
					<text class="iconfont icon-xiaoxi-chenggong"></text>
					<view>认证成功</view>
				</view>
				<view v-if="IsAudit == 2">
					<text class="iconfont icon-shibai"></text>
					<view>认证失败</view>
					<text>{{ AuditReason }}</text>
					<button @click="again">重新认证</button>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
import { post, valPhone, valbankNo, permision } from '@/common/util.js';
import { pathToBase64 } from '@/common/image-tools.js';
export default {
	components: { mpvueCityPicker },
	data() {
		return {
			userId: '',
			token: '',
			province: {},
			cityPickerValueDefault: [0, 0, 0], //默认选中
			AreaCode: '', //地区代码
			areadText: '',
			index: 0,
			name: '', //机构名称
			address: '', //详细地址
			mobile: '', //联系电话
			legal: '', //法人代表
			bank: '', //开户银行
			bankNumber: '', //银行对公账户
			base64Img: '', //资质
			tempbase64Img: '',
			IsAudit: 9,
			AuditReason: '',
			hasData: false,
			pickerText: '', //选择的地址值
			pickerTextArr: [],
			code: '' //地址code
		};
	},
	onShow() {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.quanxian();
	},
	onLoad(e) {
		this.userId = uni.getStorageSync('userId');
		this.token = uni.getStorageSync('token');
		this.StoreAuthInfo();
		this.getShopArea();
	},
	methods: {
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
		choseSite() {
			this.index = 2;
			this.cityPickerValueDefault = [0, 0, 0];
			this.areadText = '';
			this.getShopArea();
			this.$refs.mpvueCityPicker.show();
		},
		onconfirm(code) {
			this.AreaCode = code[this.index];
			this.areadText = code[3];
			this.pickerTextArr = code[3].split(' ');
			console.log(this.AreaCode);
		},
		// 上传图片
		async chooseImage() {
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				success: async res => {
					let base64 = await pathToBase64(res.tempFilePaths[0]);
					this.tempbase64Img = res.tempFilePaths[0];
					this.base64Img = base64;
				}
			});
		},
		// 获取可认证区域
		async getShopArea() {
			this.province = await post('Area/GetArea', {
				Types: 'Province'
			});
			this.hasData = true;
		},
		// 重新认证
		again() {
			this.IsAudit = 9;
		},
		// 获取审核状态
		async StoreAuthInfo() {
			let res = await post('User/StoreAuthInfo', {
				UserId: this.userId,
				Token: this.token,
				IsBusiness: 1
			});
			if (res.code == 0 && res.data.Id != 0) {
				this.IsAudit = res.data.IsAudit;
				this.name = res.data.Name;
			}
		},
		//信息校验
		valInfo() {
			if (!this.areadText) {
				uni.showToast({
					title: '请选择地区!',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (!this.name) {
				uni.showToast({
					title: '请输入机构名称!',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (!this.address) {
				uni.showToast({
					title: '请输入机构地址!',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (!valPhone(this.mobile)) {
				return false;
			}
			if (!this.legal) {
				uni.showToast({
					title: '请输入法人代表!',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (!this.bank) {
				uni.showToast({
					title: '请输入银行开户行!',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (!valbankNo(this.bankNumber)) {
				return false;
			}
			if (!this.base64Img) {
				uni.showToast({
					title: '请上传资质证明!',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			return true;
		},
		submit() {
			if (this.valInfo()) {
				this.open();
			}
		},
		async open() {
			let res = await post('User/StoreAuth', {
				UserId: this.userId,
				Token: this.token,
				AreaCode: this.AreaCode,
				Name: this.name,
				Address: this.address,
				Phone: this.mobile,
				BankAddress: this.bank,
				BankCardNo: this.bankNumber,
				LegalPerson: this.legal,
				BusinessLicense: this.base64Img,
				IsBusiness: 1
			});
			if (res.code == 0) {
				console.log(res);
				this.StoreAuthInfo();
			}
		}
	}
};
</script>

<style lang="scss">
.applyShop {
	height: 100vh;
	.line {
		height: 22upx;
		background-color: #f3f3f3;
	}
	.form {
		background-color: white;
		.name {
			display: flex;
			align-items: center;
			border-bottom: 1px solid #f3f3f3;
			padding: 20upx 0;
			margin: 0 30upx;
			.name_1 {
				flex: 1;
			}
			.name_2 {
				flex: 2;
			}
		}
		.upImg {
			padding: 20upx 15upx 20upx 30upx;
			.upImg_2 {
				padding: 20upx 20upx 20upx 0;
			}
		}
	}
	.upBtn {
		background-color: #fa6008;
		color: white;
		border-radius: 30px;
		text-align: center;
		width: 90%;
		height: 90upx;
		line-height: 90upx;
		margin: 50upx auto;
	}
	.chooseImg {
		width: 100%;
		height: 350rpx;
		border: 1px dashed #cccccc;
		border-radius: 10rpx;
		text {
			display: inline-block;
			width: 100%;
			font-size: 60rpx;
			color: #cccccc;
			text-align: center;
			height: 45rpx;
			line-height: 300rpx;
		}
		image {
			width: 100%;
			height: 100%;
		}
		view {
			width: 100%;
			height: 45rpx;
			line-height: 45rpx;
			text-align: center;
			color: #ccc;
		}
	}
	.auditbox {
		min-height: 445rpx;
		margin-top: 20rpx;
		background-color: #fff;
		padding-bottom: 20rpx;
		view {
			text-align: center;
			font-size: 36rpx;
			font-weight: 600;
		}
		text {
			font-size: 28rpx;
			color: #999;
			font-weight: 100;
		}
		.icon-shizhong {
			font-size: 175rpx;

			color: #ffaa00;
		}
		.icon-xiaoxi-chenggong {
			font-size: 175rpx;

			color: #ffaa00;
		}
		.icon-shibai {
			font-size: 160rpx;

			color: #ff3434;
		}
		button {
			height: 90rpx;
			width: 520rpx;
			border-radius: 40rpx;
			margin: 20rpx auto;
			border: 1rpx solid #ff3333;
			color: #ff3333;
			font-size: 32rpx;
			text-align: center;
			line-height: 90rpx;
			background-color: #fff;
		}
	}
}
</style>
