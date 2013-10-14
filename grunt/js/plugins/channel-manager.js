if (typeof toolkit==='undefined') toolkit={};
if (typeof toolkit.omniture==='undefined') toolkit.omniture={};
if (typeof toolkit.omniture.plugins==='undefined') toolkit.omniture.plugins={};

toolkit.omniture.plugins.channelManager = (function(){

    var persistant, session,
        persistantCookies = getCookie('s_pers'),
        sessionCookies = getCookie('s_sess');

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

    function setInsightTracking(s){
        var insight_tracking = s.getQueryParam('irct').toLowerCase();
        if (insight_tracking && insight_tracking !== session.irct) {
            s.eVar46 = s.getValOnce(insight_tracking, 'irct', 0);
        }
    }

    function setVariables(s){
        s.channel = s.siteName + '/' + s.section;
        if(s._campaignID){
            s._campaignID = s._campaignID.toLowerCase(); //todo: streamline all this toLowerCase jaxx
            s.eVar45=s._campaignID;
        }
    }

    //todo: andrew, why do we care so much about cheetah mail? delet?
    function setCheetah(s){
//        todo: i think remove all below
        if (s.getQueryParam('om_mid').length > 0) {
            var cheetahmail_variable = s.getQueryParam('om_mid');
            if(s._campaignID){
                s._campaignID = "cht-" + cheetahmail_variable + ":links__" + s._campaignID.replace("emc-","");
            }  else{
                s._campaignID = "cht-" + cheetahmail_variable;
            }
        }
    }

    function setPartnerAndKeyWords(s){
        var keyword = (s._keywords) ? s._keywords.toLowerCase() : "",
            partner = (s._partner) ? s._partner.toLowerCase() : "",
            chan = (s._channel) ? s._channel.toLowerCase() : "",
            ref = (s._referringDomain) ? s._referringDomain.toLowerCase() : "";

//todo: test the hell out of all these if statements before refactor!!!!
//todo: remove campaign specific stuff knc?
        if (s._campaignID && s._campaignID.indexOf('knc-') === 0) {
            if(s._campaignID == "knc-"){
                s.eVar45 += partner + ":" + keyword;
            }
            s.eVar3 = partner;
            s.eVar8 = keyword;
        }
        if(chan == "natural search"){
            s.eVar45 = "okc-natural search";
            s.eVar3 = partner;
            s.eVar8 = keyword;
        }
        if (s._campaignID==="" && chan != "natural search") {
            if (chan=="direct load"){
                s.eVar45="direct load";
            }
            else if(chan != "direct load" && ref){
                if(httpsSearch(ref) == "google"){
                    s.eVar45 = "okc-secured natural search";
                    s.eVar3 = "google";
                    s.eVar8 = "secured search term";
                } else {
                    s.eVar45 = "oth-" + ref;
                }
            }
        }
        if(s.eVar3){  s.prop16 = "D=v3"; }
        if(s.eVar8){ s.prop17 = "D=v8"; }
        if(s.prop45){ s.prop45 = "D=v45"; }
    }

//    todo: andrew, ilc still used? delete?
    function setupIlcCampaign(s){
        if(!s._channel && !s._campaignID){ return; }

        if(s.eVar45 && s.eVar45.indexOf('ilc-') !== 0){
            if((s.eVar45=="direct load" || s.eVar45.indexOf("oth-") === 0 ) && session.cmp_cookie_session != "undefined/undefined" &&
                session.cmp_cookie_session != "undefined/undefined" && session.cmp_cookie_session !== ""){
                s.eVar45 = s.prop45 = "";
            }
            if(!session.cmp_cookie_session || session.cmp_cookie_session == "undefined/undefined"){
                session.cmp_cookie_session = s.eVar45;
                s.eVar47 = s.getValOnce(session.cmp_cookie_session, 'cmp_cookie_session', 0);
            }
            if(!persistant.cmp_cookie || persistant.cmp_cookie == "undefined/undefined"){
                persistant.cmp_cookie = s.eVar45;
                s.campaign = s.getValOnce(persistant.cmp_cookie, 'cmp_cookie', 30);
            }
        }
    }



    function load(omniture, config){
        readCookies();

        omniture.seList = seList;
        omniture.channelManager = channelManager;
        omniture.linkInternalFilters = config.defaults.linkInternalFilters;
        omniture.channelManager('attr,dcmp','','s_campaign','0');

        setInsightTracking(omniture);
        setVariables(omniture);
        setCheetah(omniture);
        setPartnerAndKeyWords(omniture);
        setupIlcCampaign(omniture);
    }

    return {
        load: load
    };

}());

if (typeof window.define === "function" && window.define.amd) {
    define("plugins/channel-manager", function() {
        return toolkit.omniture.plugins.channelManager;
    });
}