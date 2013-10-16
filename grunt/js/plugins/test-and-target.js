if (typeof analytics==='undefined') analytics={};
if (typeof analytics.plugins==='undefined') analytics.plugins={};

analytics.plugins.testAndTarget = (function(omniture, config){
    var wd;

    var trackTNT = function(v, p, b) {
        var n="s_tnt", p=(p)?p:n, v=(v)?v:n, r="",pm=false, b=(b)?b:true;
        if(s.getQueryParam)
            pm = s.getQueryParam(p); //grab the parameter
        if(pm)
            r += (pm + ","); // append the parameter
        if(wd[v] != undefined)
            r += wd[v]; // get the global variable
        if(b)
            wd[v] = ""; // Blank out the global variable for ajax requests
        return r;
    };

    function load(){
        wd = omniture.getVariable('wd');

        omniture.addPlugin('trackTNT', trackTNT);
        var tnt = omniture.setVariable('testAndTarget', s.trackTNT());
        omniture.setVariable('tnt',tnt);
        if(typeof mboxLoadSCPlugin == "function"){mboxLoadSCPlugin(omniture);}
    }

    return {
        load: load
    };

}(analytics.omniture, analytics.config));

if (typeof window.define === "function" && window.define.amd) {
    define("plugins/test-and-target", ['core/omniture', 'core/config'], function(omniture, config) {
        return analytics.plugins.testAndTarget;
    });
}