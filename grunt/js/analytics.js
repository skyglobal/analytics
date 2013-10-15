if (typeof analytics==='undefined') analytics={};
analytics = (function(polyfill, config, linkClicks, pageView){

    return {
        linkClicks : linkClicks
    };


}(  analytics.polyfill,
    analytics.config,
    analytics.linkClicks,
    analytics.filePageView
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