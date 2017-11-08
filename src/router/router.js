import App from '../App'

const comment = r => require.ensure([], () => r(require('../page/theme/Comment.vue')), 'themeList')
const release = r => require.ensure([], () => r(require('../page/release/release.vue')), 'release')

const account = r => require.ensure([], () => r(require('../page/theme/account.vue')), 'account')
const themeList = r => require.ensure([], () => r(require('../page/theme/themeList.vue')), 'themeList')
const login = r => require.ensure([], () => r(require('../page/login/login')), 'login')
const loginReward = r => require.ensure([], () => r(require('../page/login/reward_login.vue')), 'login')
const couponList = r => require.ensure([], () => r(require('../page/couponList/couponList.vue')), 'couponList')
const personThemeList = r => require.ensure([], () => r(require('../page/personTheme/personThemeList.vue')), 'personThemeList')
const winningRecord = r => require.ensure([], () => r(require('../page/winning/winningRecord.vue')), 'winningRecord')

const lists = r => require.ensure([], () => r(require('../page/list/lists.vue')), 'lists')





export default [{
    path: '/',
    component: App, //顶层路由，对应index.html
    children: [ //二级路由。对应App.vue
        //地址为空时跳转home页面
        {
            path: '',
            redirect: '/themeList'
        },
      //新的列表
      {
        path: '/lists',
        component: lists,
        meta: {keepAlive: true}
      },
        //帖子列表
        {
        path: '/themeList',
        component: themeList,
          meta: {keepAlive: true}
        },
        //评论页面
        {
            path: '/comment/:themeId',
            component: comment,
            meta: {keepAlive: false}
        },//账户页面
        {
            path: '/account',
            component: account,
            meta: {keepAlive: false}
        },
        //登录注册页
        {
            path: '/login',
            component: login,
            meta: {keepAlive: false}
        },
        //打赏未登录进入的登录注册页
        {
            path: '/login_reward',
            component: loginReward,
            meta: {keepAlive: false}
        },
        //卡券列表页
        {
            path: '/couponList',
            component: couponList,
            meta: {keepAlive: false}
        },
        //发帖页面
        {
            path: '/release',
            component: release,
            meta: {keepAlive: false}
        },
        //个人圈子列表
        {
            path: '/personThemeList/:casId/:userType/:userAccount/:userNickName/:userIcon',
            component: personThemeList,
            meta: {keepAlive: false}
        },
        //中奖纪录
        {
            path: '/winningRecord',
            component: winningRecord,
            meta: {keepAlive: false}
        },
    ]
}]
