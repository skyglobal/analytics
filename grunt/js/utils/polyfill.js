if (typeof _analytics==='undefined') _analytics={};
_analytics.polyfill = (function(){

    if(typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    return {
        trim: true
    }

}());


//just for require
if (typeof window.define === "function" && window.define.amd) {
    define("utils/polyfill", function() {
        return _analytics.polyfill;
    });
}