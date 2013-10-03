if (typeof toolkit==='undefined') toolkit={};
if (typeof toolkit.omniture==='undefined') toolkit.omniture={};
toolkit.omniture.utils = (function(){

    function omnigetCookie(c_name) {
        if(document.cookie.length>0) {c_start=document.cookie.indexOf(c_name+"=");if(c_start!=-1){c_start=c_start+c_name.length+1;c_end=document.cookie.indexOf(";",c_start);
            if(c_end==-1)c_end=document.cookie.length;return unescape(document.cookie.substring(c_start,c_end));}}return "";
    }

    function removePluses(mynewg){
        mynewg = mynewg.replace(/\+/g,'%20');
        mynewg=mynewg.toLowerCase();
        mynewg=unescape(mynewg);
        return mynewg;
    }

    return {
        omnigetCookie: omnigetCookie,
        removePluses: removePluses
    };

}());


if (typeof window.define === "function" && window.define.amd) {
    define("omniture/utils", function() {
        return toolkit.omniture.utils;
    });
}