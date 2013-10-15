if (typeof analytics==='undefined') analytics={};
analytics.logger = (function(){

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

    function logLinkDetails(info){
        if (vars.verifying){
            console.groupCollapsed('linkDetails');
            console.log('module: ', info[0]);
            console.log('pod: ', info[1]);
            console.log('other: ', info[2]);
            console.log('context: ', info[3]);
            console.log('theme: ', info[4]);
            console.log('textClicked: ', info[5]);
            console.log('pageName: ', info[6]);
            console.groupEnd();
        }
    }

    function log(type, prop, val){
        if (!vars.verifying){ return; }
        if (type=='start'){
            if (val && val.preventDefault) { val.preventDefault(); }
            console.group(prop);
            $('#' + vars.verifyOutputId).html('');
        } else if (type=='end'){
            console.groupEnd();
        } else {
            console.log(prop +': ', val);
            $('#' + vars.verifyOutputId).append('<div class="' + prop + '">' + prop +': ' + val + '</div>');
        }
    }

    return {
        debug: debug,
        logPageView: logPageView,
        logLinkDetails: logLinkDetails,
        log: log
    };

}());


if (typeof window.define === "function" && window.define.amd) {
    define("utils/logger", function() {
        return analytics.log;
    });
}
