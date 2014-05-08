if (typeof _analytics==='undefined') _analytics={};
if (typeof _analytics.plugins==='undefined') _analytics.plugins={};

_analytics.plugins.utils = (function(omniture, config){


    /*
     * Function - read combined cookies v 0.37
     */
    if(!s.__ccucr) {
        s.c_rr=s.c_r;
        s.__ccucr=true;
        function c_r(k) {
            var s=this,d=new Date,v=s.c_rr(k),c=s.c_rspers(),i, m, e;
            if(v)return v;k=s.ape(k);i=c.indexOf(' '+k+'=');c=i<0?s.c_rr('s_sess'):c;
            i=c.indexOf(' '+k+'=');m=i<0?i:c.indexOf('|', i);e=i<0?i:c.indexOf(';', i);
            m=m>0?m:e;v=i<0?'':s.epa(c.substring(i+2+k.length, m<0?c.length:m));
            return v;
        }
        function c_rspers() {
            var cv=s.c_rr("s_pers");var date=new Date().getTime();var expd=null;
            var cvarr=[];var vcv="";if(!cv)return vcv;cvarr=cv.split(";");for(var i=0,l=cvarr.length;i<l;i++)
        {expd=cvarr[i].match(/\|([0-9]+)$/);if(expd && parseInt(expd[1]) >= date){vcv += cvarr[i]+";";}}return vcv;
        }
        s.c_rspers=c_rspers;
        s.c_r=c_r;
    }
    /*
     * Function - write combined cookies v 0.37
     */
    if(!s.__ccucw) {
        s.c_wr=s.c_w;
        s.__ccucw=true;
        function c_w(k, v, e) {
            var s=this,d=new Date,ht=0,pn='s_pers',sn='s_sess',pc=0,sc=0,pv, sv, c, i, t;d.setTime(d.getTime() - 60000);
            if(s.c_rr(k))s.c_wr(k, '', d);k=s.ape(k);pv=s.c_rspers();i=pv.indexOf(' '+k+'=');if(i>-1){
            pv=pv.substring(0, i)+pv.substring(pv.indexOf(';', i)+1);pc=1;}sv=s.c_rr(sn);i=sv.indexOf(' '+k+'=');
            if(i>-1){sv=sv.substring(0, i)+sv.substring(sv.indexOf(';', i)+1);sc=1;}d=new Date;
            if(e){if(e.getTime()>d.getTime()){pv += ' '+k+'='+s.ape(v)+'|'+e.getTime()+';';pc=1;}}
            else{sv += ' '+k+'='+s.ape(v)+';';sc=1;}sv=sv.replace(/%00/g, '');pv=pv.replace(/%00/g, '');
            if(sc)s.c_wr(sn, sv, 0);if(pc){t=pv;while(t && t.indexOf(';') != -1){var t1=parseInt(t.substring(t.indexOf('|')+1, t.indexOf(';')));
            t=t.substring(t.indexOf(';')+1);ht=ht<t1?t1:ht;}d.setTime(ht);s.c_wr(pn, pv, d);}return v==s.c_r(s.epa(k));
        }
        s.c_w=c_w;
    }

    /** Plugin Utility: Replace v1.0 */
    var repl=new Function("x","o","n","var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x.substring(0,i)+n+x.substring(i+o.length);i=x.indexOf(o,i+l)}return x");

    /** Utility Function: split v1.5 (JS 1.0 compatible) */
    var split=new Function("l","d","var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x++]=l.substring(0,i);l=l.substring(i+d.length);}return a");

    var p_fo=new Function("n","" +"var s=this;if(!s.__fo){s.__fo=new Object;}if(!s.__fo[n]){s.__fo[n]="+"new Object;return 1;}else {return 0;}");
    var getValOnce = new Function("v","c","e","" + "var s=this,k=s.c_r(c),a=new Date;e=e?e:0;if(v){a.setTime(a.getTime("+")+e*86400000);s.c_w(c,v,e?a:0);}return v==k?'':v");
    var getObjectID = function (o) { return o.href;  }
    var p_gpv=new Function("k","u","var s=this,v='',i=u.indexOf('?'),q;if(k&&i>-1){q=decodeURIComponent(u.substring(i+1));v=s.pt(q,'&','p_gvf',k)}return v");
    var p_gvf=new Function("t","k","if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'True':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s.epa(v)}return ''");

    //getQueryParam 2.3
    var getQueryParam=new Function("p","d","u",""+
        "var s=this,v='',i,t;d=d?d:'';u=u?u:(s.pageURL?s.pageURL:s.wd.locati"+
        "on);if(u=='f')u=s.gtfs().location;while(p){i=p.indexOf(',');i=i<0?p"+
        ".length:i;t=s.p_gpv(p.substring(0,i),u+'');if(t){t=t.indexOf('#')>-"+
        "1?t.substring(0,t.indexOf('#')):t;}if(t)v+=v?d+t:t;p=p.substring(i="+
        "=p.length?i:i+1)}return v");

    /** DynamicObjectIDs v1.4: Setup Dynamic Object IDs based on URL. // DEALS WITH DUPLICATE NAMES ON A SINGLE PAGE */
    var setupDynamicObjectIDs=new Function(""+
        "var s=this;if(!s.doi){s.doi=1;if(s.apv>3&&(!s.isie||!s.ismac||s.apv"+
        ">=5)){if(s.wd.attachEvent)s.wd.attachEvent('onload',s.setOIDs);else"+
        " if(s.wd.addEventListener)s.wd.addEventListener('load',s.setOIDs,fa"+
        "lse);else{s.doiol=s.wd.onload;s.wd.onload=s.setOIDs}}s.wd.s_semapho"+
        "re=1}");

    function load(){
        omniture.addPlugin('getValOnce', getValOnce);
        omniture.addPlugin('getObjectID', getObjectID);
        omniture.addPlugin('getQueryParam', getQueryParam);
        omniture.addPlugin('repl', repl);
        omniture.addPlugin('split', split);

        omniture.addPlugin('p_fo', p_fo );
        omniture.addPlugin('p_gpv',p_gpv);
        omniture.addPlugin('p_gvf',p_gvf);

        omniture.addPlugin('setupDynamicObjectIDs',setupDynamicObjectIDs);
        omniture.addPlugin('setOIDs',new Function("e",""+
            "var s=s_c_il["+omniture.getVariable('_in')+"],b=s.eh(s.wd,'onload'),o='onclick',x,l,u,c,i"+
            ",a=new Array;if(s.doiol){if(b)s[b]=s.wd[b];s.doiol(e)}if(s.d.links)"+
            "{for(i=0;i<s.d.links.length;i++){l=s.d.links[i];c=l[o]?''+l[o]:'';b"+
            "=s.eh(l,o);z=l[b]?''+l[b]:'';u=s.getObjectID(l);if(u&&c.indexOf('s_"+
            "objectID')<0&&z.indexOf('s_objectID')<0){u=s.repl(u,'\"','');u=s.re"+
            "pl(u,'\\n','').substring(0,97);l.s_oc=l[o];a[u]=a[u]?a[u]+1:1;x='';"+
            "if(c.indexOf('.t(')>=0||c.indexOf('.tl(')>=0||c.indexOf('s_gs(')>=0"+
            ")x='var x=\".tl(\";';x+='s_objectID=\"'+u+'_'+a[u]+'\";return this."+
            "s_oc?this.s_oc(e):true';if(s.isns&&s.apv>=5)l.setAttribute(o,x);l[o"+
            "]=new Function('e',x)}}}s.wd.s_semaphore=0;return true")
        );

        if (config.setObjectIDs) {//todo: andrew checking to see if people use it. 20-10-13. remove by 01-01-14.
            s.setupDynamicObjectIDs();
        }
    }



    function referredByGoogle(){
        return (document.referrer.indexOf("www.google.") > -1 && document.referrer.indexOf("q=&") > -1) ? true : false;
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


    return {
        load: load,
        referredByGoogle: referredByGoogle,
        getCookie: getCookie
    };

}(_analytics.omniture, _analytics.config));

if (typeof window.define === "function" && window.define.amd) {
    define("plugins/utils", ['core/omniture', 'core/config'], function(omniture, config) {
        return _analytics.plugins.utils;
    });
}