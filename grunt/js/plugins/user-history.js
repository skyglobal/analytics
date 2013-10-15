if (typeof analytics==='undefined') analytics={};
if (typeof analytics.plugins==='undefined') analytics.plugins={};

analytics.plugins.userHistory = (function(){

    var config;
    var loggedIn = 'Logged In';
    var notLoggedIn = 'not logged-in';
    var cookies = loadCookies();

    var getAndPersistValue=new Function("v","c","e",""+
        "var s=this,a=new Date;e=e?e:0;a.setTime(a.getTime()+e*86400000);if("+
        "v)s.c_w(c,v,e?a:0);return s.c_r(c);");


    var getFullReferringDomains=new Function(""+
        "var s=this,dr=window.document.referrer,n=s.linkInternalFilters.spli"+
        "t(',');if(dr){var r=dr.split('/')[2],l=n.length;for(i=0;i<=l;i++){i"+
        "f(r.indexOf(n[i])!=-1){r='';i=l+1;}}return r}");

    var clickThruQuality=function(scp,ct_ev,cp_ev,cpc){
        var s = this;
        if (s.p_fo(ct_ev) !== 1) { return ; }
        cpc = cpc || 's_cpc';
        if (scp) {
            s.c_w(cpc, 1, 0);
            return ct_ev;
        } else if (s.c_r(cpc) >= 1) {
            s.c_w(cpc, 0, 0);
            return cp_ev;
        }
    };


    function loadCookies() {
        var i, cookie, cookies;
        cookies = document.cookie.split(';');
        var o = {};
        for (i=0 ; i<cookies.length ; i++) {
            cookie = cookies[i].split('=');
            o[cookie[0].trim()] = unescape(cookie[1]);
        }
        return o;
    }


//    todo: andrew we deleted login events he he
    function setLoginVars( ) {
        if (cookies.skySSO) {
            s.loginStatus = loggedIn;
            if (cookies.skySSOLast != cookies.skySSO) {
                s.c_w ('skySSOLast' , cookies.skySSO);
            }
        } else {
            s.loginStatus = notLoggedIn;
        }
        if (cookies.just){ s.samId = cookies.just; }
        if (cookies.apd) { s.ageGender = cookies.apd + '|' + cookies.gpd; }
        if (cookies.custype){ s.customerType = cookies.custype; }
        if (cookies.ust) { s.optIn = cookies.ust + '|' + cookies.sid_tsaoptin; }
    }

    function setVisitVars(){
        var refURL=document.referrer;

        s.getAndPersistValue(document.location.toString().toLowerCase(),'omni_prev_URL',0);
        var c_pastEv = s.clickThruQuality(
            s.eVar47,
            config.trackedEvents['firstPageVisited'],
            config.trackedEvents['secondPageVisited'],
            's_ctq'
        );
        if(c_pastEv) { s.events.push(c_pastEv); }
        s.eVar17 = s.getFullReferringDomains();


        if (refURL){ //todo: refactor
            var iURL=refURL.indexOf('?')>-1?refURL.indexOf('?'):refURL.length;
            var qURL=refURL.indexOf('//')>-1?refURL.indexOf('//')+2:0;
            var rURL=refURL.indexOf('/',qURL)>-1?refURL.indexOf('/',qURL):iURL;
            s.refDomain=refURL.substring(qURL,rURL);
        }
    }

    function load(_config){
        config = _config;

        s.getFullReferringDomains = getFullReferringDomains;
        s.getAndPersistValue = getAndPersistValue;
        s.clickThruQuality = clickThruQuality;

        setLoginVars();
        setVisitVars();
    }

    return {
        load: load
    };

}());

if (typeof window.define === "function" && window.define.amd) {
    define("plugins/user-history", function() {
        return analytics.plugins.userHistory;
    });
}