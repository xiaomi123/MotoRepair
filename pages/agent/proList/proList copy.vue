<template>
	<view class="index_container">
		<!-- 搜索内容开始 -->
		<!-- <view class="index-search">
			<view class="index-search-cont">
				<input class="index-search-txt" style="width: 640rpx" confirm-type="search" v-model="keywords" placeholder="请输入"  @confirm="search" />
			</view>
		</view> -->
		<view class="index-search">
			<view class="index-search-cont">
				<view class="search-input-box" style="width: 100%;">
					<input class="index-search-txt" confirm-type="search" v-model="keywords" placeholder="请输入"  @confirm="search"  />
					<button class="index-search-btn s-btn" @click="search()">搜索</button>
				</view>
			</view>
		</view>
		<!-- 搜索内容结束 -->
		
		<view class="example-body" style="padding-top:20rpx">
			<view class="example-level">

				<view class="example-title" v-if="carCode.length>0">原车代码</view>
				
				<view style="border: 0; width: 100%; height: auto; overflow: hidden; zoom:1;">
					<view class="tag-view example-tag" v-for="(items, index) in carCode" style="width: 45%; float: left;">
						<uni-tag :text="items.s_car_code" inverted="false" @click="findSecondLevel(index)" :class="{'tag-active':items.isBeChecked}"></uni-tag>
					</view>
				</view>


				<view>
					<view v-for="(items, index) in secondLevel" :key="index">
						<view  @click="xgetCodePro(items.s_mb001)" class="viewleve1" :class="{pl15: items.s_level2 != '', pl25:  items.leve == 3}">{{index + 1}}: {{items.s_level2}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 产品列表内容开始 -->
		<view class="example-title" style="padding:20px 20px 0 20px; text-align: left;" v-show="isShowProducts">筛选查询结果：</view>
		<view class="index-content" v-if="proList.length>0">
			<view class="modal-title"></view>
			<view class="index-product" v-show="isShowProducts">
				<view class="index-list" v-for="(item,index) in proList" @click="toDetail(item)">
					<image :src="$http.imgUrl + item.titlepicurl" mode="widthFix" class="index-listImg"></image>
					<view class="index-uinn">
						<text class="index-title">{{item.title}}</text>
						<view>售价:<text class="am-text-danger">￥</text><text class="index-price">{{item.currentprice}}</text></view>
						<!-- <view class="index-txt">
							<text>型号:{{item.productmodel}}</text>
						</view>
						<view class="index-txt"><text>适用范围:{{item.suitable}}</text></view> -->
						<view class="index_collect ub ub-ac">
							<text class="ub f32 am-blod" v-if="item.a_id > 0">赠</text>
							<text class="iconfont ub umar-l" @click.stop="collCancle(item)" v-if="item.f_id">&#xe7bd;</text>
							<text class="iconfont ub umar-l" @click.stop="collect(item)" v-else>&#xe7bc;</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="com-nodata" v-else>暂无产品</view>
		<!-- 产品列表内容结束 -->
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		components:{
			uniLoadMore
		},
		data() {
			return {
				proList:[],//产品列表
				carCode:[],//原车代码
				userInfo:{},//用户信息
				p:1,
				pageSize:10,
				pageCount: '',
				status:'more',
				keywords:'',
				scode:'',
				ckLevel:{},
				isCk:false,
				ckLeTxt:'',
				// 拼接数据
				jointListBefore:[],
				jointListAfter:[],
				isShowProducts: true,
				secondLevel:[],
				secondLevelData: {
					name: '',
					list: [],
					code: ''
				}
			}
		},
		onLoad(option) {
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					this_.userInfo = res.data[0];
					if(!this_.$check.isEmpty(option.keyWord)){
						this_.keywords = option.keyWord;
						this_.scode = option.keyWord;
						this_.getCar();
						this_.getProduct();
					}
					if(!this_.$check.isEmpty(option.scode)){
						this_.scode = option.scode;
						this_.ckLeTxt = option.scode;
						this_.getCar();
						
					}
			    }
			});
		},
		//上拉加载
		onReachBottom (){
			if(this.p < this.pageCount){
				this.p++;
				this.status = 'loading';
				if(!this_.$check.isEmpty(this_.keywords)){
					this.getProduct();
				}
			}else{
				this.status = 'noMore';
			}
		},
		methods: {
			findSecondLevel (index) {
				this.carCode.forEach( function(item){
					item.isBeChecked = false
				} )

				this.carCode[index].isBeChecked = true
				if (this.carCode[index].s_level2.length > 0) {
					this.secondLevel = []
					this.secondLevel = this.carCode[index].s_level2

					this.carCode.splice(index + 1,this.carCode.length - 1)
					this.carCode.splice(0 ,index)
				}else{
					this.carCode.splice(index + 1,this.carCode.length - 1)
					this.carCode.splice(0 ,index)
					this.proList = [];
					this.isShowProducts = true;
					this.$http.httpTokenRequest({
						url:this.$api.ProductByCode + '?c_id=' + this.userInfo.c_id + '&c_type=' + this.userInfo.c_type + '&code=' + this.carCode[index].s_mb001,
						method:'GET',
						data:{},
					}).then(res => {
						//请求成功
						uni.hideLoading();
						this.proList = res.data;
						this.isShowProducts = true;
					},error => {
						console.log(error);
					});
				}
				
				
			},
			//机型查询
			getCar(){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.CarCode + '?code=' + this_.scode + '&level2=&level3=',
					method:'GET',
					data:{},
				}).then(res => {
					this.jointListBefore = res.data
					if (this.jointListBefore.length > 1) {
						this.isShowProducts = false
					} else {
						this.isShowProducts = true
					}
					//请求成功
					uni.hideLoading();
					if(!this_.$check.isEmpty(res.data)){
						this_.carCode = res.data;
						this_.getCodePro({
							s_mb001: this_.carCode[0].s_mb001
						});
						if(this_.carCode.length == 1){
							if(!this_.$check.isEmpty(this_.carCode[0].s_level2)){
								this_.ckLevel = this_.carCode;
								this_.isCk = true;
								this_.ckLevel = this_.carCode[0];
							}
						}
					}
					
				},error => {
					console.log(error);
				});
			},
			
			//点击“等级”查询
			levelSel(item,type){
				console.log(this.carCode)
				// this.carCode.forEach( function(item){
				// 	item.isBeChecked = false
				// } )
				// const index = this.carCode.indexOf(item)
				// this.carCode[index].isBeChecked = true
				// this.isShowProducts = true
				// console.log(this.jointListBefore)
				// console.log(this.jointListAfter)

				let this_ = this;
				this_.proList = [];
				if(!this_.$check.isEmpty(item)){
					this_.getCodePro(item);
				}
				//点击一级
				if(type=='1'){
					if(!this_.$check.isEmpty(item)){
						this_.ckLevel = type;
						this_.isCk = true;
					}
					this_.ckLeTxt = item;
				}else if(type=='2') {
					this_.isCk = false;
					this_.ckLeTxt = item;
				}else if(type=='3') {
					this_.isCk = false;
					this_.ckLeTxt = item;
				}
				
				
			},
			
			//查询产品
			getCodePro(mb001){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.ProductByCode + '?c_id=' + this_.userInfo.c_id + '&c_type=' + this_.userInfo.c_type + '&code=' + mb001.s_mb001,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					this_.proList = res.data;
				},error => {
					console.log(error);
				});
			},
			//查询产品
			xgetCodePro(mb001){
				this.proList = [];
				this.isShowProducts = true;
				uni.showLoading();
				this.$http.httpTokenRequest({
					url:this.$api.ProductByCode + '?c_id=' + this.userInfo.c_id + '&c_type=' + this.userInfo.c_type + '&code=' + mb001,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					this.proList = res.data;
					this.isShowProducts = true
				},error => {
					console.log(error);
				});
			},
			
			//产品列表
			getProduct(){
				let this_ = this;
				//获取首页产品列表
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&c_ma001='+this_.userInfo.c_ma001+'&tag='+this_.keywords+'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					if(this_.p > 1){
						this_.proList = this_.proList.concat(res.data.rows);
					}else{
						this_.proList = res.data.rows;
					}
					this_.status = 'more';
					this_.papeTotal(res.data.total);
				},error => {
					console.log(error);
				});
				
				
			},
			
			
			//点击产品列表进入详情
			toDetail(item){
				let this_ = this;
				uni.navigateTo({
				 	url: '../detail/detail?code='+item.erpcode + '&type=index'
				}); 
			},
			
			//点击收藏
			collect(item){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.AddFavorite,
					method:'POST',
					data:{"c_id":this_.userInfo.c_id,"c_ma001":this_.userInfo.c_ma001,"c_ma002":this_.userInfo.c_ma002,"i_mb001":item.erpcode},
				}).then(res => {
					//请求成功
					if(res.data.State){
						item.f_id = res.data.centent;
						uni.showToast({
							icon : 'none',
							title : '收藏成功',
							duration:1500
						});
					}
					
				},error => {
					console.log(error);
				});
			},
			//取消收藏
			collCancle(item){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.DelFavorite,
					method:'POST',
					data:[{"f_id":item.f_id}],
				}).then(res => {
					//请求成功
					if(res.data.State){
						item.f_id = '';
					}
					uni.showToast({
						icon : 'none',
						title : '取消收藏',
						duration:1500
					});
				},error => {
					console.log(error);
				});
			},
			//查询
			search(e){
				this.secondLevel = [];
				let this_ = this;
				this_.scode = this_.keywords;
				this_.getCar();
				this_.getProduct();
			},
			//获取总页数
			papeTotal(rowCount){
				let this_ = this;
				if(rowCount != null && rowCount != ""){
					if(rowCount % this_.pageSize == 0){
						this_.pageCount = parseInt(rowCount / this_.pageSize);
					}else{
						this_.pageCount = parseInt(rowCount / this_.pageSize) + 1;
					}
				}else{
					return 0;
				}
			},
			
		},
		watch: {
			jointListBefore () {
				this.isHaveLevel2 = false;
				this.isHaveLevel3 = false;
				this.isShowProducts = false;
				for (let i = 0;i<this.jointListBefore.length;i++) {
					if (this.jointListBefore[i].hasOwnProperty('s_level2') && this.jointListBefore[i].s_level2.length > 0) {
						this.isHaveLevel2 = true;
						for (let o = 0;o<this.jointListBefore[i].s_level2.length;o++) {
							this.jointListAfter.push({
								name: this.jointListBefore[i].s_level2[o].s_level2,
								code: this.jointListBefore[i].s_level2[o].s_mb001,
								leve: 2,
								num: o
							})
							if (this.jointListBefore[i].s_level2[o].hasOwnProperty('s_level3') && this.jointListBefore[i].s_level2[o].s_level3.length > 0) {
								this.isHaveLevel3 = true;
								for (let p = 0;p<this.jointListBefore[i].s_level2[o].s_level3.length;p++) {
									this.jointListAfter.push({
										name: this.jointListBefore[i].s_level2[o].s_level3[p].s_level3,
										code: this.jointListBefore[i].s_level2[o].s_level3[p].s_mb001,
										leve: 3,
										num: p
									})
								}
							}
						}
					}
				}
				this.jointListAfter = this.jointListAfter
			}
		}
	}
</script>
<style scoped>
.umar-l{
	margin-left: 10rpx;
}
.index-search-txt{
	width: 70%;
}
.index-search-btn{
	width: 18%;
}
.example-tag .tag-active{
	background-color:#2d79f1;
	border-radius: 12rpx;
	-webkit-border-radius:12rpx;
}
.example-level{
	text-align: left;
}
.pl15{
	padding-left: 15px;
	border-left: #0033BF 2px solid;
	margin-bottom: 8px;
	font-size: 14px;;
}
.pl25{
	padding-left: 25px;
	margin-bottom: 8px;
	font-size: 12px;
}
.viewleve1{
	line-height: 26px;
}
.example-title{
	text-align: center;
	width: 100%;
	margin-bottom: 15px;
	overflow: hidden;
}
.example-level{
	width: 320px;
	margin-top: 10px;
	overflow: hidden;
	zoom:1;
}
</style>