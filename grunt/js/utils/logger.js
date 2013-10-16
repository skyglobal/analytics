if (typeof analytics==='undefined') analytics={};
analytics.logger = (function(config){

    var vars = {
        verifying: false,
        verifyOutputId: 'toolkit-tracking-verify'
    };


    function debug(on){
        if (on || on === undefined){
            vars.verifying = true;
            $('body').append('<div id="' + vars.verifyOutputId + '"></div>');
        } else {
            vars.verifying = false;
            $('#' + vars.verifyOutputId).remove();
        }
    }

    function logPageView(tracked){
        log('start','pageView event triggered');
        log('','omniture', tracked);
        log('end');
    }

    function log(prop, val){
        if (!vars.verifying){ return; }
        if (prop=='start'){
            console.group(val);
            $('#' + vars.verifyOutputId).html('');
        } else if (prop=='end'){
            console.groupEnd();
        } else {
            console.log(prop +': ', val);
            $('#' + vars.verifyOutputId).append('<div class="' + prop + '">' + prop +': ' + val + '</div>');
        }
    }

    function getEventName(eventID){
        var events = config.trackedEvents, name;
        for (name in events){
            if (events[name]==eventID) return name;
        }
        return '';
    }
    function logS(linkDetails, events, mappedVars){
        var arrDetails, x;
        console.group('tracking event');

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
                    if (mappedVars[x]!==config[x]){
                        log(x, mappedVars[x]);
                    }
                }
            console.groupEnd();
            console.groupCollapsed('The Whole of omniture');
                log('s',s);
            console.groupEnd();

        console.groupEnd();
    }

    return {
        debug: debug,
        logPageView: logPageView,
        logS: logS,
        log: log
    };

}(analytics.config));


if (typeof window.define === "function" && window.define.amd) {
    define("utils/logger", ['core/config'], function(config) {
        return analytics.log;
    });
}
