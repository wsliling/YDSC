<template>
	<view>
		<view class="record">
			<uni-collapse class="rec" accordion="true" v-for="(item, index) in 5" :key="index">
				<uni-collapse-item title="2021年3月">
					<view class="con">
						<view class="course">
							<view class="cou_1">
								<view class="cou_1_1">健身课程(分钟)</view>
								<view class="cou_1_2">12.30</view>
							</view>
							<view class="cou_1">
								<view class="cou_1_1">热量(分钟)</view>
								<view class="cou_1_2">86</view>
							</view>
							<view class="cou_1">
								<view class="cou_1_1">次数</view>
								<view class="cou_1_2">2</view>
							</view>
						</view>
						<uni-collapse accordion="true">
							<uni-collapse-item title="超强下腹燃脂,7分钟躺练版" thumb="https://yd.wtanvxin.com/static/index6.png" lititle="true" lititle1="00:09:23" lititle2="85千卡">
								<view class="con_1">
									<view class="course">
										<view class="cou_1">
											<view class="cou_1_1">健身课程(分钟)</view>
											<view class="cou_1_2">12.30</view>
										</view>
										<view class="cou_1">
											<view class="cou_1_1">热量(分钟)</view>
											<view class="cou_1_2">86</view>
										</view>
										<view class="cou_1">
											<view class="cou_1_1">次数</view>
											<view class="cou_1_2">2</view>
										</view>
									</view>
								</view>
							</uni-collapse-item>
						</uni-collapse>
						<uni-collapse accordion="true">
							<uni-collapse-item title="360°全身激活" thumb="https://yd.wtanvxin.com/static/index7.png" lititle="true" lititle1="00:09:23" lititle2="85千卡">
								<view class="con_1">
									<view class="course">
										<view class="cou_1">
											<view class="cou_1_1">健身课程(分钟)</view>
											<view class="cou_1_2">12.30</view>
										</view>
										<view class="cou_1">
											<view class="cou_1_1">热量(分钟)</view>
											<view class="cou_1_2">86</view>
										</view>
										<view class="cou_1">
											<view class="cou_1_1">次数</view>
											<view class="cou_1_2">2</view>
										</view>
									</view>
								</view>
							</uni-collapse-item>
						</uni-collapse>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>
	</view>
</template>

<script>
import uniCollapse from '@/components/uni_modules/uni-collapse/components/uni-collapse/uni-collapse.vue';
import uniCollapseItem from '@/components/uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.vue';
export default {
	data() {
		return {};
	},
	components: {
		uniCollapse,
		uniCollapseItem
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
.record {
	margin: 30upx 25upx;
	.rec {
		margin-top: 30upx;
		display: block;
	}
	.con {
		.course {
			padding: 20upx 30upx;
			display: flex;
			.cou_1 {
				flex: 1;
				text-align: center;
				.cou_1_1 {
					color: #909090;
				}
				.cou_1_2 {
					color: #fa6b1e;
				}
			}
		}
		.con_1 {
			.course {
				display: flex;
				.cou_1 {
					flex: 1;
					text-align: center;
					.cou_1_1 {
						color: #909090;
					}
					.cou_1_2 {
						color: #fa6b1e;
					}
				}
			}
		}
	}
}
</style>
