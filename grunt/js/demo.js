if (typeof _demo==='undefined') _demo={};
_demo.setup = (function(){

    function bindEvents(){
        $('.toggle-code-example').on('click', toggleCodeExamples);
        $('#check').on('click', checkDiff);
    }

    function checkDiff(e){
        e.preventDefault();
        var version = $('#version').val();
        if (version.split('.').length<3 || (version.split('.')[0]<1 && version.split('.')[1]<1)){
            $('.sky-form .error').text("The version number is required, and must be '1.1.0' or higher");
            version = '1.1.0';//get lowest version available
        }
        toolkit.diff({
            route:'analytics.global.sky.com',
            oldVersion:version,
            newVersion:$('.wiki-header small').replace('v')
        });
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

    bindEvents();

}(_demo.tests));


//just for require
if (typeof window.define === "function" && window.define.amd) {
    define("demo", ['tests/tests'], function() {
        return _demo;
    });
}