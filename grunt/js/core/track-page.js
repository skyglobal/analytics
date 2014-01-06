if (typeof _analytics==='undefined') _analytics={};
_analytics.trackPage = (function(config,omniture){

    function track() {
        var name;

        omniture.setEvent('pageLoad');

        for (name in config.loadVariables){
            if (config.loadVariables.hasOwnProperty(name)) {
                omniture.setVariable(name, config.loadVariables[name], 'load');
            }
        }

        for (name in config.loadEvents){
            if (config.loadEvents.hasOwnProperty(name)) {
                omniture.setEvent(config.loadEvents[name], 'load');
            }
        }

        omniture.trackPage();
    }

    return {
        track: track
    };

}(  _analytics.config,
    _analytics.omniture
));

if (typeof window.define === "function" && window.define.amd) {//just for require
    define("core/track-page", [
        'core/config',
        'core/omniture'
    ], function(config, omniture) {
        return _analytics.trackPage;
    });
}
