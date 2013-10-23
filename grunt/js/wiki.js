if (typeof _wiki==='undefined') _wiki={};
_wiki.setup = (function(){

    function bindEvents(){
        $('.toggle-code-example').on('click', toggleCodeExamples);
        $('#btn_ajax_event').on('click', ajaxtrackPage);
        $('#btn-page-load-var').on('click', customVartrackPage);
        $('#search-results-trackPage').on('click', searchResultstrackPage);
        $('#btn_error_trackPage').on('click', triggerErrortrackPage);
        $('#btn_error_event').on('click', triggerError);
        $('#standard-vars-onLoad-a').on('click', sendStandardVarOnload);
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
            page: 'Analytics single page apps demo page',
            customEvents: [
                {'ajax_happened': {event: 101, onPageLoad: true}}
            ],
            customVariables: [
                {'colour': {var: 71 }},
                {'drink': {'var': 72 }},
                {'how_about_pina_coladas': {'var': 73 }}
            ]
        });
    }

    function searchResultstrackPage(e){
        e.preventDefault();
        analytics.trackPage({
            site: 'global',
            section: 'skyglobal/analytics',
            account: 'bskybglobaldev',
            page: 'Analytics single page apps demo page',
            loadVariables: { 'searchResults': 0, 'searchType':'weather', 'searchTerm': 'london' }
        });
    }

    function customVartrackPage(e){
        e.preventDefault();
        analytics.trackPage({
            site: 'global',
            section: 'skyglobal/analytics',
            account: 'bskybglobaldev',
            page: 'Analytics single page apps demo page',
            customVariables: [
                {'how_about_pina_coladas': {'var': 73, 'value': 'my val on load', 'onPageLoad': true }}
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
            page: 'Analytics debug demo page',
            loadVariables: { errors: '404' }
        };
        analytics.trackPage(SITECAT_CONFIG);
    }
    function sendStandardVarOnload(){
        analytics.trackPage({
            site: 'global',
            section: 'skyglobal/analytics',
            account: 'bskybdemodev',
            page: 'Analytics demo page',
            loadVariables: {'videoTitle':'My Home Video', 'externalSearchTerm':'thrill rides'}
        });
    }
    bindEvents();

}());


//just for require
if (typeof window.define === "function" && window.define.amd) {
    define("wiki", function() {
        return _wiki;
    });
}