if (typeof toolkit==='undefined') toolkit={};
if (typeof toolkit.omniture==='undefined') toolkit.omniture={};
toolkit.omniture.utils = (function(){

    if(typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        }
    }

    function getCookie(name) {
        if (!document.cookie) { return; }
        var cookieValue="", i,cookie,
            cookies = document.cookie.split(';');
        for (i = 0; i < cookies.length; i++) {
            cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
        return cookieValue;
    }

    function removePluses(string){ //why decode? if you cant handle + sure & is going to mess you up a treat?
        return decodeURI(string.replace(/\+/g,'%20').toLowerCase());
    }

    function safeString(str){
        if (typeof str === 'undefined') { return ''; }
        return str.trim().replace(/ /g,'-').replace(/[&,\+,:|]/g,'').toLowerCase();
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

    function httpsSearch(referrer){
        return (referrer.indexOf("www.google.") > -1 && document.referrer.indexOf("q=&") > -1) ? "google" : "na";
    }

    return {
        getCookie: getCookie,
        removePluses: removePluses,
        safeString: safeString,
        checkParentForAttribute: checkParentForAttribute,
        getText: getText,
        httpsSearch: httpsSearch
    };

}());


if (typeof window.define === "function" && window.define.amd) {
    define("omniture/utils", function() {
        return toolkit.omniture.utils;
    });
}