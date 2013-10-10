if (typeof toolkit==='undefined') toolkit={};
if (typeof toolkit.omniture==='undefined') toolkit.omniture={};
if (typeof toolkit.omniture.plugins==='undefined') toolkit.omniture.plugins={};

toolkit.omniture.plugins.userHistory = (function(){


    var getAndPersistValue=new Function("v","c","e",""+
        "var s=this,a=new Date;e=e?e:0;a.setTime(a.getTime()+e*86400000);if("+
        "v)s.c_w(c,v,e?a:0);return s.c_r(c);");


    var getFullReferringDomains=new Function(""+
        "var s=this,dr=window.document.referrer,n=s.linkInternalFilters.spli"+
        "t(',');if(dr){var r=dr.split('/')[2],l=n.length;for(i=0;i<=l;i++){i"+
        "f(r.indexOf(n[i])!=-1){r='';i=l+1;}}return r}");

    var clickThruQuality=function(scp,ct_ev,cp_ev,cpc){
        var s = this,
            ev, tct;
        if (s.p_fo(ct_ev) == 1) {
            if (!cpc) {
                cpc = 's_cpc';
            }
            ev = s.events ? s.events + ',' : '';
            if (scp) {
                s.c_w(cpc, 1, 0);
                return ct_ev;
            } else {
                if (s.c_r(cpc) >= 1) {
                    s.c_w(cpc, 0, 0);
                    return cp_ev;
                }
            }
        }
    };

    function setVars(omniture, skyTracking){

        omniture.getAndPersistValue(document.location.toString().toLowerCase(),'omni_prev_URL',0);
        var c_pastEv = omniture.clickThruQuality(
            omniture.eVar47,
            skyTracking.events['firstPageVisited'],
            skyTracking.events['secondPageVisited'],
            's_ctq'
        );
        if(c_pastEv) { skyTracking.loadEvents.push(c_pastEv); }
        omniture.eVar17 = omniture.getFullReferringDomains();
    }

    function load(omniture, skyTracking){
        omniture.getFullReferringDomains = getFullReferringDomains;
        omniture.getAndPersistValue = getAndPersistValue;
        omniture.clickThruQuality = clickThruQuality;
        setVars(omniture, skyTracking);
    }

    return {
        load: load
    };

}());

if (typeof window.define === "function" && window.define.amd) {
    define("plugins/user-history", function() {
        return toolkit.omniture.plugins.userHistory;
    });
}