if (typeof toolkit==='undefined') toolkit={};
if (typeof toolkit.omniture==='undefined') toolkit.omniture={};
toolkit.omniture.utils = (function(){

    if(typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        }
    }

    function omnigetCookie(c_name) {
        if(document.cookie.length>0) {c_start=document.cookie.indexOf(c_name+"=");if(c_start!=-1){c_start=c_start+c_name.length+1;c_end=document.cookie.indexOf(";",c_start);
            if(c_end==-1)c_end=document.cookie.length;return decodeURI(document.cookie.substring(c_start,c_end));}}return "";
    }

    function removePluses(string){ //why decode? if you cant handle + sure & is going to mess you up a treat?
        return decodeURI(string.replace(/\+/g,'%20').toLowerCase());
    }

    function safeString(str){
        if (typeof str === 'undefined') { return ''; }
        return str.trim().replace(/ /g,'-').replace(/[&,\+,:]/g,'').toLowerCase();
    }

//    not using jQuery.parents([data-tracking-whatever]) as is slow in ie and ff
    function checkParentForAttribute(el, attr){
        if (!el || !el.getAttribute) { return ''; }
        if (!!el.getAttribute(attr)){
            return el.getAttribute(attr);
        }
        return checkParentForAttribute(el.parentNode, attr);
    }

    function getText($el){
        return $el.attr('data-tracking-label') || $el.attr('data-tracking-value') || $el.attr('alt') || $el.val() || $el.attr('value') || $el.attr('name') || $el.text();
    }

    return {
        omnigetCookie: omnigetCookie,
        removePluses: removePluses,
        safeString: safeString,
        checkParentForAttribute: checkParentForAttribute,
        getText: getText
    };

}());


if (typeof window.define === "function" && window.define.amd) {
    define("omniture/utils", function() {
        return toolkit.omniture.utils;
    });
}