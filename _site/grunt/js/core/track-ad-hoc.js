if (typeof _analytics==='undefined') _analytics={};
_analytics.trackAdHoc = (function(config,omniture){

    function track() {
        var variable,
            i= 0,
            j= arguments.length;

        for (i; i < j; i++){
            var argument = arguments[i];

            if ((typeof argument).toLowerCase() === "string") {
                omniture.setEvent(argument, 'click');
            } else {
                variable = omniture.normaliseItem(argument);
                omniture.setVariable(variable.name, variable[variable.name], 'click');
            }
        }
        omniture.trackAdHoc();
    }

    return {
        track: track
    };

}(  _analytics.config,
    _analytics.omniture
));

if (typeof window.define === "function" && window.define.amd) {//just for require
    define("core/track-ad-hoc", [
        'core/config',
        'core/omniture'
    ], function(config, omniture) {
        return _analytics.trackAdHoc;
    });
}
