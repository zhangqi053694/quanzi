<template>
    <div style="height:100%;background:#fff;">
        <form name="userForm" method="post" enctype="multipart/form-data" id="tf">
            <div class="release-header">
                <textarea placeholder="您想说点啥" v-model="replaceTxt"></textarea>
            </div>
            <div class="">
                <!--    照片添加    -->
                <div class="z_photo" id="listDom">
                    <div class="z_file" v-show="isShowUpload">
                        <input type="file" name="image" id="file" value="" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" @change="loaduploadImg" />
                    </div>
                </div>
                <!--遮罩层-->
                <div class="z_mask">
                    <!--弹出框-->
                    <div class="z_alert">
                        <p>确定要删除这张图片吗？</p>
                        <p>
                            <span class="z_cancel">取消</span>
                            <span class="z_sure">确定</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="release-foot">
                <input type="button" value="发布" @click="submitFun"/>
            </div>
        </form>
        <!--未写文字提示-->
        <div class="release-fixed" v-show="releaseShow">
            <h2>
                <p>请先填写您需要发布的内容</p>
                <a @click="releasetcbg">好的</a>
            </h2>
        </div>
        <div class="release-bg" v-show="releaseBg"></div>
        <div class="release-tip" v-show="releaseTip">
            <p>恭喜您发帖成功，您发布的帖子正在审核中，您可以在“我的圈子”页面看到您的帖子。</p>
            <a @click="releaseEnter">确定</a>
        </div>
    </div>
</template>
<script>
    import {loaduploadImg,loadrelease} from '../../service/getData'
    import {getStore, setStore} from 'src/config/mUtils'
    import {Loadmore,Toast,MessageBox,Indicator} from 'mint-ui'

    import {isEmptyObject} from '../../service/common'

    var appCode = 'other_browser';

    var map = {};

    export default {
        data() {
            return {
                deviceId:null,
                themeId: null,
                img:null,
                imgs:{},
                imgsMap:{},
                replaceTxt:'',
                releaseShow:false,
                releaseBg:false,
                releaseTip:false,
                isShowUpload: true
            }
        },
        created(){
            var urlPara = GetQueryString('appcode');
            if (urlPara!=null){
                appCode = urlPara;
            }

            this.deviceId = getStore("_bbid");

            map = {};
        },

        methods:{
            loaduploadImg(){
                var _this = this;

                var ff = new FormData(document.forms.namedItem("userForm"));
                _this.img = ff;

                Indicator.open({ spinnerType: 'fading-circle' });

                $.ajax({
                    url : "http://hd.zt.raiyi.com/v9/private/"+_this.deviceId+"/weibo/uploadImg",
                    type : "POST",
                    data : _this.img,
                    processData : false,
                    contentType : false,
                    success:function(data){
                        if(data.code=='0000'){
                            _this.imgChange('z_photo','z_file');
                            //console.log(data)
                            var imgList = document.getElementsByClassName("z_addImg");
                            _this.setMap(imgList.length-1,data.data[0]);

                            if (Object.getOwnPropertyNames(map).length>=9){
                                _this.isShowUpload = false
                            }

                            var obj = document.getElementById('file') ;
                            obj.select();
                            //  document.selection.clear();


                            Indicator.close();

//                            if (isEmptyObject(_this.imgs)){
//                                _this.imgs = data.data;
//                            }
//                            else {
//                                _this.imgs.push(data.data[0]);
//
//                                if (_this.imgs.length>=9){
//                                    _this.isShowUpload = false
//                                }
//                            }
                        }else{
                            Indicator.close();

                            Toast({
                                message: data.msg,
                                duration: 2000
                            })
                        }
                    },
                    error:function(data){
                        Indicator.close();

                        alert("图片处理失败，请稍候再试")
                    }
                });
            },

            setMap(id,val){
                var key="img"+id;
                map[key]=val;
            },

            deleteMap(id){
                delete map["img"+id];
            },

            getMap(){
                var str = '';
                for(var i in map)
                {
                    str = str+map[i]+',';
                }
                this.imgs = str.substr(0,(str.length-1)).split(',')
            },
            
            submitFun(){
                var txtStr = this.replaceTxt;
                this.getMap()
                if(this.trim(txtStr)!='' || !isEmptyObject(this.imgs)){
                    Indicator.open({ spinnerType: 'fading-circle' });
                    if (isEmptyObject(this.imgs)){
                        this.imgs = ''
                    }
                    loadrelease(this.deviceId,this.imgs,appCode,this.replaceTxt,0).then(res => {
                        //console.log(res);
//                        this.releaseBg = true;
//                        this.releaseTip = true;
                        Indicator.close();

                        Toast({
                            message: '发布成功',
                            duration: 2000
                        });

                        setTimeout(() => this.$router.go(-1), 1000);

                        map = {};

                    }).catch(function (e) {
                        //console.log(e)
                        Toast({
                            message: '上传失败，请稍候重试',
                            duration: 2000
                        });
                        Indicator.close();
                    });
                }
                else{
                    this.releaseShow = true;
                    return;
                }
            },

            trim(str){
                return str.replace(/(^\s+)|(\s+$)/g,"");
            },

            releasetcbg(){
                this.releaseShow = false;
            },
            releaseEnter(){
                this.releaseBg= false;
                this.releaseTip = false;

                //this.$router.replace('/themeList');
                this.$router.go(-1);
            },

            imgChange(obj1, obj2) {
                //获取点击的文本框
                var file = document.getElementById("file");
                //存放图片的父级元素
                var imgContainer = document.getElementsByClassName(obj1)[0];
                //获取的图片文件
                var fileList = file.files;
                //文本框的父级元素
                var input = document.getElementsByClassName(obj2)[0];
                var imgArr = [];
                //遍历获取到得图片文件
                for (var i = 0; i < fileList.length; i++) {
                    var imgUrl = window.URL.createObjectURL(file.files[i]);
                    imgArr.push(imgUrl);
                    var img = document.createElement("img");
                    img.setAttribute("src", imgArr[i]);
                    var imgAdd = document.createElement("div");
                    imgAdd.setAttribute("class", "z_addImg");
                    imgAdd.appendChild(img);
                    //imgContainer.appendChild(imgAdd);
                    imgContainer.insertBefore(imgAdd,input);
                }

                this.imgRemove();

                var _this = this;


//                var reader = new FileReader();
//                var _this = this;
//                 reader.onload = function(evt){
//                    document.getElementById('file').src = evt.target.result;
//                    var imagesVal = evt.target.result;
//
//                    var form=document.forms[0];
//                    var formData = new FormData(form);
//
//                    formData.append("imageName",_this.convertBase64UrlToBlob(imagesVal));
//                    this.img = formData;
//                }
//
//                reader.readAsDataURL(file.files[0]);


//                var ff = new FormData(document.forms.namedItem("userForm"));
//                _this.img = ff;

//                this.loaduploadImg();
            },

            convertBase64UrlToBlob(urlData){
                var bytes=window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte
                //处理异常,将ascii码小于0的转换为大于0
                var ab = new ArrayBuffer(bytes.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < bytes.length; i++) {
                    ia[i] = bytes.charCodeAt(i);
                }

                return new Blob( [ab] , {type : 'image/png'});
            },

            imgRemove() {
                var _this = this;
                var imgList = document.getElementsByClassName("z_addImg");
                var mask = document.getElementsByClassName("z_mask")[0];
                var cancel = document.getElementsByClassName("z_cancel")[0];
                var sure = document.getElementsByClassName("z_sure")[0];
                for (let j = 0; j < imgList.length; j++) {
                    imgList[j].index = j;
                    imgList[j].onclick = function() {
                        var t = this;
                        //mask.style.display = "block";

                        MessageBox.confirm('确定要删除吗?').then(action =>{
                            t.style.display = "none";

                            _this.deleteMap(j)

                            _this.isShowUpload = true

                            var obj = document.getElementById('file') ;
                            obj.select();
                          //  document.selection.clear();
                        })

//                        cancel.onclick = function() {
//                            mask.style.display = "none";
//                        };
//                        sure.onclick = function() {
//                            mask.style.display = "none";
//                            t.style.display = "none";
//                            //_this.imgs.splice(indexNum,1);
//                            _this.deleteMap(j)
//
//                            if (map.length<9){
//                                _this.isShowUpload = true
//                            }
//                        };
                    }
                }
            }
        }
    }
</script>

<style>
        .release-header{
            background:#fff;
            padding:0.8rem;
            border-bottom:1px solid #f5f5f5;
        }
        .release-header textarea{
            font-size:0.9rem;
            width:100%;
            height: 5rem;
            resize:none;
        }
        
        .z_photo {
            overflow: hidden;
            border-bottom: 1px solid #f5f5f5;
            padding: 0.4rem 0.8rem;
        }
        
        .z_photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .z_addImg {
            width: 32%;
            height: 6rem;
            display: inline-block;
            margin-right: 1%;
            margin-bottom: 0.5rem;
            position: relative;
            vertical-align: middle;
        }

        .z_addImg:before{
            content: '×';
            position: absolute;
            top: -0.3rem;
            right: -0.3rem;
            width: 1.2rem;
            height: 1.2rem;
            line-height: 1.2rem;
            text-align: center;
            color: #fff;
            background: #ff4949;
            border-radius: 50%;
        }
        
        .z_file {
            width: 32%;
            height: 6rem;
            background: url(../../images/z-add.png) no-repeat;
            background-size: 100% 100%;
            margin-bottom: 0.5rem;
            margin-right: 0.2rem;
            display: inline-block;
            vertical-align: middle;
        }
        
        .z_file input::-webkit-file-upload-button {
            width: 1rem;
            height: 1rem;
            border: none;
            position: absolute;
            outline: 0;
            opacity: 0;
        }
        
        .z_file input#file {
            display: block;
            width: 100%;
            height: 100%;
            background: rgba(1,1,1,0);
            opacity: 0;
            border: 0;
            vertical-align: middle;
        }
        /*遮罩层*/
        
        .z_mask {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .5);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 999;
            display: none;
        }
        
        .z_alert {
            position: absolute;
            background: #fff;
            width: 60%;
            padding: 1rem 1rem 0 1rem;
            text-align: center;
            font-size: 0.9rem;
            border-radius: 4px;
            left: 0;
            right: 0;
            margin: auto;
            margin-top: 35%;
        }
        
        .z_alert p:nth-child(1) {
            padding-bottom: 1rem;
        }
        
        .z_alert p:nth-child(2){
            overflow: hidden;
            font-size: 0;
            margin-bottom: 0.5rem;
        }
        .z_alert p:nth-child(2) span {
            display: inline-block;
            width: 45%;
            line-height: 2rem;
            font-size: 0.7rem;
            background: rgba(28,186,251,1);
            color: #fff;
            border-radius: 0.2rem;
        }
        
        .z_cancel {
            margin-right: 10%;
        }
        .release-foot{
            padding:3rem 0.8rem 0.8rem 0.8rem;
        }
        .release-foot input{
            width:100%;
            background: rgba(28,186,251,1);
            color: #fff;
            border-radius: 4px;
            font-size: 1rem;
            line-height: 2.6rem;
        }
        .z_cancel{
            color:#888;
        }
        .mint-indicator{
            width: 100%;
            background: rgba(1,1,1,.5);
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99;
        }
        .release-fixed{
            width: 100%;
            background: rgba(1,1,1,.5);
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99;
        }
        .release-fixed h2{
            width: 80%;
            background: #fff;
            border-radius: 4px; 
            padding: 2rem 1rem 1rem 1rem;
            font-weight: 500;
            margin: 0 auto;      
            margin-top: 30%;
        }
        .release-fixed p{
            font-size: 1rem;
            text-align: center;
            color: #000;
            margin-bottom:2rem;
        }
        .release-fixed a{
            font-size:1rem;
            display: block;
            line-height: 2.6rem;
            background: rgba(28,186,251,1);
            border-radius: 4px;
            text-align: center;
            color:#fff;
        }
        .release-bg{
            width: 100%;
            background: rgba(1,1,1,.5);
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99;
        }
        .release-tip{
            width:80%;
            background:#fff;
            border-radius: 4px;
            padding:1rem;
            position: fixed;
            left:0;
            top:0;
            right:0;
            margin:auto;
            margin-top:30%;
            z-index:100;
            font-size:0.9rem;
        }
        .release-tip p{
            text-align: center;
            text-align: justify;
            margin-bottom:2rem;
        }
        .release-tip a{
            font-size:1rem;
            display: block;
            line-height: 2.6rem;
            background: rgba(28,186,251,1);
            border-radius: 4px;
            text-align: center;
            color:#fff;
        }
</style>