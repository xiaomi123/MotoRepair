<template>
	<view class="recommend-container">
		<view class="recommend-main">
			<view class="">
				
			</view>
		</view>
		<!-- 上拉加载 start -->
		<uni-load-more :status="status" class="am-umar-tbar"></uni-load-more>
		<!-- 上拉加载 end -->
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components:{
			
		},
		data() {
			return {
				proList:[],//产品列表
				userInfo:{},//用户信息
				p:1,
				pageSize:10,
				pageCount: '',
				status:'more',
			}
		},
		onLoad(option) {
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					this_.userInfo = res.data[0];
					this_.getRecommend(option.c_id,option.c_ma001,option.c_ma002);
			    }
			});
			
		},
		methods: {
			//产品列表
			getRecommend(cId,ma001,ma002){
				let this_ = this;
				//获取首页产品列表
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.CustRecommend,
					method:'POST',
					data:{c_id:cId,c_ma001:ma001,c_ma002:ma002,i_mb001:'',title:'',qty:'',a_id:''},
				}).then(res => {
					//请求成功
					console.log(res.data);
					
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
			
		},
		onBackPress() {
			this.$refs['showimage'].close()
		},
		//上拉加载
		onReachBottom (){
			if(this.p < this.pageCount){
				this.p++;
				this.status = 'loading';
				this.getProduct();
			}else{
				this.status = 'noMore';
			}
		},
		
		
	}
</script>
