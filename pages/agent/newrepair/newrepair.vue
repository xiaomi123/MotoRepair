<template>
	<view class="newRepair-container">
		<!-- 修理厂信息补全弹层开始 -->
		<view class="login-dialog" v-show="isEdit" style="z-index:999">
			<view class="login-dialog-cont">
				<view class="login-title">为了能更好的为您提供服务，请准确录入您的信息<text class="iconfont login-dialog-close"@click="isEdit=false">&#xe60f;</text></view>
				<view class="login-list">
					<text class="login-txt">修理厂名称</text>
					<input class="uni-input login-input" v-model="agentInfo.c_nickname" placeholder="请录入修理厂名称" />
				</view>
				<view class="login-list">
					<text class="login-txt">联系电话</text>
					<input class="uni-input login-input" v-model="agentInfo.c_tel" placeholder="请录入联系电话" />
				</view>
				<view class="login-list02">
					<view class="login-list02-content">
						<view class="login-list">
							<text class="login-txt" style="width:80%;">省份</text>
							<input class="uni-input login-input" v-model="agentInfo.c_prov" placeholder="请录入省份" />
						</view>
					</view>
					<view class="login-list02-content">
						<view class="login-list">
							<text class="login-txt" style="width:35%;text-align: right;">区域</text>
							<input class="uni-input login-input" v-model="agentInfo.c_city" placeholder="请录入区域" />
						</view>
					</view>
				</view>
				<view class="login-list" style="border-bottom: none;">
					<text class="login-txt">详细地址</text>
					<view class="login-area">
						<textarea class="login-area-txt" v-model="agentInfo.c_address" placeholder="请录入详细地址" />
					</view>
				</view>
				<view class="login-list">
					<text class="login-txt">主修车型</text>
					<view class="radio-group">
						<radio-group @change="radioChange">
							<view class="radio-item" v-for="item in models">
								<label class="radio" style="margin-right: 30rpx;" >
									<radio :value="item.type" :checked="agentInfo.c_main == item.type ? true : false" style="transform:scale(0.7)" />{{item.type}}
								</label>
							</view>
						</radio-group>
					</view>
				</view>
				<view class="login-dialog-btncont" v-if="tabIndex==0 || tabIndex==2">
					<button type="default" class="login-dialog-btn" @click="passOption('2','applay')" v-if="tabIndex==0">不通过</button>
					<button type="default" class="login-dialog-btn" @click="passOption('2','cancel')" v-if="tabIndex==2">取消</button>
					<button type="primary" class="login-dialog-btn" @click="passOption('0','applay')">通过</button>
				</view>
				<view class="login-dialog-btncont" v-if="tabIndex==1">
					<button type="default" class="login-dialog-btn" @click="cancelOption()">取消</button>
					<button type="primary" class="login-dialog-btn" @click="okOption()">确定</button>
				</view>
				
			</view>
		</view>
		<!-- 修理厂信息补全弹层结束 -->
		
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
		
		<!-- 主要内容开始 -->
		<view class="newRepair-main">
			<view class="am-fixedBar" ref="tabitem" style="top:44px;z-index:998">
				<uni-segmented-control :current="tabIndex" :values="tabItems" :badge="badge" @clickItem="onClickTab" style-type="text" active-color="#3079F3"></uni-segmented-control>
			</view>
			<view :style="{marginTop:`${marginTop}px`}">
				<view v-if="repaireList.length>0">
					<view v-for="(list,index) in repaireList" class="newRepair-list ub-ac">
						<view class="newRepair-fl">
							<view>修理厂名称：{{list.c_nickname}}</view>
							<view @click="tel(list.c_tel)">
								联系电话：
								<a style="background-color: rgb(48, 121, 243); border-radius: 3rpx; padding: 0 5px; color: #F1F1F1;"><uni-icons type="phone" size="16" color="#FFFFFF"></uni-icons>{{list.c_tel}}</a>
							</view>
							<view>备用电话：{{list.c_tel1}}</view>
							<view>详细地址：{{list.c_prov + list.c_city + list.c_address}}</view>
						</view>
						<button type="primary" class="newRepair-fr" @click="toPass(list,index)" v-if="tabIndex == 0 || tabIndex == 2">审核</button>
						<button type="primary" class="newRepair-fr" @click="edit(list,index)" v-else>编辑</button>
						<!-- <switch :checked="list.c_state == 0" @change.stop="switchChange($event,list,index)" v-else /> -->
					</view>
				</view>
				<view class="com-nodata" v-if="repaireList.length==0">暂无数据</view>
			</view>
		</view>
		<!-- 主要内容结束 -->
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	export default {
		components: {uniIcons},
		data() {
			return {
				userInfo:{},//用户信息
				repaireList:[],//修理厂用户
				tabItems: ['待审核','已审核','已拒绝'],
				badge:[0,0,0],
				tabIndex: 0,
				marginTop: '',
				p:1,
				pageSize:10,
				pageCount: '',
				status:'more',
				agentInfo:{},
				isEdit:false,//信息完善弹层
				passIndex:-1,//审核index
				models: [{type : '国产车'},{type : '合资车'},{type : '高端车'}],
				timer:null,
				keyTxt:'',
			}
		},
		onLoad(option) {
			//读取存储数据
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					this_.userInfo = res.data[0];
					this_.getNewRepair();
					this_.getRepairQty();//获取tab不同状态数量
					//每隔5秒刷新
					this_.timer = setInterval(function() {
						this_.getRepairQty();//获取数字
					}, 5000);
			    }
			});
		},
		onUnload(){
			let this_ = this;
			if(this_.timer){
				clearInterval(this_.timer);  
				this_.timer = null; 
			}
		},
		mounted() {
			this.marginTop = this.$refs.tabitem.$el.getBoundingClientRect().top;
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
		methods: {
			tel(phoneNum){
				uni.makePhoneCall({
				    phoneNumber: phoneNum //仅为示例
				});
			},
			//tab切换
			onClickTab(e){ 
				let this_ = this;
				if (this_.tabIndex !== e.currentIndex) {
					this.keyTxt = '';
					this_.p = 1;
					this_.tabIndex = e.currentIndex;
					this_.getNewRepair();
				}
			},
			//获取新增修理厂待审核数量
			getNewRepair(){
				uni.showLoading();
				let this_ = this;
				let state = 1;
				if(this_.tabIndex == 1){
					state = '-1,0';
				}else if(this_.tabIndex == 2){
					state = '2';
				}
				//this_.repaireList = [];
				this_.$http.httpTokenRequest({
					url:this_.$api.GetUser+'?name='+this_.keyTxt+'&tel=&ma001='+ this_.userInfo.c_ma001 +'&m_id='+ this_.userInfo.c_m_id +'&state='+ state +'&pageindex='+ this_.p +'&pagesize='+this_.pageSize,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					console.log(res);
					if(this_.p > 1){
						this_.repaireList = this_.repaireList.concat(res.data.rows);
					}else{
						this_.repaireList = res.data.rows;
					}
					if(0 <= res.data.total < this_.pageSize){
						this_.status = 'noMore';
					}else{
						this_.status = 'more';
					}
					this_.papeTotal(res.data.total);					
					uni.hideLoading();
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
			//启用顶用
			// switchChange(e,list,index){
			// 	let this_ = this;
			// 	this_.agentInfo = list;
			// 	let value = e.target.value;
			// 	if(value){
			// 		this_.passIndex = index;
			// 		this_.isEdit = true;
			// 	}else{
			// 		this_.passOption("-1","switch");//停用
			// 	}
			// },
			//编辑
			edit(list,index){
				this.agentInfo = list;
				this.passIndex = index;
				this.isEdit = true;
			},
			//去审核
			toPass(list,index){
				console.log(list);
				let this_ = this;
				this_.isEdit = true;
				this_.agentInfo = list;
				this_.passIndex = index;
			},
			//启用---取消
			cancelOption(){
				let this_ = this;
				this_.isEdit = false;
			},
			//启用---确定
			okOption(){
				let this_ = this;
				this_.isEdit = false;
				this_.passOption("0","switch");//启用
			},
			//公共修改修理厂账号状态
			passOption(state,type){
				let this_ = this;
				//"取消"关闭
				if(type == 'cancel'){
					this_.isEdit = false;
				}else{
					if(this_.$check.isEmpty(this_.agentInfo.c_nickname)){
						uni.showToast({
							icon : 'none',
							title : "修理厂名称不能为空",
							duration:1500
						});
						return false;
					}else if(this_.$check.isEmpty(this_.agentInfo.c_tel)){
						uni.showToast({
							icon : 'none',
							title : "联系电话不能为空",
							duration:1500
						});
						return false;
					}else if(!this_.$check.ckTel(this_.agentInfo.c_tel)){
						uni.showToast({
							icon : 'none',
							title : "手机号格式不正确",
							duration:1500
						});
						return false;
					}else if(this_.$check.isEmpty(this_.agentInfo.c_prov)){
						uni.showToast({
							icon : 'none',
							title : "省份不能为空",
							duration:1500
						});
						return false;
					}else if(this_.$check.isEmpty(this_.agentInfo.c_city)){
						uni.showToast({
							icon : 'none',
							title : "区域不能为空",
							duration:1500
						});
						return false;
					}else if(this_.$check.isEmpty(this_.agentInfo.c_address)){
						uni.showToast({
							icon : 'none',
							title : "详细地址不能为空",
							duration:1500
						});
						return false;
					}
					this_.$http.httpTokenRequest({
						url:this_.$api.UserState+'?c_id='+ this_.agentInfo.c_id,
						method:'POST',
						data:{c_nickname:this_.agentInfo.c_nickname,c_prov:this_.agentInfo.c_prov,c_city:this_.agentInfo.c_city,c_address:this_.agentInfo.c_address,c_tel:this_.agentInfo.c_tel,c_tel1:this_.agentInfo.c_tel1,c_state:state,c_main:this_.agentInfo.c_main},
					}).then(res => {
						this_.isEdit = false;
						//请求成功
						if(res.data.State){
							if(type == "applay" && state == "0"){
								//清除行--点击弹层”通过“
								uni.showToast({
									icon : 'none',
									title : '已通过',
									duration:1500
								});
								this_.repaireList.splice(this_.passIndex,1);
							}else if(type == "switch" && state == "0"){
								uni.showToast({
									icon : 'none',
									title : '已启用',
									duration:1500
								});
							}else if(type == "switch" && state == "-1"){
								uni.showToast({
									icon : 'none',
									title : '已停用',
									duration:1500
								});
							}
							this_.getNewRepair();
						}
					},error => {
						console.log(error);
					});
				}
			},
			//修理厂选择主修车型
			radioChange(e){ 
				this.agentInfo.c_main = e.detail.value;
			},
			
			//获取tab状态数量
			getRepairQty(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.UserQty+'?c_ma001='+ this_.userInfo.c_ma001 +'&m_id=' + this_.userInfo.c_m_id,
					method:'GET',
					data:{},
				}).then(res => {
					for(let i=0;i<res.data.length;i++){
						if(res.data[i].c_state == 1){
							this_.badge[0] = res.data[i].qty;
						}else if(res.data[i].c_state == 0){
							this_.badge[1] = res.data[i].qty;
						}else if(res.data[i].c_state == 2){
							this_.badge[2] = res.data[i].qty;
						}
					}
					this_.$set(this_.badge,true);
					
				},error => {
					console.log(error);
				});
			},
			//查询
			toSearch(){
				let this_ = this;
				this_.p = 1;
				this_.getNewRepair();
			},
		}
	}
</script>
