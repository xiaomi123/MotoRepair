const baseUrl = 'http://gao.vocen.cn/api/';
const imgUrl = 'http://gao.vocen.cn:8015';
const imgPath = 'http://120.76.144.84:8089/';
// const baseUrl = 'http://10.0.2.188:8006/api/';
// const baseUrl = 'http://10.0.2.233:8506/api/';



const httpRequest = (opts) => {
	let httpDefaultOpts = {
		url: baseUrl+opts.url,
		data: {"":JSON.stringify(opts.data)},
		method: opts.method,
		/*header: opts.method == 'get' ? {
		'X-Requested-With': 'XMLHttpRequest',
		"Accept": "application/json",
		"Content-Type": "application/json; charset=UTF-8"
		} : {
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},*/
		header:{'content-type': 'application/x-www-form-urlencoded'},
		dataType: 'json',
	};
	let promise = new Promise(function(resolve, reject) {
	uni.request(httpDefaultOpts).then(
		(res) => {
			resolve(res[1]);
		}).catch(
		(response) => {
			reject(response);
		});
	});
	return promise;
};
//带Token请求
const httpTokenRequest = (opts) => {
	let token = "";
	uni.getStorage({
		key: 'userInfo',
		success: function(ress) {
			token = ress.data[0].token;
		}
	});
	//此token是登录成功后后台返回保存在storage中的
	let httpDefaultOpts = {
		url: baseUrl+opts.url,
		data: {"":JSON.stringify(opts.data)},
		method: opts.method,
		/*header: opts.method == 'get' ? {
			'Token': token,
			'X-Requested-With': 'XMLHttpRequest',
			"Accept": "application/json",
			"Content-Type": "application/json; charset=UTF-8"
		} : {
			'Token': token,
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},*/
		header:{
			'content-type': 'application/x-www-form-urlencoded',
			'Authorization':'Basic ' + token,
		},
		dataType: 'json',
	}
	let promise = new Promise(function(resolve, reject) {
	uni.request(httpDefaultOpts).then(
		(res) => {
		resolve(res[1]);
	}).catch(
		(response) => {
			reject(response);
		});
	});
	return promise;
};

export default {
	imgUrl,
	baseUrl,
	imgPath,
	httpRequest,
	httpTokenRequest    
}