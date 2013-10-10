if (typeof toolkit==='undefined') toolkit={};
if (typeof toolkit.omniture==='undefined') toolkit.omniture={};
if (typeof toolkit.omniture.plugins==='undefined') toolkit.omniture.plugins={};

toolkit.omniture.plugins.newOrRepeatVisits = (function(){

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

    function load(omniture, skyTracking){

        omniture.getNewRepeat = getNewRepeat;
        omniture.getVisitNum = getVisitNum;

        omniture.eVar70 = omniture.getNewRepeat(30, "s_getNewRepeat");
        if(omniture.eVar70 == "Repeat"){  skyTracking.loadEvents.push(skyTracking.events['repeatVisit']);}//todo: test this
        omniture.eVar69 = omniture.getVisitNum();
    }

    return {
        load: load
    };

}());

if (typeof window.define === "function" && window.define.amd) {
    define("plugins/new-or-repeat-visits", function() {
        return toolkit.omniture.plugins.newOrRepeatVisits;
    });
}