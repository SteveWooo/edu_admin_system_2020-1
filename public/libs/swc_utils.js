swc.utils = {
    getUrlParam : function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    },
    checkRes: function (res) {
        if (res.code == '4003') {
            alert('请登陆');
            location.href = swc.config.baseUrl + '/teacher/login.html';
        }
        if (res.code != '2000') {
            alert(res.error_message);
            return false;
        }
        return true;
    },
    ls: {
        set: function (key, value) {
            localStorage.setItem(key, value);
        },
        get: function (key) {
            return localStorage.getItem(key);
        },
        setObject: function (key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        getObject: function (key) {
            return JSON.parse(localStorage.getItem(key));
        },
        clear: function (key) {
            localStorage.clear(key);
        }
    }
}