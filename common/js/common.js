import http from './http.js'
import api from './api.js'
/**
* 判断内容是否为空
*/
const isEmpty = (target) => {
	if (target != null && target == "null" && target =="undefined" && target==undefined) {
		target = target.replace(/(^\s*)|(\s*$)/g, "");   
	}
	if (target == null || target == "null" || target == "" || target =="undefined" || target==undefined) {
	  return true
	}
	return false
};
/**
* 判断手机号（首位为1的11位数字）
*/
const ckTel = (mobileNum) => {
	let ReDetection = false;
	let regu =/^1\d{10}$/;	
	let reg = new RegExp(regu);
	ReDetection = reg.test(mobileNum);  // 手机验证 13x 15x 18x 14x 17x以此类推
	if(!ReDetection){
	  return false;
	} 
	  return true;
};

/**
* 获取购物车数量 
*/
const cartNum = () => {
	let this_ = this;
	let _data;
	uni.getStorage({
		key:'userInfo',
		success:function(res){
			_data = res.data[0];
		}
	})
	http.httpTokenRequest({
		url: api.ShopCartQty+"?c_id="+_data.c_id,
		method: 'GET',
		data: {},
	}).then(res => {
		//请求成功
		console.log('购物车数量：'+res.data);
		uni.setStorageSync('cartNum',res.data);
	}),error => {
		console.log(error);
	}
	
};
export default {
	isEmpty,
	ckTel,
	cartNum
}
