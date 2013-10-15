if (typeof analytics==='undefined') analytics={};
analytics = (function(polyfill, config, omniture, linkClicks, pageView){

    var mandatory = ['site', 'section', 'account', 'page'];

    function setup(customConfig){
        omniture.init(customConfig.account);

        $.extend(config, customConfig);
        if (config.debug){
//            logger.debug(true);
        }
//        todo: console warning if no site or section
        checkMandatoryConfig();
        setupCustomEventsAndVariables('Events');
        setupCustomEventsAndVariables('Variables');
        return config;
    }

    //PAGE VIEW TRACKING
    function reset(custom){
        config.loadVariables={};
        config.loadEvents=[];
        pageView.reset();
        if (custom){
            setup(custom);
        }
        return config;
//        logger.logPageView(omniture.s);
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
            len = arr.length,
            item;
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

    return {
        linkClicks : linkClicks,
        pageView: function(customConfig){
            var page = reset(customConfig);
            pageView.track( page );
        },
        setup: setup
    };


}(  analytics.polyfill,
    analytics.config,
    analytics.omniture,
    analytics.linkClicks,
    analytics.pageView
));

//just for require
if (typeof window.define === "function" && window.define.amd) {
    define("analytics", [
        'utils/polyfill',
        'core/config',
        'core/omniture',
        'core/link-clicks',
        'core/page-view'
    ], function(polyfill, config, omniture, linkClicks, pageView) {
        return analytics;
    });
}