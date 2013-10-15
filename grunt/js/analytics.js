if (typeof analytics==='undefined') analytics={};
analytics = (function(polyfill, config, linkClicks, pageView){

    var page,
        mandatory = ['site', 'section', 'account', 'page'];

    function bindVars(){
        page = {
            events:[],
            loadEvents:[],
            variables:{},
            loadVariables:{}
        };
    }

    function setup(custom){
        $.extend(page, custom);
        if (custom.debug){
//            logger.debug(true);
        }
//        todo: console warning if no site or section
        checkMandatoryConfig();
        setupCustomEventsAndVariables('Events');
        setupCustomEventsAndVariables('Variables');
    }

    //PAGE VIEW TRACKING
    function reset(custom){
        bindVars();
        pageView.reset();
        if (custom){
            setup(custom);
        }

//        logger.logPageView(omniture.s);
    }

    function checkMandatoryConfig(){
        for (var name in mandatory){
            if (!page[mandatory[name]]){
                console.error('Mandatory config is missing: ', mandatory[name]);
            }
        }
    }

    function setupCustomEventsAndVariables(type){
        var arr = page['custom' + type],
            i = 0,
            len = arr.length,
            item, trackedData;
        for(i;i<len;i++){
            item = normaliseItem(arr[i]);
            if (type=='Variables') {
                setupCustomVariable(item);
            } else if (type=='Events') {
                setupCustomEvents(item);
            }
        }
    }

    function setupCustomVariable(item) {
        var trackedData = [],
            prop;
        if (item.prop){
            prop = 'prop' + item.prop;
            trackedData.push(prop);
        }
        if (item.eVar){
            prop = 'eVar' + item.eVar;
            trackedData.push(prop);
        }
        pageView.variables[item.name] = trackedData;
        if (item.onPageLoad) {
            page.loadVariables[item.name] = item.value;
        }
    }

    function setupCustomEvents(item) {
        pageView.events[item.name] =  'event' + item.event;
        page.events.push('event' + item.event);
        if (item.onPageLoad) {
            page.loadEvents.push(item.name);
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
            reset(customConfig);
            pageView.track( page );
        },
        setup: setup
    };


}(  analytics.polyfill,
    analytics.config,
    analytics.linkClicks,
    analytics.pageView
));

//just for require
if (typeof window.define === "function" && window.define.amd) {
    define("analytics", [
        'utils/polyfill',
        'core/config',
        'core/link-clicks',
        'core/page-view'
    ], function(polyfill, config, linkClicks, pageView) {
        return analytics;
    });
}