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

    function logtrackPage(tracked){
        log('start','trackPage event triggered');
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
                    if (mappedVars[x].val!==String(config[x])){
                        log(x, mappedVars[x].val);
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
        debugging: function(){ return debugging; },
        logtrackPage: logtrackPage,
        logS: logS,
        log: log
    };

}(_analytics.config));


if (typeof window.define === "function" && window.define.amd) {
    define("utils/logger", ['core/config'], function(config) {
        return _analytics.logger;
    });
}
