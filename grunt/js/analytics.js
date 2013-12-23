if (typeof _analytics==='undefined') _analytics={};
_analytics.setup = (function(polyfill, config, omniture, trackClick, trackPage, trackAdHoc, logger,mediaModule,testAndTarget,channelManager,newOrRepeatVisits,userHistory,utils ){
//todo: document vars that come for free + what props sent etc
//todo: document masthead prop + test
//todo: document sessionCamID + test

//todo: test and document setup()
//todo: write page to test require.. and sleep?
//todo: test for live binding
//todo: integration test for newOrRepeat
//todo: maybe unit setLoginVars from user hist

//todo: test plugins with andrew and order
//todo: delete    setVariable('pageURL','D=referrer');

//todo: show transparency of test suit, build status maybe exec js tests on demo page
//todo: write analytics.send method within analytics.js

    var mandatory = ['site', 'section', 'account'];
    var setVariable = omniture.setVariable;
    var pluginsLoaded = false;

    function setup(customConfig){
        $.extend(config, customConfig);

        omniture.init(customConfig.account);

        checkMandatoryConfig();
        setupCustomEventsAndVariables('Events');
        setupCustomEventsAndVariables('Variables');
        trackClick.bind();

        loadPlugins();
        setPageDescriptions();

        return config;
    }


    function setPageDescriptions(){
        var name,
            siteName = setVariable('siteName','sky/portal/' + config.site),
            contentType = setVariable('contentType', config.contentType),
            pageName = setVariable('pageName', siteName + "/" + (config.page || config.section) + (!config.page && contentType ? "/" + contentType : ''));

        setVariable('refDomain', (document.referrer) ? document.referrer.split('/')[2] : '');
        setVariable('pageURL','D=referrer');//todo: andrew, really?
        setVariable('url', config.url);
        setVariable('contentId', config.contentId);
        setVariable('channel', siteName + '/' + config.section);
        setVariable('section0', siteName + '/' +  config.section.split('/').slice(0,1).join('/'));
        setVariable('section1', siteName + '/' +  config.section.split('/').slice(0,2).join('/'));
        setVariable('section2', siteName + '/' +  config.section.split('/').slice(0,3).join('/'));
        setVariable('pageConversion', pageName.replace('sky/portal/',''));
        setVariable('headline', config.headline);

        if (window.sessionCamRecorder && window.sessionCamRecorder.sessionId){
            setVariable('sessionCamID', window.sessionCamRecorder.sessionId().split(',')[0]);
        }

        if (config.headline) {
            setVariable('fullPageDescription', (config.site + '/' + config.section+ '/' + config.headline).substring(0,255));
        } else{
            setVariable('fullPageDescription', pageName.substring(0,255));
        }
        for (name in config) {
            setVariable(name, config[name]);
        }
    }

    function loadPlugins() {
        if(pluginsLoaded){ return; }

        utils.load(); //must go first - user history needs it to set a campaign evar
        channelManager.load(); //must go second - user history needs it to set a campaign evar
        userHistory.load();
        testAndTarget.load();
        mediaModule.load();
        newOrRepeatVisits.load();

        pluginsLoaded = true;
    }

    function reset(customConfig){
        omniture.reset();
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
            item = omniture.normaliseItem(arr[i]);
            if (type=='Variables') {
                setupCustomVariable(item);
            } else if (type=='Events') {
                setupCustomEvents(item);
            }
        }
    }

    function addToVariableMap(item){
        var arrValues = [], i, type, varID, prefix,
            varName = item.name,
            types = ['prop','eVar','list','hier'];
        for (i in types){
            type = types[i];
            varID = item[type];
            if (varID){
                arrValues.push(type + varID);
            }
        }
        config.variablesMap[varName] = arrValues;
    }

    function addToEventMap(item){
        var prefix = 'event' + item.event;
        config.eventsMap[item.name] = (item.serial) ? prefix + ':' + item.serial : prefix;
    }

    function setupCustomVariable(item) {
        addToVariableMap(item);
        if (item.onPageLoad) {
            config.loadVariables[item.name] = item.value;
        }
    }

    function setupCustomEvents(item) {
        addToEventMap(item);
        if (item.onPageLoad) {
            config.loadEvents.push(item.name);
        }
    }

    window.analytics = {
        trackAdHoc: function(){
            reset();
            trackAdHoc.track.apply(trackAdHoc, arguments);
        },
        trackClick: function(e){
            var pageConfig = reset(config);
            trackClick.track( e );
        },
        trackError: omniture.trackError,
        trackPage: function(customConfig){
            var pageConfig = reset(customConfig);
            trackPage.track( pageConfig );
        },
        setup: function(customConfig){
            var pageConfig = reset(customConfig);
            return pageConfig;
        },
        debug: logger.debug
    };

    return analytics;

}(  _analytics.polyfill,
    _analytics.config,
    _analytics.omniture,
    _analytics.trackClick,
    _analytics.trackPage,
    _analytics.trackAdHoc,
    _analytics.logger,
    _analytics.plugins.mediaModule,
    _analytics.plugins.testAndTarget,
    _analytics.plugins.channelManager,
    _analytics.plugins.newOrRepeatVisits,
    _analytics.plugins.userHistory,
    _analytics.plugins.utils
));

//just for require
if (typeof window.define === "function" && window.define.amd) {
    define("analytics", [
        'utils/polyfill',
        'core/config',
        'core/omniture',
        'core/track-click',
        'core/track-page',
        'core/track-ad-hoc',
        'utils/logger',
        'plugins/media-module',
        'plugins/test-and-target',
        'plugins/channel-manager',
        'plugins/new-or-repeat-visits',
        'plugins/user-history',
        'plugins/utils'
    ], function(polyfill, config, omniture, trackClick, trackPage, trackAdHoc, logger, mediaModule, testAndTarget, channelManager, newOrRepeatVisits, userHistory, utils) {
        return _analytics.setup;
    });
}