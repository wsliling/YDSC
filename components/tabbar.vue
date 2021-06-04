<template>
    <view class="TabBar">
        <view class="tab" v-for="(item,index) in list" :key="index" @tap="navigatorTo(item.pagePath+shopId)">
            <!-- 判断是否有点击，如果没有就不是激活样式，点击就是激活的样式 -->
            <image class="imgsize" :src="current == index ? item.selectedIconPath : item.iconPath" mode="widthFix"></image>
            <view :class="['text',current == index ?'active':'']">{{item.text}}</view>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            current: {
                type: Number,
                default: 0 //默认第一个页面tabbar激活
            }
        },
		created() {
			this.shopId=uni.getStorageSync("nowShopId");
		},
        data() {
            return {
				shopId:'',
				// https://yd.wtanvxin.com
                list: [{
                        "pagePath": "/pages/goods/storeIndex/storeIndex?id=",
                        "iconPath": "https://yd.wtanvxin.com/static/s_f1.png",
                        "selectedIconPath": "../../../static/s_f1_in.png",
                        "text": "店铺首页"
                    },
                    {
                        "pagePath": "/pages/goods/storeprolist/storeprolist?id=",
                        "iconPath": "https://yd.wtanvxin.com/static/s_f2.png",
                        "selectedIconPath": "../../../static/s_f2_in.png",
                        "text": "全部商品"
                    },
                    {
                        "pagePath": "/pages/goods/storeClass/storeClass?id=",
                        "iconPath": "https://yd.wtanvxin.com/static/s_f3.png",
                        "selectedIconPath": "../../../static/s_f3_in.png",
                        "text": "商品分类"
                    },
                    {
                       "pagePath": "/pages/goods/storeInfo/storeInfo?id=",
                       "iconPath": "https://yd.wtanvxin.com/static/s_f4.png",
                       "selectedIconPath": "../../../static/s_f4_in.png",
                       "text": "店铺介绍"
                    }
                ]
            }
        },
        methods: {
            navigatorTo(e) {
                uni.navigateTo({
                	 url: e,
                })
            }
        }
    }
</script>

<style scoped>
.TabBar {
    position: fixed;
    bottom: 0;
	left: 0;
	right: 0;
    height: 100upx;
    background-color: #fff;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
	z-index: 9;
}
.tab {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.imgsize {
    width: 48upx;
    height: 48upx;
	margin-top: 10upx;
}
.text {
    font-size: 12px;
	color: #333;
}
.text.active{
	color: #fb9461;
}
</style>