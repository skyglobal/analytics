if (typeof _demo==='undefined') _demo={};
_demo.tests = (function(){

    function bindEvents(){

        $('#basic-config').on('click', basicConfigLoad);
        $('#reset-config').on('click', resetConfigLoad);
        $('#custom-config').on('click', customConfigLoad);
        $('#custom-config-with-content-type').on('click', anotherCustomConfigLoad);
        $('#btn_page_load').on('click', customPageLoad);
        $('#debug-on-load').on('click', debugOnLoad);
        $('#debug-in-realtime').on('click', debugInRealtime);
        $('#debug-in-realtime-off').on('click', debugInRealtimeOff);
        $('#btn_ajax_event').on('click', ajaxtrackPage);
        $('#btn-page-load-var').on('click', customVartrackPage);
        $('#btn-page-load-list').on('click', customListtrackPage);
        $('#btn-page-load-hier').on('click', customHiertrackPage);
        $('#search-results-trackPage').on('click', searchResultstrackPage);
        $('#btn_error_trackPage').on('click', triggerErrortrackPage);
        $('#btn_404_trackPage').on('click', trigger404trackPage);
        $('#btn_error_event').on('click', triggerError);
        $('#standard-vars-onLoad-a').on('click', sendStandardVarOnload);
        $('#standard-events-onLoad-a').on('click', sendStandardEventsOnload);
        $('#productSelection-event-onLoad-a').on('click', sendProductSelectionEventOnload);
        $('#custom-prop').on('click', sendCustomProp);
        $('#ad-hoc-tracking').on('click', sendAdHocTracking);
        $('#ad-hoc-tracking-page-view').on('click', sendAdHocTrackingPageView);
        $('#ad-hoc-tracking-after-page-view').on('click', sendAdHocTrackingAfterPageView);
        $('#play-pooh').on('click', playPooh);
        $('#pause-pooh').on('click', pausePooh);
        $('#skip-pooh').on('click', skipPooh);
        $('#end-pooh').on('click', endPooh);

        $(document).on('click', '#manualBind, #manualBindA', analytics.trackClick);
        updateCustomVariableValues();
        manualTrigger();
        showDemoCode();
    }

    // html5 video not supported in PhantomJS
    // we can't use the video API as it causes a javascript error
    // for example: document.getElementById('pooh-video').play()
    function playPooh(){
        if(document.getElementById('pooh-video').play) {
            document.getElementById('pooh-video').play();
        }
        else {
            $('#pooh-video').trigger('play');
        }
    }

    function pausePooh(){
        if(document.getElementById('pooh-video').pause) {
            document.getElementById('pooh-video').pause();
        }
        else {
            $('#pooh-video').trigger('pause');
        }
    }

    function skipPooh(){
        if(document.getElementById('pooh-video').currentTime){
            document.getElementById('pooh-video').currentTime += 30;
        }
        else {
            $('#pooh-video').trigger('seeking');
        }
    }

    function endPooh() {
        if (document.getElementById('pooh-video').duration) {
            document.getElementById('pooh-video').currentTime = document.getElementById('pooh-video').duration;
        }
        else {
            $('#pooh-video').trigger('ended');
        }
    }


    function showDemoCode(){
        $('.code-example script').each(function(){
           var code = this.innerHTML.split('<!--demo-->');
            if (code.length<=1 || (code[1] && !code[1].trim())){
                code[1] = '<i>none</i>';
            }
            $(this).parent().find('code.js').append(code[1].trim());
        });
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
                {'myHierarchyOfStuff': {'hier': 2, 'value': ['h1','second h','final hier'], 'onPageLoad': true }}
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
            loadVariables: { errors: 'nnn-service-down' }
        };
        analytics.trackPage(SITECAT_CONFIG);
    }
    function trigger404trackPage(){
        SITECAT_CONFIG = {
            page: '404',
            site: 'global',
            section: 'skyglobal/analytics/404',
            headline: '',
            contentType: '404',
            contentId: '',
            account: 'bskybglobaldev',
            loadVariables: { '404Page': 'errorPage' }
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

    function sendProductSelectionEventOnload(){
        analytics.trackPage({
            site: 'global',
            section: 'skyglobal/analytics',
            account: 'bskybdemodev',
            loadEvents: ['productSelection']
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
        e.preventDefault();
        analytics.debug();
    }
    function debugInRealtimeOff(e) {
        e.preventDefault();
        analytics.debug(false);
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

    function resetConfigLoad(e){
        e.preventDefault();
        analytics.setup({
            site: 'global',
            section: 'skyglobal/analytics/resetting',
            account: 'bskybdemodev',
            loadVariables: {'videoTitle':'My Home Video'},
            loadEvents: ['activateComplete'],
            customEvents: [
                {'magic_happened': {event: 101, onPageLoad:true}}
            ],
            customVariables: [
                {'drink': {'eVar': 72, value:'hello drinks', onPageLoad:true}}
            ]
        });
        analytics.trackPage();
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
            debug: false
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
                {'drink': {'eVar': 72}}
            ],
            debug: false
        });
    }

    function sendCustomProp(e){
        e.preventDefault();
        analytics.trackPage({
            site: 'global',
            section: 'skyglobal/analytics/demo',
            account: 'bskybdemodev',
            contentType: 'analytics',
            customVariables: [
                {'briansCat': {'prop': 66, value:'is great', onPageLoad:true}}
            ]
        });
    }

    function sendAdHocTracking(e){
        e.preventDefault();
        analytics.setup({
            site: 'global',
            section: 'skyglobal/analytics/demo',
            account: 'bskybdemodev',
            contentType: 'analytics',
            customVariables: [
                {'petesDog': {'eVar': 67}},
                {'briansCat': {'eVar': 66}},
                {'magic_happened': {'event': 99}}
            ],
            customEvents: [
                {'myAdHocEvent': {'event': 69} }
            ]
        });
        analytics.trackAdHoc(
            {'petesDog': 'is better'},
            {'testAndTarget': 'is poo'},
            'myAdHocEvent'
        );
    }
    function sendAdHocTrackingPageView(e){
        e.preventDefault();
        analytics.setup({
            site: 'global',
            section: 'skyglobal/analytics/demo',
            account: 'bskybdemodev',
            contentType: 'analytics',
            customVariables: [
                {'petesDog': {'eVar': 67}},
                {'briansCat': {'eVar': 66}},
                {'magic_happened': {'event': 99}}
            ],
            customEvents: [
                {'myAdHocEvent': {'event': 69} }
            ]
        });
        analytics.trackPage();
    }

    function sendAdHocTrackingAfterPageView(e){
        e.preventDefault();
        analytics.trackAdHoc(
            {'briansCat': 'is still great'},
            {'testAndTarget': 'is poo'},
            'myAdHocEvent'
        );
    }

    bindEvents();

}());


//just for require
if (typeof window.define === "function" && window.define.amd) {
    define("tests/tests", function() {
        return _demo.tests;
    });
}