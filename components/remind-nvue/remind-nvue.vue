<template>
<view>
   <!-- <uni-popup type="center" ref="remind"> -->
	   <view class="uni-popup">
			<text class="pop-hd">登录提示</text>
			<text class="pop-hd2">您还没有登录，是否重新登录？</text>
			<view class="uni-close-bottom">
				<text class="button1" @click="cancel">取消</text>
				<text class="button2" @click="tabclick">确认</text>
			</view>
	   </view>
   <!-- </uni-popup> -->
</view>
</template>
<script>
import {webUrl} from '@/common/util';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
	components: {
	},
    props:{
		title:{
            type:String,
            default:'忆喜-直播'
		}
    },
    data(){
        return {
			data:{},
			showPopupShare:false,
			offsetTop:0
        }
    },
	created() {
	},
    methods:{
		cancel(){
			this.$emit('hide');
		},
		tabclick(){
			this.$emit('hide');
			this.$emit('tologin');
		}
    }
}
</script>
<style scoped lang="scss">
	.uni-popup {
		background-color: #ffffff;
		width: 460upx;
		text-align: center;
		border-radius: 16upx;
		overflow: hidden;
	}
	.pop-hd{ 
		display: inline-block;
		font-size: 32upx;
		color: #000;
		text-align:center;
		line-height:100upx;
	}
	.pop-hd2{
		display: inline-block;
		font-size: 28upx;
		color: #666;
		text-align:center;
		line-height:50upx;
		padding-bottom: 40upx;
	}
	.uni-close-bottom{ 
		display: flex;
		flex-direction: row;
		width: 460upx; 
		text-align:center;
		border-top-color: #eaeaea;
		border-top-width: 0.5px;
		border-top-style: solid;
	}
	.button1{
		display: inline-block;
		height: 80upx;
		line-height: 80upx; 
		width: 230upx;
		box-sizing: border-box;
		text-align:center;
		color: #999;
		font-size: 30upx;
		border-right-color: #eaeaea;
		border-right-width: 0.5px;
		border-right-style: solid;
	}
	.button2{
		display: inline-block;
		height: 80upx;
		line-height: 80upx; 
		width: 230upx;
		box-sizing: border-box;
		text-align:center;
		color: #FF3333;
		font-size: 30upx;
	}
</style>