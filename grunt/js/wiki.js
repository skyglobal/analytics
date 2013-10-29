if (typeof _wiki==='undefined') _wiki={};
_wiki.setup = (function(){

    function bindEvents(){
        $('.toggle-code-example').on('click', toggleCodeExamples);
        $('#btn_page_load').on('click', customPageLoad);
        $('#debug-on-load').on('click', debugOnLoad);
        $('#btn_ajax_event').on('click', ajaxtrackPage);
        $('#btn-page-load-var').on('click', customVartrackPage);
        $('#search-results-trackPage').on('click', searchResultstrackPage);
        $('#btn_error_trackPage').on('click', triggerErrortrackPage);
        $('#btn_error_event').on('click', triggerError);
        $('#standard-vars-onLoad-a').on('click', sendStandardVarOnload);
        $('#standard-events-onLoad-a').on('click', sendStandardEventsOnload);
        $(document).on('click', '#manualBind, #manualBindA', analytics.trackClick);
        updateCustomVariableValues();
        manualTrigger();
    }

    function toggleCodeExamples(){
        var $toggler = $(this);
        var $example = $('#' + $toggler.attr('for'));
        if ($example.hasClass('open')){
            $toggler.removeClass('open');
            $example.removeClass('open');
        } else {
            $toggler.addClass('open');
            $example.addClass('open');
        }
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

    bindEvents();

}());


//just for require
if (typeof window.define === "function" && window.define.amd) {
    define("wiki", function() {
        return _wiki;
    });
}