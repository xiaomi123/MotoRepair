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
		<view class="example-title">
			原车代码:
			<uni-tag :text="ycdm" style="display: inline-block;background-color:#2d79f1;border-radius: 12rpx;-webkit-border-radius:12rpx; margin-left: 8px;" class="tag-active"></uni-tag>
		</view>
		
		<view class="example-body" v-show="showYcdm" style="padding-top:0px">
			<view class="example-level">	
					<view style="border-bottom: #dddddd 1px solid; padding-bottom: 10px; margin-bottom: 30rpx; font-weight: bold;">点击下方产品规格进行查询</view>
				<view>
					
					
					<view v-for="(items, index) in secondLevel" :key="index">
						<view v-if="items.s_level3.length > 0" @click="xgetCodePro(items.s_mb001, index, true)" class="pl15" v-bind:class="{ active: items.isChecd }">
							<button v-if="items.isChecd" type="primary">{{index + 1}}: {{items.s_level2}}</button>
							<button v-else type="default">{{index + 1}}: {{items.s_level2}}</button>
							<view v-show="items.s_level3.length == 0" style="font-weight: bold; padding-left: 70px;">{{items.spec}}</view>
							<view v-show="alreadyHavaImg.indexOf(ycdm + '_' + items.s_mb001) >= 0 && items.isChecd" class="smallPic" style="margin: 10px 0 0 70px;"><image :src="'../../../static/ycdm/' + ycdm + '_' + items.s_mb001 + '.png'"></image></view>
						</view>
						<view v-else @click="xgetCodePro(items.s_mb001, index, false)" class="viewleve1 pl15" v-bind:class="{ active: items.isChecd }">
							<button v-if="items.isChecd" type="primary">{{index + 1}}: {{items.s_level2}}</button>
							<button v-else type="default">{{index + 1}}: {{items.s_level2}}</button>
							<view v-show="items.s_level3.length > 0" style="font-weight: bold; padding-left: 70px;">{{items.spec}}</view>
							<view v-show="alreadyHavaImg.indexOf(ycdm + '_' + items.s_mb001) >= 0 && items.isChecd" class="smallPic" style="margin: 10px 0 0 70px;"><image :src="'../../../static/ycdm/' + ycdm + '_' + items.s_mb001 + '.png'"></image></view>
						</view>
						<view @click="xgetCodePro(e.s_mb001, index, false)" class="viewleve1 pl25" v-for="(e, i) in items.s_level3" v-show="e.isshow">
							<view style="font-weight: bold;" v-bind:class="{ level3active: e.ischecked }">{{index+1}}-{{i + 1}}: {{e.s_level3}}</view>
							<view>{{e.spec}}</view>
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
				<view class="index-list" v-for="(item,index) in proList">
					<image :src="$http.imgUrl + item.titlepicurl" mode="widthFix" class="index-listImg" @click="toDetail(item)"></image>
					<view class="index-uinn">
						<text class="index-title" @click="toDetail(item)">{{item.title}}</text>
						<view>售价:<text class="am-text-danger">￥</text><text class="index-price">{{item.currentprice}}</text></view>
						<!-- <view class="index-txt">
							<text>型号:{{item.productmodel}}</text>
						</view>
						<view class="index-txt"><text>适用范围:{{item.suitable}}</text></view> -->
						<view class="index_collect" style="padding-top: 5px; width: 100%;">
							<uni-number-box style="margin: 5px auto 10px auto; width: 110px;" :min="1" @change="changeCart"></uni-number-box>
							<button type="default" @click="selectCustomer(item)" style="margin: 0 auto; width: 110px; border-radius: 5px;; height: 40px; line-height: 40px; font-size: 14px;" class="cart-bot-right">代客下单</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="example-title" v-show="showAllNo">
			<image class="emptyImg" src="../../../static/images/empty.png" mode="widthFix"></image>
		</view>

		<!-- 代客下单 -->
		<!-- 备注\代理商选中弹层内容开始 -->
		<view v-show="isShow" style="background-color: rgb(48, 121, 243); position: fixed; width: 100%; height: 30px; left: 0; right: 0; top:40px; z-index: 999; padding: 10px;">
			<view class="search-input-box" style="width: 94%;">
				<input class="index-search-txt" style="width: 50%;" confirm-type="search" v-model="nameAndTel" placeholder="请输入修理厂名称或手机号" />
				<button class="index-search-btn s-btn" style="width: 20%;" @click="searchXLC()">搜索</button>
			</view>
		</view>
		<view class="cart-cust-dialog" v-show="isShow" style="padding-top: 10px; top:90px;">
			<radio-group @change="radioChange">
				<label class="cart-cust-list" v-for="(item, index) in custList">
					<radio :value="`${item.c_m_id + item.c_ma001}`" :checked="index === current" />
					<view>
						<view>名称：{{item.c_nickname}}&ensp;&ensp;</view>
						<view>电话：{{item.c_tel}}</view>
						<view>详细地址：{{item.c_prov + ' ' + item.c_city + ' ' + item.c_address}}</view>
					</view>
				</label>
			</radio-group>
			<view class="login-list ub-ac" style="margin-top: 10px;">
				<text class="login-list-fl">备注信息：</text>
				<view class="login-list-fr">
					<textarea v-model="note" placeholder="请填写您的备注信息" placeholder-style="color:#999" />
				</view>
			</view>
			<view class="cart-cust-btn" style="bottom: 0;">
				<view class="ub umar-a">
					<view class="ub ub-f1 am-btn-default"><button style="width: 100%; border: none;" class="am-btn" @click="cancelModal()">取消</button></view>
					<view class="ub ub-f1 am-btn-primary"><button style="width: 100%; border: none;" class="am-btn am-text-white" @click="toSumit()">提交</button></view>
				</view>
			</view>
		</view>
		<!-- 备注\代理商选中弹层内容结束 -->
		
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
				secondLevel:[],
				isShowProducts:false,
				ycdm:'',
				isShow: false,
				alreadyHavaImg: [
					'2H0_1280087',
					'2H0_1280090',
					'2H0_1280090',
					'CG12_1280070',
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
					'L2B_1180065', //?是否正确
					'L2B_1180085',
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
				showAllNo: false,
				custList: [],//代理商列表
				current: 0,//选中代理商index
				erpCode:'',//产品编号
				a_id:'',//活动id
				qty:1 ,//购物车数量,
				c_id: 0, // 代客下单用到
				m_id: 0, // 代客下单用到
				c_openid: '', // 代客下单用到
				c_nickname: '', // 代客下单用到
				c_ma001: '', // 代客下单用到
				c_ma002: '', // 代客下单用到
				c_tel: '', // 代客下单用到
				c_address: '', // 代客下单用到
				note: '', // 代客下单用到
				nameAndTel: '',
				mb001Opt:''
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
					url:this_.$api.CarCode + '?code=' + this.ycdm + '&level2=&level3=&isexact=1',
					method:'GET',
					data:{},
				}).then(res => {
					if (res.data[0].s_level2.length > 0) {
						this.showYcdm = true
						this.showAllNo = false
					} else {
						this.showYcdm = false
						this.showAllNo = true
					}
					//请求成功
					uni.hideLoading();
					this_.secondLevel = res.data[0].s_level2;
					if (this_.secondLevel.length == 0) {
						this_.getProduct()
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
			search(){
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
							this.secondLevel[x].s_level3[s].ischecked = false;
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
					
					for(let x=0;x<this.secondLevel.length;x++){
						if(this.secondLevel[x].s_level3.length > 0){
							for(let s=0;s<this.secondLevel[x].s_level3.length;s++){
								if(this.secondLevel[x].s_level3[s].s_mb001 == mb001){
									this.secondLevel[x].s_level3[s].ischecked = true;
								}else{
									this.secondLevel[x].s_level3[s].ischecked = false;
								}
							}
						}
					}
					
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
				this.showAllNo = false
				let this_ = this;
				//获取首页产品列表
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&c_ma001='+this_.userInfo.c_ma001+'&tag='+this_.mb001Opt+'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
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
					if (this_.proList.length > 0) {
						this.showAllNo = false
					} else {
						this.showAllNo = true
					}
					this_.status = 'more';
					this_.papeTotal(res.data.total);
				},error => {
					console.log(error);
				});
				
				
			},
			// 原车代码或者搜索结果，要求加个代客下单
			selectCustomer(item){
				this.erpCode = item.erpcode;
				this.a_id = item.a_id;
				console.log(item)
				uni.showLoading();
				let this_ = this;
				this_.isShow = true;
				let state = 0;
				this_.$http.httpTokenRequest({
					url:this_.$api.GetUser+'?name=&tel=&ma001='+ this_.userInfo.c_ma001 +'&m_id='+ this_.userInfo.c_m_id +'&state='+ state +'&pageindex='+ this_.p +'&pagesize='+this_.pageSize,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					console.log(res.data);
					this_.custList = res.data.rows;
					uni.hideLoading();
				},error => {
					console.log(error);
				});
				
				
			},
			changeCart(e){
				this.qty = e;
			},
			//选择修理厂
			radioChange: function(evt) {
				let this_ = this;
				for (let i = 0; i < this_.custList.length; i++) {
					if ((this_.custList[i].c_m_id + this_.custList[i].c_ma001) === evt.target.value) {
						this_.current = i;
						break;
					}
				}
			},
			//关闭弹窗并提交订单
			toSumit(){
				var this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.CustAgentOrder,
					method:'POST',
					data:{
						"c_id":this_.custList[this.current].c_id,
						"c_openid":this_.custList[this.current].c_openid,
						"c_nickname":this_.custList[this.current].c_nickname,
						"c_ma001":this_.userInfo.c_ma001,
						"c_ma002":this_.userInfo.c_ma002,
						"c_tel":this_.custList[this.current].c_tel,
						"c_address": this_.custList[this.current].c_prov + this_.custList[this.current].c_city + this_.custList[this.current].c_address,
						"note": this_.note,
						"item":[{mb001:this.erpCode,qty:this.qty,a_id:this.a_id}],
						"m_id":this_.userInfo.c_m_id
					},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					if(res.data.State){
						uni.showToast({
							title:'下单成功～',
							duration:1500
						});
						setTimeout(function(){
							uni.navigateTo({
								url:'../reporder/reporder?id=0'
							})
						},1500);
					}
				},error => {
					console.log(error);
				});
			},
			cancelModal(){
				var this_ = this;
				this_.isShow = !this_.isShow;
				this.nameAndTel = '';
			},
			searchXLC(){
				if(this.nameAndTel.trim() == ''){
					uni.showToast({
						icon : 'none',
						title : '搜索内容不能为空',
						duration:1500
					});
					return false;
				}
				uni.showLoading();
				this.$http.httpTokenRequest({
					url:this.$api.GetUser+'?name=' + this.nameAndTel + '&tel=&ma001='+ this.userInfo.c_ma001 +'&m_id='+ this.userInfo.c_m_id +'&state=0&pageindex=1&pagesize=10',
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					this.custList = res.data.rows;
				},error => {
					console.log(error);
				});
			}
		},
		created() {
			this.ycdm = this.$route.query.keyWord;
			this.keywords = this.ycdm;
			this.mb001Opt = this.$route.query.mb001;
			uni.getStorage({
			    key: 'userInfo',
			    success:(res) => {
					this.userInfo = res.data[0];
					if(this.$route.query.mb001 == ''){
						this.showAllNo = true;
					}else{
						this.getCar();
					}
					
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
	font-size: 14px;
	margin-left: 10px;
}
.pl25{
	margin-bottom: 8px;
	font-size: 12px;
	padding-left: 100px;
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
	width: 60px;
	height: 26px;
	float: left;
	margin-right: 5px;
}
.no-handle{
	width: 60px;
	height: 26px;
	float: left;
}
.smallPic{
	width: 170px;
	height: 120px;
	border-radius: 10px;
	overflow: hidden;
	zoom:1;
}
.smallPic image{
	width: 100%;
	height: 100%;
}
.active{
	font-weight: bold;
	color: #3079f3;
}
.example-level uni-button{
	text-align: left;
	font-size: 18px;
}
.level3active{
	color: #3079f3;
}
</style>