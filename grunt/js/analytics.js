if (typeof _analytics==='undefined') _analytics={};
_analytics.setup = (function(polyfill, config, omniture, trackClick, trackPage, logger){
//todo: test and document setup()
//todo: write page to test require.. and sleep?
//todo: test for live binding
//todo: integration test for newOrRepeat
//todo: maybe unit setLoginVars from user hist

//todo: add search event into config
//todo: test plugins with andrew and order
//todo: delete    setVariable('pageURL','D=referrer');

//todo: show transparency of test suit, build status maybe exec js tests on demo page
//todo: write analytics.send method within analytics.js

    var mandatory = ['site', 'section', 'account', 'page'];

    function setup(customConfig){
        $.extend(config, customConfig);
        omniture.init(customConfig.account);

        checkMandatoryConfig();
        setupCustomEventsAndVariables('Events');
        setupCustomEventsAndVariables('Variables');
        trackClick.bind();

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
        trackClick : trackClick.track,
        trackError: omniture.trackError,
        trackPage: function(customConfig){
            var page = reset(customConfig);
            trackPage.track( page );
        },
        setup: setup,
        debug: logger.debug
    };
    return analytics;


}(  _analytics.polyfill,
    _analytics.config,
    _analytics.omniture,
    _analytics.trackClick,
    _analytics.trackPage,
    _analytics.logger
));

//just for require
if (typeof window.define === "function" && window.define.amd) {
    define("analytics", [
        'utils/polyfill',
        'core/config',
        'core/omniture',
        'core/track-click',
        'core/track-page',
        'utils/logger'
    ], function(polyfill, config, omniture, trackClick, trackPage, logger) {
        return _analytics.setup;
    });
}