window.GetQueryString = function(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null){
        return  unescape(r[2]);
    }
    return null;
}

export function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0;
}