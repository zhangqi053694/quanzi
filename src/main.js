import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import {routerMode} from './config/env'
import './config/rem'
import FastClick from 'fastclick'
import axios from 'axios'
Vue.prototype.$http = axios;

import './service/common'

import "babel-polyfill"

import 'fetch-detector'
import 'fetch-ie8'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

Vue.use(VueRouter)
Vue.use(MintUI)
const router = new VueRouter({
	routes,
	mode: routerMode,
	strict: process.env.NODE_ENV !== 'production'
})


new Vue({
	router,
}).$mount('#app')

