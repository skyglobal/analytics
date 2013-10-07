/* eexp-global-v1.2
 * moving to H26 and forced link tracking - date 07/05/2013 - AJG
 *
 */
if (typeof toolkit==='undefined') toolkit={};
if (typeof toolkit.omniture==='undefined') toolkit.omniture={};
toolkit.omniture = (function(config, utils, h26){

    var pluginsLoaded = false,
        persistantCookies,sessionCookies = "",
        s_objectID = h26.s_objectID,
        s_gi = h26.s_gi,
        s = {};

    if(utils.omnigetCookie("s_pers")){ persistantCookies = utils.omnigetCookie('s_pers'); }
    if(utils.omnigetCookie("s_sess")){ sessionCookies = utils.omnigetCookie('s_sess'); }

    var sky = sky ? sky : {};
    sky.tracking = {
        settings: config.settings,
        trackedDataValues: config.trackedDataValues,
        variables: config.trackedData,
        loadVariables: {},
        events: config.trackedEvents,
        setup: function(options){
            // Initial defaults:
            var prod = [],
                i, j, k, x, name;

            for (var data in sky.tracking.trackedDataValues){
                if (sky.tracking.trackedDataValues[data]) {
                    sky.tracking.trackedDataValues[data] = sky.tracking.trackedDataValues[data].toLowerCase();
                }
            }

            options.siteName = 'sky/portal/' + options.site;
            options.pageName = options.siteName + "/" + options.page;
            options.eVar19 = options.site + "/" + options.page;

    //            set page Description
            if (options.headline) {
                options.eVar55 = (options.site + '/' + options.section+ '/' + options.headline).substring(0,255);
            } else{
                options.eVar55 = options.pageName.substring(0,255);
            }

            options.channel = options.siteName + '/' + options.section;
            //setting section 0,1,2 to the split section value or all the same if only one section
            for (i = 0; i < 3 ; ++i) {
                options['section' + i] = options.siteName + '/' +  options.section.split('/').slice(0,i+1).join('/');
            }

            if (options.searchResults !== undefined ) {
                options.loadEvents.push(sky.tracking.events['searchResults']);
                if (options.searchResults == 0) {
                    options.loadEvents.push(sky.tracking.events['zeroResults']);
                }
            }

            if (options.errors) {
                options.loadEvents.push(sky.tracking.events['error']);
            }


            // Overwrite defaults with passed parameters
            for (name in options) {
                sky.tracking.settings[name] = options[name];
            }
        },

        addVariable :function(prop, val){
            if(!val){ return; }
            var map;
            if (sky.tracking.variables[prop].length==1){
                sky.tracking.loadVariables[sky.tracking.variables[prop][0]] = val;
            } else {
                map = 'D=' + sky.tracking.variables[prop][1].replace('eVar','v').replace('prop','c');
                sky.tracking.loadVariables[sky.tracking.variables[prop][0]] = map;
                sky.tracking.loadVariables[sky.tracking.variables[prop][1]] = val;
            }
        },

        pageView:  function (options) {

            sky.tracking.setup(options);

            var prod = [],
                tempS = s_gi(sky.tracking.settings.account),
                i, j, k, x, name;


            s = s_gi(sky.tracking.settings.account);

            for (name in sky.tracking.loadVariables){
                s[name] = sky.tracking.loadVariables[name];
            }

            if(!pluginsLoaded){
                this.loadPlugins(s);
                pluginsLoaded = true;
            }

            window.s_bskyb = this.s = s;

            // Test and Target
            var tntInput = s.trackTNT();
            s.eVar18 = s.tnt = tntInput;
            if(typeof mboxLoadSCPlugin == "function"){mboxLoadSCPlugin(s);}

            // Load the media module
            this.loadMediaModule(s);
            s.loadModule("Media");
            s.Media.autoTrack=false;
            s.Media.trackWhilePlaying=true;
            s.Media.trackVars="None";
            s.Media.trackEvents="None";
            s.currentYear=new Date().getFullYear();
            // Change below if EU law on DST start/end dates changes
            var d = new Date ( s.currentYear , 2 , 31 );
            s.dstStart = "03/"+(31-d.getDay())+"/"+s.currentYear;
            d = new Date ( s.currentYear , 9 , 31 );
            s.dstEnd = "10/"+(31-d.getDay())+"/"+s.currentYear;
            if (options.LoggedIn === undefined) {
                this.setLoginVars(options);
            }else{
                if (options.LoggedIn === false) {sky.tracking.settings.loginStatus = 'not logged-in';}
                if (options.LoggedIn === true) {sky.tracking.settings.loginStatus = 'logged-in';}
            }
            s.linkInternalFilters = sky.tracking.settings.linkInternalFilters;

            //update channel manager
            s.channelManager('attr,dcmp','','s_campaign','0');
            var camps,chan,part,term,ref,ommid_deeplink,dcmp_deeplink,irct_deeplink,cmp_cookie_value_session,cmp_cookie_value_month,irct_deeplink_cookie,cm_cmp_cookie;
            camps=chan=part=term=ref=ommid_deeplink=dcmp_deeplink=irct_deeplink=cmp_cookie_value_session=cmp_cookie_value_month=irct_deeplink_cookie=cm_cmp_cookie="";
            if(utils.omnigetCookie("cmp_cookie_session")){cmp_cookie_value_session = utils.omnigetCookie("cmp_cookie_session");}
            if(utils.omnigetCookie("cmp_cookie")){cmp_cookie_value_month = utils.omnigetCookie("cmp_cookie");}
            if(utils.omnigetCookie("irct_deeplink_cookie")){irct_deeplink_cookie = utils.omnigetCookie("irct");}
            if(utils.omnigetCookie('cmp_cookie')){cm_cmp_cookie = utils.omnigetCookie('cmp_cookie');}
            if(sessionCookies && sessionCookies !== ""){
                var mycookievalueCM = sessionCookies.split(";");
                for(x=0;x<mycookievalueCM.length;x++){
                    var splitcookieCM = mycookievalueCM[x].split("=");
                    if(splitcookieCM[0] == " cmp_cookie_session"){
                        cmp_cookie_value_session = splitcookieCM[1];
                    }
                    if(splitcookieCM[0] == " irct"){
                        irct_deeplink_cookie = splitcookieCM[1];
                    }
                    if(splitcookieCM[0] == " cmp_cookie"){
                        cm_cmp_cookie = splitcookieCM[1];
                    }
                }
            }
            if(persistantCookies && persistantCookies !== ""){
                var mycookievalueCM2 = persistantCookies.split(";");
                for(x=0;x<mycookievalueCM2.length;x++){
                    var splitcookieCM2 = mycookievalueCM2[x].split("=");
                    if(splitcookieCM2[0] == " cmp_cookie"){
                        cmp_cookie_value_month = splitcookieCM2[1];
                    }
                }
            }

            /*This is used for ajax or deeplinks where we need to remove the irct / dcmp value.  pass the values in
             irct_deeplink and dcmp_deeplink respectively.  we may need to add a ommid_deeplink for cheetahmail*/
            if ('function' == typeof trackDCMPPage){
                trackDCMPPage();
            }
            // Insight tracking
            if (s.getQueryParam('irct').length > 0 || irct_deeplink !== "") {
                var insight_tracking = "";
                if(irct_deeplink){insight_tracking = irct_deeplink;}else{insight_tracking = s.getQueryParam('irct');}
                if (insight_tracking.toLowerCase() != irct_deeplink_cookie) {
                    s.eVar46 = s.getValOnce(insight_tracking.toLowerCase(), 'irct', 0);
                }}
            if(s._campaignID){s._campaignID=s._campaignID.toLowerCase();}
            /*if there is no dcmp value in the url and we have a value in dcmp_deeplink, use dcmp_deeplink
             This must be pased into the campaignID or the function will not work*/
            if(!s._campaignID && dcmp_deeplink) {
                if (dcmp_deeplink.toLowerCase() != cm_cmp_cookie) {
                    s._campaignID = s.getValOnce(dcmp_deeplink, 'cmp_cookie', 0);
                }}
            /*see if this is coming from cheetahmail.  cheetahmail will take precendence over normal emc
             I am prefixing the cheetahmail campaign with cht to show these values in channel stacking and
             distinguish between cheetmail integrated emails from others.*/
            if (s.getQueryParam('om_mid').length > 0 || ommid_deeplink !== "") {
                var cheetahmail_variable = "";
                if(ommid_deeplink){cheetahmail_variable = ommid_deeplink;}else{cheetahmail_variable = s.getQueryParam('om_mid');}
                if(s._campaignID){s._campaignID = "cht-" + cheetahmail_variable + ":links__" + s._campaignID.replace("emc-","");}
                else{s._campaignID = "cht-" + cheetahmail_variable;}
            }
            if(s._campaignID){camps=s._campaignID.toLowerCase();}
            if(s._channel){chan=s._channel.toLowerCase();}
            if(s._keywords){term=s._keywords.toLowerCase();}
            if(s._partner){part = s._partner.toLowerCase();}
            if(s._referringDomain){ref = s._referringDomain.toLowerCase();}
            //ensure there is a value and it is not blank, internal campaign or a search term
            if (camps !== "" && camps.indexOf('knc-') !== 0 && camps.indexOf('okc-') !== 0){
                s.eVar45=camps;
            }
            else if (camps.indexOf('knc-') === 0) {
                if(camps == "knc-"){
                    s.eVar45 = camps + part + ":" + term;
                }
                else{
                    s.eVar45 = camps;
                }
                s.eVar3 = part;
                s.eVar8 = term;
            }
            if(chan == "natural search"){
                s.eVar45 = "okc-natural search";
                s.eVar3 = part;
                s.eVar8 = term;
            }
            //may need to change as it dependent on the sky.com change
            if (s._campaignID==="" && chan != "natural search") {
                if (chan=="direct load"){
                    s.eVar45="direct load";
                }
                else if(chan != "direct load" && ref){
                    var checkNaturalSearch = s.httpsSearch(ref);
                    if(checkNaturalSearch == "na"){
                        s.eVar45 = "oth-" + ref;
                    }else{s.eVar45 = "okc-secured natural search";
                        s.eVar3 = checkNaturalSearch;
                        s.eVar8 = "secured search term";
                    }
                }
            }
            if(s._channel || s._campaignID){
                if(s.eVar45){
                    s.eVar45 = s.eVar45.toLowerCase();
                    s.prop45 = "D=v45";
                }
                if(s.eVar3){
                    s.eVar3 = s.eVar3.toLowerCase();
                    s.prop16 = "D=v3";
                }
                if(s.eVar8){
                    s.eVar8 = s.eVar8.toLowerCase();
                    s.prop17 = "D=v8";
                }
                if(s.eVar45){
                    if(s.eVar45.indexOf('ilc-') !== 0){
                        if((s.eVar45.toLowerCase()=="direct load" || s.eVar45.indexOf("oth-") === 0 ) && cmp_cookie_value_session != "undefined/undefined" &&
                            cmp_cookie_value_session != "undefined/undefined" && cmp_cookie_value_session !== ""){
                            s.eVar45 = s.prop45 = "";
                        }
                        if(!cmp_cookie_value_session || cmp_cookie_value_session == "undefined/undefined"){
                            cmp_cookie_value_session = s.eVar45;
                            s.eVar47 = s.getValOnce(cmp_cookie_value_session, 'cmp_cookie_session', 0);
                        }
                        if(!cmp_cookie_value_month || cmp_cookie_value_month == "undefined/undefined"){
                            cmp_cookie_value_month = s.eVar45;
                            s.campaign = s.getValOnce(cmp_cookie_value_month, 'cmp_cookie', 30);
                        }
                    }
                }
            }
            var omni_current_location = document.location.toString();
            s.getAndPersistValue(omni_current_location.toLowerCase(),'omni_prev_URL',0);
            var c_pastEv = s.clickThruQuality(
                s.eVar47,
                sky.tracking.events['firstPageVisited'],
                sky.tracking.events['secondPageVisited'],
                's_ctq'
            );
            if(c_pastEv) { options.loadEvents.push(c_pastEv); }
            s.eVar17 = s.getFullReferringDomains();



            s.eVar70 = s.getNewRepeat(30, "s_getNewRepeat");
            if(s.eVar70 == "Repeat"){  options.loadEvents.push(sky.tracking.events['repeatVisit']);}//todo: test this
            s.eVar69 = s.getVisitNum();


            if (sky.tracking.settings.setObjectIDs) {
                s.setupDynamicObjectIDs();
            }
            sky.tracking.settings.partTime=s.getTimePartingJH('h','0');
            var refURL=document.referrer;
            if (refURL !== ""){
                var iURL=refURL.indexOf('?')>-1?refURL.indexOf('?'):refURL.length;
                var qURL=refURL.indexOf('//')>-1?refURL.indexOf('//')+2:0;
                var rURL=refURL.indexOf('/',qURL)>-1?refURL.indexOf('/',qURL):iURL;
                sky.tracking.settings.refDomain=refURL.substring(qURL,rURL);
            }

            //if (prod.length) s.products = prod.join(',');
            if (options.loadEvents.length)   s.events = options.loadEvents.join(',');
            for (var variable in options.loadVariables){
                s[variable] = options.loadVariables[variable];
            }
            for (k in sky.tracking.settings) this.setVar ( s , k , sky.tracking.settings[k]);

            //URL length optimisation
            s.pageURL="D=Referer";
            if(s.prop12){    s.eVar31="D=c12";  }
            if(s.prop1){    s.eVar1="D=c1";  }
            if(s.prop16){    s.eVar3="D=c16";  }
            if(s.prop17){    s.eVar8="D=c17";  }
            if(s.prop3){    s.eVar13="D=c3";  }
            if(s.prop2){    s.eVar2="D=c2";  }
            if(s.prop5){    s.eVar5="D=c5";  }
            if(s.prop9){    s.eVar9="D=c9";  }
            if(s.prop36){    s.eVar36="D=c36";  }
            if(s.prop20){    s.eVar20="D=c20";  }
            if(s.prop21){    s.eVar15="D=c21";  }
            if(s.prop23){    s.eVar14="D=c23";  }
            if(s.prop25){    s.eVar26="D=c25";  }
            if(s.prop27){    s.eVar29="D=c27";  }
            if(s.prop31){    s.eVar30="D=c31";  }
            if(s.prop26){    s.eVar28="D=c26";  }
            if(s.channel){ s.eVar24=s.hier1="D=ch";  }
            if(s.prop35){    s.eVar35="D=c35";  }
            if(s.eVar69){s.prop69=s.eVar69;}
            if(s.eVar70){s.prop70 = "D=v70";}
            if(s.eVar55){s.prop55 = "D=v55";}
            if(sky.tracking.settings.track){
                s.t();
            }
        },


        MovieStartManual: function(m_Name,m_Length,m_Player) {
            var s = sky.tracking.s;
            s.Media.open(m_Name,m_Length,m_Player);
            s.Media.play(m_Name,'0');
        },


        MovieEndManual: function(m_Name,m_Pos) {
            var s = sky.tracking.s;
            s.Media.stop(m_Name,m_Pos);
            s.Media.close(m_Name);
        },


        loadCookies: function() {
            var cl = document.cookie.split(';');
            var o = {};
            for (var i=0 ; i<cl.length ; i++) {
                var c = cl[i].split('=');
                //|--- this trims whitespace --------------|
                o[c[0].replace(/^\s*((?:[\S\s]*\S)?)\s*$/, '$1')] = unescape(c[1]);
            }
            return o;
        },
        setVar: function ( s , vname , val ) {
            var vl = this.variables[vname];
            vl = vl ? vl : [vname];
            for (var i = 0 ; i < vl.length ; ++i ){
                s[vl[i]] = val;
            }
        },


        setLoginVars: function ( options ) {
            var c = this.loadCookies();
            if (c.skySSO) {
                sky.tracking.settings.loginStatus = 'logged-in';
                if (c.skySSOLast != c.skySSO) {
                    this.s.c_w ('skySSOLast' , c.skySSO);
                    var fl = c.skyLoginFrom ? c.skyLoginFrom.split(',') : ['generic','l'];
                    options.loadEvents.push ( fl[1] == 'l' ? this.events.loginComplete : this.events.regComplete);
                    sky.tracking.settings._loginFrom = fl[0];
                }
            } else {
                sky.tracking.settings.loginStatus = 'not logged-in';
                //     document.cookie = 'skySSOLast=0; expires=Fri, 02-Jan-1970 00:00:00 GMT';
            }
            if(c.just){ sky.tracking.settings.samId = c.just;}
            if (c.apd) sky.tracking.settings.ageGender = c.apd + '|' + c.gpd;
            if(c.custype){ sky.tracking.settings.customerType = c.custype;}
            if (c.ust) sky.tracking.settings.optIn = c.ust + '|' + c.sid_tsaoptin;
        },


        featuredContentClickManual: function(place,description) {
            var s = sky.tracking.s;
            s.prop15 = String(place)+"|"+String(description) + "|" + s.pageName.replace("sky/portal/","");
            s.eVar7 = "D=c15";
            s.events = sky.tracking.events['linkClick'];
            s.linkTrackVars='prop39,eVar39,prop15,eVar7,events';
            s.linkTrackEvents=sky.tracking.events['linkClick'];
            s.tl(this,'o','Link Click',null,'navigate');
        },

        clickSamePage: function(place,description) {
            var s = sky.tracking.s;
            s.prop15 = String(place)+"|"+String(description) + "|" + s.pageName.replace("sky/portal/","");
            s.eVar7 = "D=c15";
            s.events = sky.tracking.events['linkClick'];
            s.linkTrackVars='prop39,eVar39,prop15,eVar7,events';
            s.linkTrackEvents=sky.tracking.events['linkClick'];
            s.tl(this,'o','Link Click');
        },


        loadPlugins: function(s) {
            /*extra*/
            s.c_rr = s.c_r;
            s.c_r = new Function("k", "" + "var s=this,d=new Date,v=s.c_rr(k),c=s.c_rr('s_pers'),i,m,e;if(v)ret" + "urn v;k=s.ape(k);i=c.indexOf(' '+k+'=');c=i<0?s.c_rr('s_sess'):c;i=" + "c.indexOf(' '+k+'=');m=i<0?i:c.indexOf('|',i);e=i<0?i:c.indexOf(';'" + ",i);m=m>0?m:e;v=i<0?'':s.epa(c.substring(i+2+k.length,m<0?c.length:" + "m));if(m>0&&m!=e)if(parseInt(c.substring(m+1,e<0?c.length:e))<d.get" + "Time()){d.setTime(d.getTime()-60000);s.c_w(s.epa(k),'',d);v='';}ret" + "urn v;");
            s.c_wr = s.c_w;
            s.c_w = new Function("k", "v", "e", "" + "var s=this,d=new Date,ht=0,pn='s_pers',sn='s_sess',pc=0,sc=0,pv,sv," + "c,i,t;d.setTime(d.getTime()-60000);if(s.c_rr(k)) s.c_wr(k,'',d);k=s" + ".ape(k);pv=s.c_rr(pn);i=pv.indexOf(' '+k+'=');if(i>-1){pv=pv.substr" + "ing(0,i)+pv.substring(pv.indexOf(';',i)+1);pc=1;}sv=s.c_rr(sn);i=sv" + ".indexOf(' '+k+'=');if(i>-1){sv=sv.substring(0,i)+sv.substring(sv.i" + "ndexOf(';',i)+1);sc=1;}d=new Date;if(e){if(e.getTime()>d.getTime())" + "{pv+=' '+k+'='+s.ape(v)+'|'+e.getTime()+';';pc=1;}}else{sv+=' '+k+'" + "='+s.ape(v)+';';sc=1;}if(sc) s.c_wr(sn,sv,0);if(pc){t=pv;while(t&&t" + ".indexOf(';')!=-1){var t1=parseInt(t.substring(t.indexOf('|')+1,t.i" + "ndexOf(';')));t=t.substring(t.indexOf(';')+1);ht=ht<t1?t1:ht;}d.set" + "Time(ht);s.c_wr(pn,pv,d);}return v==s.c_r(s.epa(k));");

            s.getValOnce = new Function("v","c","e","" + "var s=this,k=s.c_r(c),a=new Date;e=e?e:0;if(v){a.setTime(a.getTime("+")+e*86400000);s.c_w(c,v,e?a:0);}return v==k?'':v");
            s.clickThruQuality=function(scp,ct_ev,cp_ev,cpc){
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
            s.p_fo=new Function("n","" +"var s=this;if(!s.__fo){s.__fo=new Object;}if(!s.__fo[n]){s.__fo[n]="+"new Object;return 1;}else {return 0;}");
            s.apl = new Function("L", "v", "d", "u", "var s=this,m=0;if(!L)L='';if(u){var i,n,a=s.split(L,d);for(i=0;i<a.length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCase()));}}if(!m)L=L?L+d+v:v;return L");



            /*
             * Plugin: getNewRepeat 1.2 - Returns whether user is new or repeat
             */
            s.getNewRepeat=new Function("d","cn",""+
                "var s=this,e=new Date(),cval,sval,ct=e.getTime();d=d?d:30;cn=cn?cn:"+
                "'s_nr';e.setTime(ct+d*24*60*60*1000);cval=s.c_r(cn);if(cval.length="+
                "=0){s.c_w(cn,ct+'-New',e);return'New';}sval=s.split(cval,'-');if(ct"+
                "-sval[0]<30*60*1000&&sval[1]=='New'){s.c_w(cn,ct+'-New',e);return'N"+
                "ew';}else{s.c_w(cn,ct+'-Repeat',e);return'Repeat';}");




            /*
             * Plugin: getQueryParam 2.3
             */
            s.getQueryParam=new Function("p","d","u",""+
                "var s=this,v='',i,t;d=d?d:'';u=u?u:(s.pageURL?s.pageURL:s.wd.locati"+
                "on);if(u=='f')u=s.gtfs().location;while(p){i=p.indexOf(',');i=i<0?p"+
                ".length:i;t=s.p_gpv(p.substring(0,i),u+'');if(t){t=t.indexOf('#')>-"+
                "1?t.substring(0,t.indexOf('#')):t;}if(t)v+=v?d+t:t;p=p.substring(i="+
                "=p.length?i:i+1)}return v");



            s.p_gpv=new Function("k","u",""+
                "var s=this,v='',i=u.indexOf('?'),q;if(k&&i>-1){q=decodeURIComponent"+
                "(u.substring(i+1));v=s.pt(q,'&','p_gvf',k)}return v");




            s.p_gvf=new Function("t","k",""+
                "if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'T"+
                "rue':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s."+
                "epa(v)}return ''");



            /* DynamicObjectIDs config */
            s.getObjectID = function (o) {
                var ID=o.href;
                return ID;
            }


// DEALS WITH DUPLICATE NAMES ON A SINGLE PAGE
            /*
             * DynamicObjectIDs v1.4: Setup Dynamic Object IDs based on URL
             */
            s.setupDynamicObjectIDs=new Function(""+
                "var s=this;if(!s.doi){s.doi=1;if(s.apv>3&&(!s.isie||!s.ismac||s.apv"+
                ">=5)){if(s.wd.attachEvent)s.wd.attachEvent('onload',s.setOIDs);else"+
                " if(s.wd.addEventListener)s.wd.addEventListener('load',s.setOIDs,fa"+
                "lse);else{s.doiol=s.wd.onload;s.wd.onload=s.setOIDs}}s.wd.s_semapho"+
                "re=1}");



            s.setOIDs=new Function("e",""+
                "var s=s_c_il["+s._in+"],b=s.eh(s.wd,'onload'),o='onclick',x,l,u,c,i"+
                ",a=new Array;if(s.doiol){if(b)s[b]=s.wd[b];s.doiol(e)}if(s.d.links)"+
                "{for(i=0;i<s.d.links.length;i++){l=s.d.links[i];c=l[o]?''+l[o]:'';b"+
                "=s.eh(l,o);z=l[b]?''+l[b]:'';u=s.getObjectID(l);if(u&&c.indexOf('s_"+
                "objectID')<0&&z.indexOf('s_objectID')<0){u=s.repl(u,'\"','');u=s.re"+
                "pl(u,'\\n','').substring(0,97);l.s_oc=l[o];a[u]=a[u]?a[u]+1:1;x='';"+
                "if(c.indexOf('.t(')>=0||c.indexOf('.tl(')>=0||c.indexOf('s_gs(')>=0"+
                ")x='var x=\".tl(\";';x+='s_objectID=\"'+u+'_'+a[u]+'\";return this."+
                "s_oc?this.s_oc(e):true';if(s.isns&&s.apv>=5)l.setAttribute(o,x);l[o"+
                "]=new Function('e',x)}}}s.wd.s_semaphore=0;return true");

//*/



            s.getAndPersistValue=new Function("v","c","e",""+
                "var s=this,a=new Date;e=e?e:0;a.setTime(a.getTime()+e*86400000);if("+
                "v)s.c_w(c,v,e?a:0);return s.c_r(c);");




            s.getFullReferringDomains=new Function(""+
                "var s=this,dr=window.document.referrer,n=s.linkInternalFilters.spli"+
                "t(',');if(dr){var r=dr.split('/')[2],l=n.length;for(i=0;i<=l;i++){i"+
                "f(r.indexOf(n[i])!=-1){r='';i=l+1;}}return r}");




            /*
             * Plugin Utility: Replace v1.0
             */
            s.repl=new Function("x","o","n",""
                +"var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x.substring(0,i)+n+x."
                +"substring(i+o.length);i=x.indexOf(o,i+l)}return x");




            /*
             * Utility Function: split v1.5 (JS 1.0 compatible)
             */
            s.getVisitNum = new Function("var s=this,e=new Date(),cval,cvisit,ct=e.getTime(),c='s_vnum',c2='s_invisit';e.setTime(ct+30*24*60*60*1000);cval=s.c_r(c);if(cval){var i=cval.indexOf('&vn='),str=cval.substring(i+4,cval.length),k;}cvisit=s.c_r(c2);if(cvisit){if(str){e.setTime(ct+30*60*1000);s.c_w(c2,'true',e);return str;}else return 'unknown visit number';}else{if(str){str++;k=cval.substring(0,i);e.setTime(k);s.c_w(c,k+'&vn='+str,e);e.setTime(ct+30*60*1000);s.c_w(c2,'true',e);return str;}else{s.c_w(c,ct+30*24*60*60*1000+'&vn=1',e);e.setTime(ct+30*60*1000);s.c_w(c2,'true',e);return 1;}}");




            s.split=new Function("l","d",""
                +"var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x"
                +"++]=l.substring(0,i);l=l.substring(i+d.length);}return a");




            /*
             * Plugin: getPreviousValue v1.0 - return previous value of designated
             *   variable (requires split utility)
             */
            s.getPreviousValue=new Function("v","c","el",""
                +"var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el"
                +"){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i"
                +"){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)"
                +":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?"
                +"s.c_w(c,v,t):s.c_w(c,'no value',t);return r}");





            /*
             * channelManager v2.2 - Tracking External Traffic
             */
            s.channelManager=new Function("a","b","c","V",""
                +"var s=this,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,t,u,v,w,x,y,z,A,B,C,D,E,F,"
                +"G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,W,X,Y,newg;g=s.referrer?s.referrer:documen"
                +"t.referrer;g=g.toLowerCase();if(!g){h='1'}i=g.indexOf('?')>-1?g.ind"
                +"exOf('?'):g.length;j=g.substring(0,i);k=s.linkInternalFilters.toLow"
                +"erCase();k=s.split(k,',');l=k.length;for(m=0;m<l;m++){n=j.indexOf(k"
                +"[m])==-1?'':g;if(n)o=n}if(!o&&!h){p=g;q=g.indexOf('//')>-1?g.indexO"
                +"f('//')+2:0;r=g.indexOf('/',q)>-1?g.indexOf('/',q):i;t=g.substring("
                +"q,r);t=t.toLowerCase();u=t;P='Referrers';v=s.seList+'>'+s._extraSea"
                +"rchEngines;if(V=='1'){j=s.repl(j,'oogle','%');j=s.repl(j,'ahoo','^'"
                +");j=s.repl(j,'as_q','*');}A=s.split(v,'>');B=A.length;for(C=0;C<B;C"
                +"++){D=A[C];D=s.split(D,'|');E=s.split(D[0],',');F=E.length;for(G=0;"
                +"G<F;G++){H=j.indexOf(E[G]);if(H>-1){I=s.split(D[1],',');J=I.length;n"
                +"ewg=g;newg=utils.removePluses(newg);for(K=0;K<J;K++){L=s.getQueryParam(I[K]"
                +",'',newg);if(L){L=L.toLowerCase();M=L;if(D[2]){u=D[2];N=D[2]}else{N=t}"
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




            s.httpsSearch = function(A){var pp = "";if(A.indexOf("www.google.") != -1){;if(document.referrer.indexOf("q=&")!=-1){pp = "google";}}if(pp == ""){pp = "na";}return pp;}
            /* Top 130 - Grouped */




            s.seList="altavista.co,altavista.de|q,r|AltaVista>.aol.,suche.aolsvc"
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

            s.trackTNT = function(v, p, b) {
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
            }




            /*
             * Plugin: getTimePartingJH
             * Based on getTimeParting 2.0 - Set timeparting values based on time zone
             * This version is altered for BSKYB to return WeekDay_hr_quarter
             * as in Wednesday_17_15  (when called with t="h")
             * By Jeroen Hustinx sept 24, 2010
             */
            s.getTimePartingJH = function(t,z){
                var s=this,cy;
                dc=new Date('1/1/2000');
                if(dc.getDay() != 6 || dc.getMonth() != 0) {
                    return 'Data Not Available';
                } else {
                    z = parseFloat(z);
                    var dsts = new Date(s.dstStart);
                    var dste = new Date(s.dstEnd);
                    fl = dste;
                    cd = new Date();
                    if (cd > dsts && cd < fl) {
                        z = z + 1
                    } else {
                        z = z;
                    }
                    utc = cd.getTime() + (cd.getTimezoneOffset() * 60000);
                    tz = new Date(utc + (3600000 * z));
                    thisy = tz.getFullYear();
                    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    if (thisy != s.currentYear) {
                        return 'Data Not Available';
                    } else {
                        thish = tz.getHours();
                        thismin = tz.getMinutes();
                        thisd = tz.getDay();
                        var dow = days[thisd];
                        var bskybstring = dow + '_' + thish + '_' + thismin;
                        if (t == 'h') {
                            return bskybstring
                        }
                        if (t == 'd') {
                            return dow
                        }
                    }
                }
            };



            if (document.getElementById('404ErrorPage')){
                s.pageName = '404 Error Page';
                s.pageType= "errorPage";
                var docHref = (document.location.href).split('?');
                s.eVar9 = docHref[0];
                s.prop9 = "D=v9";
                var refHref = (document.referrer);
                s.eVar36 = refHref;
                s.prop36 = "D=v36";
            }

        },
        loadMediaModule: function(s) {
            /* Module: Media */
            s.m_Media_c="var m=s.m_i('Media');m.cn=function(n){var m=this;return m.s.rep(m.s.rep(m.s.rep(n,\"\\n\",''),\"\\r\",''),'--**--','')};m.open=function(n,l,p,b){var m=this,i=new Object,tm=new Date,a='',"
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
            s.m_i("Media");
        },
       reset: function(){
           if (!this.s){ return; }
           this.s.linkTrackVars = '';
           this.s.events = '';
           this.s.linkTrackEvents = '';
        },
        utils: utils
    };


    return sky.tracking;

}(toolkit.omniture.config, toolkit.omniture.utils, toolkit.omniture.h26));

//just for require
if (typeof window.define === "function" && window.define.amd) {
    define("omniture", ['omniture/config', 'omniture/utils', 'omniture/omniture-h26'], function(config, utils) {
        return toolkit.omniture;
    });
}
