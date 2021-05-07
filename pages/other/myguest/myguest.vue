<template>
	<view>
		<view class="team-header">
			<view class="invita">
				<image class="invitaBg" src="http://yd.wtanvxin.com/static/teambg.png"></image>
				<view class="info">
					<view class="info-item">
						<text>{{data.TeamNum}}</text>
						<view>总人数</view>
					</view>
					<view  class="info-item">
						<text>{{data.JTNum}}</text>
						<view>今日新增</view>
					</view>
					<view  class="info-item">
						<text>{{data.ZTNum}}</text>
						<view>昨日新增</view>
					</view>
				</view>
				<view class="invitation" v-if="FatherData.length>0">
					<image v-if="FatherData[0].Avatar" :src="FatherData[0].Avatar"></image>
					<image v-else src="http://yd.wtanvxin.com/static/default.png"></image>
					<view class="invita-name">
						<view>{{FatherData[0].NickName}}</view>
						<text>我的邀请人</text>
					</view>
				</view>
				<view class="invitation" v-else>
					<view class="invita-name">
						<!-- <view>{{data.NickName}}</view> -->
						<text>没有邀请人</text>
					</view>
				</view>
			</view>
		<!-- 	<view class="level-nav">
				<view :class="selIndex==1?'active':''" @click="tanNav(1)">
					一级好友
					<text></text>
				</view>
				<view :class="selIndex==2?'active':''" @click="tanNav(2)">
					二级好友
					<text></text>
				</view>
			</view> -->
		</view>
		<view class="team-list">
			<view class="team-title">
				我的分销团队
			</view>
			<view class="teamNav">
				<view @click="getTeamNav(index)" :class="navIndex==index?'active':''" v-for="(item, index) in teamNav" :key="index">{{item}}</view>
			</view>
			<block v-for="(item,index) in TeamList" :key="index">
				<view class="list-item">
					<view class="item-user">
						<image :src="item.Avatar" v-if="item.Avatar!=''"></image>
						<image v-else src="http://yd.wtanvxin.com/static/default.png" ></image>
						<view class="nameBox">
							<view>
								<text>{{item.NickName}}</text>
								<view class="attest" v-if="item.GradeName!='普通用户'">
									<image src='http://yd.wtanvxin.com/static/attest1.png'></image>
									{{item.GradeName}}
								</view>
							</view>
							<text>{{item.Mobile}}</text>
						</view>
					</view>
					<view class="item-time">{{item.CreateTime}}</view>
				</view>
			</block>
		</view>
		<!-- <uniLoadMore v-if="dataMore"></uniLoadMore> -->
		<noData :isShow="noData"></noData>
	</view>
</template>

<script>
	import {post} from '@/common/util.js'
	import uniLoadMore from '@/components/uni-load-more.vue'; //加载更多
	import noData from '@/components/noData.vue'; //暂无数据
	export default {
		data() {
			return {
				userId: "",
				token: "",
				page:1,
				pageSize:12,
				TeamList:[],
				FatherData:{},
				data:{},
				selIndex:1,
				noData:false,
				dataMore:true,
				teamNav:['普通用户','网红达人','经销商'],
				navIndex:0
			}
		},
		components:{
			uniLoadMore,
			noData
		},
		onLoad() {
			this.userId = uni.getStorageSync("userId");
			this.token = uni.getStorageSync("token");
			
		},
		onShow(){
			this.init()
		},
		methods: {
			getTeamNav(index){
				this.page=1
				this.navIndex=index
				this.init()
			},
			async init(){
				let result = await post('User/MyCustom',{
					UserId:this.userId,
					Token:this.token,
					Page:this.page,
					// PageSize:this.pageSize,
					GradeId:this.navIndex,
					Type:this.selIndex
				})
				if(result.code==0){
					this.data=result.data
					// console.log(this.data.FatherData)
					this.TeamList=this.data.TeamList
					this.FatherData=this.data.FatherData
					// console.log(this.TeamList===[])
					if(this.data.TeamNum==0){
						this.noData=true
						this.dataMore=false
					}else{
						this.noData=false
						this.dataMore=true
					}
				}
				
			},
			tanNav(index){
				this.page=1
				this.selIndex=index
				this.init()
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f2f2f2;
	
	}
	.team-header{
		margin-bottom: 20upx;
		background-color: #fff;
		padding: 30upx;
		.invita{
			margin-bottom: 15upx;
			height: 300upx;
			width: 100%;
			position: relative;
			border-radius: 10upx;
			.invitaBg{
				position: absolute;
				height: 300rpx;
				z-index: 1;
			}
			.info{
				display: flex;
				align-items: center;
				height: 175upx;
				z-index: 3;
				position: relative;
				.info-item{
					border-left: 1upx solid #fd8971;
					flex: 1;
					text-align: center;
					color: #fff;
					font-size: 40upx;
					view{
						margin-top: 20upx;
						font-size: 24upx;
					}
				}
			}
			.invitation{
				display: flex;
				align-items: center;
				padding-left: 30upx;
				height: 125upx;
				position: relative;
				z-index: 3;
				image{
					display: inline-block;
					border-radius: 100%;
					width: 105upx;
					height: 105upx;
				}
				.invita-name{
					margin-left: 20upx;
					color: #fff;
					font-size: 30upx;
					text{
						font-size: 24upx;
					}
				}
			}
		}
		.level-nav{
			padding: 0 130upx;
			font-size: 28upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 75upx;
			view{
				height: 75upx;
				position: relative;
				line-height: 75upx;
				text{
					height: 4upx;
					background-color: #fff;
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
				}
			}
			.active{
				color:$primary;
				text{
					background-color: $primary;
				}
			}
		}
	}
	.team-list{
		background-color: #fff;
		padding: 30rpx 30upx 0;
		
		.team-title{
			// font-size: 32rpx;
			// font-weight: 600;
			font-size: 28rpx;
			text-align: center;
			font-weight: 600;
			font-family: 'pingfang';
		}
		.teamNav{
			display: flex;
			align-items: center;
			justify-content: center;
			view{
				margin: 30rpx 20rpx;
				width: 170rpx;
				height: 60rpx;
				border: 1rpx solid #dedede;
				color: #999;
				text-align: center;
				line-height: 60rpx;
				&.active{
					color: #fff;
					background-color: #FF3333;
					border-color: #FF3333;
				}
			}
		}
		.list-item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 140upx;
			border-bottom: 1px solid #ececec;
			.item-user{
				display: flex;
				align-items: center;
				image{
					width: 80upx;
					height: 80upx;
					border-radius: 100%;
					display: inline-block;
				}
				.nameBox{
					margin-left: 20upx;
					font-size: 28upx;
					text{
						font-size: 24upx;
						color: #999;
					}
					view{
						position: relative;
						display: flex;
						align-items: center;
						text{
							flex: 1;
							font-size: 28rpx;
							color: #333;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
						.attest{
							// position: absolute;
							// right: -120rpx;
							// top: 15%;
							margin-left: 10rpx;
							width: 120rpx;
							height: 40rpx;
							background-color: #feed00;
							color: #FF3333;
							font-size: 20rpx;
							display: flex;
							align-items: center;
							border-radius: 40rpx;
							// transform: translate(-50%);
							image{
								width: 40rpx;
								height: 40rpx;
								border-radius: 100%;
							}
						}
					}
				}
			}
			.item-time{
				font-size: 24upx;
				color: #999;
			}
		}
		.list-item:last-of-type{
			border: none;
		}
	}
</style>
