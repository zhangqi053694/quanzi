<template>
    <div style="background-color: #f2f2f2;">
        <div class="quanzi page-loadmore-wrapper" v-bind:style="{ 'max-height': screenHeight+'px'}"  ref="wrapper">
            <!--滑块开始-->
            <!-- <div class="page-loadmore-wrapper" ref="wrapper" > -->
                    <mt-loadmore :bottomMethod="loadBottom" @bottom-status-change="handleBottomChange"
                                 :bottomAllLoaded="allLoaded" ref="loadmore">
            <div class="quanziDetail">
                <div class="htit-bt" v-if="commentData.themeType==0?true:false"></div>
                <div class="htit-bt" v-if="commentData.themeType==1?true:false">{{commentData.content}}</div>
                <div class="qzHead">
                    <div class="headImg">
                        <img :src="userIcon">
                    </div>
                    <div class="headFont">
                        <p class="headFont-name">{{commentData.nickName}}</p>
                        <p class="headFont-tiem" style="font-size:0.7rem;color:#afafaf;">
                            {{countTime(commentData.showTime)}}</p>
                    </div>
                </div>
                <div class="qzWenzi">
                    <p v-if="commentData.themeType == null || commentData.themeType == 0">{{commentData.content}}</p>
                    <div v-else="" v-html="commentData.html"></div>
                </div>
                <div v-if="commentData.themeType == null || commentData.themeType == 0" class="qzImgs">
                    <div v-for="(img,index) in imgList">
                        <img @click="largeImgs(index)" :src="img.smallImg" />
                        <img @click="largeImgs(index)" class="gif-flag" src="../../images/gif-flag.png" v-if="img.img.indexOf('gif')>0?true:false">
                    </div>
                </div>
                <!--来源-->
                <div v-if="commentData.site == null || commentData.site ==''" class="hsource"></div>
                <div v-else="" class="hsource">来源：{{commentData.site}}</div>
                <!--打赏-->
                <div class="rewardWindow" v-if="commentData.userType==3?true:false">
                    <p class="rewardWindow-p1"><a @click="rewardWindow()">赏</a></p>
                    <p class="rewardWindow-p2">第{{ lotteryperiodId }}期，奖池累计: {{ lotterytotal }}</p>
                    <div class="reward-countdown">
                        <a>开奖倒计时</a>
                        <span id="h-time">{{hour}}</span>:<span id="h-minute">{{minute}}</span>:<span id="h-second">{{second}}</span>
                    </div>
                </div>
                <div class="smallIcons">
                    <div class="iconDiv" @click="showReply('',commentData.auditStatus)">
                        <img src="../../images/index-pl-a.png"/>
                        <p>{{commentsCount}}</p>
                    </div>
                    <!--like 1代表喜欢 2代表不喜欢  -->
                    <div class="iconDiv2 iconDiv3" v-if="liked == 1" @click="upTheme(2,commentData.auditStatus)">
                        <img  src="../../images/index-dz-b.png"/>
                        <p :style="'color:#FF9728;'">{{commentData.likeCount}}</p>
                    </div>
                    <div class="iconDiv2 iconDiv3" v-else="" @click="upTheme(1,commentData.auditStatus)">
                        <img  src="../../images/index-dz-a.png"/>
                        <p :style="'color:#787878;'">{{commentData.likeCount}}</p>
                    </div>
                    <div class="iconDiv2" @click="award('',commentData.auditStatus)">
                        <img v-if="isRewarded" src="../../images/index-ds-b.png"/>
                        <img v-else="" src="../../images/index-ds-a.png"/>
                        <p :style="isRewarded?'color:#FF9728;':'color:#787878;'">{{rewardCount}}</p>
                    </div>
                </div>
                <nav class="separate"></nav>
                
                        <ul id="comments" class="comments_ul" style="overflow: scroll;">
                            <li class="commentLi" v-for="commentSingle in comments">
                                <div style="width: 2.5rem;height: 2.5rem;background: gray;border-radius: 50%;float: left;margin: 0.3rem 0.5rem 1rem 0;">
                                    <img v-if="commentSingle.userIcon" class="c_img" :src="commentSingle.userIcon"/>
                                    <img v-else="" class="c_img" src="../../images/cr-012.png"/>
                                </div>
                                <section class="commentDesc">
                                    <header class="nameTime">
                                        <!-- <p v-if="commentSingle.nickName != null" class="nameTime-name">
                                            {{commentSingle.nickName}}</p> -->
                                        <p class="nameTime-name">
                                        {{getVisitorName(commentSingle.userType,commentSingle.userAccount,commentSingle.nickName)}}</p>
                                        <p class="nameTime-tiem">
                                            {{countTime(commentSingle.showTime) }}
                                            <a class="delCommentBtn" @click="deleteComment(commentSingle.commentId)"
                                                    v-if="commentSingle.userAccount == browserId||commentSingle.userAccount==casId">删除
                                            </a>
                                        </p>
                                        <nav>
                                            
                                            <img v-if="commentSingle.isLike == 1"
                                                 @click="upComment(commentSingle.commentId,2)"
                                                 src="../../images/index-dz-b.png"/>
                                            <img v-else="" @click="upComment(commentSingle.commentId,1)"
                                                 src="../../images/index-dz-a.png"/>
                                            <p :style="commentSingle.isLike == 1?'color:#FF9728;':'color:#787878;'">
                                                {{commentSingle.likeCount<=999?commentSingle.likeCount:commentSingle.likeCount+'+'}}</p>
                                        </nav>
                                    </header>
                                </section>
                                <nav class="commentContent">
                                    <p>
                                        <span v-if="commentSingle.isReComment==1">回复<span style="color:#536792;">{{commentSingle.pNickName}}</span>:</span>{{commentSingle.content}}
                                    </p>
                                </nav>
                            </li>
                            <li class="loadOrNo" v-show="bottomStatus != 'loading'">
                                <nav class="loadOrNo-foot" v-if="allLoaded">已经到底了哦</nav>
                                <nav class="loadOrNo-up" v-else="">上拉加载更多</nav>
                            </li>
                        </ul>
                        
                        
            </div>
            <div slot="bottom" class="mint-loadmore-bottom">
                            <span v-show="bottomStatus === 'loading'">
                            <div class="mint-spinner-snake"
                             style="border-top-color: rgb(204, 204, 204); border-left-color: rgb(204, 204, 204); border-bottom-color: rgb(204, 204, 204); height: 28px; width: 28px;padding-top:-5px;"></div>
                            </span>
                        </div>
            <!--滑块结束-->
            </mt-loadmore>
                <!-- </div>   -->
        </div>
        <!--回复-->
        <div @click="showReply('',commentData.auditStatus)" class="revert">
            <div class="revert-c">
                <input class="revert-input" type="text" placeholder="写评论" readonly/>
                <input class="revert-button" type="button" value="回复"/>
                <img class="revert-img" src="../../images/cr-010.png">
            </div>
        </div>

        <!--打赏弹窗-->
        <div class="award-pop" @click="awardNone2" v-show="rewardShow"></div>
        <!--未登录-->
        <!-- <div class="award-tc" v-show="rewardShow">
            <div class="award-1"><img src="../../images/cr-014.png"/></div>
            <div class="award-2" @click="popNone"><img src="../../images/cr-015.png"/></div>
            <div class="award-3"><b>打赏</b></div>
            <div class="award-4">打赏赢果币即有机会参与抽奖<br />赶快登录参与吧</div>
            <div @click="awardGo" class="award-6">立即登录</div>
            <div style="line-height: 1;color: red;text-align: center;margin-bottom: 0.5rem;" v-if="rewardMsg !=''">
                {{rewardMsg}}
            </div>
        </div> -->
        <!--登录-->
        <div class="award-tc award-tc-log" v-show="rewardShow">
            <div class="award-1"><img src="../../images/cr-014.png"/></div>
            <div class="award-2" @click="popNone"><img src="../../images/cr-015.png"/></div>
            <!--登录-->
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

            <div v-if="islogin" @click="awardGo" class="award-6">立刻打赏</div>
            <div v-else="" @click="awardLogin" class="award-6">立刻登录</div>

            <div style="line-height: 1;color: red;text-align: center;margin-bottom: 0.5rem;" v-if="rewardMsg !=''">
                {{rewardMsg}}
            </div>
            <!--<div class="award-7">中奖后可在<span>"我的"-"果币"</span>中查看</div>-->
        </div>
        <!--大图展示-->
        <div class="big-img-pop" @click="bigImgHide"  @touchmove.prevent v-show="bigImgVisible"></div>
        <div @click="bigImgHide"  @touchmove.prevent class="big-img-tc" v-show="bigImgVisible">
            <swiper :options="bigImgOption" ref="swiper">
                <swiper-slide v-for="img in imgList">
                    <img v-bind:style="{ 'max-height': screenHeight+'px'}" style="margin: 0 auto;" v-bind:src="img.img"/>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </div>

        <!--回复框-->
        <div v-show="replyShow" @touchmove.prevent class="revert-case" @click="cancelReply"></div>
        <div v-show="replyShow" @touchmove.prevent class="revert-case-con">
            <div class="revert-case-top">
                <a @click="cancelReply">取消</a>
                <a>写跟帖</a>
                <a @click="sendComment">发送</a>
            </div>
            <div class="revert-case-inp">
                <textarea id="commentTextId" v-focus="focused" @focus="focused = true" class="touch_select" 
                v-model="commentContent" placeholder="我也来说两句"></textarea>
            </div>
        </div>
    </div>

</template>

<script>
    import {Loadmore,Toast,MessageBox,Indicator} from 'mint-ui';
    import {swiper, swiperSlide} from 'vue-awesome-swiper'
    import {getStore, setStore} from 'src/config/mUtils'
    import { focus } from 'vue-focus';
    import {
        themeDetail,
        sendComment,
        upTheme,
        upComment,
        deleteComment,
        loadCommentBottom,
        awardTheme,
        userInfo,
        lotteryTime
    } from '../../service/getData'
    import {userAgent, isUserAgentIsFL, isUserAgentIsWX, isUserAgentIsZT, urlHost} from '../../service/userAgent'
    import {wxShare} from '../../service/wxShare'

    var appCode = 'other_browser';
    var scUrl = 'other_browser'

    export default {
        directives: { focus: focus },
        components: {
            Loadmore,Toast, swiper, swiperSlide
        },
        name: 'hello',
        data () {
            return {
                focused:false,
                bigImgOption: {
                    pagination: '.swiper-pagination',
                    paginationClickable: true
                },
                deviceId: null,
                browserId:null,
                casId:null,
                themeId: null,
                commentData: {'showTime':'0'},
                comments: {},
                commentsCount: null,
                userIcon: null, //用户头像
                imgList: [],
                replyShow: false,
                commentId: "",//被评论的评论id
                commentContent: "",
                liked: 2,//是否已经点赞
                isRewarded: false,
                rewardCount: null,
                rewardShow: false,
                listNumber: 1,//打赏个数
                rewardMsg: null,
                bottomStatus: '',
                allLoaded: false,
                pageIndex:1,
                pageSize: 10,
                bigImgVisible: false,
                bigImgSrc: null,
                lotteryData:1,
                lotteryTime:1,
                hour:"00",
                minute:"00",
                second:"00",
                lotteryperiodId:1,
                lotterytotal:1,
                islogin:false,
                themeSimple:{
                    "behaviors":null,
                    "themeId":null,
                    "commentCount":null,
                    "likeCount":null,
                    "rewardCount":null
                },
                screenHeight:null,
                jackpotCopy: '每打赏一个果币将得到一次获得奖池所有果币的机会，打赏越多，机会越大哦',
                personCopy: '每打赏一个果币对方将得到一个果币',
                copyUserType: 0
            }
        },
        mounted(){
            //this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
            this.init();
            this.deviceId = getStore("_bbid");
            this.screenHeight = document.documentElement.clientHeight;
            // console.log(this.screenHeight);
        },
        beforeDestroy(){
        },
        activated(){
        },
        created() {
            var urlPara = GetQueryString('appcode');
            if (urlPara!=null){
                appCode = urlPara;
            }
            urlPara = GetQueryString('sc');
            if (urlPara!=null){
                scUrl = urlPara
            }

            Indicator.open({ spinnerType: 'fading-circle' });
            this.themeId = this.$route.params.themeId;
            var themeStore = JSON.parse(getStore("themeSimple"));
            if(themeStore != null && themeStore.themeId == this.themeId){
                this.themeSimple = themeStore;
            }
            // console.log(this.themeSimple);
            this.themeSimple.themeId = this.themeId;
            setStore("themeSimple",this.themeSimple);
            this.browserUserInfo();
            var userId = getStore("_uuid");
            if(userId != null && userId != ''){
                this.islogin = true;

            }else{
                this.islogin = false;
            }
            var casId = getStore("casId");
            if(casId != null && casId !=''){
                this.casId = casId;
            }
            let time = setInterval(() => {
              this.deviceId = getStore("_bbid");
              this.browserId = getStore("_browserId");
              //console.log(this.deviceId);
              //console.log(this.browserId);
              if (this.deviceId != null) {
                  clearInterval(time)
                  themeDetail(this.deviceId, this.themeId, appCode,scUrl).then(res => {
                    // console.log(res);
                    this.commentData = res.data;

                    //获取userType，用于打赏弹窗显示对应文案
                    this.copyUserType = res.data.userType

                    this.comments = res.data.comments;
                    this.commentsCount = res.data.commentCount;
                    if (this.commentsCount <= this.pageSize) {
                        this.allLoaded = true;
                    }
                    this.rewardCount = this.commentData.rewardCount;
                    var behaviors = res.data.behaviors;
                    if (behaviors != null) {
                        for (var i = 0; i < behaviors.length; i++) {
                            var behaver = behaviors[i];
                            if (behaver.behaviorType == 'LIKE') {
                                if (behaver.behaviorValue == 1) {
                                    this.liked = behaver.behaviorValue;
                                }
                            }
                            if (behaver.behaviorType == 'REWARD') {
                                this.isRewarded = true;
                            }
                        }
                    }
                    this.userIcon = this.commentData.userIcon;
                    this.imgList = this.commentData.imgList;

                    let isShare = true;
                    let title = "我在圈子里看到了一件不得了的事情，快来围观！";
                    let content = this.commentData.content;
                      // let imageUrl = "http://filestore.zt.raiyi.com/fs/userIcon/79800.png";
                    let imageUrl = "http://filestore.zt.raiyi.com/fs/icon/95828.png";
                    let shareUrl = "http://hd.zt.raiyi.com/wap/weibo/index.html#/comment/"+this.themeId;
                     // console.log(shareUrl);
                    if (isUserAgentIsWX) {
                        doWXShareInfo(title, content, imageUrl, shareUrl, isShare);
                    }
                });
                lotteryTime(this.deviceId).then(res=>{
                    // console.log(res);
                    this.lotteryTime = res.data.time;
                    this.lotteryperiodId = res.data.periodId;
                    this.lotterytotal = parseInt(res.data.total);
                    this.getRTime();

                    this.$nextTick(function(){ 
                        setTimeout(() => Indicator.close(), 50);
                    })
                })
                
              }
            }, 50)
            //setTimeout(() => Indicator.close(), 2000);

            this.commentScrollLoad()
            
        },
        computed: {
            swiper() {
                return this.$refs.swiper.swiper
            }
        },
        methods: {
            browserUserInfo(){
                var local_bbid = getStore("_bbid");
                let validity = 30;
                let now = new Date();
                let browserId = getStore("_browserId");;
                now.setTime(now.getTime() + validity * 24 * 60 * 60 * 1000);
                if (local_bbid != undefined && local_bbid != "" && local_bbid != null && local_bbid !== "[object HTMLInputElement]" && browserId != null && browserId != "") {
                  document.cookie = "USER_BBID=" + local_bbid + ";path=/;expires=" + now.toGMTString();
                }
                else {
                  userInfo().then(result => {
                    // console.log(result);
                    if (result && result.success) {
                      local_bbid = result.data.bbid;
                      localStorage.setItem("_bbid", local_bbid);
                    } else if (result.code == "3003") {
                      // console.log(result.data);
                      local_bbid = result.data.bbid;
                      browserId = result.data.browserId;
                      localStorage.setItem("_bbid", local_bbid);
                      localStorage.setItem("_browserId", browserId);
                    }
                  });
                }
            },
            bigImgHide(){
                this.bigImgVisible = false;
            },
            largeImgs(index){
                // console.log(index);
                this.swiper.slideTo(index);
                this.bigImgVisible = true;
            },
            countTime(item){
                if (item!=0||item!='0') {
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
                }
            },
            getRTime(){
                //var EndTime= new Date(this.lotteryTime*1000);
                //console.log(EndTime);
                //var NowTime = new Date(); 
                this.lotteryTime = this.lotteryTime -1000;
                var t = this.lotteryTime;
                //console.log(t);
                if(t>0){
                    var h=Math.floor(t/1000/60/60%24); 
                    var m=Math.floor(t/1000/60%60); 
                    var s=Math.floor(t/1000%60); 
                    if(h<10){
                        h = "0"+h
                    }
                    if(m<10){
                        m = "0"+m
                    }
                    if(s<10){
                        s = "0"+s
                    }
                    this.hour = h; 
                    this.minute = m; 
                    this.second = s; 
                    
                    setTimeout(this.getRTime,1000);
                }else{
                    this.hour = "00"; 
                    this.minute = "00"; 
                    this.second = "00"; 
                } 
            },
            handleBottomChange(status){
                this.bottomStatus = status;
            },
            init() {
                document.body.scrollTop=0
            },
            showReply(commentId,auditStatus){
                if (auditStatus>=0) {
                    var _self = this;
                    if (commentId !== null && typeof(commentId) !== "undefined" && commentId !== "") {
                        _self.commentId = commentId;
                    }
                    _self.replyShow = true;
                    this.focused = true;
                    this.hideVideos();
                }
                else {
                    Toast({
                        message: '暂未审核通过，无法评论',
                        duration: 2000
                    });
                }
            },
            showVideos(){
                var videos = document.getElementsByTagName("video");
                for(var i = 0;i<videos.length;i++){
                    videos[i].style.display = 'block';
                }
            },
            hideVideos(){
                var videos = document.getElementsByTagName("video");
                for(var i = 0;i<videos.length;i++){
                    videos[i].style.display = 'none';
                }
            },
            cancelReply(){
                var _self = this;
                _self.replyShow = false;
                this.showVideos();
            },
            sendComment(){
                if(this.commentContent.trim() == ''){
                    Toast({
                      message: '说点什么再发送吧~',
                      duration: 2000
                    });
                    return
                }
                sendComment(this.deviceId, this.themeId, this.commentContent, this.commentData.visible,appCode).then(json => {
                    // console.log(json);
                    if(json.success){
                        this.comments = json.data.comments;
                        this.replyShow = false;
                        this.commentsCount +=1;
                        this.commentContent = "";
                        this.showVideos();
                        document.getElementById("comments").focus();
                        this.themeSimple.commentCount = this.commentsCount;
                        setStore("themeSimple",this.themeSimple);
                    }
                });

            },
            upTheme(like,auditStatus){//点赞帖子功能
                if (auditStatus>=0) {
                    upTheme(this.deviceId, this.themeId, like, appCode).then(json => {
                        //console.log(json);
                        this.commentData.likeCount = json.data.likeCount;
                        var behaviors = json.data.behaviors;
                        if (behaviors != null) {
                            for (var i = 0; i < behaviors.length; i++) {
                                var behaver = behaviors[i];
                                if (behaver.behaviorType == 'LIKE') {
                                    this.liked = behaver.behaviorValue;
                                    this.themeSimple.likeCount = this.commentData.likeCount;
                                    this.themeSimple.behaviors = behaviors;
                                    setStore("themeSimple", this.themeSimple);
                                }
                            }
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
            upComment(commentId, like){//点赞评论功能
                upComment(this.deviceId, this.themeId, like, commentId,appCode).then(json => {
                    //console.log(json);
                    if (json.code == "0000") {
                        for (var i = 0; i < this.comments.length; i++) {
                            var comment = this.comments[i];
                            if (comment.commentId == commentId) {
                                comment.isLike = like;
                                if (like == 1) {
                                    comment.likeCount += 1;
                                } else {
                                    comment.likeCount -= 1;
                                }
                            }
                        }
                    }
                });
            },
            award(commentId,auditStatus){//打赏
                if (auditStatus>=0) {
                    var _self = this;
                    _self.commentId = commentId;
                    _self.rewardShow = true;
                    this.hideVideos();
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
            awardGo(){
                var userId = getStore('_uuid');
                if (userId!=null && userId!='') {
                    awardTheme(this.deviceId, this.themeId, this.listNumber,appCode).then(json => {
                        //console.log(json);
                        if (json.success) {
                            this.lotterytotal += this.listNumber;
                            this.rewardCount = json.data.rewardCount;
                            this.themeSimple.behaviors = json.data.behaviors;
                            this.themeSimple.rewardCount = this.rewardCount;
                            setStore("themeSimple",this.themeSimple);
                            this.isRewarded = true;
                            this.rewardShow = false;
                            this.listNumber = 1;
                            this.showVideos();
                        } else if (json.code == '2002') {
                            this.$router.push('/login_reward');
                        } else {
                            this.rewardMsg = json.msg;
                        }
                    });
                }else{
                    this.$router.push('/login_reward');
                }
                
            },
            deleteComment(commentId){
                MessageBox.confirm('确定要删除该条评论吗?').then(action => {
                  deleteComment(this.deviceId, commentId).then(json => {
                    //console.log(json);
                    if(json.success){
                        Toast({
                          message: '删除成功！',
                          duration: 1000
                        });
                        var comment;
                        for(var i=0;i<this.comments.length;i++){
                            comment = this.comments[i];
                            if(comment.commentId == commentId){
                                this.comments.splice(i,1);
                                this.commentsCount -=1;
                                this.themeSimple.commentCount = this.commentsCount;
                                setStore("themeSimple",this.themeSimple);
                                break;
                            }
                        }
                    }
                  })
                });
            },
            popNone(){
                this.rewardShow = false;
                this.rewardMsg = "";
                this.showVideos();
            },
            rewardWindow(){
                this.rewardShow = true;
                this.hideVideos();
            },
            awardMinus(){
                this.listNumber--
                if (this.listNumber <= 1) {
                    this.listNumber = 1
                }
            },
            awardPlus(){
                this.listNumber++
            },
            awardNone2(){
                this.rewardShow = false;
                this.showVideos();
            },
            loadBottom() {
                //this.pageSize += 10;
                this.pageIndex += 1;
                setTimeout(() => {
                  loadCommentBottom(this.deviceId, this.themeId, this.pageIndex, this.pageSize).then(json => {
                    //console.log(json);
                    if (this.commentsCount <= this.pageIndex*this.pageSize) {
                        this.allLoaded = true;// 若数据已全部获取完毕
                    } else {
                        this.allLoaded = false;
                    }
                    this.$refs.loadmore.onBottomLoaded();
                    for(var i=0;i<json.data.length;i++){
                        this.comments.push(json.data[i]);
                    }
                    
                  })
                }, 1500);
            },
            getVisitorName(userType,userAccount,nickName){
                //console.log(userType);
                if(userType == 0){
                    var last4Str = userAccount.substring(userAccount.length-4,userAccount.length);
                    //console.log(last4Str);
                    var sum = (last4Str.charCodeAt(0)-'0'.charCodeAt(0))*1000+(last4Str.charCodeAt(1)-'0'.charCodeAt(0))*100
                    +(last4Str.charCodeAt(2)-'0'.charCodeAt(0))*10+(last4Str.charCodeAt(3)-'0'.charCodeAt(0));
                    return "游客"+sum;
                }else{
                    return nickName;
                }
            },
            commentScrollLoad(){
                window.onscroll = function (){}
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    @import '../../style/reset.css';

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
    .box2-wrap {
        height: 300px;
        overflow: hidden;
    }

    .rotate {
        display: inline-block;
        transform: rotate(-180deg);
    }

    .pullup-arrow {
        transition: all linear 0.2s;
        color: #666;
        font-size: 25px;
    }

    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    a {
        color: #42b983;
    }
    
    .rewardWindow{
        padding:1rem 0;
    }
    .rewardWindow-p1{
        text-align:center;
    }
    .rewardWindow-p1 a{
        width:4rem;
        height:4rem;
        line-height:4rem;
        text-align:center;
        display:inline-block;
        border-radius:50%;
        background:#ff8400;
        color:#fff;
        font-size:2rem;
    }
    .rewardWindow-p2{
        color:#2d2d2d;
        font-size:0.9rem;
        text-align:center;
        padding: 0.5rem 0 1rem 0;
    }
    .reward-countdown{
        text-align:center;
        color:#666;
    }
    .reward-countdown a{
        color:#666;
    }
    .reward-countdown span{
        font-size:0.9rem;
        display:inline-block;
        border:1px solid #cdcdcd;
        color:#535353;
        background:#eee;
        border-radius:4px;
        width:1.6rem;
        line-height:1.6rem;
        text-align:center;
        margin:0 0.3rem;
    }
    /*回复*/
    .revert {
        border-top: 1px solid #e5e5e5;
        padding: 0.5rem 0;
        background: #fff;
        left: 0;
        bottom: 0;
        width: 100%;
        right: 0;
        margin: auto;
        position: fixed;
    }

    .revert-c {
        overflow: hidden;
        padding: 0 0.8rem;
        position: relative;
    }

    .revert-input {
        float: left;
        width: 70%;
        padding-left: 10%;
        border: 1px solid #e5e5e5;
        font-size: 0.8rem;
        line-height: 2rem;
        border-radius: 10rem;
        -webkit-appearance: none;
    }

    .revert-button {
        float: right;
        width: 25%;
        background: #1cbafb;
        color: #fff;
        font-size: 0.8rem;
        text-align: center;
        outline: none;
        border: none;
        border-radius: 10rem;
        line-height: 2rem;
    }

    .revert-img {
        position: absolute;
        width: 0.9rem;
        top: 0;
        bottom: 0;
        left: 1.4rem;
        margin: auto;
    }

    /*回复的框*/
    .revert-case {
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

    .revert-case-con {
        background: #efefef;
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 999;
    }

    .revert-case-top {
        padding: 0 0.8rem;
        display: -webkit-flex;
        display: flex;
        justify-content: space-between;
    }

    .revert-case-top a {
        color: #333;
        font-size: 1rem;
        padding: 0.8rem 0;
    }

    .revert-case-inp {
        padding: 0 0.8rem 1rem 0.8rem;
    }

    .revert-case-inp textarea {
        width: 100%;
        height: 7rem;
        border: 1px solid #ddd;
        resize: none;
        font-size: 0.9rem;
        padding: 0.8rem;
    }

    .head {
        width: 100%;
        height: 4rem;
        background-color: #40AFFE;
        text-align: center;
    }

    .qzFont {
        padding-top: 1.5rem;

    }

    .threeIcon {
        margin-top: 2rem;
        height: 6rem;
    }

    .hot1 {
        background-color: #27ccbb;
        width: 24%; /*4rem;*/
        height: 6rem;
        margin-left: 12%;

        float: left;
    }

    .quanzi {
        width: 100%;
        overflow: hidden;
    }

    .quanziDetail {
        /*padding-top: 0.8rem;*/
        flex: 1;
        flex-direction: column;
        background-color: #fff;
    }

    .qzHead {
        overflow: hidden;
        padding: 0.8rem 0.8rem ;
    }

    .headImg {
        float: left;
        width: 2.7rem;
        height: 2.7rem;
        border-radius: 50%;
        vertical-align: middle;
        overflow: hidden;
        background: #ddd;
    }

    .headImg img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .headFont {
        float: left;
        width: 76%;
        padding-left: 0.4rem;
        margin-top: 0.2rem;
    }

    .qzWenzi {
        font-size: 0.9rem;
        padding: 0.4rem 0.8rem;
        text-align: justify;
    }

    .qzWenzi div img {
        width: auto;
        max-width: 100%;
        margin: 0.3rem auto;
    }

    .headFont-name {
        color: #536792;
        font-weight: bold;
        font-size: 0.85rem;
        padding-bottom: 0.2rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: middle;
    }

    .headFont-time {
        color: #afafaf;
        font-size: 0.85rem;
    }

    .nameTime-tiem {
        color: #afafaf;
        font-size: 0.8rem;
        display: inline-block;
        .delCommentBtn{
            border: none;
            height: 1.5rem;
            width: 3rem;
            display: inline-block;
            color: #666666;
            background-color: #F2F2F2;
            font-size: .8rem;
            font-weight: lighter;
            font-family: STXihei;
            padding-left: 1rem;
        }
    }

    .qzImgs {
        overflow: hidden;
        padding: 0 0.8rem;
    }

    .qzImgs div {
        width: 32%;
        float: left;
        margin-bottom: 0.5rem;
        position: relative;
        height: 6rem;
        overflow: hidden;
    }

    .qzImgs img {
        width: 100%;
        min-height: 100%;
        object-fit: cover;
        background-color: #ddd;
    }

    .qzImgs div:nth-child(3n+2) {
        margin: 0 2%;
    }

    .iconDiv {
        float: left;
        width: 33.3333%;
        text-align: center;
        font-size:0;
        padding: 0 1.5rem 0 1.5rem;
    }

    .iconDiv2 {
        float: left;
        width: 33.3333%;
        text-align: center;
        font-size:0;
        padding: 0 1.5rem 0 1.5rem;
    }

    .iconDiv3 {
        position: relative;
    }

    .iconDiv3:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        height: 100%;
        background: #e5e5e5;
    }

    .iconDiv3:after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 100%;
        background: #e5e5e5;
    }

    .smallIcons {
        overflow: hidden;
        border-top: 1px solid #efefef;
        border-bottom: 1px solid #efefef;
        padding: 0.6rem 0;
    }

    .smallIcons img {
        display: inline-block;
        vertical-align: middle;
        width: 0.8rem;
    }

    .smallIcons p {
        display: inline-block;
        vertical-align: middle;
        font-style: normal;
        font-size: 0.8rem;
        padding-left: 0.5rem;
        color: #787878;
    }

    .nameTime {
        position: relative;
    }

    .nameTime-name {
        color: #536792;
        font-size: 0.9rem;
        padding-bottom: 0.3rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: middle;
    }

    .nameTime-time {
        color: #afafaf;
        font-size: 0.85rem;
    }

    /*.mint-loadmore{margin-bottom:3rem;}*/
    .comments_ul {
        background-color: #F2F2F2;
        margin-bottom: 0rem;
    .commentLi {
        border-bottom: 1px solid #e5e5e5;
        padding: 0.5rem 0.8rem;
    .c_img {
    @include wh(2.5rem, 2.5rem);
        border-radius: 50%;
        float: left;
    }

    .commentDesc {

    header {

    nav {
        position: absolute;
        top: 1rem;
        right: 0;
        width: 30%;
        text-align: right;

    
    img {
        width: 0.8rem;
        display: inline-block;
        vertical-align: middle;
        margin-right: 0.3rem;
    }

    p {
        display: inline-block;
        overflow: hidden;
        vertical-align: middle;
        color: #787878;
        width: 2.1rem;
        text-align: left;
    }


    }
    }
    }
    .commentContent {
        display: flex;
        flex-wrap: wrap;
        padding-top: 0.5rem;
        padding-left: .2rem;
        p{
            word-break:break-all;
        }
    }

    }
    .loadOrNo {
        display: flex;
        flex-flow: column;
        text-align: center;
    }

    .loadOrNo-foot {
        color: #ddd;
        padding: 1rem 0 1rem 0;
    }

    .loadOrNo-up {
        color: #ddd;
        padding: 1rem 0 1rem 0;
    }

    }

    .commentHeadImg img {
        width: 90%;
        object-fit: cover;
    }

    .commentIcons img {
        height: 1rem;
    }

    .commentIcons p {
        float: left;
        padding: 0.1rem 0 0 0.1rem
    }

    .loadDiv {
        margin: 0 auto;
        width: 100%;
        height: 4rem;
        text-align: center;
    }

    .reply {
        background-color: #ffffff;
        position: fixed;
        z-index: 100;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3.5rem;
    }

    .inputS {

        float: left;
        padding: 0.5rem 0 0 1rem;
    }

    input {
        border-radius: 1rem;
        border: .025rem solid #e4e4e4;
    }

    .commentInput {
        width: 13rem;
        height: 2.5rem;
    }

    .replyBtn {

        width: 5.5rem;
        height: 2.5rem;
        border-radius: 1rem;
        background-color: #40AFFE;
        border: none;
    }

    .buttonS {
        float: right;
        margin: 0.5rem 1rem 0 0;
    }

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
    .big-img-pop{
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 99;
        background: rgba(1, 1, 1, .7);
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
    }
    .big-img-tc{
        /*background: black;*/
        border-radius: 6px;
        position: fixed;
        /*padding: 0.8rem;*/
        width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 100;
        margin: auto;
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

    .award-7 {
        text-align: center;
        color: #9f9f9f;
    }

    .award-7 span {
        color: #1cbafb;
    }

    .slDesc {
        margin-top: 1rem;
        text-align: center;
    }

    .rotate {
        transform: rotate(180deg);
    }

    .page-loadmore .mint-spinner {
        display: inline-block;
        vertical-align: middle;
    }

    .page-loadmore-desc {
        text-align: center;
        color: #666;
        padding-bottom: 5px;
    }

    .page-loadmore-desc:last-of-type {
        border-bottom: solid 1px #eee;
    }

    .page-loadmore-listitem {
        height: 50px;
        line-height: 50px;
        border-bottom: solid 1px #eee;
        text-align: center;
    }

    .page-loadmore-listitem:first-child {
        border-top: solid 1px #eee;
    }

    .page-loadmore-wrapper {
       overflow: scroll;
    }

    .mint-loadmore-bottom {
        margin-bottom: .5rem;
    }

    .mint-loadmore-bottom span {
        display: inline-block;
        -webkit-transition: .2s linear;
        transition: .2s linear;
        vertical-align: middle
    }

    .mint-loadmore-bottom span.is-rotate {
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
    }

    .mint-popup {
        position: fixed;
        background: transparent;
    }



    .swiper-slide img{
        width: auto;
        max-width: 100%;
        margin: 0 auto;
    }
    .htit-bt{
        background:#fff;
        font-size:1.1rem;
        padding:0.8rem 0.8rem 0 0.8rem;
        font-weight:bold;
    }
    .hsource{
        font-size:0.8rem;
        color:#8c8c8c;
        padding:0 0.8rem;
        text-align:right;
    }


    .mint-loadmore-bottom{
        margin-bottom: 0;
    }
</style>
