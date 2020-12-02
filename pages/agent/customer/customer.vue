<template>
	<view class="newRepair-container">
		<!-- 主要内容开始 -->
		<view class="newRepair-main" style="padding-top:100rpx;">
			<!-- 搜索内容开始 -->
			<view class="index-search">
				<view class="index-search-cont">
					<view class="search-input-box" style="width: 100%;">
						<input class="index-search-txt" confirm-type="search" v-model="keyTxt" placeholder="名称/电话"  @confirm="toSearch()"  />
						<button class="index-search-btn s-btn" @click="toSearch()">搜索</button>
					</view>
				</view>
			</view>
			<!-- 搜索内容结束 -->
			<view v-if="repaireList.length>0">
				<view v-for="(list,index) in repaireList" class="list-item">
					<view class="umar-b" v-if="currentTitle == 1">修理厂名称：{{list.c_nickname}}</view>
					<view class="umar-b" v-else-if="currentTitle == 3">协议客户名称：{{list.c_nickname}}</view>
					<view class="umar-b">联系电话：{{list.c_tel}}</view>
					<view class="umar-b">详细地址：{{list.c_prov + list.c_city + list.c_address}}</view>
					<view class="ub ub-pe">
						<view class="ub umar-r f28"><button class="am-btn" type="warn" @click="toRecomm(list)">推荐</button></view>
						<view class="ub"><button class="am-btn" type="primary" @click="toCusOrder(list)">代下单</button></view>
					</view>
				</view>
			</view>
			<!-- 上拉加载 start -->
			<uni-load-more :status="status" class="am-umar-tbar"></uni-load-more>
			<!-- 上拉加载 end -->
		</view>
		<!-- 主要内容结束 -->
		
		<!-- 切换客户列表 -->
		<uni-popup ref="popup" type="top">
			<view class="popup-box">
				<radio-group @change="change">
					<view class="list-item">
						<label class="radio">
							<radio value="1" :checked="currentTitle == 1" style="transform: scale(0.7);" />
							<text>修理厂客户</text>
						</label>
					</view>
					<view class="list-item">
						<label class="radio">
							<radio value="3" :checked="currentTitle == 3" style="transform: scale(0.7);" />
							<text>协议客户</text>
						</label>
					</view>
				</radio-group>
				<!-- <view class="list-item"><label class="radio"><radio value="3"  style="transform: scale(0.7);" />协议客户</label></view> -->
			</view>	
		</uni-popup>
		
		<!-- 底部导航 -->
		<tabBar :current="currentTabIndex" :column="tabNum" :options="tabList"></tabBar>
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
				userInfo:{},//用户信息
				repaireList:[],//修理厂用户
				p:1,
				pageSize:10,
				pageCount: '',
				status:'more',
				tabList: [
					{
						pagePath : '../index/index',
						iconPath:"../../../static/images/icon_index_bottom01.png",
						selectedIconPath:"../../../static/images/icon_index_bottom11.png",
						text : '首页',
						badge : ''
					},{
						pagePath : '../customer/customer',
						iconPath:"../../../static/images/icon_index_bottom05.png",
						selectedIconPath:"../../../static/images/icon_index_bottom15.png",
						text : '代客下单',
						badge : ''
					},{
						pagePath : '../user/user',
						iconPath:"../../../static/images/icon_index_bottom04.png",
						selectedIconPath:"../../../static/images/icon_index_bottom14.png",
						text : '我的',
						badge : ''
					}
				],
				tabNum:3,
				currentTabIndex:1,
				keyTxt:'',
				title : ['修理厂客户','协议客户'],
				currentTitle : 1
			}
		},
		onLoad(option) {
			//读取存储数据
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					this_.userInfo = res.data[0];
					if(this_.userInfo.c_level == 1 && this_.userInfo.c_admin == 1){
						this_.tabList.splice(1,0,{
							pagePath : '../tobuy/tobuy',
							iconPath:"../../../static/images/icon_index_bottom06.png",
							selectedIconPath:"../../../static/images/icon_index_bottom16.png",
							text : '进货',
							badge : ''
						});
						this_.tabNum = 4;
						this_.currentTabIndex = 2;
					}
					this_.getNewRepair();
			    }
			});
			uni.setNavigationBarTitle({
				title:this.currentTitle == 1 ? this.title[0] : this.title[1]
			})
		},
		methods: {
			//获取修理厂
			getNewRepair(){
				let this_ = this;
				console.log('this_.currentTitle:'+this_.currentTitle);
				let state = 0;
				this_.$http.httpTokenRequest({
					url:this_.$api.GetUser+'?name='+this_.keyTxt+'&tel=&ma001='+ this_.userInfo.c_ma001 +'&m_id='+ this_.userInfo.c_m_id +'&state='+ state +'&pageindex='+ this_.p +'&pagesize='+this_.pageSize+'&c_type='+this_.currentTitle,
					method:'GET',
					data:{},
				}).then(res => {
					console.log(res);
					console.log(this_.p);
					//请求成功
					if(this_.p > 1){
						this_.repaireList = this_.repaireList.concat(res.data.rows);
						console.log(this_.repaireList.length)
					}else{
						this_.repaireList = res.data.rows;
					}
					if(0 <= res.data.total < this_.pageSize){
						this_.status = 'noMore';
					}else{
						this_.status = 'more';
					}
					this_.papeTotal(res.data.total);
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
			//选择客户
			toRecomm(list){
				let this_ = this;
				this_.$set(list, 'enter', 'recomm');
				uni.navigateTo({
				 	url: '../custpro/custpro?custInfo=' + encodeURIComponent(JSON.stringify(list))
				}); 
			},
			//代客户下单
			toCusOrder(list){
				let this_ = this;
				this_.$set(list, 'enter', 'custorder');
				uni.navigateTo({
				 	url: '../custpro/custpro?custInfo=' + encodeURIComponent(JSON.stringify(list)) + '&type='+this_.currentTitle
				}); 
			},
			//查询
			toSearch(){
				let this_ = this;
				this_.p = 1;
				this_.getNewRepair();
			},
			//上拉加载
			onReachBottom (){
				if(this.p < this.pageCount){
					this.p++;
					this.status = 'loading';
					this.getNewRepair();
				}else{
					this.status = 'noMore';
				}
			},
			//选择客户
			change(e){
				//console.log('客户类型：'+e.detail.value);
				this.currentTitle = e.detail.value;
				uni.setNavigationBarTitle({
					title:e.detail.value == 1 ? this.title[0] : this.title[1]
				})
				this.$refs.popup.close();
				this.getNewRepair();
			}
		},
		onNavigationBarButtonTap() {
			this.$refs.popup.open();
		}
	}
</script>
<style>
.umar-r{
	margin-right: 20rpx;
}
.am-btn{
	font-size: 24rpx;
}
.list-item{
	border-bottom: 1px solid #EEEEEE;
	padding: 15rpx;
}
.umar-b{
	margin-bottom: 8rpx;
}
.popup-box{
	background-color: #FFFFFF;
}
.popup-box .list-item{
	padding: 30rpx 15rpx;
}
</style>