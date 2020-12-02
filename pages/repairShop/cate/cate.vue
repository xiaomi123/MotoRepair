<template>
	<view class="cate-container">
		<!-- 搜索内容开始 -->
		<view class="index-search">
			<view class="index-search-cont">
				<input class="index-search-txt index-search-agent" confirm-type="search" placeholder="请输入"  v-model="keywords" @confirm="search" />
			</view>
		</view>
		<!-- 搜索内容结束 -->
		
		<!-- header中tab切换内容开始 -->
		<view class="am-fixedBar" ref="tabitem">
			<uni-segmented-control :current="tabIndex" :values="tabItems" @clickItem="onClickTab" style-type="text" active-color="#3079F3"></uni-segmented-control>
		</view>
		<!-- header中tab切换内容结束 -->
		
		<!-- 相关产品内容开始 -->
		<view class="example-body" v-if="tabIndex == 1">
			<view class="tag-view" v-for="item in tags">
				<uni-tag :text="item.title" inverted="false" :type="type" @click="selected(item)"></uni-tag>
			</view>
			<view class="am-clear"></view>
		</view>
		<!-- 相关产品内容结束 -->
		
		<!-- 原车代码内容开始 -->
		<view class="example-body" v-if="tabIndex == 0">
			<uni-indexed-list :options="newCarCodeList" :showSelect="false" @click="bindClick"></uni-indexed-list>
			<!--<view class="tag-view" v-for="item in carCode">
				<uni-tag :text="item.s_car_code" inverted="false" :type="type" @click="carCodeSel(item.s_car_code)"></uni-tag>
			</view>-->
			<view class="am-clear"></view>
		</view>
		<!-- 原车代码内容结束 -->
		
	</view>
</template>

<script>
	import uniIndexedList from "@/components/uni-indexed-list/uni-indexed-list.vue"
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	export default {
		components: {
			uniTag,
			uniIndexedList
		},
		data() {
			return {
				type : "default",
				tags : [],
				tabItems: ['原车铭牌上发动机型号','相关产品'],
				state:['0','1','2','3','4'],//切换传值
				tabIndex: 0,
				marginTop: '',
				carCode:[],
				keywords:'',//关键字查询
				newCarCodeList: [],
				winHeight: 0,
				itemHeight: 0,
				winOffsetY: 0,
				touchmove: false,
				touchmoveIndex: -1,
				scrollViewId: '',
				touchmoveTimeout: '',
				loaded: false
			}
		},
		onLoad(){
			this.getCateList();
			this.getCartCode();
		},
		mounted() {
			this.marginTop = this.$refs.tabitem.$el.getBoundingClientRect().height;
		},
		methods: {
			//tab切换
			onClickTab(e){
				let this_ = this;
				if (this_.tabIndex !== e.currentIndex) {
					this_.p = 1;
					this_.tabIndex = e.currentIndex;
				}
			},
			
			//获取相关产品
			getCateList(){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.ProductHome,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					this_.tags = res.data;
					
				},error => {
					console.log(error);
				});
			},
			
			//相关产品点击
			selected(item){
				uni.navigateTo({
					url : '../detail/detail?code='+item.erpcode + '&type=cate' 
				});
			},
			
			//获取原车代码
			getCartCode(){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.CarCode,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					this_.carCode = []
					this_.carCode = res.data;
					
				},error => {
					console.log(error);
				});
			},
			
			//点击原车代码
			carCodeSel(car_code){
				let this_ = this;
				uni.navigateTo({
					url : '../proList/proList?scode=' + car_code +'&keyWord='
				});
			},
			
			//查询
			search(){
				let this_ = this;
				uni.navigateTo({
					url : '../proList/proList?scode=&keyWord='+ this_.keywords
				});
			},
			
			bindClick (e) {
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.CarCode + '?code=' + e.item.name + '&level2=2&level3=&isexact=1',
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					uni.navigateTo({
						url : '../proList/byClickProList?scode=&keyWord=&click=' + e.item.name + '&mb001=' + res.data[0].s_mb001
					});
				},error => {
					console.log(error);
				});
			}
		},
		watch: {
			carCode () {
				let letterArrs = []
				let dataArrs = []
				for ( let i = 0; i<this.carCode.length; i++) {
					letterArrs.push(this.carCode[i].s_car_code.substring(0,1))
					dataArrs.push(this.carCode[i].s_car_code)
				}
				// 去重
				letterArrs = Array.from(new Set(letterArrs))
				console.log(letterArrs)
				console.log(dataArrs)
				for(let x = 0; x<letterArrs.length; x++){
					const dataArrsxx = []
					for(let z = 0; z<dataArrs.length; z++){
						if (letterArrs[x] == dataArrs[z].substring(0,1)){
							dataArrsxx.push(dataArrs[z])
						}
					}
					this.newCarCodeList.push({
						letter: letterArrs[x],
						data: dataArrsxx
					})
				}
				console.log(this.newCarCodeList)
			}
		}
	}
</script>
