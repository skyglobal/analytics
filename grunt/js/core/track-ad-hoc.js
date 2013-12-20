if (typeof _analytics==='undefined') _analytics={};
_analytics.trackAdHoc = (function(config,omniture){

    function track(type) {
        var variable,
            i= 1,
            j= arguments.length;

        for (i; i < j; i++){
            var argument = j[i];

            if ((typeof argument).toLowerCase() === "string") {
                omniture.setEvent(argument);
            } else {
                variable = normaliseItem(argument);
                omniture.setVariable(variable.name, variable[variable.name]);
            }
        }
        omniture.trackAdHoc(type);
    }

    function normaliseItem(item){
        var properties = {}, name;
        for (name in item) {
            if(item.hasOwnProperty(name)) {
                if (!properties.name) {
                    properties.name = name;
                }
                properties[name] = item[name];
            }
        }
        return properties;
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
