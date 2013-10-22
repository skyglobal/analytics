if (typeof _analytics==='undefined') _analytics={};
if (typeof _analytics.plugins==='undefined') _analytics.plugins={};

_analytics.plugins.channelManager = (function(omniture, config){

    var persistant, session,
        persistantCookies = getCookie('s_pers'),
        sessionCookies = getCookie('s_sess'),
        setVariable = omniture.setVariable,
        getVariable = omniture.getVariable;

    function removePlus(string){
        return unescape(string.replace(/\+/g,'%20').toLowerCase());
    }


    function httpsSearch(referrer){
        return (referrer.indexOf("www.google.") > -1 && document.referrer.indexOf("q=&") > -1) ? "google" : "na";
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
            cmp_cookie: getCookie("cmp_cookie")
        };
        session = {
            cookies: unescape(sessionCookies).split(";"),
            cmp_cookie_session : getCookie("cmp_cookie_session"),
            cmp_cookie : getCookie("cmp_cookie"),
            irct : getCookie("irct")
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

        if (campaignID.indexOf('knc-') === 0) {//knc = paid search
            var campaignEnd = partner + ":" + keyword;
            if(campaignID !== "knc-"){
                campaignEnd = '-' + campaignEnd;
            }
            setVariable('fullCampaign',getVariable('fullCampaign') + campaignEnd);
            setVariable('searchEngine',partner);
            setVariable('externalSearchTerm',keyword);
        } else if(chan == "natural search"){
            setVariable('fullCampaign',"okc-natural search");
            setVariable('searchEngine',partner);
            setVariable('externalSearchTerm',keyword);
        } else if (chan=="direct load"){
            setVariable('fullCampaign',"direct load");
        } else if(ref && httpsSearch(ref) == "google"){
            setVariable('fullCampaign',"okc-secured natural search");
            setVariable('searchEngine',"google");
            setVariable('externalSearchTerm',"secured search term");
        } else if (ref) {
            setVariable('fullCampaign',"oth-" + ref);
        } else if(campaignID){
            setVariable('fullCampaign',campaignID);
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
        load: load
    };

}(_analytics.omniture, _analytics.config));

if (typeof window.define === "function" && window.define.amd) {
    define("plugins/channel-manager", ['core/omniture', 'core/config'], function(omniture, config) {
        return _analytics.plugins.channelManager;
    });
}