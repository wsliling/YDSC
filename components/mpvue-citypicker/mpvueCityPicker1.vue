<template>
	<div class="mpvue-picker">
		<div :class="{'pickerMask':showPicker}" @click="maskClick" catchtouchmove="true"></div>
		<div class="mpvue-picker-content " :class="{'mpvue-picker-view-show':showPicker}">
			<div class="mpvue-picker__hd" catchtouchmove="true">
				<div class="mpvue-picker__action" @click="pickerCancel">取消</div>
				<div class="mpvue-picker__action" :style="{color:themeColor}" @click="pickerConfirm">确定</div>
			</div>
			<picker-view indicator-style="height: 40px;" class="mpvue-picker-view" :value="pickerValue" @change="provincesChange">
				<block>
					<picker-view-column>
						<div class="picker-item" v-for="(item,index) in province.data" :key="index">{{item.Name}}</div>
					</picker-view-column>
					<picker-view-column v-if="GradeId==30||GradeId==20">
						<div class="picker-item" v-for="(item,index) in citys.data" :key="index">{{item.Name}}</div>
					</picker-view-column>
					<picker-view-column v-if="GradeId==20">
            <div class="picker-item" v-for="(item,index) in qus.data" :key="index">{{item.Name}}</div>
          </picker-view-column>
				</block>
			</picker-view>
		</div>
	</div>
</template>

<script>
	import {
		host,
		post,
		get
	} from '@/common/util.js';
	export default {
		data() {
			return {
				pickerValue: [0, 0, 0],
				citys: {}, //市
				qus: {},
				provincesCode: "",
				cityCode: "",
				quCode: "",
				pickerText: "",
				type1: "",
				type2: "",
				type3: "",
				hasData: false,
				/* 是否显示控件 */
				showPicker: false,
			};
		},
		created: function(e) {
			this.provincesCode = this.province.data[0].Code;
				// console.log('*******************', this.provincesCode)
			this.type1 = this.province.data[0].Name;
			//this.getcitys();
		},
		watch:{
			GradeId(e){
				this.GradeId=e
			},
			province(e){
				console.log("改变了")
				this.province=e;
				this.pickerValue=[0, 0, 0];
				this.provincesCode = this.province.data[0].Code;
				console.log("改变了000"+this.provincesCode)
				this.type1 = this.province.data[0].Name;
				if(this.GradeId==30||this.GradeId==20){
					this.getcitys();
				}
			}
		},
		props: {
			/* 默认值 */
			pickerValueDefault: {
				type: Array,
				default () {
					return [0, 0, 0]
				}
			},
			GradeId: {
				type: Number,
				default: 50
			},
			province: {
				type: Object
			},
			/* 主题色 */
			themeColor: {
				type:String,
				default:"#ff3333"
			}
		},
		methods: {
			show() {
				setTimeout(() => {
					this.showPicker = true;
				}, 0);
			},
			maskClick() {
				this.pickerCancel();
			},
			pickerCancel() {
				this.showPicker = false;
			},
			pickerConfirm(e) {
				this.showPicker = false;
				if(this.GradeId==50){
					this.type2="";
					this.cityCode="";
					this.type3="";
					this.quCode="";
				}
				if(this.GradeId==30){
					this.type3="";
					this.quCode="";
				}
				this.pickerText = this.type1 + " " + this.type2 + " " + this.type3;
				let data = [this.provincesCode, this.cityCode, this.quCode, this.pickerText]
				this.$emit('onconfirm', data);
			},
			provincesChange(e) {
				this.pickerValue=e.mp.detail.value;
				let valIndex = e.mp.detail.value; //组件的下标索引数字例：[0,0,0,]
				this.type1 = this.province.data[this.pickerValue[0]].Name;
				this.provincesCode = this.province.data[this.pickerValue[0]].Code;
				if (this.GradeId == 30||this.GradeId == 20) {
					if (this.pickerValue[1] != 0) {
						this.cityCode = this.citys.data[this.pickerValue[1]].Code;
						this.type2 = this.citys.data[this.pickerValue[1]].Name;
					}
				    this.getcitys(this.pickerValue[1], this.pickerValue[2]);
				}
				if (this.GradeId == 20&&this.pickerValue[2] != 0) {
					this.type3 = this.qus.data[valIndex[2]].Name;
					this.quCode = this.qus.data[valIndex[2]].Code;
				}
			},
			async getcitys(index1, index2) {
				this.citys = await post("User/GetShopArea", {
					Types: "City",
					Code: this.provincesCode,
					GradeId: this.GradeId
				});
				if(this.GradeId==30||this.GradeId==20){
					if(this.citys.data.length){
						if (index1 > 0) {
							this.cityCode = this.citys.data[index1].Code;
							this.type2 = this.citys.data[index1].Name;
						}
						else{ 
							this.cityCode = this.citys.data[0].Code;
							this.type2 = this.citys.data[0].Name;
						}
					}else{
						this.cityCode =this.provincesCode;
						this.type2 =this.type1;
						this.type1="";
						this.provincesCode="";
					}
				}
				if(this.GradeId==20){
					console.log(this.cityCode)
					this.getQu(index2);
				}
			},
			async getQu(index2) {
				this.qus = await post("User/GetShopArea", {
					Types: "District",
					Code: this.cityCode,
					GradeId: this.GradeId
				});
				if (this.quCode == "" || index2 == 0) {
					this.quCode = this.qus.data[0].Code;
					this.type3 = this.qus.data[0].Name;
				}
				if (index2 > 0) {
					this.quCode = this.qus.data[index2].Code;
					this.type3 = this.qus.data[index2].Name;
				}
			},
		}
	};
</script>

<style>
	.pickerMask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	.mpvue-picker-content {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: all 0.3s ease;
		transform: translateY(100%);
		z-index: 3000;
	}

	.mpvue-picker-view-show {
		transform: translateY(0);
	}

	.mpvue-picker__hd {
		display: flex;
		padding: 9px 15px;
		background-color: #fff;
		position: relative;
		text-align: center;
		font-size: 17px;
	}

	.mpvue-picker__hd:after {
		content: ' ';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #e5e5e5;
		color: #e5e5e5;
		transform-origin: 0 100%;
		transform: scaleY(0.5);
	}

	.mpvue-picker__action {
		display: block;
		flex: 1;
		color: #1aad19;
	}

	.mpvue-picker__action:first-child {
		text-align: left;
		color: #888;
	}

	.mpvue-picker__action:last-child {
		text-align: right;
	}

	.picker-item {
		text-align: center;
		line-height: 40px;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 16px;
	}

	.mpvue-picker-view {
		position: relative;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 238px;
		background-color: rgba(255, 255, 255, 1);
	}
</style>
