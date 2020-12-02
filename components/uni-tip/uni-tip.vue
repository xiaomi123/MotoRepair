<template>
	<view class="uni-tip-main">
		<view class="uni-tip-top" v-if="tipshows">
			<view class="uni-tip-txt" :style="{color: styleColor}">{{tipmsg}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniTip',
		props: {
			tipmsg:{
				type: String,
				default: ''
			},
			styleColor:{
				type: String,
				default: '#f5f5f5'
			},
			tipshow:{
				type: Boolean,
				default: false
			},
			tiptime:{
				type: Number,
				default: 0
			}
		},
		data() {
			return{
				tipshows: false
			}
		},
		mounted() {
			let that = this;
			that.tipshow = that.tipshows;
			alert(that.tipshow);
			setTimeout(function(){
				that.tipshow = false;
			},5000);
		},
	}
</script>

<style>
	.uni-tip-main{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 999;
		display: block;
		box-sizing: border-box;
		pointer-events: none;
	}
	.uni-tip-top{
		position: fixed;
		z-index: 999;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%,-50%);
		transform: translate(-50%,-50%);
		text-align: center;
		max-width: 80%;
		
	}
	.uni-tip-txt{
		display: inline-block;
		vertical-align: middle;
		color: #fff;
		background-color: rgba(17,17,17,.7);
		padding: 10px 20px;
		border-radius: 5px;
		font-size: 13px;
		text-align: center;
		max-width: 100%;
		word-break: break-all;
		white-space: normal;
	}
</style>
