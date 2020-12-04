<template>
	<view class="index_container">
		<view class="index-search">
			<view class="index-search-cont">
				<view class="search-input-box" style="width: 100%;">
					<input class="index-search-txt" confirm-type="search" v-model="keywords" placeholder="请输入"  @confirm="search"  />
					<button class="index-search-btn s-btn" @click="search()">搜索</button>
				</view>
			</view>
		</view>
		<!-- 搜索内容结束 -->
		
		<view v-show="isShowYcdmList" class="example-body" style="padding-top:20rpx">
			<view class="example-title" style="padding:20px 20px 0 20px; text-align: left;">请点击下方查询结果：</view>
			<view class="example-level">
				<view style="border: 0; width: 100%; height: auto; overflow: hidden; zoom:1;">
					<view class="tag-view example-tag" v-for="(items, index) in carCode" style="width: 45%; float: left;">
						<uni-tag :text="items.s_car_code" @click="toProListShow(items.s_car_code,items.s_mb001)"></uni-tag>
					</view>
				</view>
			</view>
		</view>

		<!-- 产品列表内容结束 -->
		
		<!-- 产品列表内容开始 -->
		<view v-show="proList.length > 0" class="example-title" style="padding:20px 20px 0 20px; text-align: left;">查询结果：</view>
		<view class="index-content" v-if="proList.length>0">
			<view class="modal-title"></view>
			<view class="index-product" v-show="isShowProducts">
				<view class="index-list" v-for="(item,index) in proList" @click="toDetail(item)">
					<image :src="$http.imgUrl + item.titlepicurl" mode="widthFix" class="index-listImg"></image>
					<view class="index-uinn">
						<text class="index-title">{{item.title}}</text>
						<view class="index-txt"><text>品牌:{{item.suitable}}</text></view>
						<view class="">会员价：<text class="am-text-danger">￥</text><text class="index-price">{{item.currentpriceb}}</text></view>
						<view class="">非会员价：<text class="f24 am-text-warning">￥</text><text class="index-price f28 am-text-warning">{{item.currentprice}}</text></view>
						<view class="">车主价格：<text class="f24 am-text-primary">￥</text><text class="index-price f28 am-text-primary">{{item.currentpricec}}</text></view>
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
		<view v-show="noProducts" class="example-title" style="text-align: center;">
			<image class="emptyImg" src="../../../static/images/empty.png" mode="widthFix"></image>
		</view>
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
				searchItem:{},
				isShowYcdmList: false,
				noProducts: false
			}
		},
		onLoad() {
			this.keywords = this.$route.query.keyWord;
		},
		//上拉加载
		onReachBottom (){
			let this_ = this;
			if(this_.p < this_.pageCount){
				this_.p++;
				this_.status = 'loading';
				if(!this_.$check.isEmpty(this_.keywords)){
					this_.getProduct();
				}
			}else{
				this_.status = 'noMore';
			}
		},
		methods: {
			findSecondLevel (index) {
				this.carCode.forEach( function(item){
					item.isBeChecked = false
				} )
				console.log(this.searchItem)
				this.carCode[index].isBeChecked = true
				if (this.carCode[index].s_level2.length > 0) {
					this.secondLevel = []
					this.secondLevel = this.carCode[index].s_level2
					console.log(this.secondLevel)
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
			getCar(isexact){
				let code = this.keywords != ''?this.keywords:this.$route.query.keyWord
				console.log("搜索内容")
				console.log(code)
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.CarCode + '?code=' + code + '&level2=&level3=&isexact='+isexact,
					method:'GET',
					data:{},
				}).then(res => {
					if(res.data.length > 0){
						this.isShowYcdmList = true;
					}else{
						this.isShowYcdmList = false;
						// 优先查询原车代码，如果原车代码没有数据，再查询产品列表
						this.getProduct();
					}
					//请求成功
					uni.hideLoading();
					this_.carCode = res.data;
					
				},error => {
					console.log(error);
				});
			},
			//点击进入查询结果列表页
			toProListShow(item,mb001){
				uni.navigateTo({
				 	url: '../proList/proListShow?scode=&keyWord='+ item + '&mb001='+mb001
				}); 
			},
			//查询
			search(e){
				this.secondLevel = [];
				this.proList = [];
				this.scode = this.keywords;
				this.getCar('0');
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
			//点击产品列表进入详情
			toDetail(item){
				let this_ = this;
				uni.navigateTo({
				 	url: '../detail/detail?code='+item.erpcode + '&type=index'
				}); 
			},
			//产品列表
			getProduct(){
				let tag = this.keywords != ''?this.keywords:this.$route.query.keyWord
				let this_ = this;
				//获取首页产品列表
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&c_ma001='+this_.userInfo.c_ma001+'&tag='+tag+'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
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
					
					if(this_.proList.length == 0){
						this_.noProducts = true;
					}else{
						this_.noProducts = false;
					}

					
					this_.status = 'more';
					this_.papeTotal(res.data.total);
				},error => {
					console.log(error);
				});
				
				
			}
		},
		created() {
			uni.getStorage({
			    key: 'userInfo',
			    success: (res) => {
					this.userInfo = res.data[0];
					this.getCar('0');
			    }
			});
		},
		watch:{
			proList () {
				this.isShowProducts = true;
				if (this.proList.length > 0) {
					this.noProducts = false;
				}else{
					this.noProducts = true;
				}
			},
			carCode () {
				if (this.carCode.length > 0) {
					this.noProducts = false;
				}else{
					this.noProducts = true;
				}
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
	font-size: 14px;
	margin-left: 10px;
}
.pl25{
	padding-left: 25px;
	margin-bottom: 8px;
	font-size: 12px;
	margin-left: 10px;
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
	margin-bottom: 10px;
}
</style>