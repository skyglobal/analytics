if (typeof toolkit==='undefined') toolkit={};
if (typeof toolkit.omniture==='undefined') toolkit.omniture={};
if (typeof toolkit.omniture.plugins==='undefined') toolkit.omniture.plugins={};

toolkit.omniture.plugins.testAndTarget = (function(){

    var trackTNT = function(v, p, b) {
        var s=this, n="s_tnt", p=(p)?p:n, v=(v)?v:n, r="",pm=false, b=(b)?b:true;
        if(s.getQueryParam)
            pm = s.getQueryParam(p); //grab the parameter
        if(pm)
            r += (pm + ","); // append the parameter
        if(s.wd[v] != undefined)
            r += s.wd[v]; // get the global variable
        if(b)
            s.wd[v] = ""; // Blank out the global variable for ajax requests
        return r;
    };

    function load(omniture){
        omniture.trackTNT = trackTNT;
        omniture.eVar18 = omniture.tnt = omniture.trackTNT(); //todo: andrew, need to set tnt to eVar18?
        if(typeof mboxLoadSCPlugin == "function"){mboxLoadSCPlugin(omniture);}
    }

    return {
        load: load
    };

}());

if (typeof window.define === "function" && window.define.amd) {
    define("plugins/test-and-target", function() {
        return toolkit.omniture.plugins.testAndTarget;
    });
}