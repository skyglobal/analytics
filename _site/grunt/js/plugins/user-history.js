if (typeof _analytics==='undefined') _analytics={};
if (typeof _analytics.plugins==='undefined') _analytics.plugins={};

_analytics.plugins.userHistory = (function(omniture, config, utils){

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

    function setLoginVars( ) {
        var ageGender, optIn;
        omniture.setVariable('loginStatus', (cookies.skySSO) ? loggedIn : notLoggedIn);
        if (cookies.skySSO && cookies.skySSOLast != cookies.skySSO) {
            s.c_w('skySSOLast', cookies.skySSO);
            var fl = cookies.skyLoginFrom ? cookies.skyLoginFrom.split(',') : ['generic','l'];
            var loginType = (fl[1] == 'l') ? 'loginComplete' : 'regComplete';
            omniture.setEvent(loginType);
        }
        ageGender = (cookies.apd) ? cookies.apd + '|' + cookies.gpd : '';
        optIn = (cookies.ust) ? cookies.ust + '|' + cookies.sid_tsaoptin : '';

        if (cookies.just && cookies.skyCEsidexsso01) {
            omniture.setVariable('samId',cookies.just);
            omniture.setVariable('persistentLoginType', 'Hard Login - Persistent Login Accepted');
            s.getAndPersistValue('true','persLogin',90);
        } else if ( cookies.just && !cookies.skyCEsidexsso01) {
            omniture.setVariable('samId',cookies.just);
            omniture.setVariable('persistentLoginType', 'Hard Login - Declined Persistent Login');
        } else if (!cookies.just && cookies.skyCEsidexsso01) {
            omniture.setVariable('persistentLoginType', 'Persistent Login');
            s.getAndPersistValue('true','persLogin',90);
        } else if (!cookies.just && !cookies.skyCEsidexsso01 && s.c_r('persLogin')) {
            omniture.setVariable('persistentLoginType', 'Persistent Login Expired');
        } else {
            omniture.setVariable('persistentLoginType', 'Not Logged-in');
        }

        omniture.setVariable('customerType', cookies.custype);
        omniture.setVariable('ageGender',ageGender);
        omniture.setVariable('optIn', optIn);

        s.getAndPersistValue(document.location.toString().toLowerCase(),'omni_prev_URL',0);
        var c_pastEv = s.clickThruQuality(omniture.getVariable('campaign'),config.eventsMap['firstPageVisited'],config.eventsMap['secondPageVisited'],'s_ctq');
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

}(_analytics.omniture, _analytics.config, _analytics.utils));

if (typeof window.define === "function" && window.define.amd) {
    define("plugins/user-history", ['core/omniture', 'core/config', 'plugins/utils'], function(omniture, config, utils) {
        return _analytics.plugins.userHistory;
    });
}


