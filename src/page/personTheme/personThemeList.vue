<template>
    <div>

        <div class="ptl-top-div">
            <div class="ptl-top-masker"></div>
            <div class="ptl-top-release" v-if="isMe">
                <img @click="loginOrRelease" src="../../images/icon_release.png">
            </div>
            <div class="ptl-top-header-div">
                <img :src="loginUserIcon!=null?loginUserIcon:require('../../images/defaultUserIcon.png')">
                <p class="ptl-top-userName">{{loginUserNickName}}</p>
                <!--<a class="ptl-top-prize">果币抽奖</a>-->
            </div>
        </div>

        <div class="ptl-num-div">
            <div class="ptl-num">
                <p>{{personNumList.releaseCount}}</p>
                <p>发布</p>
            </div>
            <div class="ptl-num">
                <p>{{personNumList.rewardCount}}</p>
                <p>打赏</p>
            </div>
        </div>

        <div style="margin-top: 0.5rem;">
            <div class="comment" v-for="(listData,index) in personThemeList">
                <div v-if="listData.type==2?true:false">
                    <router-link :to="'/comment/' + listData.themeId" :key="listData.themeId" class="con-img-a">
                        <div class="con">
                            <!--头像-->
                            <div class="con-top">
                                <router-link :to="'/comment/' + listData.themeId" :key="listData.themeId">
                                    <a class="con-top-a1">
                                        <!--默认头像的给予-->
                                        <img :src="(listData.userIcon!=null && listData.userIcon!='')?listData.userIcon:require('../../images/cr-033.png')"/>
                                    </a>
                                </router-link>
                                <div class="con-top-p">
                                    <p class="con-top-p1">
                                        <span>{{listData.nickName}}</span>
                                        <span class="con-top-p1-status" v-if="listData.auditStatus==-1">审核未通过</span>
                                        <span class="con-top-p1-status" v-if="listData.auditStatus==-2">内容未审核</span>
                                    </p>
                                    <p class="con-top-p2">{{countTime(listData.showTime)}}</p>
                                </div>
                                <div class="con-delete-div" @click.prevent="deletePT(listData.themeId)" v-if="listData.isMe==1">
                                    <img src="../../images/ptl-delete.png">
                                    <span>删除</span>
                                </div>
                            </div>
                            <!--评论-->
                            <div class="con-tit">
                                <router-link :to="'/comment/' + listData.themeId" :key="listData.themeId">
                                        <span class="con-tit-span1"
                                              v-if="listData.content!=null">{{listData.content.substring(0,79)}}</span><span
                                        v-if="listData.content!=null && listData.content.length>80" class="con-tit-point">...</span>
                                    <span class="con-tit-span2"
                                          v-if="listData.content!=null && listData.content.length>80">全文</span>
                                </router-link>
                            </div>
                            <!--嗮图-->
                            <div class="con-img">
                                <div class="con-img-2">
                                    <a v-if="key<3" class="con-img-a con-show-img"
                                       v-for="(value,key) in listData.imgList">
                                        <img :src="value.smallImg"/>
                                        <img class="gif-flag" src="../../images/gif-flag.png"
                                             v-if="value.img.indexOf('gif')>0?true:false">
                                    </a>
                                    <span class="con-img-num"
                                          v-if="listData.imgList!=null && listData.imgList.length>3">共{{listData.imgList.length}}张</span>
                                </div>
                            </div>
                        </div>
                    </router-link>
                    <!--留言，赞，打赏-->
                    <div class="con-talk">
                        <span>
                             <router-link :to="'/comment/' + listData.themeId" :key="listData.themeId" class="con-img-a">
                                 <a class="con-talk-aImg"><img src="../../images/cr-004.png"/></a>
                                 <i>{{listData.commentCount}}</i>
                             </router-link>
                        </span>

                        <span v-if="isHaveLike(listData.behaviors)" @click="ptlLikeData(listData.likeCount,listData.themeId,'1',listData.auditStatus)">
                            <img src="../../images/index-dz-b.png"/><i style="color: #FF9728;">{{listData.likeCount}}</i>
                        </span>
                        <span v-else="" @click="ptlLikeData(listData.likeCount,listData.themeId,'2',listData.auditStatus)">
                            <img src="../../images/index-dz-a.png"/><i>{{listData.likeCount}}</i>
                        </span>

                        <span class="con-talk-btn" @click="listDataFun(listData.themeId,listData.userType,listData.auditStatus)">
                            <a class="con-talk-aImg">
                                <img v-if="isHaveReward(listData.behaviors) && listData.behaviors!=null" src="../../images/index-ds-a.png"/>
                            </a>
                            <i v-if="isHaveReward(listData.behaviors) && listData.behaviors!=null">{{listData.rewardCount}}</i>

                            <a class="con-talk-aImg">
                                <img v-if="HaveReward(listData.behaviors) && listData.behaviors!=null" src="../../images/index-ds-b.png"/>
                            </a>
                            <i v-if="HaveReward(listData.behaviors) && listData.behaviors!=null" style="color: #FF9728;">{{listData.rewardCount}}</i>

                            <a class="con-talk-aImg">
                                <img v-if="listData.behaviors==null" src="../../images/index-ds-a.png"/>
                            </a>
                            <i v-if="listData.behaviors==null">{{listData.rewardCount}}</i>
                        </span>
                    </div>
                </div>
            </div>

            <!--加载转圈-->
            <div class="hcircle-wait" v-show="isShowBottomLoading">
                <!--loading动画-->
                <div class="loading-wrapper">
                    <img src="../../images/loadingImg.png">
                </div>
            </div>
            <div class="hcircle-wait" v-show="!isShowBottomLoading">
                <p>已经到底啦</p>
            </div>

        </div>

        <!--打赏弹窗-->
        <div class="award-pop" @click="awardNone2" @touchmove.prevent v-show="isshow"></div>
        <div class="award-tc" v-show="isshow">
            <div class="award-1"><img src="../../images/cr-014.png"/></div>
            <div class="award-2" @click="popNone"><img src="../../images/cr-015.png"/></div>
            <div v-if="islogin" class="award-3"><b>给他打赏</b></div>
            <!--未登录-->
            <div v-else="" class="award-3"><b>打赏</b></div>
            <div v-if="islogin && copyUserType == 3" class="award-4">{{jackpotCopy}}</div>
            <div v-if="islogin && copyUserType != 3" class="award-4">{{personCopy}}</div>
            <div v-if="!islogin" class="award-4">打赏赢果币即有机会参与抽奖<br />赶快登录参与吧</div>
            <div class="award-5" v-show="islogin">
                <div class="award-minus" @click="awardMinus"><img src="../../images/cr-016.png"/></div>
                <div class="award-money">{{listNumber}}个果币</div>
                <div class="award-plus" @click="awardPlus"><img src="../../images/cr-017.png"/></div>
            </div>
            <div  v-if="islogin" class="award-6" @click="awardGo()">立刻打赏</div>
            <div v-else="" @click="awardLogin" class="award-6">立刻登录</div>
            <div style="line-height: 1;color: red;text-align: center;margin-bottom: 0.5rem;" v-if="rewardMsg !=''">
                {{rewardMsg}}
            </div>
            <!--<div class="award-7">中奖后可在<span>"我的"-"果币"</span>中查看</div>-->
        </div>

    </div>
</template>

<script>
    import { Toast,Indicator,MessageBox  } from 'mint-ui';

    import {getStore, setStore} from 'src/config/mUtils'
    import {personThemeList,deletePersonTheme,personNum,likeTheme,awardTheme} from '../../service/getData'

    var appCode = 'other_browser';
    var gbcount = 1;
    var gbthemeId = 0;

    export default{
        data(){
            return {
                deviceId: null,
                loginUserIcon: null,
                loginUserNickName: null,
                personThemeList: null,
                ptlPageIndex: 1,
                ptlPageSize: 10,
                casId: 0,
                userType: 1,
                userAccount: 0,
                personNumList: {
                    releaseCount: 0,
                    rewardCount: 0
                },
                isShowBottomLoading: true,
                isMe: false,
                isshow: false,
                islogin:false,
                jackpotCopy: '每打赏一个果币将得到一次获得奖池所有果币的机会，打赏越多，机会越大哦',
                personCopy: '每打赏一个果币对方将得到一个果币',
                copyUserType: 0,
                listNumber: 1,
                rewardMsg: null,
            }
        },
        created(){
            var urlPara = GetQueryString('appcode');
            if (urlPara!=null){
                appCode = urlPara;
            }

            var storeCasId = getStore('casId');
            this.userAccount = this.$route.params.userAccount;
            this.casId = this.$route.params.casId;

            if (this.userAccount == storeCasId){
                this.casId = 0
            }

            if (this.casId == 0){
                this.casId = storeCasId;
                this.isMe = true;
            }
            else {
                this.isMe = false;
            }

            this.userType = this.$route.params.userType;

            if (this.userAccount == 0){
                this.userAccount = this.casId;
            }

            var userNickName = this.$route.params.userNickName;
            if (userNickName == 0 || this.casId == storeCasId){
                this.loginUserNickName = getStore('userNickName');
            }
            else {
                this.loginUserNickName = userNickName;
            }

            var userIcon = this.$route.params.userIcon;
            if (userIcon == 0 || this.casId == storeCasId){
                var userIconLocal = getStore("userIcon");
                if (userIconLocal != null && userIconLocal != '') {
                    this.loginUserIcon = userIconLocal;
                }
                else {
                    this.loginUserIcon = null;
                }
            }
            else {
                this.loginUserIcon = 'http://filestore.zt.raiyi.com/fs/userIcon/'+userIcon;
                if (!(this.CheckImgExists(this.loginUserIcon))){
                    this.loginUserIcon = null;
                }
            }

            if (storeCasId!=null) {
                this.casId = storeCasId;
            }
            else {
                this.casId = ''
            }


            var userId = getStore("_uuid");
            if(userId != null && userId != ''){
                this.islogin = true;
            }else{
                this.islogin = false;
            }


            this.deviceId = getStore("_bbid");
            let time = setInterval(() => {
                this.deviceId = getStore("_bbid");
                if (this.deviceId != null) {
                    clearInterval(time)
                    this.getPTL();
                    this.getPersonNum();
                }
            }, 50)

            this.scrollLoad();
        },
        methods:{
            getPTL(){
                personThemeList(this.deviceId,this.casId,this.userType,this.userAccount,this.ptlPageSize).then(json => {
                    //console.log(json)
                    if (json.code == '0000') {
                        this.personThemeList = json.data;

                        if (this.personThemeList!=null) {
                            if (this.personThemeList.length < this.ptlPageSize) {
                                this.isShowBottomLoading = false;
                            }
                        }
                        else {
                            this.isShowBottomLoading = false;
                        }
                    }
                });
            },
            getPersonNum(){
                personNum(this.deviceId,this.casId,this.userType,this.userAccount).then(json => {
                    //console.log(json)
                    if (json.code == '0000') {
                        this.personNumList = json.data;

                        this.loginUserIcon = json.data.userIcon;
                    }
                })
            },
            deletePT(themeId){
                MessageBox.confirm('确定要删除吗?').then(action => {
                    deletePersonTheme(this.deviceId,this.casId,themeId).then(json => {
                        //console.log(json);
                        if (json.code == '0000') {
                            this.getPTL();
                        }
                    });
                })
            },
            loginOrRelease(){
                var userId = getStore('_uuid');
                if (userId == null || userId == ''){
                    this.$router.push('/login');
                }
                else {
                    this.$router.push('/release');
                }
            },
            CheckImgExists(imgurl){
                var ImgObj = new Image(); //判断图片是否存在
                ImgObj.src = imgurl;
                //没有图片，则返回-1
                if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
                    return true;
                } else {
                    return false;
                }
            },
            toComment(themeId){
                this.$router.push('/comment/'+themeId);
            },
            countTime(item){
                let curentTime = new Date()
                let showTime = new Date(item);
                let day = showTime.getDate();
                let month = showTime.getMonth() + 1;
                let year = showTime.getFullYear();
                let hour = showTime.getHours();
                let min = showTime.getMinutes();

                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                if (hour < 10) {
                    hour = '0' + hour;
                }
                if (min < 10) {
                    min = '0' + min;
                }

                let lastShowTime = '';

                if (curentTime.getFullYear() - year > 0) {
                    lastShowTime += year + '-';
                }
                if (curentTime.getDate() - day > 0 || curentTime.getMonth() + 1 - month != 0) {
                    lastShowTime += month + '-' + day + ' ';
                }
                lastShowTime += hour + ':' + min;

                return lastShowTime;
            },
            isHaveLike(behaviorsList){
                var isHave = false;
                if (behaviorsList != null) {
                    for (var i = 0; i < behaviorsList.length; i++) {
                        if (behaviorsList[i].behaviorType == 'LIKE' && behaviorsList[i].behaviorValue == '1') {
                            isHave = true;
                        }
                    }
                }
                return isHave;
            },
            isHaveReward(behaviorsList){
                var isHave = false;
                if (behaviorsList != null) {
                    if (!(behaviorsList.hasOwnProperty('REWARD'))) {
                        isHave = true;
                    }
                    for (var i = 0; i < behaviorsList.length; i++) {
                        if (behaviorsList[i].behaviorType == 'REWARD') {
                            isHave = false;
                        }
                    }
                }
                return isHave;
            },
            HaveReward(behaviorsList){
                var isHave = false;
                if (behaviorsList != null) {
                    for (var i = 0; i < behaviorsList.length; i++) {
                        if (behaviorsList[i].behaviorType == 'REWARD') {
                            isHave = true;
                        }
                    }
                }
                return isHave;
            },
            scrollLoad(){
                let _this = this;
                window.onscroll = function (){
                    var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
                    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                    var innerHeight = window.innerHeight;

                    if (scrollTop + innerHeight >= htmlHeight && innerHeight < htmlHeight && _this.personThemeList.length>=_this.ptlPageSize){
                        _this.ptlPageSize += 10
                        _this.getPTL()
                    }
                }
            },
            ptlLikeData(pice, themeId, like,auditStatus){
                if (auditStatus>=0) {
                    if (like == 1) {
                        like = 2;
                    }
                    else {
                        like = 1;
                    }
                    var _self = this;

                    //页面优先展示点赞效果
                    var LikeObj = {"behaviorType": "LIKE", "behaviorValue": '1'};
                    var LikeArr = [{"behaviorType": "LIKE", "behaviorValue": '1'}];

                    if (like == 1) {
                        pice = pice + 1;
                    } else {
                        pice = pice - 1;
                    }
                    for (var i = 0; i < _self.personThemeList.length; i++) {
                        if (_self.personThemeList[i].themeId == themeId) {
                            if (_self.personThemeList[i].behaviors != null) {
                                //判断behaviorType是否存在LIKE
                                var isHaveLikeItem = true;
                                for (var j = 0; j < _self.personThemeList[i].behaviors.length; j++) {
                                    if (_self.personThemeList[i].behaviors[j].behaviorType == 'LIKE') {
                                        isHaveLikeItem = false;
                                        _self.personThemeList[i].behaviors[j].behaviorValue = like;
                                    }
                                }
                                if (isHaveLikeItem) {
                                    _self.personThemeList[i].behaviors.push(LikeObj);
                                }
                            }
                            else {
                                _self.personThemeList[i].behaviors = LikeArr;
                            }
                            _self.personThemeList[i].likeCount = pice;
                        }
                    }

                    likeTheme(this.deviceId, themeId, like, appCode).then(json => {
                        //console.log(json);
                        if (json.code == "0000") {
                        }
                    });
                }
                else {
                    Toast({
                        message: '暂未审核通过，无法点赞',
                        duration: 2000
                    });
                }
            },
            awardGo(){
                var _self = this;
                var userId = getStore('_uuid');
                if (userId!=null && userId!='') {
                    awardTheme(this.deviceId, gbthemeId, gbcount,appCode)
                        .then(json => {
                            //console.log(json);
                            if (json.code == '0000') {
                                _self.isshow = false;
                                for (var i = 0; i < _self.personThemeList.length; i++) {
                                    if (_self.personThemeList[i].themeId == gbthemeId) {
                                        _self.personThemeList[i].behaviors = json.data.behaviors;
                                        _self.personThemeList[i].rewardCount = gbcount + _self.personThemeList[i].rewardCount;
                                    }
                                }
                                _self.listNumber = 1;
                            } else if (json.code == '3003') {
                                this.$router.push('/login_reward');
                            }
                            else {
                                this.rewardMsg = json.msg;
                            }
                        })
                }
                else {
                    this.$router.push('/login_reward');
                }
            },
            listDataFun(themeid,copyUserType,auditStatus){
                if (auditStatus>=0) {
                    this.isshow = !this.isshow;
                    this.copyUserType = copyUserType;
                    gbthemeId = themeid
                }
                else {
                    Toast({
                        message: '暂未审核通过，无法打赏',
                        duration: 2000
                    });
                }
            },
            awardLogin(){
                this.$router.push('/login_reward');
            },
            awardMinus(){
                this.listNumber--
                if (this.listNumber <= 1) {
                    this.listNumber = 1
                }
                gbcount = this.listNumber

            },
            awardPlus(){
                this.listNumber++
                gbcount = this.listNumber
            },
            popNone(){
                this.isshow = false
                this.rewardMsg=null
            },
            awardNone2(){
                this.isshow = false
                this.rewardMsg=null
            },
        }
    }
</script>

<style>
    body{
        background-color: #f2f2f2;
    }

    .ptl-top-div {
        position: relative;
        background-size: cover;
        background-repeat: no-repeat;
        background-image: url("../../images/ptl-top-bg.png");
        width: 100%;
        height: 9rem;
    }

    .ptl-top-masker {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        z-index: 2;
    }

    .ptl-top-release {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        height: 1rem;
        z-index: 3;
    }

    .ptl-top-release img {
        height: 100%;
    }

    .ptl-top-header-div {
        position: absolute;
        top: 3rem;
        left: 0;
        width: 100%;
        text-align: center;
        z-index: 3;
    }

    .ptl-top-header-div > img {
        width: 3rem;
        height: 3rem;
        border: 0.1rem solid #fff;
        border-radius: 9999px;
        box-sizing: border-box;
        margin: 0 auto;
    }

    .ptl-top-userName {
        font-size: 0.8rem;
        color: #fff;
        line-height: 1;
        margin-bottom: 0.3rem;
        margin-top: 0.2rem;
    }

    .ptl-top-prize {
        display: inline-block;
        color: #fff;
        font-size: 0.85rem;
        line-height: 1.6rem;
        width: 6rem;
        background-color: #ff8a00;
        border-radius: 9999px;
    }

    .ptl-num-div {
        position: relative;
        background-color: #fff;
        padding: 0.5rem 0;
        font-size: 0;
    }

    .ptl-num-div:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 1px;
        height: 50%;
        background-color: #e5e5e5;
    }

    .ptl-num {
        display: inline-block;
        font-size: 0.6rem;
        color: #a4a4a4;
        width: 50%;
        text-align: center;
    }

    .ptl-num > p:first-child {
        color: #323232;
        font-size: 0.85rem;
    }

    /*列表*/
    .comment {
        margin-bottom: 0.5rem;
    }

    .con {
        background: #fff;
        padding: 0.8rem;
        position: relative;
    }

    .con:before{
        position: absolute;
        content: '';
        width: 100%;
        left: 0;
        top: 0;
        height: 1px;
        background-color: #d3d3d3;
        -webkit-transform: scale(1,0.5);
        transform: scale(1,0.5);
        -webkit-transform-origin: center bottom;
        transform-origin: center bottom;
    }

    .con:after{
        position: absolute;
        content: '';
        width: 100%;
        left: 0;
        bottom: 0;
        height: 1px;
        background-color: #d3d3d3;
        -webkit-transform: scale(1,0.5);
        transform: scale(1,0.5);
        -webkit-transform-origin: center bottom;
        transform-origin: center bottom;
    }

    .con-top{
        position: relative;
    }

    .con-top a {
        display: inline-block;
        width: 2.7rem;
        height: 2.7rem;
        border-radius: 50%;
        vertical-align: middle;
        overflow: hidden;
    }

    .con-top a img {
        width: 100%;
        height: 100%;
    }

    .con-top-p {
        display: inline-block;
        width: 80%;
        padding-left: 0.4rem;
        vertical-align: middle;
    }

    .con-top-p1 {
        color: #536792;
        font-weight: bold;
        font-size: 0.85rem;
        padding-bottom: 0.2rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: middle;
        line-height: 1rem;
    }

    .con-top-p1 span{
        display: inline-block;
        vertical-align: middle;
    }

    .con-top-p2 {
        color: #afafaf;
        font-size: 0.7rem;
    }

    .con-tit {
        font-size: 0.8rem;
        padding: 0.5rem 0;
        text-align: justify;
    }

    .con-tit .con-tit-span1 {
        word-break: break-all;
        color: #333;
    }

    .con-tit-span2 {
        color: #5a6d96;
    }

    .con-tit-point{
        color: #5a6d96;
    }

    .con-img-1 img {
        width: 100%
    }

    .con-img-2 {
        /*display: -webkit-flex;*/
        /*display: flex;*/
        /*justify-content: space-between;*/
        position: relative;
        overflow: hidden;
    }

    .con-show-img {
        height: 6rem;
        overflow: hidden;
        float: left;
        position: relative;
    }

    .con-show-img img {
        min-height: 100%;
        object-fit: cover;
    }

    .con-img-2 .con-show-img:nth-child(3n+2){
        margin: 0 2%;
    }

    .con-img-a {
        width: 32%;
    }

    .con-img-a img {
        width: 100%;
        display: block;
    }

    .con-img-num {
        position: absolute;
        z-index: 2;
        right: 0;
        bottom: 0;
        background: rgba(1, 1, 1, .7);
        color: #fff;
        padding: 0.2rem 0.6rem;
        font-size: 0.7rem;
    }

    .gif-flag{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        width: 45%  !important;
        min-height: initial !important;
        object-fit: initial !important;
        height: auto !important;
        background-color: transparent !important;
    }

    .con-talk {
        display: -webkit-flex;
        display: flex;
        justify-content: space-between;
        background: #fff;
        padding: 0.6rem 0;
        position: relative;
    }
    .con-talk:after{
        position: absolute;
        content: '';
        width: 100%;
        left: 0;
        bottom: 0;
        height: 1px;
        background-color: #d3d3d3;
        -webkit-transform: scale(1,0.5);
        transform: scale(1,0.5);
        -webkit-transform-origin: center bottom;
        transform-origin: center bottom;
    }

    .con-talk span {
        width: 33.3333%;
        text-align: center;
        font-size: 0;
    }

    .con-talk-aImg {
        display: inline-block;
        vertical-align: middle;
    }
    .con-talk-aImg img{
        width: 0.8rem;
        display: block;
    }

    .con-talk span img {
        display: inline-block;
        vertical-align: middle;
        width: .8rem;
    }

    .con-talk span i {
        vertical-align: middle;
        font-style: normal;
        font-size: 0.8rem;
        padding-left: 0.5rem;
        color: #787878;
    }

    .con-talk span:nth-of-type(2) {
        position: relative;
    }

    .con-talk span:nth-of-type(2):before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        height: 100%;
        background: #d3d3d3;
        -webkit-transform: scale(0.5,1);
        transform: scale(0.5,1);
    }

    .con-talk span:nth-of-type(2):after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 100%;
        background: #d3d3d3;
        -webkit-transform: scale(0.5,1);
        transform: scale(0.5,1);
    }

    .message-talk-top {
        overflow: hidden;
        padding: 0.9rem 0.8rem 0 0.8rem;
        background: #fff;
    }

    .message-top-header {
        float: left;
        width: 2.8rem;
        height: 2.8rem;
        border-radius: 50%;
        overflow: hidden;
    }

    .message-top-header img {
        width: 100%;
        position: relative;
    }

    .message-top-name {
        float: left;
        padding-left: 0.4rem;
        width: 38%;
    }

    .message-top-name-p1 {
        color: #536792;
        font-size: 0.9rem;
        padding-bottom: 0.3rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .message-top-name-p2 {
        color: #afafaf;
        font-size: 0.85rem;
    }

    .message-top-shop {
        text-align: right;
        padding-top: 0.5rem;
    }

    .message-top-shop a {
        display: inline-block;
        margin-left: 1rem;
    }

    .message-top-shop a:first-child {
        margin-left: 0;
    }

    .message-top-shop a img {
        width: 0.9rem;
        display: inline-block;
        vertical-align: middle;
    }

    .message-top-shop a span {
        vertical-align: middle;
        color: #838383;
        padding-left: 0.3rem;
    }

    .message-talk-tit {
        font-size: 0.9rem;
        padding: 0.3rem 0.8rem 0.8rem 4rem;
        position: relative;
    }

    .message-talk-tit span {
        color: #536792;
    }

    .message-talk-tit:before {
        content: '';
        position: absolute;
        height: 1px;
        background: #e5e5e5;
        width: 100%;
        bottom: 0;
        right: 0;
    }

    .message-talk-reply {
        background: #fff;
        font-size: 0.9rem;
        padding: 0.3rem 0.8rem 0.8rem 4rem;
        border-bottom: 1px solid #e5e5e5;
    }

    .message-talk-reply b {
        font-weight: 500;
        color: #536792;
    }

    .con-top-p1-status{
        background-color: #ff0000;
        color: #fff;
        font-size: 0.6rem;
        margin-left: 0.2rem;
        width: 4rem;
        text-align: center;
        border-radius: 0.15rem;
        /*line-height: 1;*/
        /*padding: 0.2rem 0;*/
    }

    .con-delete-div{
        position: absolute;
        top: 0;
        right: 0;
        width: 3rem;
        font-size: 0.6rem;
        color: #6e6e6e;
        text-align: center;
        line-height: 1.3rem;
        border: 1px solid #eaeaea;
        border-radius: 0.1rem;
    }

    .con-delete-div img{
        display: inline-block;
        vertical-align: middle;
        width: auto;
        height: 0.8rem;
    }

    .con-delete-div span{
        display: inline-block;
        vertical-align: middle;
    }


    .hcircle-wait{
        padding:0.3rem 0 0.8rem;
        text-align: center;
        margin:0 auto;
        /*background: #fff;*/
    }

    .hcircle-wait p{
        font-size: 0.7rem;
        color: #bebebe;
    }

    @-webkit-keyframes rotation{
        0%{-webkit-transform: rotate(0deg);}
        100%{-webkit-transform: rotate(360deg);}
    }
    @-moz-keyframes rotation{
        0%{-moz-transform: rotate(0deg);}
        100%{-moz-transform: rotate(360deg);}
    }
    @keyframes rotation{
        0%{transform: rotate(0deg);}
        100%{transform: rotate(360deg);}
    }

    .loading-wrapper{
        animation: rotation 1s ease-in-out infinite;
        width: 2rem;
        height: 2rem;
        margin: 0 auto;
    }

    .loading-wrapper img{
        width: 100%;
        height: 100%;
    }



    /*打赏弹窗*/
    .award-pop {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 99;
        background: rgba(1, 1, 1, .5);
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        max-width: 720px;
    }

    .award-tc {
        background: #fff;
        border-radius: 6px;
        position: fixed;
        padding: 0.8rem;
        width: 80%;
        top: 25%;
        max-width: 720px;
        z-index: 100;
        right: 0;
        left: 0;
        margin: auto;
        font-size: 0.8rem;
    }

    .award-1 {
        position: absolute;
        top: -1.5rem;
        left: 0;
        right: 0;
        margin: auto;
        width: 3rem;
    }

    .award-1 img {
        width: 100%;
    }

    .award-2 {
        position: absolute;
        top: 0.2rem;
        right: 0.4rem;
        width: 1.5rem;
        padding: 0.4rem;
    }

    .award-2 img {
        width: 100%;
    }

    .award-3 {
        padding: 1.2rem 0 0.5rem 0;
        font-size: 0.9rem;
        text-align: center;
    }

    .award-4 {
        padding: 0 0.2rem 0.8rem 0.2rem;
        text-align: center;
        color: #9f9f9f;
    }

    .award-5 {
        overflow: hidden;
        margin-bottom: 1rem;
    }

    .award-minus {
        float: left;
        width: 25%;
        text-align: center;
        border: 1px solid #e5e5e5;
        line-height: 2.2rem;
        border-radius: 10rem 0 0 10rem;
    }

    .award-minus img {
        display: inline-block;
        vertical-align: middle;
        width: 0.8rem;
    }

    .award-money {
        float: left;
        width: 39%;
        text-align: center;
        border: 1px solid #e5e5e5;
        line-height: 2.2rem;
        font-size: 0.9rem;
        color: #ff1400;
        margin: 0 4%;
    }

    .award-plus {
        float: left;
        width: 25%;
        text-align: center;
        border: 1px solid #e5e5e5;
        line-height: 2.2rem;
        border-radius: 0 10rem 10rem 0;
    }

    .award-plus img {
        display: inline-block;
        vertical-align: middle;
        width: 0.8rem;
    }

    .award-6 {
        background: #1cbafb;
        color: #fff;
        margin: 1rem 0.5rem 1rem 0.5rem;
        border-radius: 30rem;
        text-align: center;
        padding: 0.6rem 0;
        font-size: 0.9rem;
    }

    .award-6:active {
        background: #178ebe;
    }

    .award-7 {
        text-align: center;
        color: #9f9f9f;
    }

    .award-7 span {
        color: #1cbafb;
    }

    canvas {
        max-width: 720px;
    }

    .award {
        margin: 0 auto;
        text-align: center;
        position: relative;
    }
</style>