/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */
let baseUrl;
let routerMode;
const imgBaseUrl = 'https://fuss10.elemecdn.com';

//if (process.env.NODE_ENV == 'development') {
//  baseUrl = 'http://10.99.8.51:8080/flowcenter-activity';
// 	baseUrl = 'http://10.99.8.191:8080';
// 	baseUrl = 'http://10.99.1.128:8085';
	baseUrl = 'http://hd.zt.raiyi.com';
	//baseUrl = '';
	routerMode = 'hash'
/*}else{

	routerMode = 'hash'
}*/

export {
	baseUrl,
	routerMode,
	imgBaseUrl
}
