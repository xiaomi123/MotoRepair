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
		
		<!-- 搜索内容结束 -->
		<view class="example-title" v-show="secondLevel.length > 0">
			原车代码:
			<uni-tag :text="ycdm" style="display: inline-block;background-color:#2d79f1;border-radius: 12rpx;-webkit-border-radius:12rpx; margin-left: 8px;" class="tag-active"></uni-tag>
		</view>
		
		<view class="example-body" style="padding-top:20px" v-show="showYcdm">
			<view class="example-level">
				<view class="example-title" style="text-align: left; padding-left: 10px;">请点击下方产品规格</view>
				<view style="padding-top: 10px;">
					
					
					<view v-for="(items, index) in secondLevel" :key="index">
						<view v-if="items.s_level3.length > 0" @click="xgetCodePro(items.s_mb001, index, true)" class="pl15">
							<view class="handle"></view>{{index + 1}}: {{items.s_level2}}
							<view v-show="alreadyHavaImg.indexOf(ycdm + '_' + items.s_mb001) >= 0" class="smallPic"><image :src="'../../../static/ycdm/' + ycdm + '_' + items.s_mb001 + '.png'"></image></view>
						</view>
						<view v-else @click="xgetCodePro(items.s_mb001, index, false)" class="viewleve1 pl15">
							<view class="handle"></view>{{index + 1}}: {{items.s_level2}}
							<view v-show="alreadyHavaImg.indexOf(ycdm + '_' + items.s_mb001) >= 0" class="smallPic"><image :src="'../../../static/ycdm/' + ycdm + '_' + items.s_mb001 + '.png'"></image></view>
						</view>
						<view style="padding-left: 35px;" @click="xgetCodePro(e.s_mb001, index, false)" class="viewleve1 pl25" v-for="(e, i) in items.s_level3" v-show="e.isshow">
							<view class="no-handle"></view>
							{{index+1}}-{{i + 1}}: {{e.s_level3}}  {{e.s_mb001}}
							<view v-show="alreadyHavaImg.indexOf(ycdm + '_' + e.s_mb001) >= 0" class="smallPic"><image :src="'../../../static/ycdm/' + ycdm + '_' + e.s_mb001 + '.png'"></image></view>
						</view>
						
					</view>
					
					
				</view>
				
			</view>
		</view>
		
		
		<!-- 产品列表内容开始 -->
		<view class="index-content" v-show="proList.length>0">
			<view class="example-title" style="padding:20px 20px 0 20px; text-align: left;">查询结果：</view>
			<view class="index-product">
				<view class="index-list" v-for="(item,index) in proList" @click="toDetail(item)">
					<image :src="$http.imgUrl + item.titlepicurl" mode="widthFix" class="index-listImg"></image>
					<view class="index-uinn">
						<text class="index-title">{{item.title}}</text>
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
		
		
		<view class="example-title" v-show="showAllNo">
			<image class="emptyImg" src="../../../static/images/empty.png" mode="widthFix"></image>
		</view>

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
				searchItem:{},
				isShowProducts: false,
				secondLevel: [],
				ycdm:'',
				alreadyHavaImg: [
					'2H0_1280087',
					'2H0_1280090',
					'2H0_1280090',
					'CG12_1280111',
					'CG12_1280111',
					'DK15-01_1280139',
					'DK15-01_1280139',
					'DK15-02_1280140',
					'DK15-02_1280141',
					'DK15-06_1280143',
					'DK15-06_1280144',
					'DK15-07_1280145',
					'DK15-07_1280146',
					'DK15-10_1280145',
					'DK15-10_1280146',
					'DK15-10_1280147',
					'DK15-60_1280148',
					'DK15-61_1280149',
					'JL4G18_1280117',
					'JL4G18_1280118',
					'JLγ-4G15_1280119',
					'JLγ-4G15_1280120',
					'JLγ-4G18_1280121',
					'JLγ-4G18_1280122',
					'L2B_1280065', //?是否正确
					'L2B_1280085',
					'LDE_1280081',
					'LDE_1280092',
					'LMU_1280062',
					'LMU_1280063',
					'MR479Q_1180122',
					'MR479QA_1280114',
					'MR479QA_1280115',
					'SFG15-01_1280148',
					'SFG15-01_1280149',
					'SFG15-02_1280148',
					'SFG15-02_1280149',
					'SFG18_1280154',
					'SFG18_1280155'
				],
				showYcdm: false,
				showResult: false
			}
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
			//机型查询
			getCar(){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.CarCode + '?code=' + this.ycdm + '&level2=&level3=',
					method:'GET',
					data:{},
				}).then(res => {
					this.secondLevel = res.data[0].s_level2

					//请求成功
					uni.hideLoading();
					if(!this.$check.isEmpty(res.data)){
						this.carCode = res.data;
						this.getCodePro({
							s_mb001: this.carCode[0].s_mb001
						});
						if(this.carCode.length == 1){
							if(!this.$check.isEmpty(this.carCode[0].s_level2)){
								this.ckLevel = this.carCode;
								this.isCk = true;
								this.ckLevel = this.carCode[0];
							}
						}
					}
					
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
				uni.navigateTo({
					url : '../proList/proList?scode=&keyWord='+ this.keywords
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
			//查询产品
			xgetCodePro(mb001,index,isOpenAndData){
				// isOpenAndData 是否打开并且加载请求数据
				for(let x=0;x<this.secondLevel.length;x++){
					this.secondLevel[x].isChecd = false;
					this.secondLevel[index].isChecd = true;
					if(this.secondLevel[x].s_level3.length > 0){
						for(let s=0;s<this.secondLevel[x].s_level3.length;s++){
							if(x != index){
								this.secondLevel[x].s_level3[s].isshow = false;	
							}
						}
					}
				}
				
				if(isOpenAndData == true){
					for(let i=0;i<this.secondLevel.length;i++){
						if(this.secondLevel[i].s_level3.length > 0){
							if(i == index){
								for(let s=0;s<this.secondLevel[i].s_level3.length;s++){
									if(this.secondLevel[i].s_level3[s].isshow){
										this.secondLevel[i].s_level3[s].isshow = false;
									}else{
										this.secondLevel[i].s_level3[s].isshow = true;
									}
								}
							}else{	
								for(let s=0;s<this.secondLevel[i].s_level3.length;s++){
									this.secondLevel[i].s_level3[s].isshow = false;
								}
							}
						}
					}
				}

				if(isOpenAndData == false){
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
						if (res.data.length > 0) {
							this.showAllNo = false
						} else {
							this.showAllNo = true
						}
					},error => {
						console.log(error);
					});
				}else{
					this.proList = [];
				}
				
			},
			//产品列表
			getProduct(){
				let this_ = this;
				//获取首页产品列表
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&c_ma001='+this_.userInfo.c_ma001+'&tag='+this.ycdm+'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
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
				
				
			}
		},
		watch:{
			secondLevel () {
				if(this.secondLevel.length > 0){
					this.showYcdm = true;
				}else{
					this.showYcdm = false;
					this.getProduct();
				}
			},
			proList() {
				this.showResult = true;
				if(this.proList.length > 0){
					this.isShowProducts = true;
				}
			}
		},
		created() {
			this.ycdm = this.$route.query.click;
			this.keywords = this.ycdm;
			uni.getStorage({
			    key: 'userInfo',
			    success:(res) => {
					this.userInfo = res.data[0];
					this.getCar();
			    }
			});
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
	margin-bottom: 8px;
	font-size: 16px;
	margin-left: 10px;
}
.pl25{
	margin-bottom: 8px;
	font-size: 12px;
	margin-left: 10px;
}
.viewleve1{
	line-height: 30px;
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
.handle{
	width: 26px;
	height: 26px;
	float: left;
	background-image: url(../../../static/images/handle.png);
	background-position: left center;
	background-repeat: no-repeat;
	background-size: cover;
	margin-right: 10px;
}
.no-handle{
	width: 35px;
	height: 26px;
	float: left;
}
.smallPic{
	width: 100px;
	height: 80px;
	border-radius: 10px;
	margin-left: 30px;
	overflow: hidden;
	zoom:1;
}
.smallPic image{
	width: 100%;
	height: 100%;
}
</style>