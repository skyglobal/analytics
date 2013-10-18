if (typeof _analytics==='undefined') _analytics={};
_analytics.setup = (function(polyfill, config, omniture, linkClick, pageView, logger){
//todo: write page to test require
//todo: test val vs attr value and the rest of getText | + all things logged
//todo: test for live binding

    var mandatory = ['site', 'section', 'account', 'page'];

    function setup(customConfig){
        $.extend(config, customConfig);
        omniture.init(customConfig.account);

        checkMandatoryConfig();
        setupCustomEventsAndVariables('Events');
        setupCustomEventsAndVariables('Variables');
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
        config.trackedData[varName] = arrValues;
    }

    function addToEventMap(eventName, eventID){
        config.trackedEvents[eventName] = 'event' + eventID;
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
}