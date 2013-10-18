if (typeof _wiki==='undefined') _wiki={};
_wiki.setup = (function(){

    function bindEvents(){
        $('.toggle-code-example').on('click', toggleCodeExamples);
        $('#btn_ajax_event').on('click', ajaxPageView);
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

    function ajaxPageView(e){
        e.preventDefault();
        analytics.pageView({
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

    function manualTrigger(){
        $('#manualTrackingOff').on('click', function(){
            $(this).trigger('analytics-track');
        });
        $('#manualTrack').on('click', function(){
            $(this).trigger('analytics-track');
        });
        $('#manualTrackNotDouble').on('click', function(){
            $(this).trigger('analytics-track');
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