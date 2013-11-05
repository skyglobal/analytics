if (typeof _demo==='undefined') _demo={};
_demo.tests = (function(){

    function bindEvents(){

        $('#basic-config').on('click', basicConfigLoad);
        $('#custom-config').on('click', customConfigLoad);
        $('#custom-config-with-content-type').on('click', anotherCustomConfigLoad);
        $('#btn_page_load').on('click', customPageLoad);
        $('#debug-on-load').on('click', debugOnLoad);
        $('#debug-in-realtime').on('click', debugInRealtime);
        $('#btn_ajax_event').on('click', ajaxtrackPage);
        $('#btn-page-load-var').on('click', customVartrackPage);
        $('#btn-page-load-list').on('click', customListtrackPage);
        $('#btn-page-load-hier').on('click', customHiertrackPage);
        $('#search-results-trackPage').on('click', searchResultstrackPage);
        $('#btn_error_trackPage').on('click', triggerErrortrackPage);
        $('#btn_error_event').on('click', triggerError);
        $('#standard-vars-onLoad-a').on('click', sendStandardVarOnload);
        $('#standard-events-onLoad-a').on('click', sendStandardEventsOnload);
        $(document).on('click', '#manualBind, #manualBindA', analytics.trackClick);
        updateCustomVariableValues();
        manualTrigger();

    }

    function updateCustomVariableValues(){
        $('[data-tracking-variable=how_about_pina_coladas]').attr('data-tracking-value',$('input[name=radio_field]:checked').val());
        $('[data-tracking-variable=drink]').attr('data-tracking-value',$('#input_field').val());
        $('#input_field').on('blur', function(e){
            $('[data-tracking-variable=drink]').attr('data-tracking-value',$(this).val());
        });
        $('#radio-input input').on('click', function(e){
            $('[data-tracking-variable=how_about_pina_coladas]').attr('data-tracking-value',$(this).val());
        });
        $('#text-input button, #radio-input button').on('click', function(e){
            e.preventDefault();
        });
    }

    function ajaxtrackPage(e){
        e.preventDefault();
        analytics.trackPage({
            site: 'global',
            section: 'skyglobal/analytics',
            account: 'bskybglobaldev',
            customEvents: [
                {'ajax_happened': {event: 101, onPageLoad: true}}
            ],
            customVariables: [
                {'colour': {eVar: 71 }},
                {'drink': {'eVar': 72 }},
                {'how_about_pina_coladas': {'eVar': 73 }}
            ]
        });
    }

    function searchResultstrackPage(e){
        e.preventDefault();
        analytics.trackPage({
            site: 'global',
            section: 'skyglobal/analytics',
            account: 'bskybglobaldev',
            loadVariables: { 'searchResults': 0, 'searchType':'weather', 'searchTerm': 'london' }
        });
    }

    function customVartrackPage(e){
        e.preventDefault();
        analytics.trackPage({
            site: 'global',
            section: 'skyglobal/analytics',
            account: 'bskybglobaldev',
            customVariables: [
                {'how_about_pina_coladas': {'eVar': 73, 'value': 'my val on load', 'onPageLoad': true }}
            ]
        });
    }

    function customListtrackPage(e){
        e.preventDefault();
        analytics.trackPage({
            site: 'global',
            section: 'skyglobal/analytics',
            account: 'bskybglobaldev',
            customVariables: [
                {'myListOfStuff': {'list': 1, 'value': ['val1','my second','final value'], 'onPageLoad': true }}
            ]
        });
    }
    function customHiertrackPage(e){
        e.preventDefault();
        analytics.trackPage({
            site: 'global',
            section: 'skyglobal/analytics',
            account: 'bskybglobaldev',
            customVariables: [
                {'myHierarchyOfStuff': {'hier': 1, 'value': ['h1','second h','final hier'], 'onPageLoad': true }}
            ]
        });
    }

    function manualTrigger(){
        $('#manualTrackingOff').on('click', function(){
            $('#manualTrackingOff').trigger('analytics-track');
        });
        $('#manualTrack').on('click', function(e){
            $('#manualTrack').trigger('analytics-track');
        });
    }


    function triggerError(){
        analytics.trackError('myCustomError i.e. 404 or no-package-found');
    }
    function triggerErrortrackPage(){
        SITECAT_CONFIG = {
            site: 'global',
            section: 'skyglobal/analytics/debug',
            headline: '',
            contentType: 'demo',
            contentId: '',
            account: 'bskybglobaldev',
            loadVariables: { errors: '404' }
        };
        analytics.trackPage(SITECAT_CONFIG);
    }
    function sendStandardVarOnload(){
        analytics.trackPage({
            site: 'global',
            section: 'skyglobal/analytics',
            account: 'bskybdemodev',
            loadVariables: {'videoTitle':'My Home Video', 'externalSearchTerm':'thrill rides'}
        });
    }
    function sendStandardEventsOnload(){
        analytics.trackPage({
            site: 'global',
            section: 'skyglobal/analytics',
            account: 'bskybdemodev',
            loadEvents: ['liveChat']
        });
    }
    function customPageLoad(){

        SITECAT_CONFIG = {
            site: 'global',
            section: 'skyglobal/analytics',
            headline: '',
            contentType: 'skyglobal',
            contentId: '',
            account: 'bskybmyglobaldev',
            customEvents: [{'magic_happened': {event: 99, onPageLoad: true}}],
            customVariables: [
                {'my_custom_prop':     { prop: 40, onPageLoad: true, value: 'my custom prop value'}},
                {'my_custom_variable': { eVar: 41, prop: 41,  onPageLoad: true, value: 'my custom eVar value'}}
            ]
        };

        analytics.trackPage(SITECAT_CONFIG);
    }

    function debugInRealtime(e) {
        if ($(e.target).attr('data-debug')=='true'){
            analytics.debug();
            $(e.target).attr('data-debug','false');
        } else {
            analytics.debug(false);
        }
    }

    function debugOnLoad(e){
        e.preventDefault();
        SITECAT_CONFIG = {
            site: 'global',
            section: 'skyglobal/analytics/debug',
            headline: '',
            contentType: 'demo',
            contentId: '',
            account: 'bskybglobaldev',
            debug: true

        };

        analytics.trackPage(SITECAT_CONFIG);
    }

    function basicConfigLoad(e){
        e.preventDefault();
        analytics.trackPage({
            site: 'global',
            section: 'skyglobal/analytics/demo',
            account: 'bskybdemodev'
        });
    }

    function customConfigLoad(e){
        e.preventDefault();
        analytics.trackPage({
            page: document.title,
            site: 'global',
            section: 'skyglobal/analytics/demo',
            account: 'bskybdemodev',
            loadVariables: {'videoTitle':'My Home Video', 'externalSearchTerm':'thrill rides'},
            loadEvents: ['activateComplete'],
            customEvents: [
                {'magic_happened': {event: 101, onPageLoad:true}}
            ],
            customVariables: [
                {'drink': {'eVar': 72}},
            ],
            debug: true
        });
    }

    function anotherCustomConfigLoad(e){
        e.preventDefault();
        analytics.trackPage({
            site: 'global',
            section: 'skyglobal/analytics/demo',
            account: 'bskybdemodev',
            contentType: 'analytics',
            loadVariables: {'videoTitle':'My Home Video', 'externalSearchTerm':'thrill rides'},
            loadEvents: ['activateComplete'],
            customEvents: [
                {'magic_happened': {event: 101, onPageLoad:true}}
            ],
            customVariables: [
                {'drink': {'eVar': 72}},
            ],
            debug: true
        });
    }

    bindEvents();

}());


//just for require
if (typeof window.define === "function" && window.define.amd) {
    define("tests/tests", function() {
        return _demo.tests;
    });
}