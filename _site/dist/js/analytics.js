
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
    define("utils/polyfill", [],function() {
        return _analytics.polyfill;
    });
};
if (typeof _analytics==='undefined') _analytics={};
_analytics.config = (function(){

    var linkDetailsMap = [
            'module','pod','other','context','theme','textClicked','pageName'
        ],
        variablesMap = {
            searchType: ['prop12','eVar31'],
            searchTerm: ['prop1','eVar1'],
            searchResults: ['prop34'],
            headline: ['prop3','eVar13'],
            errors: ['prop2','eVar2'],
            url: ['prop9','eVar9'],
            refDomain: ['prop36','eVar36'],
            contentType: ['prop20','eVar20'],
            contentId: ['prop21','eVar15'],
            siteName: ['prop23','eVar14'],
            section: ['prop23','eVar14'],
            browseMethod: ['prop24'],
            section0: ['prop25','eVar26'],
            section1: ['prop27','eVar29'],
            section2: ['prop31','eVar30'],
            videoTitle: ['prop26','eVar28'],
            channel: ['eVar24','channel','hier1'],
            samId: ['prop39','eVar39'],
            loginStatus: ['eVar11'],
            ageGender: ['eVar12'],
            skyPackage: ['eVar16'],
            optIn: ['eVar38'],
            linkDetails: ['prop15','eVar7'],
            newRepeat: ["prop70", "eVar70"],
            visitNum: ["prop69", "eVar69"],
            visitorID: ["visitorID"],
            pageName: ["pageName"],
            fullCampaign: ['prop45','eVar45'],
            insightCampaign: ['eVar46'],
            searchEngine: ['prop16','eVar3'],
            externalSearchTerm: ['prop17','eVar8'],
            pageConversion: ['eVar19'],
            fullPageDescription: ['eVar55'],
            testAndTarget: ['eVar18'],
            sessionCampaign: ['eVar47']
        },
        eventsMap = {
            pageLoad: 'event1',
            error: 'event3',
            linkClick: 'event6',
            firstPageVisited: 'event7',
            secondPageVisited: 'event8',
            searchResults: 'event15',
            loginComplete: 'event16',
            loginStart: 'event17',
            regComplete: 'event18',
            regStart: 'event19',
            repeatVisit: 'event20',
            optIn: 'event25',
            zeroResults: 'event26',
            liveChat: "event36",
            passwordStart: 'event76',
            passwordComplete: 'event77',
            activateStart: 'event78',
            activateComplete: 'event79'
        },
        variableBasedEvents = {
            'searchResults': 'searchResults',
            'errors': 'error'
        };


    return {
        variablesMap: variablesMap,
        eventsMap: eventsMap,
        linkDetailsMap: linkDetailsMap,
        variableBasedEvents: variableBasedEvents,
        trackingServer: 'metrics.sky.com',
        trackingServerSecure: 'smetrics.sky.com',
        visitorNamespace: 'bskyb',
        charSet: 'UTF-8',
        trackDownloadLinks: true,
        trackExternalLinks: true,
        trackInlineStats: true,
        linkDownloadFileTypes: 'exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx,air,wma,dmg',
        //anyway to make this easier to have all?
        linkInternalFilters: 'javascript:,skyintranet,sky.com,skysports.co.uk,skyarts.co.uk,skybet.com,skypoker.com,skybingo.com,skyvegas.com,teamtalk.com,football365.com,sportinglife.com,sportal.com,bettingzone.co.uk,fixtures365.com,teamsky.com,oddschecker.com,sport365.com,skysports.com,sky.zoopla.co.uk,skyoneonline.co.uk,bskybpensionplan.com,skymobileiphone.com,skymovies.com,skyone.co.uk,sky1.co.uk,skyoneonline.co.uk,m.skynews.com,skyrainforestrescueschoolschallenge.org,skybroadband.com,skyartsonline.co.uk,skymoviesactive.com,skyhub.bskyb.com,skyone.co.uk,sky.co.uk,skybet.mobi,socceram.com,teamtalk.co.za,football365.co.uk,jointhebiggerpicture.com,skysportsnewsradio.com,file,contact.sky.com,.rainforestrescue.com,.nowtv.com,'+window.location.host,
        linkLeaveQueryString: false,
        linkTrackVars: 'None',
        linkTrackEvents: 'None',
        browseMethod: 'web',
        url: window.location.href.toString().split('?')[0],
        server: window.location.hostname,
        QScmpId: 'cmpid,aff',
        QScmpIdInt: 'cmpid_int',
        useForcedLinkTracking: true,
        forceLinkTrackingTimeout: 500,
        setObjectIDs: true,
        trackLinks: true, //todo: document
        loadEvents:[],
        loadVariables:{}
    };

}());


if (typeof window.define === "function" && window.define.amd) {
    define("core/config", [],function() {
        return _analytics.config;
    });
};
if (typeof _analytics==='undefined') _analytics={};
_analytics.logger = (function(config){

    var debugging= false,
        debugOutputId= 'analytics-debug';

    function debug(on){
        $('#' + debugOutputId).remove();
        if (on || on === undefined){
            debugging = true;
            $('body').append('<div id="' + debugOutputId + '"></div>');
        } else {
            debugging = false;
        }
    }

    function logPageView(tracked){
        log('start','pageView event triggered');
        log('','omniture', tracked);
        log('end');
    }

    function log(prop, val){
        if (!debugging){ return; }
        if (prop=='start'){
            console.group(val);
            $('#' + debugOutputId).html('');
        } else if (prop=='end'){
            console.groupEnd();
        } else {
            console.log(prop +': ', val);
            $('#' + debugOutputId).append('<div class="' + prop + '">' + prop +': ' + val + '</div>');
        }
    }

    function getEventName(eventID){
        var eventsMap = config.eventsMap,
            name;
        for (name in eventsMap){
            if (eventsMap[name]==eventID) return name;
        }
        return '';
    }
    function logS(linkDetails, events, mappedVars){
        if (!(debugging && console && console.group)){ return; }
        var arrDetails, x;
        log('start','tracking event');

            if (linkDetails){
                console.groupCollapsed('linkDetails');
                arrDetails = linkDetails.split('|');
                for (x in arrDetails){
                    log(config.linkDetailsMap[x], arrDetails[x]);
                }
                console.groupEnd();
            }
            if (events){
                arrDetails = events.split(',');
                console.groupCollapsed('events');
                for (x in arrDetails){
                    log(getEventName(arrDetails[x]), arrDetails[x]);
                }
                console.groupEnd();
            }
            console.groupCollapsed('All Changed Variables');
                for (x in mappedVars){
                    if (mappedVars[x]!==String(config[x])){
                        log(x, mappedVars[x]);
                    }
                }
            console.groupEnd();
            console.groupCollapsed('The Whole of omniture');
                log('s',s);
            console.groupEnd();

        log('end');
    }

    return {
        debug: debug,
        logPageView: logPageView,
        logS: logS,
        log: log
    };

}(_analytics.config));


if (typeof window.define === "function" && window.define.amd) {
    define("utils/logger", ['core/config'], function(config) {
        return _analytics.logger;
    });
}
;
if (typeof _analytics==='undefined') _analytics={};
_analytics.omniture = (function(config, logger){

    window.s = {};
    var mappedVars = {};

    function obfuscate(val){ //todo: test channel being first in vars list
        return val.replace('eVar','v').replace('prop','c').replace('channel','ch');
    }

    function init(account){
        s = s_gi(account);
        if (config.debug){
            logger.debug(true);
        }
    }

    function getVariable(prop){
        return mappedVars[prop] || s[prop];
    }

    function setVariable(prop, val){ //todo: unit test 0 as val. test val is typeof string
        if(typeof val === "undefined" || prop=='events'){ return; }
        var i= 1,map,
            data = config.variablesMap[prop] || [prop];
        val = val.toString();
        mappedVars[prop] = val;
        s[data[0]] = val;
        if (data.length>1){
            map = 'D=' + obfuscate(data[0]);
            for (i; i<data.length; i++){
                s[data[i]] = map;
            }
        }
        return val;
    }

    function setLinkTrackVariable(variable){
        if (!s.linkTrackVars) s.linkTrackVars = '';
        if (s.linkTrackVars.length>0) s.linkTrackVars += ',';
        s.linkTrackVars += config.variablesMap[variable];
    }
    function setLinkTrackEvent(event){
        if (!s.linkTrackEvents) s.linkTrackEvents = '';
        if (s.linkTrackEvents.length>0) s.linkTrackEvents += ',';
        s.linkTrackEvents += config.eventsMap[event];
    }

    function setEvent(event){
        if (!s.events) s.events = '';
        if (s.events.length>0) s.events += ',';
        s.events += config.eventsMap[event];
    }

    function setVariableBasedEvents(variable){
        if (config.variableBasedEvents[variable]){
            setEvent(config.variableBasedEvents[variable]);
        }
    }
    function trackLink(el){
        log();
        s.trackLink(el,'o','Link Click');
    }
    function trackPage(){
        log();
        s.t();
    }

    function log(){
        logger.logS(getVariable('linkDetails'), getVariable('events'), mappedVars);
    }

    function reset(){
        setVariable('linkDetails','');
        s.linkTrackVars = '';
        s.linkTrackEvents = '';
        s.events = '';
    }

    function addPlugin(name, fn){
        s[name] = fn;
        return s[name];
    }

    /************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
    var s_code='',
        s_objectID;

    function s_gi(un,pg,ss){
        var c="s.version='H.26';s.an=s_an;s.logDebug=function(m){var s=this,tcf=new Function('var e;try{console.log(\"'+s.rep(s.rep(s.rep(m,\"\\\\\",\"\\\\\\"
        +"\\\"),\"\\n\",\"\\\\n\"),\"\\\"\",\"\\\\\\\"\")+'\");}catch(e){}');tcf()};s.cls=function(x,c){var i,y='';if(!c)c=this.an;for(i=0;i<x.length;i++){n=x.substring(i,i+1);if(c.indexOf(n)>=0)y+=n}return "
        +"y};s.fl=function(x,l){return x?(''+x).substring(0,l):x};s.co=function(o){return o};s.num=function(x){x=''+x;for(var p=0;p<x.length;p++)if(('0123456789').indexOf(x.substring(p,p+1))<0)return 0;retur"
        +"n 1};s.rep=s_rep;s.sp=s_sp;s.jn=s_jn;s.ape=function(x){var s=this,h='0123456789ABCDEF',f=\"+~!*()'\",i,c=s.charSet,n,l,e,y='';c=c?c.toUpperCase():'';if(x){x=''+x;if(s.em==3){x=encodeURIComponent(x)"
        +";for(i=0;i<f.length;i++) {n=f.substring(i,i+1);if(x.indexOf(n)>=0)x=s.rep(x,n,\"%\"+n.charCodeAt(0).toString(16).toUpperCase())}}else if(c=='AUTO'&&('').charCodeAt){for(i=0;i<x.length;i++){c=x.subs"
        +"tring(i,i+1);n=x.charCodeAt(i);if(n>127){l=0;e='';while(n||l<4){e=h.substring(n%16,n%16+1)+e;n=(n-n%16)/16;l++}y+='%u'+e}else if(c=='+')y+='%2B';else y+=escape(c)}x=y}else x=s.rep(escape(''+x),'+',"
        +"'%2B');if(c&&c!='AUTO'&&s.em==1&&x.indexOf('%u')<0&&x.indexOf('%U')<0){i=x.indexOf('%');while(i>=0){i++;if(h.substring(8).indexOf(x.substring(i,i+1).toUpperCase())>=0)return x.substring(0,i)+'u00'+"
        +"x.substring(i);i=x.indexOf('%',i)}}}return x};s.epa=function(x){var s=this,y,tcf;if(x){x=s.rep(''+x,'+',' ');if(s.em==3){tcf=new Function('x','var y,e;try{y=decodeURIComponent(x)}catch(e){y=unescap"
        +"e(x)}return y');return tcf(x)}else return unescape(x)}return y};s.pt=function(x,d,f,a){var s=this,t=x,z=0,y,r;while(t){y=t.indexOf(d);y=y<0?t.length:y;t=t.substring(0,y);r=s[f](t,a);if(r)return r;z"
        +"+=y+d.length;t=x.substring(z,x.length);t=z<x.length?t:''}return ''};s.isf=function(t,a){var c=a.indexOf(':');if(c>=0)a=a.substring(0,c);c=a.indexOf('=');if(c>=0)a=a.substring(0,c);if(t.substring(0,"
        +"2)=='s_')t=t.substring(2);return (t!=''&&t==a)};s.fsf=function(t,a){var s=this;if(s.pt(a,',','isf',t))s.fsg+=(s.fsg!=''?',':'')+t;return 0};s.fs=function(x,f){var s=this;s.fsg='';s.pt(x,',','fsf',f"
        +");return s.fsg};s.mpc=function(m,a){var s=this,c,l,n,v;v=s.d.visibilityState;if(!v)v=s.d.webkitVisibilityState;if(v&&v=='prerender'){if(!s.mpq){s.mpq=new Array;l=s.sp('webkitvisibilitychange,visibi"
        +"litychange',',');for(n=0;n<l.length;n++){s.d.addEventListener(l[n],new Function('var s=s_c_il['+s._in+'],c,v;v=s.d.visibilityState;if(!v)v=s.d.webkitVisibilityState;if(s.mpq&&v==\"visible\"){while("
        +"s.mpq.length>0){c=s.mpq.shift();s[c.m].apply(s,c.a)}s.mpq=0}'),false)}}c=new Object;c.m=m;c.a=a;s.mpq.push(c);return 1}return 0};s.si=function(){var s=this,i,k,v,c=s_gi+'var s=s_gi(\"'+s.oun+'\");s"
        +".sa(\"'+s.un+'\");';for(i=0;i<s.va_g.length;i++){k=s.va_g[i];v=s[k];if(v!=undefined){if(typeof(v)!='number')c+='s.'+k+'=\"'+s_fe(v)+'\";';else c+='s.'+k+'='+v+';'}}c+=\"s.lnk=s.eo=s.linkName=s.link"
        +"Type=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';\";return c};s.c_d='';s.c_gdf=function(t,a){var s=this;if(!s.num(t))return 1;return 0};s.c_gd=function(){var s=this,d=s.wd.location.hostname,"
        +"n=s.fpCookieDomainPeriods,p;if(!n)n=s.cookieDomainPeriods;if(d&&!s.c_d){n=n?parseInt(n):2;n=n>2?n:2;p=d.lastIndexOf('.');if(p>=0){while(p>=0&&n>1){p=d.lastIndexOf('.',p-1);n--}s.c_d=p>0&&s.pt(d,'.'"
        +",'c_gdf',0)?d.substring(p):d}}return s.c_d};s.c_r=function(k){var s=this;k=s.ape(k);var c=' '+s.d.cookie,i=c.indexOf(' '+k+'='),e=i<0?i:c.indexOf(';',i),v=i<0?'':s.epa(c.substring(i+2+k.length,e<0?"
        +"c.length:e));return v!='[[B]]'?v:''};s.c_w=function(k,v,e){var s=this,d=s.c_gd(),l=s.cookieLifetime,t;v=''+v;l=l?(''+l).toUpperCase():'';if(e&&l!='SESSION'&&l!='NONE'){t=(v!=''?parseInt(l?l:0):-60)"
        +";if(t){e=new Date;e.setTime(e.getTime()+(t*1000))}}if(k&&l!='NONE'){s.d.cookie=k+'='+s.ape(v!=''?v:'[[B]]')+'; path=/;'+(e&&l!='SESSION'?' expires='+e.toGMTString()+';':'')+(d?' domain='+d+';':'');"
        +"return s.c_r(k)==v}return 0};s.eh=function(o,e,r,f){var s=this,b='s_'+e+'_'+s._in,n=-1,l,i,x;if(!s.ehl)s.ehl=new Array;l=s.ehl;for(i=0;i<l.length&&n<0;i++){if(l[i].o==o&&l[i].e==e)n=i}if(n<0){n=i;l"
        +"[n]=new Object}x=l[n];x.o=o;x.e=e;f=r?x.b:f;if(r||f){x.b=r?0:o[e];x.o[e]=f}if(x.b){x.o[b]=x.b;return b}return 0};s.cet=function(f,a,t,o,b){var s=this,r,tcf;if(s.apv>=5&&(!s.isopera||s.apv>=7)){tcf="
        +"new Function('s','f','a','t','var e,r;try{r=s[f](a)}catch(e){r=s[t](e)}return r');r=tcf(s,f,a,t)}else{if(s.ismac&&s.u.indexOf('MSIE 4')>=0)r=s[b](a);else{s.eh(s.wd,'onerror',0,o);r=s[f](a);s.eh(s.w"
        +"d,'onerror',1)}}return r};s.gtfset=function(e){var s=this;return s.tfs};s.gtfsoe=new Function('e','var s=s_c_il['+s._in+'],c;s.eh(window,\"onerror\",1);s.etfs=1;c=s.t();if(c)s.d.write(c);s.etfs=0;r"
        +"eturn true');s.gtfsfb=function(a){return window};s.gtfsf=function(w){var s=this,p=w.parent,l=w.location;s.tfs=w;if(p&&p.location!=l&&p.location.host==l.host){s.tfs=p;return s.gtfsf(s.tfs)}return s."
        +"tfs};s.gtfs=function(){var s=this;if(!s.tfs){s.tfs=s.wd;if(!s.etfs)s.tfs=s.cet('gtfsf',s.tfs,'gtfset',s.gtfsoe,'gtfsfb')}return s.tfs};s.mrq=function(u){var s=this,l=s.rl[u],n,r;s.rl[u]=0;if(l)for("
        +"n=0;n<l.length;n++){r=l[n];s.mr(0,0,r.r,r.t,r.u)}};s.flushBufferedRequests=function(){};s.mr=function(sess,q,rs,ta,u){var s=this,dc=s.dc,t1=s.trackingServer,t2=s.trackingServerSecure,tb=s.trackingS"
        +"erverBase,p='.sc',ns=s.visitorNamespace,un=s.cls(u?u:(ns?ns:s.fun)),r=new Object,l,imn='s_i_'+s._in+'_'+un,im,b,e;if(!rs){if(t1){if(t2&&s.ssl)t1=t2}else{if(!tb)tb='2o7.net';if(dc)dc=(''+dc).toLower"
        +"Case();else dc='d1';if(tb=='2o7.net'){if(dc=='d1')dc='112';else if(dc=='d2')dc='122';p=''}t1=un+'.'+dc+'.'+p+tb}rs='http'+(s.ssl?'s':'')+'://'+t1+'/b/ss/'+s.un+'/'+(s.mobile?'5.1':'1')+'/'+s.versio"
        +"n+(s.tcn?'T':'')+'/'+sess+'?AQB=1&ndh=1'+(q?q:'')+'&AQE=1';if(s.isie&&!s.ismac)rs=s.fl(rs,2047)}if(s.d.images&&s.apv>=3&&(!s.isopera||s.apv>=7)&&(s.ns6<0||s.apv>=6.1)){if(!s.rc)s.rc=new Object;if(!"
        +"s.rc[un]){s.rc[un]=1;if(!s.rl)s.rl=new Object;s.rl[un]=new Array;setTimeout('if(window.s_c_il)window.s_c_il['+s._in+'].mrq(\"'+un+'\")',750)}else{l=s.rl[un];if(l){r.t=ta;r.u=un;r.r=rs;l[l.length]=r"
        +";return ''}imn+='_'+s.rc[un];s.rc[un]++}if(s.debugTracking){var d='AppMeasurement Debug: '+rs,dl=s.sp(rs,'&'),dln;for(dln=0;dln<dl.length;dln++)d+=\"\\n\\t\"+s.epa(dl[dln]);s.logDebug(d)}im=s.wd[im"
        +"n];if(!im)im=s.wd[imn]=new Image;im.s_l=0;im.onload=new Function('e','this.s_l=1;var wd=window,s;if(wd.s_c_il){s=wd.s_c_il['+s._in+'];s.bcr();s.mrq(\"'+un+'\");s.nrs--;if(!s.nrs)s.m_m(\"rr\")}');if"
        +"(!s.nrs){s.nrs=1;s.m_m('rs')}else s.nrs++;im.src=rs;if(s.useForcedLinkTracking||s.bcf){if(!s.forcedLinkTrackingTimeout)s.forcedLinkTrackingTimeout=250;setTimeout('if(window.s_c_il)window.s_c_il['+s"
        +"._in+'].bcr()',s.forcedLinkTrackingTimeout);}else if((s.lnk||s.eo)&&(!ta||ta=='_self'||ta=='_top'||ta=='_parent'||(s.wd.name&&ta==s.wd.name))){b=e=new Date;while(!im.s_l&&e.getTime()-b.getTime()<50"
        +"0)e=new Date}return ''}return '<im'+'g sr'+'c=\"'+rs+'\" width=1 height=1 border=0 alt=\"\">'};s.gg=function(v){var s=this;if(!s.wd['s_'+v])s.wd['s_'+v]='';return s.wd['s_'+v]};s.glf=function(t,a){"
        +"if(t.substring(0,2)=='s_')t=t.substring(2);var s=this,v=s.gg(t);if(v)s[t]=v};s.gl=function(v){var s=this;if(s.pg)s.pt(v,',','glf',0)};s.rf=function(x){var s=this,y,i,j,h,p,l=0,q,a,b='',c='',t;if(x&"
        +"&x.length>255){y=''+x;i=y.indexOf('?');if(i>0){q=y.substring(i+1);y=y.substring(0,i);h=y.toLowerCase();j=0;if(h.substring(0,7)=='http://')j+=7;else if(h.substring(0,8)=='https://')j+=8;i=h.indexOf("
        +"\"/\",j);if(i>0){h=h.substring(j,i);p=y.substring(i);y=y.substring(0,i);if(h.indexOf('google')>=0)l=',q,ie,start,search_key,word,kw,cd,';else if(h.indexOf('yahoo.co')>=0)l=',p,ei,';if(l&&q){a=s.sp("
        +"q,'&');if(a&&a.length>1){for(j=0;j<a.length;j++){t=a[j];i=t.indexOf('=');if(i>0&&l.indexOf(','+t.substring(0,i)+',')>=0)b+=(b?'&':'')+t;else c+=(c?'&':'')+t}if(b&&c)q=b+'&'+c;else c=''}i=253-(q.len"
        +"gth-c.length)-y.length;x=y+(i>0?p.substring(0,i):'')+'?'+q}}}}return x};s.s2q=function(k,v,vf,vfp,f){var s=this,qs='',sk,sv,sp,ss,nke,nk,nf,nfl=0,nfn,nfm;if(k==\"contextData\")k=\"c\";if(v){for(sk "
        +"in v)if((!f||sk.substring(0,f.length)==f)&&v[sk]&&(!vf||vf.indexOf(','+(vfp?vfp+'.':'')+sk+',')>=0)&&(!Object||!Object.prototype||!Object.prototype[sk])){nfm=0;if(nfl)for(nfn=0;nfn<nfl.length;nfn++"
        +")if(sk.substring(0,nfl[nfn].length)==nfl[nfn])nfm=1;if(!nfm){if(qs=='')qs+='&'+k+'.';sv=v[sk];if(f)sk=sk.substring(f.length);if(sk.length>0){nke=sk.indexOf('.');if(nke>0){nk=sk.substring(0,nke);nf="
        +"(f?f:'')+nk+'.';if(!nfl)nfl=new Array;nfl[nfl.length]=nf;qs+=s.s2q(nk,v,vf,vfp,nf)}else{if(typeof(sv)=='boolean'){if(sv)sv='true';else sv='false'}if(sv){if(vfp=='retrieveLightData'&&f.indexOf('.con"
        +"textData.')<0){sp=sk.substring(0,4);ss=sk.substring(4);if(sk=='transactionID')sk='xact';else if(sk=='channel')sk='ch';else if(sk=='campaign')sk='v0';else if(s.num(ss)){if(sp=='prop')sk='c'+ss;else "
        +"if(sp=='eVar')sk='v'+ss;else if(sp=='list')sk='l'+ss;else if(sp=='hier'){sk='h'+ss;sv=sv.substring(0,255)}}}qs+='&'+s.ape(sk)+'='+s.ape(sv)}}}}}if(qs!='')qs+='&.'+k}return qs};s.hav=function(){var "
        +"s=this,qs='',l,fv='',fe='',mn,i,e;if(s.lightProfileID){l=s.va_m;fv=s.lightTrackVars;if(fv)fv=','+fv+','+s.vl_mr+','}else{l=s.va_t;if(s.pe||s.linkType){fv=s.linkTrackVars;fe=s.linkTrackEvents;if(s.p"
        +"e){mn=s.pe.substring(0,1).toUpperCase()+s.pe.substring(1);if(s[mn]){fv=s[mn].trackVars;fe=s[mn].trackEvents}}}if(fv)fv=','+fv+','+s.vl_l+','+s.vl_l2;if(fe){fe=','+fe+',';if(fv)fv+=',events,'}if (s."
        +"events2)e=(e?',':'')+s.events2}for(i=0;i<l.length;i++){var k=l[i],v=s[k],b=k.substring(0,4),x=k.substring(4),n=parseInt(x),q=k;if(!v)if(k=='events'&&e){v=e;e=''}if(v&&(!fv||fv.indexOf(','+k+',')>=0"
        +")&&k!='linkName'&&k!='linkType'){if(k=='timestamp')q='ts';else if(k=='dynamicVariablePrefix')q='D';else if(k=='visitorID')q='vid';else if(k=='pageURL'){q='g';if(v.length>255){s.pageURLRest=v.substr"
        +"ing(255);v=v.substring(0,255);}}else if(k=='pageURLRest')q='-g';else if(k=='referrer'){q='r';v=s.fl(s.rf(v),255)}else if(k=='vmk'||k=='visitorMigrationKey')q='vmt';else if(k=='visitorMigrationServe"
        +"r'){q='vmf';if(s.ssl&&s.visitorMigrationServerSecure)v=''}else if(k=='visitorMigrationServerSecure'){q='vmf';if(!s.ssl&&s.visitorMigrationServer)v=''}else if(k=='charSet'){q='ce';if(v.toUpperCase()"
        +"=='AUTO')v='ISO8859-1';else if(s.em==2||s.em==3)v='UTF-8'}else if(k=='visitorNamespace')q='ns';else if(k=='cookieDomainPeriods')q='cdp';else if(k=='cookieLifetime')q='cl';else if(k=='variableProvid"
        +"er')q='vvp';else if(k=='currencyCode')q='cc';else if(k=='channel')q='ch';else if(k=='transactionID')q='xact';else if(k=='campaign')q='v0';else if(k=='resolution')q='s';else if(k=='colorDepth')q='c'"
        +";else if(k=='javascriptVersion')q='j';else if(k=='javaEnabled')q='v';else if(k=='cookiesEnabled')q='k';else if(k=='browserWidth')q='bw';else if(k=='browserHeight')q='bh';else if(k=='connectionType'"
        +")q='ct';else if(k=='homepage')q='hp';else if(k=='plugins')q='p';else if(k=='events'){if(e)v+=(v?',':'')+e;if(fe)v=s.fs(v,fe)}else if(k=='events2')v='';else if(k=='contextData'){qs+=s.s2q('c',s[k],f"
        +"v,k,0);v=''}else if(k=='lightProfileID')q='mtp';else if(k=='lightStoreForSeconds'){q='mtss';if(!s.lightProfileID)v=''}else if(k=='lightIncrementBy'){q='mti';if(!s.lightProfileID)v=''}else if(k=='re"
        +"trieveLightProfiles')q='mtsr';else if(k=='deleteLightProfiles')q='mtsd';else if(k=='retrieveLightData'){if(s.retrieveLightProfiles)qs+=s.s2q('mts',s[k],fv,k,0);v=''}else if(s.num(x)){if(b=='prop')q"
        +"='c'+n;else if(b=='eVar')q='v'+n;else if(b=='list')q='l'+n;else if(b=='hier'){q='h'+n;v=s.fl(v,255)}}if(v)qs+='&'+s.ape(q)+'='+(k.substring(0,3)!='pev'?s.ape(v):v)}}return qs};s.ltdf=function(t,h){"
        +"t=t?t.toLowerCase():'';h=h?h.toLowerCase():'';var qi=h.indexOf('?');h=qi>=0?h.substring(0,qi):h;if(t&&h.substring(h.length-(t.length+1))=='.'+t)return 1;return 0};s.ltef=function(t,h){t=t?t.toLower"
        +"Case():'';h=h?h.toLowerCase():'';if(t&&h.indexOf(t)>=0)return 1;return 0};s.lt=function(h){var s=this,lft=s.linkDownloadFileTypes,lef=s.linkExternalFilters,lif=s.linkInternalFilters;lif=lif?lif:s.w"
        +"d.location.hostname;h=h.toLowerCase();if(s.trackDownloadLinks&&lft&&s.pt(lft,',','ltdf',h))return 'd';if(s.trackExternalLinks&&h.indexOf('#')!=0&&h.indexOf('about:')!=0&&h.indexOf('javascript:')!=0"
        +"&&(lef||lif)&&(!lef||s.pt(lef,',','ltef',h))&&(!lif||!s.pt(lif,',','ltef',h)))return 'e';return ''};s.lc=new Function('e','var s=s_c_il['+s._in+'],b=s.eh(this,\"onclick\");s.lnk=this;s.t();s.lnk=0;"
        +"if(b)return this[b](e);return true');s.bcr=function(){var s=this;if(s.bct&&s.bce)s.bct.dispatchEvent(s.bce);if(s.bcf){if(typeof(s.bcf)=='function')s.bcf();else if(s.bct&&s.bct.href)s.d.location=s.b"
        +"ct.href}s.bct=s.bce=s.bcf=0};s.bc=new Function('e','if(e&&e.s_fe)return;var s=s_c_il['+s._in+'],f,tcf,t,n,nrs,a,h;if(s.d&&s.d.all&&s.d.all.cppXYctnr)return;if(!s.bbc)s.useForcedLinkTracking=0;else "
        +"if(!s.useForcedLinkTracking){s.b.removeEventListener(\"click\",s.bc,true);s.bbc=s.useForcedLinkTracking=0;return}else s.b.removeEventListener(\"click\",s.bc,false);s.eo=e.srcElement?e.srcElement:e."
        +"target;nrs=s.nrs;s.t();s.eo=0;if(s.nrs>nrs&&s.useForcedLinkTracking&&e.target){a=e.target;while(a&&a!=s.b&&a.tagName.toUpperCase()!=\"A\"&&a.tagName.toUpperCase()!=\"AREA\")a=a.parentNode;if(a){h=a"
        +".href;if(h.indexOf(\"#\")==0||h.indexOf(\"about:\")==0||h.indexOf(\"javascript:\")==0)h=0;t=a.target;if(e.target.dispatchEvent&&h&&(!t||t==\"_self\"||t==\"_top\"||t==\"_parent\"||(s.wd.name&&t==s.w"
        +"d.name))){tcf=new Function(\"s\",\"var x;try{n=s.d.createEvent(\\\\\"MouseEvents\\\\\")}catch(x){n=new MouseEvent}return n\");n=tcf(s);if(n){tcf=new Function(\"n\",\"e\",\"var x;try{n.initMouseEven"
        +"t(\\\\\"click\\\\\",e.bubbles,e.cancelable,e.view,e.detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,e.button,e.relatedTarget)}catch(x){n=0}return n\");n=tcf(n"
        +",e);if(n){n.s_fe=1;e.stopPropagation();if (e.stopImmediatePropagation) {e.stopImmediatePropagation();}e.preventDefault();s.bct=e.target;s.bce=n}}}}}');s.oh=function(o){var s=this,l=s.wd.location,h="
        +"o.href?o.href:'',i,j,k,p;i=h.indexOf(':');j=h.indexOf('?');k=h.indexOf('/');if(h&&(i<0||(j>=0&&i>j)||(k>=0&&i>k))){p=o.protocol&&o.protocol.length>1?o.protocol:(l.protocol?l.protocol:'');i=l.pathna"
        +"me.lastIndexOf('/');h=(p?p+'//':'')+(o.host?o.host:(l.host?l.host:''))+(h.substring(0,1)!='/'?l.pathname.substring(0,i<0?0:i)+'/':'')+h}return h};s.ot=function(o){var t=o.tagName;if(o.tagUrn||(o.sc"
        +"opeName&&o.scopeName.toUpperCase()!='HTML'))return '';t=t&&t.toUpperCase?t.toUpperCase():'';if(t=='SHAPE')t='';if(t){if((t=='INPUT'||t=='BUTTON')&&o.type&&o.type.toUpperCase)t=o.type.toUpperCase();"
        +"else if(!t&&o.href)t='A';}return t};s.oid=function(o){var s=this,t=s.ot(o),p,c,n='',x=0;if(t&&!o.s_oid){p=o.protocol;c=o.onclick;if(o.href&&(t=='A'||t=='AREA')&&(!c||!p||p.toLowerCase().indexOf('ja"
        +"vascript')<0))n=s.oh(o);else if(c){n=s.rep(s.rep(s.rep(s.rep(''+c,\"\\r\",''),\"\\n\",''),\"\\t\",''),' ','');x=2}else if(t=='INPUT'||t=='SUBMIT'){if(o.value)n=o.value;else if(o.innerText)n=o.inner"
        +"Text;else if(o.textContent)n=o.textContent;x=3}else if(o.src&&t=='IMAGE')n=o.src;if(n){o.s_oid=s.fl(n,100);o.s_oidt=x}}return o.s_oid};s.rqf=function(t,un){var s=this,e=t.indexOf('='),u=e>=0?t.subs"
        +"tring(0,e):'',q=e>=0?s.epa(t.substring(e+1)):'';if(u&&q&&(','+u+',').indexOf(','+un+',')>=0){if(u!=s.un&&s.un.indexOf(',')>=0)q='&u='+u+q+'&u=0';return q}return ''};s.rq=function(un){if(!un)un=this"
        +".un;var s=this,c=un.indexOf(','),v=s.c_r('s_sq'),q='';if(c<0)return s.pt(v,'&','rqf',un);return s.pt(un,',','rq',0)};s.sqp=function(t,a){var s=this,e=t.indexOf('='),q=e<0?'':s.epa(t.substring(e+1))"
        +";s.sqq[q]='';if(e>=0)s.pt(t.substring(0,e),',','sqs',q);return 0};s.sqs=function(un,q){var s=this;s.squ[un]=q;return 0};s.sq=function(q){var s=this,k='s_sq',v=s.c_r(k),x,c=0;s.sqq=new Object;s.squ="
        +"new Object;s.sqq[q]='';s.pt(v,'&','sqp',0);s.pt(s.un,',','sqs',q);v='';for(x in s.squ)if(x&&(!Object||!Object.prototype||!Object.prototype[x]))s.sqq[s.squ[x]]+=(s.sqq[s.squ[x]]?',':'')+x;for(x in s"
        +".sqq)if(x&&(!Object||!Object.prototype||!Object.prototype[x])&&s.sqq[x]&&(x==q||c<2)){v+=(v?'&':'')+s.sqq[x]+'='+s.ape(x);c++}return s.c_w(k,v,0)};s.wdl=new Function('e','var s=s_c_il['+s._in+'],r="
        +"true,b=s.eh(s.wd,\"onload\"),i,o,oc;if(b)r=this[b](e);for(i=0;i<s.d.links.length;i++){o=s.d.links[i];oc=o.onclick?\"\"+o.onclick:\"\";if((oc.indexOf(\"s_gs(\")<0||oc.indexOf(\".s_oc(\")>=0)&&oc.ind"
        +"exOf(\".tl(\")<0)s.eh(o,\"onclick\",0,s.lc);}return r');s.wds=function(){var s=this;if(s.apv>3&&(!s.isie||!s.ismac||s.apv>=5)){if(s.b&&s.b.attachEvent)s.b.attachEvent('onclick',s.bc);else if(s.b&&s"
        +".b.addEventListener){if(s.n&&((s.n.userAgent.indexOf('WebKit')>=0&&s.d.createEvent)||(s.n.userAgent.indexOf('Firefox/2')>=0&&s.wd.MouseEvent))){s.bbc=1;s.useForcedLinkTracking=1;s.b.addEventListene"
        +"r('click',s.bc,true)}s.b.addEventListener('click',s.bc,false)}else s.eh(s.wd,'onload',0,s.wdl)}};s.vs=function(x){var s=this,v=s.visitorSampling,g=s.visitorSamplingGroup,k='s_vsn_'+s.un+(g?'_'+g:''"
        +"),n=s.c_r(k),e=new Date,y=e.getYear();e.setYear(y+10+(y<1900?1900:0));if(v){v*=100;if(!n){if(!s.c_w(k,x,e))return 0;n=x}if(n%10000>v)return 0}return 1};s.dyasmf=function(t,m){if(t&&m&&m.indexOf(t)>"
        +"=0)return 1;return 0};s.dyasf=function(t,m){var s=this,i=t?t.indexOf('='):-1,n,x;if(i>=0&&m){var n=t.substring(0,i),x=t.substring(i+1);if(s.pt(x,',','dyasmf',m))return n}return 0};s.uns=function(){"
        +"var s=this,x=s.dynamicAccountSelection,l=s.dynamicAccountList,m=s.dynamicAccountMatch,n,i;s.un=s.un.toLowerCase();if(x&&l){if(!m)m=s.wd.location.host;if(!m.toLowerCase)m=''+m;l=l.toLowerCase();m=m."
        +"toLowerCase();n=s.pt(l,';','dyasf',m);if(n)s.un=n}i=s.un.indexOf(',');s.fun=i<0?s.un:s.un.substring(0,i)};s.sa=function(un){var s=this;if(s.un&&s.mpc('sa',arguments))return;s.un=un;if(!s.oun)s.oun="
        +"un;else if((','+s.oun+',').indexOf(','+un+',')<0)s.oun+=','+un;s.uns()};s.m_i=function(n,a){var s=this,m,f=n.substring(0,1),r,l,i;if(!s.m_l)s.m_l=new Object;if(!s.m_nl)s.m_nl=new Array;m=s.m_l[n];i"
        +"f(!a&&m&&m._e&&!m._i)s.m_a(n);if(!m){m=new Object,m._c='s_m';m._in=s.wd.s_c_in;m._il=s._il;m._il[m._in]=m;s.wd.s_c_in++;m.s=s;m._n=n;m._l=new Array('_c','_in','_il','_i','_e','_d','_dl','s','n','_r"
        +"','_g','_g1','_t','_t1','_x','_x1','_rs','_rr','_l');s.m_l[n]=m;s.m_nl[s.m_nl.length]=n}else if(m._r&&!m._m){r=m._r;r._m=m;l=m._l;for(i=0;i<l.length;i++)if(m[l[i]])r[l[i]]=m[l[i]];r._il[r._in]=r;m="
        +"s.m_l[n]=r}if(f==f.toUpperCase())s[n]=m;return m};s.m_a=new Function('n','g','e','if(!g)g=\"m_\"+n;var s=s_c_il['+s._in+'],c=s[g+\"_c\"],m,x,f=0;if(s.mpc(\"m_a\",arguments))return;if(!c)c=s.wd[\"s_"
        +"\"+g+\"_c\"];if(c&&s_d)s[g]=new Function(\"s\",s_ft(s_d(c)));x=s[g];if(!x)x=s.wd[\\'s_\\'+g];if(!x)x=s.wd[g];m=s.m_i(n,1);if(x&&(!m._i||g!=\"m_\"+n)){m._i=f=1;if((\"\"+x).indexOf(\"function\")>=0)x"
        +"(s);else s.m_m(\"x\",n,x,e)}m=s.m_i(n,1);if(m._dl)m._dl=m._d=0;s.dlt();return f');s.m_m=function(t,n,d,e){t='_'+t;var s=this,i,x,m,f='_'+t,r=0,u;if(s.m_l&&s.m_nl)for(i=0;i<s.m_nl.length;i++){x=s.m_"
        +"nl[i];if(!n||x==n){m=s.m_i(x);u=m[t];if(u){if((''+u).indexOf('function')>=0){if(d&&e)u=m[t](d,e);else if(d)u=m[t](d);else u=m[t]()}}if(u)r=1;u=m[t+1];if(u&&!m[f]){if((''+u).indexOf('function')>=0){"
        +"if(d&&e)u=m[t+1](d,e);else if(d)u=m[t+1](d);else u=m[t+1]()}}m[f]=1;if(u)r=1}}return r};s.m_ll=function(){var s=this,g=s.m_dl,i,o;if(g)for(i=0;i<g.length;i++){o=g[i];if(o)s.loadModule(o.n,o.u,o.d,o"
        +".l,o.e,1);g[i]=0}};s.loadModule=function(n,u,d,l,e,ln){var s=this,m=0,i,g,o=0,f1,f2,c=s.h?s.h:s.b,b,tcf;if(n){i=n.indexOf(':');if(i>=0){g=n.substring(i+1);n=n.substring(0,i)}else g=\"m_\"+n;m=s.m_i"
        +"(n)}if((l||(n&&!s.m_a(n,g)))&&u&&s.d&&c&&s.d.createElement){if(d){m._d=1;m._dl=1}if(ln){if(s.ssl)u=s.rep(u,'http:','https:');i='s_s:'+s._in+':'+n+':'+g;b='var s=s_c_il['+s._in+'],o=s.d.getElementBy"
        +"Id(\"'+i+'\");if(s&&o){if(!o.l&&s.wd.'+g+'){o.l=1;if(o.i)clearTimeout(o.i);o.i=0;s.m_a(\"'+n+'\",\"'+g+'\"'+(e?',\"'+e+'\"':'')+')}';f2=b+'o.c++;if(!s.maxDelay)s.maxDelay=250;if(!o.l&&o.c<(s.maxDel"
        +"ay*2)/100)o.i=setTimeout(o.f2,100)}';f1=new Function('e',b+'}');tcf=new Function('s','c','i','u','f1','f2','var e,o=0;try{o=s.d.createElement(\"script\");if(o){o.type=\"text/javascript\";'+(n?'o.id"
        +"=i;o.defer=true;o.onload=o.onreadystatechange=f1;o.f2=f2;o.l=0;':'')+'o.src=u;c.appendChild(o);'+(n?'o.c=0;o.i=setTimeout(f2,100)':'')+'}}catch(e){o=0}return o');o=tcf(s,c,i,u,f1,f2)}else{o=new Obj"
        +"ect;o.n=n+':'+g;o.u=u;o.d=d;o.l=l;o.e=e;g=s.m_dl;if(!g)g=s.m_dl=new Array;i=0;while(i<g.length&&g[i])i++;g[i]=o}}else if(n){m=s.m_i(n);m._e=1}return m};s.voa=function(vo,r){var s=this,l=s.va_g,i,k,"
        +"v,x;for(i=0;i<l.length;i++){k=l[i];v=vo[k];if(v||vo['!'+k]){if(!r&&(k==\"contextData\"||k==\"retrieveLightData\")&&s[k])for(x in s[k])if(!v[x])v[x]=s[k][x];s[k]=v}}};s.vob=function(vo){var s=this,l"
        +"=s.va_g,i,k;for(i=0;i<l.length;i++){k=l[i];vo[k]=s[k];if(!vo[k])vo['!'+k]=1}};s.dlt=new Function('var s=s_c_il['+s._in+'],d=new Date,i,vo,f=0;if(s.dll)for(i=0;i<s.dll.length;i++){vo=s.dll[i];if(vo)"
        +"{if(!s.m_m(\"d\")||d.getTime()-vo._t>=s.maxDelay){s.dll[i]=0;s.t(vo)}else f=1}}if(s.dli)clearTimeout(s.dli);s.dli=0;if(f){if(!s.dli)s.dli=setTimeout(s.dlt,s.maxDelay)}else s.dll=0');s.dl=function(v"
        +"o){var s=this,d=new Date;if(!vo)vo=new Object;s.vob(vo);vo._t=d.getTime();if(!s.dll)s.dll=new Array;s.dll[s.dll.length]=vo;if(!s.maxDelay)s.maxDelay=250;s.dlt()};s.gfid=function(){var s=this,d='012"
        +"3456789ABCDEF',k='s_fid',fid=s.c_r(k),h='',l='',i,j,m=8,n=4,e=new Date,y;if(!fid||fid.indexOf('-')<0){for(i=0;i<16;i++){j=Math.floor(Math.random()*m);h+=d.substring(j,j+1);j=Math.floor(Math.random("
        +")*n);l+=d.substring(j,j+1);m=n=16}fid=h+'-'+l;}y=e.getYear();e.setYear(y+2+(y<1900?1900:0));if(!s.c_w(k,fid,e))fid=0;return fid};s.applyADMS=function(){var s=this,vb=new Object;if(s.wd.ADMS&&!s.vis"
        +"itorID&&!s.admsc){if(!s.adms)s.adms=ADMS.getDefault();if(!s.admsq){s.visitorID=s.adms.getVisitorID(new Function('v','var s=s_c_il['+s._in+'],l=s.admsq,i;if(v==-1)v=0;if(v)s.visitorID=v;s.admsq=0;if"
        +"(l){s.admsc=1;for(i=0;i<l.length;i++)s.t(l[i]);s.admsc=0;}'));if(!s.visitorID)s.admsq=new Array}if(s.admsq){s.vob(vb);vb['!visitorID']=0;s.admsq.push(vb);return 1}else{if(s.visitorID==-1)s.visitorI"
        +"D=0}}return 0};s.track=s.t=function(vo){var s=this,trk=1,tm=new Date,sed=Math&&Math.random?Math.floor(Math.random()*10000000000000):tm.getTime(),sess='s'+Math.floor(tm.getTime()/10800000)%10+sed,y="
        +"tm.getYear(),vt=tm.getDate()+'/'+tm.getMonth()+'/'+(y<1900?y+1900:y)+' '+tm.getHours()+':'+tm.getMinutes()+':'+tm.getSeconds()+' '+tm.getDay()+' '+tm.getTimezoneOffset(),tcf,tfs=s.gtfs(),ta=-1,q=''"
        +",qs='',code='',vb=new Object;if(s.mpc('t',arguments))return;s.gl(s.vl_g);s.uns();s.m_ll();if(!s.td){var tl=tfs.location,a,o,i,x='',c='',v='',p='',bw='',bh='',j='1.0',k=s.c_w('s_cc','true',0)?'Y':'N"
        +"',hp='',ct='',pn=0,ps;if(String&&String.prototype){j='1.1';if(j.match){j='1.2';if(tm.setUTCDate){j='1.3';if(s.isie&&s.ismac&&s.apv>=5)j='1.4';if(pn.toPrecision){j='1.5';a=new Array;if(a.forEach){j="
        +"'1.6';i=0;o=new Object;tcf=new Function('o','var e,i=0;try{i=new Iterator(o)}catch(e){}return i');i=tcf(o);if(i&&i.next){j='1.7';if(a.reduce){j='1.8';if(j.trim){j='1.8.1';if(Date.parse){j='1.8.2';i"
        +"f(Object.create)j='1.8.5'}}}}}}}}}if(s.apv>=4)x=screen.width+'x'+screen.height;if(s.isns||s.isopera){if(s.apv>=3){v=s.n.javaEnabled()?'Y':'N';if(s.apv>=4){c=screen.pixelDepth;bw=s.wd.innerWidth;bh="
        +"s.wd.innerHeight}}s.pl=s.n.plugins}else if(s.isie){if(s.apv>=4){v=s.n.javaEnabled()?'Y':'N';c=screen.colorDepth;if(s.apv>=5){bw=s.d.documentElement.offsetWidth;bh=s.d.documentElement.offsetHeight;i"
        +"f(!s.ismac&&s.b){tcf=new Function('s','tl','var e,hp=0;try{s.b.addBehavior(\"#default#homePage\");hp=s.b.isHomePage(tl)?\"Y\":\"N\"}catch(e){}return hp');hp=tcf(s,tl);tcf=new Function('s','var e,ct"
        +"=0;try{s.b.addBehavior(\"#default#clientCaps\");ct=s.b.connectionType}catch(e){}return ct');ct=tcf(s)}}}else r=''}if(s.pl)while(pn<s.pl.length&&pn<30){ps=s.fl(s.pl[pn].name,100)+';';if(p.indexOf(ps"
        +")<0)p+=ps;pn++}s.resolution=x;s.colorDepth=c;s.javascriptVersion=j;s.javaEnabled=v;s.cookiesEnabled=k;s.browserWidth=bw;s.browserHeight=bh;s.connectionType=ct;s.homepage=hp;s.plugins=p;s.td=1}if(vo"
        +"){s.vob(vb);s.voa(vo)}s.fid=s.gfid();if(s.applyADMS())return '';if((vo&&vo._t)||!s.m_m('d')){if(s.usePlugins)s.doPlugins(s);if(!s.abort){var l=s.wd.location,r=tfs.document.referrer;if(!s.pageURL)s."
        +"pageURL=l.href?l.href:l;if(!s.referrer&&!s._1_referrer){s.referrer=r;s._1_referrer=1}s.m_m('g');if(s.lnk||s.eo){var o=s.eo?s.eo:s.lnk,p=s.pageName,w=1,t=s.ot(o),n=s.oid(o),x=o.s_oidt,h,l,i,oc;if(s."
        +"eo&&o==s.eo){while(o&&!n&&t!='BODY'){o=o.parentElement?o.parentElement:o.parentNode;if(o){t=s.ot(o);n=s.oid(o);x=o.s_oidt}}if(!n||t=='BODY')o='';if(o){oc=o.onclick?''+o.onclick:'';if((oc.indexOf('s"
        +"_gs(')>=0&&oc.indexOf('.s_oc(')<0)||oc.indexOf('.tl(')>=0)o=0}}if(o){if(n)ta=o.target;h=s.oh(o);i=h.indexOf('?');h=s.linkLeaveQueryString||i<0?h:h.substring(0,i);l=s.linkName;t=s.linkType?s.linkTyp"
        +"e.toLowerCase():s.lt(h);if(t&&(h||l)){s.pe='lnk_'+(t=='d'||t=='e'?t:'o');s.pev1=(h?s.ape(h):'');s.pev2=(l?s.ape(l):'')}else trk=0;if(s.trackInlineStats){if(!p){p=s.pageURL;w=0}t=s.ot(o);i=o.sourceI"
        +"ndex;if(o.dataset&&o.dataset.sObjectId){s.wd.s_objectID=o.dataset.sObjectId;}else if(o.getAttribute&&o.getAttribute('data-s-object-id')){s.wd.s_objectID=o.getAttribute('data-s-object-id');}else if("
        +"s.useForcedLinkTracking){s.wd.s_objectID='';oc=o.onclick?''+o.onclick:'';if(oc){var ocb=oc.indexOf('s_objectID'),oce,ocq,ocx;if(ocb>=0){ocb+=10;while(ocb<oc.length&&(\"= \\t\\r\\n\").indexOf(oc.cha"
        +"rAt(ocb))>=0)ocb++;if(ocb<oc.length){oce=ocb;ocq=ocx=0;while(oce<oc.length&&(oc.charAt(oce)!=';'||ocq)){if(ocq){if(oc.charAt(oce)==ocq&&!ocx)ocq=0;else if(oc.charAt(oce)==\"\\\\\")ocx=!ocx;else ocx"
        +"=0;}else{ocq=oc.charAt(oce);if(ocq!='\"'&&ocq!=\"'\")ocq=0}oce++;}oc=oc.substring(ocb,oce);if(oc){o.s_soid=new Function('s','var e;try{s.wd.s_objectID='+oc+'}catch(e){}');o.s_soid(s)}}}}}if(s.gg('o"
        +"bjectID')){n=s.gg('objectID');x=1;i=1}if(p&&n&&t)qs='&pid='+s.ape(s.fl(p,255))+(w?'&pidt='+w:'')+'&oid='+s.ape(s.fl(n,100))+(x?'&oidt='+x:'')+'&ot='+s.ape(t)+(i?'&oi='+i:'')}}else trk=0}if(trk||qs)"
        +"{s.sampled=s.vs(sed);if(trk){if(s.sampled)code=s.mr(sess,(vt?'&t='+s.ape(vt):'')+s.hav()+q+(qs?qs:s.rq()),0,ta);qs='';s.m_m('t');if(s.p_r)s.p_r();s.referrer=s.lightProfileID=s.retrieveLightProfiles"
        +"=s.deleteLightProfiles=''}s.sq(qs)}}}else s.dl(vo);if(vo)s.voa(vb,1);s.abort=0;s.pageURLRest=s.lnk=s.eo=s.linkName=s.linkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';if(s.pg)s.wd.s_lnk=s"
        +".wd.s_eo=s.wd.s_linkName=s.wd.s_linkType='';return code};s.trackLink=s.tl=function(o,t,n,vo,f){var s=this;s.lnk=o;s.linkType=t;s.linkName=n;if(f){s.bct=o;s.bcf=f}s.t(vo)};s.trackLight=function(p,ss"
        +",i,vo){var s=this;s.lightProfileID=p;s.lightStoreForSeconds=ss;s.lightIncrementBy=i;s.t(vo)};s.setTagContainer=function(n){var s=this,l=s.wd.s_c_il,i,t,x,y;s.tcn=n;if(l)for(i=0;i<l.length;i++){t=l["
        +"i];if(t&&t._c=='s_l'&&t.tagContainerName==n){s.voa(t);if(t.lmq)for(i=0;i<t.lmq.length;i++){x=t.lmq[i];y='m_'+x.n;if(!s[y]&&!s[y+'_c']){s[y]=t[y];s[y+'_c']=t[y+'_c']}s.loadModule(x.n,x.u,x.d)}if(t.m"
        +"l)for(x in t.ml)if(s[x]){y=s[x];x=t.ml[x];for(i in x)if(!Object.prototype[i]){if(typeof(x[i])!='function'||(''+x[i]).indexOf('s_c_il')<0)y[i]=x[i]}}if(t.mmq)for(i=0;i<t.mmq.length;i++){x=t.mmq[i];i"
        +"f(s[x.m]){y=s[x.m];if(y[x.f]&&typeof(y[x.f])=='function'){if(x.a)y[x.f].apply(y,x.a);else y[x.f].apply(y)}}}if(t.tq)for(i=0;i<t.tq.length;i++)s.t(t.tq[i]);t.s=s;return}}};s.wd=window;s.ssl=(s.wd.lo"
        +"cation.protocol.toLowerCase().indexOf('https')>=0);s.d=document;s.b=s.d.body;if(s.d.getElementsByTagName){s.h=s.d.getElementsByTagName('HEAD');if(s.h)s.h=s.h[0]}s.n=navigator;s.u=s.n.userAgent;s.ns"
        +"6=s.u.indexOf('Netscape6/');var apn=s.n.appName,v=s.n.appVersion,ie=v.indexOf('MSIE '),o=s.u.indexOf('Opera '),i;if(v.indexOf('Opera')>=0||o>0)apn='Opera';s.isie=(apn=='Microsoft Internet Explorer'"
        +");s.isns=(apn=='Netscape');s.isopera=(apn=='Opera');s.ismac=(s.u.indexOf('Mac')>=0);if(o>0)s.apv=parseFloat(s.u.substring(o+6));else if(ie>0){s.apv=parseInt(i=v.substring(ie+5));if(s.apv>3)s.apv=pa"
        +"rseFloat(i)}else if(s.ns6>0)s.apv=parseFloat(s.u.substring(s.ns6+10));else s.apv=parseFloat(v);s.em=0;if(s.em.toPrecision)s.em=3;else if(String.fromCharCode){i=escape(String.fromCharCode(256)).toUp"
        +"perCase();s.em=(i=='%C4%80'?2:(i=='%U0100'?1:0))}if(s.oun)s.sa(s.oun);s.sa(un);s.vl_l='timestamp,dynamicVariablePrefix,visitorID,fid,vmk,visitorMigrationKey,visitorMigrationServer,visitorMigrationS"
        +"erverSecure,ppu,charSet,visitorNamespace,cookieDomainPeriods,cookieLifetime,pageName,pageURL,referrer,contextData,currencyCode,lightProfileID,lightStoreForSeconds,lightIncrementBy,retrieveLightProf"
        +"iles,deleteLightProfiles,retrieveLightData';s.va_l=s.sp(s.vl_l,',');s.vl_mr=s.vl_m='timestamp,charSet,visitorNamespace,cookieDomainPeriods,cookieLifetime,contextData,lightProfileID,lightStoreForSec"
        +"onds,lightIncrementBy';s.vl_t=s.vl_l+',variableProvider,channel,server,pageType,transactionID,purchaseID,campaign,state,zip,events,events2,products,linkName,linkType';var n;for(n=1;n<=75;n++){s.vl_"
        +"t+=',prop'+n+',eVar'+n;s.vl_m+=',prop'+n+',eVar'+n}for(n=1;n<=5;n++)s.vl_t+=',hier'+n;for(n=1;n<=3;n++)s.vl_t+=',list'+n;s.va_m=s.sp(s.vl_m,',');s.vl_l2=',tnt,pe,pev1,pev2,pev3,resolution,colorDept"
        +"h,javascriptVersion,javaEnabled,cookiesEnabled,browserWidth,browserHeight,connectionType,homepage,pageURLRest,plugins';s.vl_t+=s.vl_l2;s.va_t=s.sp(s.vl_t,',');s.vl_g=s.vl_t+',trackingServer,trackin"
        +"gServerSecure,trackingServerBase,fpCookieDomainPeriods,disableBufferedRequests,mobile,visitorSampling,visitorSamplingGroup,dynamicAccountSelection,dynamicAccountList,dynamicAccountMatch,trackDownlo"
        +"adLinks,trackExternalLinks,trackInlineStats,linkLeaveQueryString,linkDownloadFileTypes,linkExternalFilters,linkInternalFilters,linkTrackVars,linkTrackEvents,linkNames,lnk,eo,lightTrackVars,_1_refer"
        +"rer,un';s.va_g=s.sp(s.vl_g,',');s.pg=pg;s.gl(s.vl_g);s.contextData=new Object;s.retrieveLightData=new Object;if(!ss)s.wds();if(pg){s.wd.s_co=function(o){return o};s.wd.s_gs=function(un){s_gi(un,1,1"
        +").t()};s.wd.s_dc=function(un){s_gi(un,1).t()}}",
    w=window,l=w.s_c_il,n=navigator,u=n.userAgent,v=n.appVersion,e=v.indexOf('MSIE '),m=u.indexOf('Netscape6/'),a,i,j,x,s;if(un){un=un.toLowerCase();if(l)for(j=0;j<2;j++)for(i=0;i<l.length;i++){s=l[i];x=s._c;if((!x||x=='s_c'||(j>0&&x=='s_l'))&&(s.oun==un||(s.fs&&s.sa&&s.fs(s.oun,un)))){if(s.sa)s.sa(un);if(x=='s_c')return s}else s=0}}w.s_an='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    w.s_sp=new Function("x","d","var a=new Array,i=0,j;if(x){if(x.split)a=x.split(d);else if(!d)for(i=0;i<x.length;i++)a[a.length]=x.substring(i,i+1);else while(i>=0){j=x.indexOf(d,i);a[a.length]=x.subst"
        +"ring(i,j<0?x.length:j);i=j;if(i>=0)i+=d.length}}return a");
    w.s_jn=new Function("a","d","var x='',i,j=a.length;if(a&&j>0){x=a[0];if(j>1){if(a.join)x=a.join(d);else for(i=1;i<j;i++)x+=d+a[i]}}return x");
    w.s_rep=new Function("x","o","n","return s_jn(s_sp(x,o),n)");
    w.s_d=new Function("x","var t='`^@$#',l=s_an,l2=new Object,x2,d,b=0,k,i=x.lastIndexOf('~~'),j,v,w;if(i>0){d=x.substring(0,i);x=x.substring(i+2);l=s_sp(l,'');for(i=0;i<62;i++)l2[l[i]]=i;t=s_sp(t,'');d"
        +"=s_sp(d,'~');i=0;while(i<5){v=0;if(x.indexOf(t[i])>=0) {x2=s_sp(x,t[i]);for(j=1;j<x2.length;j++){k=x2[j].substring(0,1);w=t[i]+k;if(k!=' '){v=1;w=d[b+l2[k]]}x2[j]=w+x2[j].substring(1)}}if(v)x=s_jn("
        +"x2,'');else{w=t[i]+' ';if(x.indexOf(w)>=0)x=s_rep(x,w,t[i]);i++;b+=62}}}return x");
    w.s_fe=new Function("c","return s_rep(s_rep(s_rep(c,'\\\\','\\\\\\\\'),'\"','\\\\\"'),\"\\n\",\"\\\\n\")");
    w.s_fa=new Function("f","var s=f.indexOf('(')+1,e=f.indexOf(')'),a='',c;while(s>=0&&s<e){c=f.substring(s,s+1);if(c==',')a+='\",\"';else if((\"\\n\\r\\t \").indexOf(c)<0)a+=c;s++}return a?'\"'+a+'\"':"
        +"a");
    w.s_ft=new Function("c","c+='';var s,e,o,a,d,q,f,h,x;s=c.indexOf('=function(');while(s>=0){s++;d=1;q='';x=0;f=c.substring(s);a=s_fa(f);e=o=c.indexOf('{',s);e++;while(d>0){h=c.substring(e,e+1);if(q){i"
        +"f(h==q&&!x)q='';if(h=='\\\\')x=x?0:1;else x=0}else{if(h=='\"'||h==\"'\")q=h;if(h=='{')d++;if(h=='}')d--}if(d>0)e++}c=c.substring(0,s)+'new Function('+(a?a+',':'')+'\"'+s_fe(c.substring(o+1,e))+'\")"
        +"'+c.substring(e+1);s=c.indexOf('=function(')}return c;");
    c=s_d(c);if(e>0){a=parseInt(i=v.substring(e+5));if(a>3)a=parseFloat(i)}else if(m>0)a=parseFloat(u.substring(m+10));else a=parseFloat(v);if(a<5||v.indexOf('Opera')>=0||u.indexOf('Opera')>=0)c=s_ft(c);if(!s){s=new Object;if(!w.s_c_in){w.s_c_il=new Array;w.s_c_in=0}s._il=w.s_c_il;s._in=w.s_c_in;s._il[s._in]=s;w.s_c_in++;}s._c='s_c';(new Function("s","un","pg","ss",c))(s,un,pg,ss);
        return s
    }
    function s_giqf(){
        var w=window,q=w.s_giq,i,t,s;if(q)for(i=0;i<q.length;i++){t=q[i];s=s_gi(t.oun);s.sa(t.un);s.setTagContainer(t.tagContainerName)}w.s_giq=0;
    }
    s_giqf();


    return {
        getVariable: getVariable,
        setVariable: setVariable,
        setEvent: setEvent,
        setVariableBasedEvents: setVariableBasedEvents,
        setLinkTrackVariable: setLinkTrackVariable,
        setLinkTrackEvent: setLinkTrackEvent,
        trackLink: trackLink,
        trackPage: trackPage,
        addPlugin: addPlugin,
        init: init,
        reset: reset
    };

}(_analytics.config, _analytics.logger));


if (typeof window.define === "function" && window.define.amd) {
    define("core/omniture", ['core/config', 'utils/logger'], function(config, logger) {
        return _analytics.omniture;
    });
};
if (typeof _analytics==='undefined') _analytics={};
if (typeof _analytics.plugins==='undefined') _analytics.plugins={};

_analytics.plugins.mediaModule = (function(omniture, config){

    var m_Media_c="var m=s.m_i('Media');m.cn=function(n){var m=this;return m.s.rep(m.s.rep(m.s.rep(n,\"\\n\",''),\"\\r\",''),'--**--','')};m.open=function(n,l,p,b){var m=this,i=new Object,tm=new Date,a='',"
    +"x;n=m.cn(n);l=parseInt(l);if(!l)l=1;if(n&&p){if(!m.l)m.l=new Object;if(m.l[n])m.close(n);if(b&&b.id)a=b.id;for (x in m.l)if(m.l[x]&&m.l[x].a==a)m.close(m.l[x].n);i.n=n;i.l=l;i.p=m.cn(p);i.a=a;i.t=0"
    +";i.ts=0;i.s=Math.floor(tm.getTime()/1000);i.lx=0;i.lt=i.s;i.lo=0;i.e='';i.to=-1;m.l[n]=i}};m.close=function(n){this.e(n,0,-1)};m.play=function(n,o){var m=this,i;i=m.e(n,1,o);i.m=new Function('var m"
    +"=s_c_il['+m._in+'],i;if(m.l){i=m.l[\"'+m.s.rep(i.n,'\"','\\\\\"')+'\"];if(i){if(i.lx==1)m.e(i.n,3,-1);i.mt=setTimeout(i.m,5000)}}');i.m()};m.stop=function(n,o){this.e(n,2,o)};m.track=function(n){va"
    +"r m=this;if (m.trackWhilePlaying) {m.e(n,4,-1)}};m.e=function(n,x,o){var m=this,i,tm=new Date,ts=Math.floor(tm.getTime()/1000),ti=m.trackSeconds,tp=m.trackMilestones,z=new Array,j,d='--**--',t=1,b,"
    +"v=m.trackVars,e=m.trackEvents,pe='media',pev3,w=new Object,vo=new Object;n=m.cn(n);i=n&&m.l&&m.l[n]?m.l[n]:0;if(i){w.name=n;w.length=i.l;w.playerName=i.p;if(i.to<0)w.event=\"OPEN\";else w.event=(x="
    +"=1?\"PLAY\":(x==2?\"STOP\":(x==3?\"MONITOR\":\"CLOSE\")));w.openTime=new Date();w.openTime.setTime(i.s*1000);if(x>2||(x!=i.lx&&(x!=2||i.lx==1))) {b=\"Media.\"+name;pev3 = m.s.ape(i.n)+d+i.l+d+m.s.a"
    +"pe(i.p)+d;if(x){if(o<0&&i.lt>0){o=(ts-i.lt)+i.lo;o=o<i.l?o:i.l-1}o=Math.floor(o);if(x>=2&&i.lo<o){i.t+=o-i.lo;i.ts+=o-i.lo;}if(x<=2){i.e+=(x==1?'S':'E')+o;i.lx=x;}else if(i.lx!=1)m.e(n,1,o);i.lt=ts"
    +";i.lo=o;pev3+=i.t+d+i.s+d+(m.trackWhilePlaying&&i.to>=0?'L'+i.to:'')+i.e+(x!=2?(m.trackWhilePlaying?'L':'E')+o:'');if(m.trackWhilePlaying){b=0;pe='m_o';if(x!=4){w.offset=o;w.percent=((w.offset+1)/w"
    +".length)*100;w.percent=w.percent>100?100:Math.floor(w.percent);w.timePlayed=i.t;if(m.monitor)m.monitor(m.s,w)}if(i.to<0)pe='m_s';else if(x==4)pe='m_i';else{t=0;v=e='None';ti=ti?parseInt(ti):0;z=tp?"
    +"m.s.sp(tp,','):0;if(ti&&i.ts>=ti)t=1;else if(z){if(o<i.to)i.to=o;else{for(j=0;j<z.length;j++){ti=z[j]?parseInt(z[j]):0;if(ti&&((i.to+1)/i.l<ti/100)&&((o+1)/i.l>=ti/100)){t=1;j=z.length}}}}}}}else{m"
    +".e(n,2,-1);if(m.trackWhilePlaying){w.offset=i.lo;w.percent=((w.offset+1)/w.length)*100;w.percent=w.percent>100?100:Math.floor(w.percent);w.timePlayed=i.t;if(m.monitor)m.monitor(m.s,w)}m.l[n]=0;if(i"
    +".e){pev3+=i.t+d+i.s+d+(m.trackWhilePlaying&&i.to>=0?'L'+i.to:'')+i.e;if(m.trackWhilePlaying){v=e='None';pe='m_o'}else{t=0;m.s.fbr(b)}}else t=0;b=0}if(t){vo.linkTrackVars=v;vo.linkTrackEvents=e;vo.p"
    +"e=pe;vo.pev3=pev3;m.s.t(vo,b);if(m.trackWhilePlaying){i.ts=0;i.to=o;i.e=''}}}}return i};m.ae=function(n,l,p,x,o,b){if(n&&p){var m=this;if(!m.l||!m.l[n])m.open(n,l,p,b);m.e(n,x,o)}};m.a=function(o,t"
    +"){var m=this,i=o.id?o.id:o.name,n=o.name,p=0,v,c,c1,c2,xc=m.s.h,x,e,f1,f2='s_media_'+m._in+'_oc',f3='s_media_'+m._in+'_t',f4='s_media_'+m._in+'_s',f5='s_media_'+m._in+'_l',f6='s_media_'+m._in+'_m',"
    +"f7='s_media_'+m._in+'_c',tcf,w;if(!i){if(!m.c)m.c=0;i='s_media_'+m._in+'_'+m.c;m.c++}if(!o.id)o.id=i;if(!o.name)o.name=n=i;if(!m.ol)m.ol=new Object;if(m.ol[i])return;m.ol[i]=o;if(!xc)xc=m.s.b;tcf=n"
    +"ew Function('o','var e,p=0;try{if(o.versionInfo&&o.currentMedia&&o.controls)p=1}catch(e){p=0}return p');p=tcf(o);if(!p){tcf=new Function('o','var e,p=0,t;try{t=o.GetQuickTimeVersion();if(t)p=2}catc"
    +"h(e){p=0}return p');p=tcf(o);if(!p){tcf=new Function('o','var e,p=0,t;try{t=o.GetVersionInfo();if(t)p=3}catch(e){p=0}return p');p=tcf(o)}}v=\"var m=s_c_il[\"+m._in+\"],o=m.ol['\"+i+\"']\";if(p==1){"
    +"p='Windows Media Player '+o.versionInfo;c1=v+',n,p,l,x=-1,cm,c,mn;if(o){cm=o.currentMedia;c=o.controls;if(cm&&c){mn=cm.name?cm.name:c.URL;l=cm.duration;p=c.currentPosition;n=o.playState;if(n){if(n="
    +"=8)x=0;if(n==3)x=1;if(n==1||n==2||n==4||n==5||n==6)x=2;}';c2='if(x>=0)m.ae(mn,l,\"'+p+'\",x,x!=2?p:-1,o)}}';c=c1+c2;if(m.s.isie&&xc){x=m.s.d.createElement('script');x.language='jscript';x.type='tex"
    +"t/javascript';x.htmlFor=i;x.event='PlayStateChange(NewState)';x.defer=true;x.text=c;xc.appendChild(x);o[f6]=new Function(c1+'if(n==3){x=3;'+c2+'}setTimeout(o.'+f6+',5000)');o[f6]()}}if(p==2){p='Qui"
    +"ckTime Player '+(o.GetIsQuickTimeRegistered()?'Pro ':'')+o.GetQuickTimeVersion();f1=f2;c=v+',n,x,t,l,p,p2,mn;if(o){mn=o.GetMovieName()?o.GetMovieName():o.GetURL();n=o.GetRate();t=o.GetTimeScale();l"
    +"=o.GetDuration()/t;p=o.GetTime()/t;p2=o.'+f5+';if(n!=o.'+f4+'||p<p2||p-p2>5){x=2;if(n!=0)x=1;else if(p>=l)x=0;if(p<p2||p-p2>5)m.ae(mn,l,\"'+p+'\",2,p2,o);m.ae(mn,l,\"'+p+'\",x,x!=2?p:-1,o)}if(n>0&&"
    +"o.'+f7+'>=10){m.ae(mn,l,\"'+p+'\",3,p,o);o.'+f7+'=0}o.'+f7+'++;o.'+f4+'=n;o.'+f5+'=p;setTimeout(\"'+v+';o.'+f2+'(0,0)\",500)}';o[f1]=new Function('a','b',c);o[f4]=-1;o[f7]=0;o[f1](0,0)}if(p==3){p='"
    +"RealPlayer '+o.GetVersionInfo();f1=n+'_OnPlayStateChange';c1=v+',n,x=-1,l,p,mn;if(o){mn=o.GetTitle()?o.GetTitle():o.GetSource();n=o.GetPlayState();l=o.GetLength()/1000;p=o.GetPosition()/1000;if(n!="
    +"o.'+f4+'){if(n==3)x=1;if(n==0||n==2||n==4||n==5)x=2;if(n==0&&(p>=l||p==0))x=0;if(x>=0)m.ae(mn,l,\"'+p+'\",x,x!=2?p:-1,o)}if(n==3&&(o.'+f7+'>=10||!o.'+f3+')){m.ae(mn,l,\"'+p+'\",3,p,o);o.'+f7+'=0}o."
    +"'+f7+'++;o.'+f4+'=n;';c2='if(o.'+f2+')o.'+f2+'(o,n)}';if(m.s.wd[f1])o[f2]=m.s.wd[f1];m.s.wd[f1]=new Function('a','b',c1+c2);o[f1]=new Function('a','b',c1+'setTimeout(\"'+v+';o.'+f1+'(0,0)\",o.'+f3+"
    +"'?500:5000);'+c2);o[f4]=-1;if(m.s.isie)o[f3]=1;o[f7]=0;o[f1](0,0)}};m.as=new Function('e','var m=s_c_il['+m._in+'],l,n;if(m.autoTrack&&m.s.d.getElementsByTagName){l=m.s.d.getElementsByTagName(m.s.i"
    +"sie?\"OBJECT\":\"EMBED\");if(l)for(n=0;n<l.length;n++)m.a(l[n]);}');if(s.wd.attachEvent)s.wd.attachEvent('onload',m.as);else if(s.wd.addEventListener)s.wd.addEventListener('load',m.as,false)";


    function setVars(){
        s.m_i("Media");
        omniture.setVariable('Media', {
            autoTrack:false,
            trackWhilePlaying:true,
            trackVars:"None",
            trackEvents : "None"}
        );
        s.loadModule("Media");
    }

    function load(){

        omniture.setVariable('videoTitle', config.videoTitle);
        s.m_Media_c = m_Media_c;

        setVars();
    }

    return {
        load: load
    };

}(_analytics.omniture, _analytics.config));

if (typeof window.define === "function" && window.define.amd) {
    define("plugins/media-module", ['core/omniture', 'core/config'], function(omniture, config) {
        return _analytics.plugins.mediaModule;
    });
};
if (typeof _analytics==='undefined') _analytics={};
if (typeof _analytics.plugins==='undefined') _analytics.plugins={};

_analytics.plugins.testAndTarget = (function(omniture, config){
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

}(_analytics.omniture, _analytics.config));

if (typeof window.define === "function" && window.define.amd) {
    define("plugins/test-and-target", ['core/omniture', 'core/config'], function(omniture, config) {
        return _analytics.plugins.testAndTarget;
    });
};
if (typeof _analytics==='undefined') _analytics={};
if (typeof _analytics.plugins==='undefined') _analytics.plugins={};

_analytics.plugins.utils = (function(omniture, config){
    /** Plugin Utility: Replace v1.0 */
    var repl=new Function("x","o","n","var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x.substring(0,i)+n+x.substring(i+o.length);i=x.indexOf(o,i+l)}return x");
    /** Utility Function: split v1.5 (JS 1.0 compatible) */
    var split=new Function("l","d","var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x++]=l.substring(0,i);l=l.substring(i+d.length);}return a");

    var c_r = new Function("k", "" + "var s=this,d=new Date,v=s.c_rr(k),c=s.c_rr('s_pers'),i,m,e;if(v)ret" + "urn v;k=s.ape(k);i=c.indexOf(' '+k+'=');c=i<0?s.c_rr('s_sess'):c;i=" + "c.indexOf(' '+k+'=');m=i<0?i:c.indexOf('|',i);e=i<0?i:c.indexOf(';'" + ",i);m=m>0?m:e;v=i<0?'':s.epa(c.substring(i+2+k.length,m<0?c.length:" + "m));if(m>0&&m!=e)if(parseInt(c.substring(m+1,e<0?c.length:e))<d.get" + "Time()){d.setTime(d.getTime()-60000);s.c_w(s.epa(k),'',d);v='';}ret" + "urn v;");
    var c_w = new Function("k", "v", "e", "" + "var s=this,d=new Date,ht=0,pn='s_pers',sn='s_sess',pc=0,sc=0,pv,sv,c,i,t;d.setTime(d.getTime()-60000);if(s.c_rr(k)) s.c_wr(k,'',d);k=s" + ".ape(k);pv=s.c_rr(pn);i=pv.indexOf(' '+k+'=');if(i>-1){pv=pv.substr" + "ing(0,i)+pv.substring(pv.indexOf(';',i)+1);pc=1;}sv=s.c_rr(sn);i=sv" + ".indexOf(' '+k+'=');if(i>-1){sv=sv.substring(0,i)+sv.substring(sv.i" + "ndexOf(';',i)+1);sc=1;}d=new Date;if(e){if(e.getTime()>d.getTime())" + "{pv+=' '+k+'='+s.ape(v)+'|'+e.getTime()+';';pc=1;}}else{sv+=' '+k+'" + "='+s.ape(v)+';';sc=1;}if(sc) s.c_wr(sn,sv,0);if(pc){t=pv;while(t&&t" + ".indexOf(';')!=-1){var t1=parseInt(t.substring(t.indexOf('|')+1,t.i" + "ndexOf(';')));t=t.substring(t.indexOf(';')+1);ht=ht<t1?t1:ht;}d.set" + "Time(ht);s.c_wr(pn,pv,d);}return v==s.c_r(s.epa(k));");
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

        omniture.addPlugin('c_rr', s.c_r);
        omniture.addPlugin('c_wr', s.c_w);
        omniture.addPlugin('c_r',  c_r);
        omniture.addPlugin('c_w',  c_w);
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
};
if (typeof _analytics==='undefined') _analytics={};
if (typeof _analytics.plugins==='undefined') _analytics.plugins={};

_analytics.plugins.channelManager = (function(omniture, config, utils){

    var persistant, session,
        persistantCookies = utils.getCookie('s_pers'),
        sessionCookies = utils.getCookie('s_sess'),
        setVariable = omniture.setVariable,
        getVariable = omniture.getVariable;

    function removePlus(string){
        return unescape(string.replace(/\+/g,'%20').toLowerCase());
    }

    /*
     * channelManager v2.2 - Tracking External Traffic
     */
    var channelManager=new Function("a","b","c","V",""
        +"var s=this,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,t,u,v,w,x,y,z,A,B,C,D,E,F,"
        +"G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,W,X,Y;g=s.referrer?s.referrer:documen"
        +"t.referrer;g=g.toLowerCase();if(!g){h='1'}i=g.indexOf('?')>-1?g.ind"
        +"exOf('?'):g.length;j=g.substring(0,i);k=s.linkInternalFilters.toLow"
        +"erCase();k=s.split(k,',');l=k.length;for(m=0;m<l;m++){n=j.indexOf(k"
        +"[m])==-1?'':g;if(n)o=n}if(!o&&!h){p=g;q=g.indexOf('//')>-1?g.indexO"
        +"f('//')+2:0;r=g.indexOf('/',q)>-1?g.indexOf('/',q):i;t=g.substring("
        +"q,r);t=t.toLowerCase();u=t;P='Referrers';v=s.seList+'>'+s._extraSea"
        +"rchEngines;if(V=='1'){j=s.repl(j,'oogle','%');j=s.repl(j,'ahoo','^'"
        +");j=s.repl(j,'as_q','*');}A=s.split(v,'>');B=A.length;for(C=0;C<B;C"
        +"++){D=A[C];D=s.split(D,'|');E=s.split(D[0],',');F=E.length;for(G=0;"
        +"G<F;G++){H=j.indexOf(E[G]);if(H>-1){I=s.split(D[1],',');J=I.length;"
        +"for(K=0;K<J;K++){L=s.getQueryParam(I[K],'',removePlus(g));"
        +"if(L){L=L.toLowerCase();M=L;if(D[2]){u=D[2];N=D[2]}else{N=t}"
        +"if(V=='1'){N=s.repl(N,'#',' - ');N=s.repl(N,'*','as_q');N=s.repl(N,'^'"
        +",'ahoo');N=s.repl(N,'%','oogle');}}}}}}}O=s.getQueryParam(a,b);if(O){u"
        +"=O;if(M){P='Paid Search'}else{P='Paid Non-Search';}}if(!O&&M){u=N;P='N"
        +"atural Search'}f=s._channelDomain;if(f){k=s.split(f,'>');l=k.length;fo"
        +"r(m=0;m<l;m++){Q=s.split(k[m],'|');R=s.split(Q[1],',');S=R.length;for("
        +"T=0;T<S;T++){W=j.indexOf(R[T]);if(W>-1)P=Q[0]}}}d=s._channelParameter;"
        +"if(d){k=s.split(d,'>');l=k.length;for(m=0;m<l;m++){Q=s.split(k[m],'|')"
        +";R=s.split(Q[1],',');S=R.length;for(T=0;T<S;T++){U=s.getQueryParam(R[T]"
        +");if(U)P=Q[0]}}}e=s._channelPattern;if(e){k=s.split(e,'>');l=k.length;"
        +"for(m=0;m<l;m++){Q=s.split(k[m],'|');R=s.split(Q[1],',');S=R.length"
        +";for(T=0;T<S;T++){X=O.indexOf(R[T]);if(X==0)P=Q[0]}}}if(h=='1'&&!O)"
        +"{u=P=t=p='Direct Load'}T=M+u+t;U=c?'c':'c_m';if(c!='0'){T=s.getValO"
        +"nce(T,U,0);}if(T)M=M?M:'n/a';s._referrer=T&&p?p:'';s._referringDoma"
        +"in=T&&t?t:'';s._partner=T&&N?N:'';s._campaignID=T&&O?O:'';s._campai"
        +"gn=T&&u?u:'';s._keywords=T&&M?M:'';s._channel=T&&P?P:'';");

    var seList="altavista.co,altavista.de|q,r|AltaVista>.aol.,suche.aolsvc"
        +".de|q,query|AOL>ask.jp,ask.co|q,ask|Ask>www.baidu.com|wd|Baidu>daum"
        +".net,search.daum.net|q|Daum>google.,googlesyndication.com|q,as_q|Go"
        +"ogle>icqit.com|q|icq>bing.com|q|Microsoft Bing>myway.com|searchfor|"
        +"MyWay.com>naver.com,search.naver.com|query|Naver>netscape.com|query"
        +",search|Netscape Search>reference.com|q|Reference.com>seznam|w|Sezn"
        +"am.cz>abcsok.no|q|Startsiden>tiscali.it,www.tiscali.co.uk|key,query"
        +"|Tiscali>virgilio.it|qs|Virgilio>yahoo.com,yahoo.co.jp|p,va|Yahoo!>"
        +"yandex|text|Yandex.ru>search.cnn.com|query|CNN Web Search>search.ea"
        +"rthlink.net|q|Earthlink Search>search.comcast.net|q|Comcast Search>"
        +"search.rr.com|qs|RoadRunner Search>optimum.net|q|Optimum Search";


    function readCookies(){
        var cookie, x;
        persistant = {
            cookies : unescape(persistantCookies).split(";"),
            cmp_cookie: utils.getCookie("cmp_cookie")
        };
        session = {
            cookies: unescape(sessionCookies).split(";"),
            cmp_cookie_session : utils.getCookie("cmp_cookie_session"),
            cmp_cookie : utils.getCookie("cmp_cookie"),
            irct : utils.getCookie("irct")
        };

        for(x=0;x<session.cookies.length;x++){
            cookie = session.cookies[x].split("=");
            session[cookie[0].trim()] = (cookie[1]) ? cookie[1].trim() : "";
        }
        for(x=0;x<persistant.cookies.length;x++){
            cookie = persistant.cookies[x].split("=");
            persistant[cookie[0].trim()] = (cookie[1]) ? cookie[1].trim() : "";
        }
    }

    function setInsightTracking(){
        var insight_tracking = s.getQueryParam('irct').toLowerCase();
        if (insight_tracking && insight_tracking !== session.irct) {
            setVariable('insightCampaign', s.getValOnce(insight_tracking, 'irct', 0));
        }
    }


    function setCheetah(){ //todo: check with andrew to delete after 1-1-14.
        if (s.getQueryParam('om_mid').length < 0) { return; }

        var campaignID = "cht-" + s.getQueryParam('om_mid');
        if(getVariable('fullCampaign')){
            campaignID  =+ ":links__" + getVariable('fullCampaign').replace("emc-","");
        }
        setVariable('fullCampaign',campaignID);
    }

    function setPartnerAndKeyWords(){
        var keyword = getVariable('_keywords').toLowerCase(),
            partner = getVariable('_partner').toLowerCase(),
            chan = getVariable('_channel').toLowerCase(),
            ref = getVariable('_referringDomain').toLowerCase(),
            campaignID = getVariable('_campaignID').toLowerCase();

        setVariable('fullCampaign',campaignID);

        if (campaignID.indexOf('knc-') === 0) {//knc = paid search
            campaignID += (campaignID.substr(-1, 1) === "-")? '' : '-';
            setVariable('fullCampaign',campaignID + partner + ":" + keyword);
            setVariable('searchEngine',partner);
            setVariable('externalSearchTerm',keyword);
        } else if(chan == "natural search"){
            setVariable('fullCampaign',"okc-natural search");
            setVariable('searchEngine',partner);
            setVariable('externalSearchTerm',keyword);
        } else if (chan=="direct load"){
            setVariable('fullCampaign',"direct load");
        } else if(utils.referredByGoogle()){
            setVariable('fullCampaign',"okc-secured natural search");
            setVariable('searchEngine',"google");
            setVariable('externalSearchTerm',"secured search term");
        } else if (ref) {
            setVariable('fullCampaign',"oth-" + ref);
        }
    }

    function setupCampaignCookies(){
        var campaignID = omniture.getVariable('fullCampaign') || '';
        if(!campaignID || campaignID.indexOf('ilc-') === 0){ return; }
        var hasSessionCookie =  (session.cmp_cookie_session && session.cmp_cookie_session !== "undefined/undefined"),
            hasPersistantCookie =  (persistant.cmp_cookie && persistant.cmp_cookie !== "undefined/undefined"),
            directLoadOrOther = (campaignID=="direct load" || campaignID.indexOf("oth-") === 0 );


        if(directLoadOrOther && hasSessionCookie){
            omniture.setVariable('fullCampaign','');
        }
        if(!hasSessionCookie){
            omniture.setVariable('sessionCampaign',s.getValOnce(omniture.getVariable('sessionCampaign'), 'cmp_cookie_session', 0));
        }
        if(!hasPersistantCookie){
            omniture.setVariable('campaign',s.getValOnce(omniture.getVariable('sessionCampaign'), 'cmp_cookie', 30));
        }
    }


    function load(){
        readCookies();

        s.linkInternalFilters = config.linkInternalFilters;
        s.seList = seList;
        omniture.addPlugin('channelManager', channelManager);
        s.channelManager('attr,dcmp','','s_campaign','0');

        setPartnerAndKeyWords();
        setInsightTracking();
        setCheetah();
        setupCampaignCookies();
    }

    return {
        load: load,
        setPartnerAndKeyWords: setPartnerAndKeyWords, //returned for tests
        setupCampaignCookies: setupCampaignCookies //returned for tests
    };

}(_analytics.omniture, _analytics.config, _analytics.plugins.utils));

if (typeof window.define === "function" && window.define.amd) {
    define("plugins/channel-manager", ['core/omniture', 'core/config', 'plugins/utils'], function(omniture, config) {
        return _analytics.plugins.channelManager;
    });
};
if (typeof _analytics==='undefined') _analytics={};
if (typeof _analytics.plugins==='undefined') _analytics.plugins={};

_analytics.plugins.newOrRepeatVisits = (function(omniture, config){

    var getVisitNum = new Function("var s=this,e=new Date(),cval,cvisit,ct=e.getTime(),c='s_vnum',c2='s_invisit';e.setTime(ct+30*24*60*60*1000);cval=s.c_r(c);if(cval){var i=cval.indexOf('&vn='),str=cval.substring(i+4,cval.length),k;}cvisit=s.c_r(c2);if(cvisit){if(str){e.setTime(ct+30*60*1000);s.c_w(c2,'true',e);return str;}else return 'unknown visit number';}else{if(str){str++;k=cval.substring(0,i);e.setTime(k);s.c_w(c,k+'&vn='+str,e);e.setTime(ct+30*60*1000);s.c_w(c2,'true',e);return str;}else{s.c_w(c,ct+30*24*60*60*1000+'&vn=1',e);e.setTime(ct+30*60*1000);s.c_w(c2,'true',e);return 1;}}");

    /*
    * Plugin: getNewRepeat 1.2 - Returns whether user is new or repeat
    */
    var getNewRepeat = function(d,cn){
        var s=this,e=new Date(),cval,sval,ct=e.getTime();
        d=d?d:30;cn=cn?cn:'s_nr';
        e.setTime(ct+d*24*60*60*1000);cval=s.c_r(cn);
        if(cval.length==0){
            s.c_w(cn,ct+'-New',e);
            return'New';
        }
        sval=cval.split('-');
        if(ct-sval[0]<30*60*1000&&sval[1]=='New'){
            s.c_w(cn,ct+'-New',e);
            return 'New';
        }else{
            s.c_w(cn,ct+'-Repeat',e);
            return'Repeat';
        }
    };

    function setVars(){
        var newRepeat = omniture.setVariable('newRepeat',s.getNewRepeat(30, "s_getNewRepeat"));
        if(newRepeat == "Repeat"){
            omniture.setEvent('repeatVisit');
        }
        omniture.setVariable('visitNum',s.getVisitNum());
    }

    function load(){

        omniture.addPlugin('getNewRepeat', getNewRepeat);
        omniture.addPlugin('getVisitNum', getVisitNum);

        setVars();
    }

    return {
        load: load
    };

}(_analytics.omniture, _analytics.config));

if (typeof window.define === "function" && window.define.amd) {
    define("plugins/new-or-repeat-visits", ['core/omniture', 'core/config'], function(omniture, config) {
        return _analytics.plugins.newOrRepeatVisits;
    });
};
if (typeof _analytics==='undefined') _analytics={};
if (typeof _analytics.plugins==='undefined') _analytics.plugins={};

_analytics.plugins.userHistory = (function(omniture, config){

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
        omniture.setVariable('loginStatus', (cookies.skySSO) ? loggedIn : notLoggedIn);
        if (cookies.skySSO && cookies.skySSOLast != cookies.skySSO) {
            s.c_w('skySSOLast', cookies.skySSO);
            var fl = cookies.skyLoginFrom ? cookies.skyLoginFrom.split(',') : ['generic','l'];
            var loginType = (fl[1] == 'l') ? 'loginComplete' : 'regComplete';
            omniture.setEvent(loginType);
        }
        if (cookies.just){ omniture.setVariable('samId',cookies.just); }
        if (cookies.apd) { omniture.setVariable('ageGender',cookies.apd + '|' + cookies.gpd); }
        if (cookies.custype){ omniture.setVariable('customerType', cookies.custype); }
        if (cookies.ust) { omniture.setVariable('optIn', cookies.ust + '|' + cookies.sid_tsaoptin); }

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

}(_analytics.omniture, _analytics.config));

if (typeof window.define === "function" && window.define.amd) {
    define("plugins/user-history", ['core/omniture', 'core/config'], function(omniture, config) {
        return _analytics.plugins.userHistory;
    });
}


;
if (typeof _analytics==='undefined') _analytics={};
_analytics.pageView = (function(config,omniture,mediaModule,testAndTarget,channelManager,newOrRepeatVisits,userHistory,utils){

    var pluginsLoaded = false,
        setVariable = omniture.setVariable,
        setEvent = omniture.setEvent;

    function setPageDescriptions(){
        var siteName = setVariable('siteName','sky/portal/' + config.site),
            pageName = setVariable('pageName', siteName + "/" + config.page);
        setVariable('refDomain', (document.referrer) ? document.referrer.split('/')[2] : '');
        setVariable('pageURL','D=referrer');//todo: andrew, delete? i dont see s.referer beingset
        setVariable('contentType',config.contentType);
        setVariable('url',config.url);
        setVariable('contentId',config.contentId);
        setVariable('section','sky/portal/' + config.site);
        setVariable('section0', siteName + '/' +  config.section.split('/').slice(0,1).join('/'));
        setVariable('section1', siteName + '/' +  config.section.split('/').slice(0,2).join('/'));
        setVariable('section2', siteName + '/' +  config.section.split('/').slice(0,3).join('/'));
        setVariable('pageConversion', config.site + "/" + config.page);
        setVariable('headline', config.headline);

        if (config.headline) {
            setVariable('fullPageDescription', (config.site + '/' + config.section+ '/' + config.headline).substring(0,255));
        } else{
            setVariable('fullPageDescription', pageName.substring(0,255));
        }
    }


    function track() {
            var name;

            setEvent('pageLoad');

            setPageDescriptions();

            for (name in config.loadVariables){
                setVariable(name, config.loadVariables[name]);
                omniture.setVariableBasedEvents(name);
            }
            for (name in config.loadEvents){
                setEvent(config.loadEvents[name]);
            }
            for (name in config) {
                setVariable(name, config[name]);
            }

            loadPlugins();
            omniture.trackPage();
            omniture.reset();
        }

    function loadPlugins() {//  todo: double check ordering. which ones are pge view plugins and which are setup?
            if(pluginsLoaded){ return; }

            utils.load(); //must go first - user history needs it to set a campaign evar
            channelManager.load(); //must go second - user history needs it to set a campaign evar
            userHistory.load();
            testAndTarget.load();
            mediaModule.load();
            newOrRepeatVisits.load();

            pluginsLoaded = true;
    }

    return {
        track: track
    };

}(  _analytics.config,
    _analytics.omniture,
    _analytics.plugins.mediaModule,
    _analytics.plugins.testAndTarget,
    _analytics.plugins.channelManager,
    _analytics.plugins.newOrRepeatVisits,
    _analytics.plugins.userHistory,
    _analytics.plugins.utils
));

if (typeof window.define === "function" && window.define.amd) {//just for require
    define("core/page-view", [
        'core/config',
        'core/omniture',
        'plugins/media-module',
        'plugins/test-and-target',
        'plugins/channel-manager',
        'plugins/new-or-repeat-visits',
        'plugins/user-history',
        'plugins/utils'
    ], function(config, omniture, mediaModule, testAndTarget, channelManager, newOrRepeatVisits, userHistory, utils) {
        return _analytics.pageView;
    });
};
if (typeof _analytics==='undefined') _analytics={};
_analytics.linkClick = (function(config, omniture){

    function bindEvents(selector, evnt) {
        if(!config.trackLinks){return;}
        var clickSelector = selector || 'input[type=submit]:not([data-tracking=false]), button:not([data-tracking=false]), a:not([data-tracking=false]), [data-tracking]:not([data-tracking=false])';
        evnt = evnt || 'click';
        $(document).on(evnt, clickSelector, function(e) {
            track(e);
        });
        $(document).on('analytics-track','*', function(e) {
            e.stopPropagation();
            track(e);
        });
    }

    function track(e){
        var $el = $(e.currentTarget),
            context;

        addEvent('linkClick');
        addVariable('events');
        addVariable('linkDetails', getProperties($el));
        addVariable('refDomain', (document.referrer) ? document.referrer.split('/')[2] : '');
        addVariable('url', window.location.href.split('?')[0]);
        addCustomClickVariable($el);
        addCustomClickEvents($el);

        if ($el.attr('data-tracking-search')){
            context = $el.attr('data-tracking-context') || getText($('#' + $el.attr('data-tracking-context-id')));
            addVariable('searchType', $el.attr('data-tracking-search'));
            addVariable('searchTerm', context);
            addEvent('search');
        }
        omniture.trackLink(this);
        omniture.reset();
    }


    function getProperties($el){
        var textClicked = getText($el),
            context = $el.attr('data-tracking-context') || getText($('#' + $el.attr('data-tracking-context-id'))),
            theme =  $el.attr('data-tracking-theme') || checkParentForAttribute($el[0],'data-tracking-theme'),
            other = checkParentForAttribute($el[0],'data-tracking-other'),
            pod =  checkParentForAttribute($el[0],'data-tracking-pod'),
            module = checkParentForAttribute($el[0],'data-tracking-module');

        var linkDetails = [
            safeString(module),
            safeString(pod),
            safeString(other),
            safeString(context),
            safeString(theme),
            safeString(textClicked),
            safeString(omniture.getVariable('pageName').replace(/sky\/portal\//g, ''))
        ];

        return linkDetails.join('|');
    }


    function addCustomClickEvents($el){
        var customEvent = $el.attr('data-tracking-event');
        if (!customEvent) return;
        addEvent(customEvent);
    }

    function addCustomClickVariable($el){
        var customVariable = $el.attr('data-tracking-variable');
        if (!customVariable) return;
        addVariable(customVariable,getText($el));
    }

    function addVariable(variable, val){
        omniture.setVariable(variable, val);
        omniture.setLinkTrackVariable(variable);
    }

    function addEvent(event){
        omniture.setEvent(event);
        omniture.setLinkTrackEvent(event);
    }


    function safeString(str){
        if (typeof str === 'undefined') { return ''; }
        return str.trim().replace(/ /g,'-').replace(/[&,\+,:|]/g,'').toLowerCase();
    }

    function checkParentForAttribute(el, attr){//    not using jQuery.parents([data-tracking-whatever]) as is slow in ie and ff
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
        bind: bindEvents,
        track: track
    };

}(_analytics.config, _analytics.omniture));

if (typeof window.define === "function" && window.define.amd) {
    define("core/link-click", ["core/config","core/page-view"], function() {
        return _analytics.linkClick;
    });
};
if (typeof _analytics==='undefined') _analytics={};
_analytics.setup = (function(polyfill, config, omniture, linkClick, pageView, logger){
//todo: write omniture.send method
//todo: write page to test require
//todo: test val vs attr value and the rest of getText | + all things logged
//todo: test for live binding
//    todo: check referrer is working
//    todo: check     Similar CTA's, different actions is working
//    todo: check     search event is working
//    todo: test     customVarPageView
//    todo: test     click link, then click ajax button - shouldn't see previous linkDetails

    var mandatory = ['site', 'section', 'account', 'page'];

    function setup(customConfig){
        $.extend(config, customConfig);
        omniture.init(customConfig.account);

        checkMandatoryConfig();
        setupCustomEventsAndVariables('Events');
        setupCustomEventsAndVariables('Variables');
        linkClick.bind();

        return config;
    }

    function reset(customConfig){
        config.loadVariables={};
        config.loadEvents=[];
        if (customConfig){
            setup(customConfig);
        }
        return config;
    }

    function checkMandatoryConfig(){
        for (var name in mandatory){
            if (!config[mandatory[name]]){
                console.error('Mandatory config is missing: ', mandatory[name]);
            }
        }
    }

    function setupCustomEventsAndVariables(type){
        var arr = config['custom' + type],
            i = 0,
            len, item;
        if (!arr) { return; }
        len = arr.length;
        for(i;i<len;i++){
            item = normaliseItem(arr[i]);
            if (type=='Variables') {
                setupCustomVariable(item);
            } else if (type=='Events') {
                setupCustomEvents(item);
            }
        }
    }

    function addToVariableMap(varName, propValue, eVarValue){
        var arrValues = [],
            prop;
        if (propValue){
            prop = 'prop' + propValue;
            arrValues.push(prop);
        }
        if (eVarValue){
            prop = 'eVar' + eVarValue;
            arrValues.push(prop);
        }
        config.variablesMap[varName] = arrValues;
    }

    function addToEventMap(eventName, eventID){
        config.eventsMap[eventName] = 'event' + eventID;
    }

    function setupCustomVariable(item) {
        addToVariableMap(item.name, item.prop, item.eVar);
        if (item.onPageLoad) {
            config.loadVariables[item.name] = item.value;
        }
    }

    function setupCustomEvents(item) {
        addToEventMap(item.name, item.event);
        if (item.onPageLoad) {
            config.loadEvents.push(item.name);
        }
    }

    function normaliseItem(item){
        var properties, name;
        for (name in item) {
            if(item.hasOwnProperty(name)) {
                properties = item[name];
            }
        }
        return {
            value: properties.value,
            onPageLoad: properties.onPageLoad,
            event: properties.event,
            eVar: properties.eVar,
            prop: properties.prop,
            name: name
        };
    }

    window.analytics = {
        linkClick : linkClick.track,
        pageView: function(customConfig){
            var page = reset(customConfig);
            pageView.track( page );
        },
        setup: setup,
        debug: logger.debug
    };
    return analytics;


}(  _analytics.polyfill,
    _analytics.config,
    _analytics.omniture,
    _analytics.linkClick,
    _analytics.pageView,
    _analytics.logger
));

//just for require
if (typeof window.define === "function" && window.define.amd) {
    define("analytics", [
        'utils/polyfill',
        'core/config',
        'core/omniture',
        'core/link-click',
        'core/page-view',
        'utils/logger'
    ], function(polyfill, config, omniture, linkClick, pageView, logger) {
        return _analytics.setup;
    });
};