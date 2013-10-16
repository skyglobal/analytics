if (typeof analytics==='undefined') analytics={};
if (typeof analytics.plugins==='undefined') analytics.plugins={};

analytics.plugins.userHistory = (function(omniture, config){

    var loggedIn = 'Logged In',
        notLoggedIn = 'not logged-in',
        cookies = loadCookies(),
        getAndPersistValue=new Function("v","c","e",
            "var s=this,a=new Date;e=e?e:0;a.setTime(a.getTime()+e*86400000);if(v)s.c_w(c,v,e?a:0);return s.c_r(c);"
        );

    function clickThruQuality(scp,ct_ev,cp_ev,cpc){
        if (s.p_fo(ct_ev) !== 1) { return ; }
        cpc = cpc || 's_cpc';
        if (scp) {
            s.c_w(cpc, 1, 0);
            return ct_ev;
        } else if (s.c_r(cpc) >= 1) {
            s.c_w(cpc, 0, 0);
            return cp_ev;
        }
    }

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

    function setLoginVars( ) { //    todo: andrew we deleted login events he he
        if (cookies.skySSO) {
            omniture.setVariable('loginStatus', loggedIn);
            if (cookies.skySSOLast != cookies.skySSO) {
                s.c_w('skySSOLast', cookies.skySSO);
            }
        } else {
            omniture.setVariable('loginStatus',notLoggedIn);
        }
        if (cookies.just){ omniture.setVariable('samId',cookies.just); }
        if (cookies.apd) { omniture.setVariable('ageGender',cookies.apd + '|' + cookies.gpd); }
        if (cookies.custype){ omniture.setVariable('customerType', cookies.custype); }
        if (cookies.ust) { omniture.setVariable('optIn', cookies.ust + '|' + cookies.sid_tsaoptin); }

        s.getAndPersistValue(document.location.toString().toLowerCase(),'omni_prev_URL',0);
        var c_pastEv = s.clickThruQuality(omniture.getVariable('campaign'),config.trackedEvents['firstPageVisited'],config.trackedEvents['secondPageVisited'],'s_ctq');
        if(c_pastEv) { omniture.setEvent(c_pastEv); }
    }


    function load(){
        omniture.addPlugin('getAndPersistValue',getAndPersistValue);
        omniture.addPlugin('clickThruQuality',clickThruQuality);

        setLoginVars();
    }

    return {
        load: load
    };

}(analytics.omniture, analytics.config));

if (typeof window.define === "function" && window.define.amd) {
    define("plugins/user-history", ['core/omniture', 'core/config'], function(omniture, config) {
        return analytics.plugins.userHistory;
    });
}


