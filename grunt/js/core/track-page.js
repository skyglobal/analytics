if (typeof _analytics==='undefined') _analytics={};
_analytics.trackPage = (function(config,omniture,mediaModule,testAndTarget,channelManager,newOrRepeatVisits,userHistory,utils){

    var pluginsLoaded = false,
        setVariable = omniture.setVariable,
        setEvent = omniture.setEvent;

    function setPageDescriptions(){
        var siteName = setVariable('siteName','sky/portal/' + config.site),
            pageName = setVariable('pageName', siteName + "/" + config.page);
        setVariable('refDomain', (document.referrer) ? document.referrer.split('/')[2] : '');
        setVariable('pageURL','D=referrer');
        setVariable('contentType',config.contentType);
        setVariable('url',config.url);
        setVariable('contentId',config.contentId);
        setVariable('section','sky/portal/' + config.site);
        setVariable('section0', siteName + '/' +  config.section.split('/').slice(0,1).join('/'));
        setVariable('section1', siteName + '/' +  config.section.split('/').slice(0,2).join('/'));
        setVariable('section2', siteName + '/' +  config.section.split('/').slice(0,3).join('/'));
        setVariable('pageConversion', config.site + "/" + config.page);
        setVariable('headline', config.headline);

        if (config.headline) {
            setVariable('fullPageDescription', (config.site + '/' + config.section+ '/' + config.headline).substring(0,255));
        } else{
            setVariable('fullPageDescription', pageName.substring(0,255));
        }
    }


    function track() {
            var name;

            setEvent('pageLoad');

            setPageDescriptions();

            for (name in config.loadVariables){
                setVariable(name, config.loadVariables[name]);
            }
            for (name in config.loadEvents){
                setEvent(config.loadEvents[name]);
            }
            for (name in config) {
                setVariable(name, config[name]);
            }

            loadPlugins();
            omniture.trackPage();
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

    return {
        track: track
    };

}(  _analytics.config,
    _analytics.omniture,
    _analytics.plugins.mediaModule,
    _analytics.plugins.testAndTarget,
    _analytics.plugins.channelManager,
    _analytics.plugins.newOrRepeatVisits,
    _analytics.plugins.userHistory,
    _analytics.plugins.utils
));

if (typeof window.define === "function" && window.define.amd) {//just for require
    define("core/track-page", [
        'core/config',
        'core/omniture',
        'plugins/media-module',
        'plugins/test-and-target',
        'plugins/channel-manager',
        'plugins/new-or-repeat-visits',
        'plugins/user-history',
        'plugins/utils'
    ], function(config, omniture, mediaModule, testAndTarget, channelManager, newOrRepeatVisits, userHistory, utils) {
        return _analytics.trackPage;
    });
}