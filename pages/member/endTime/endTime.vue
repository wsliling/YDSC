<template>
	<view>
		<view class="begainTime">
			<view class="title">开始时间</view>
			<view class="m-day">
				<view class="item">{{ year }}年</view>
				<view class="item">
					<carousel :img-list="month" url-key="item" @selected="selectedBanner" :verticals='true':distance="'100upx'"/>
				</view>
				<view class="item">
					<carousel :img-list="day" url-key="item" @selected="selectedBanner" :verticals='true' :distance="'100upx'"/>
				</view>
			</view>
		</view>
		<view class="begainTime">
			<view class="title">持续时长</view>
			<view class="m-day">
				<view class="item"></view>
				<view class="item">
					<carousel :img-list="duration" url-key="item" @selected="selectedBanner" verticals='true' :distance="'100upx'"/>
				</view>
				<view class="item position" style="color: #000000; text-align: left; font-size: 24upx;">天</view>
			</view>
		</view>
	</view>
</template>

<script>
  import carousel from '@/components/vear-carousel/vear-carousel'
    export default {
        components: {
            carousel
        },
        data() {
            return {
			   year:'2021',
               month:['01月','02月','03月','04月','05月','06月','07月','08月','09月','10月','11月','12月'],
			   day:['01日','02日','03日','04日','05日','06日'],
			   duration:['10','20','30','40','50','60','70','80','90','100'],
            }
        },
        methods: {
            selectedBanner(item, index) {
                console.log('-------', item, index)
            }
        }
}
</script>

<style lang="scss" scoped>
page {
	overflow: hidden;
}
.begainTime {
	width: 690upx;
	height: 355upx;
	background: #fff;
	border-radius: 20upx;
	margin: 30upx auto;
	.title {
		text-align: center;
		font-size: 30upx;
		line-height: 80upx;
	}
}
.m-day {
	display: flex;
	align-items: center;
	height: 220upx;
	justify-content: space-between;
	padding: 0 20upx;
	.item {
		min-width:200upx;
		text-align: center;
		font-size: 32upx;
		color: #fa6008;
		position: relative;
	}
}
.position{
	position: absolute;
	right: 80upx;
	top: -4upx;
}
</style>
