if (typeof _demo==='undefined') _demo={};
_demo.setup = (function(){

    function bindEvents(){
        $(document).on('click','.toggler', toggle);
        $('#check').on('click', checkDiff);
    }

    function checkDiff(e){
        e.preventDefault();
        var oldVersion = $('#version').val(),
            newVersion = $('.wiki-header small').text().replace('v',''),
            route = 'http://analytics.global.sky.com';
        if (oldVersion.split('.').length<3 || (oldVersion.split('.')[0]<1)){
            $('.sky-form .error').text("The version number is required, and must be '1.1.0' or higher");
            oldVersion = '1.1.0';//get lowest version available
        }
        toolkit.diff({
            oldRoute: route + '/' + oldVersion + '/_site/_includes',
            newRoute: route + '/' + newVersion + '/_site/_includes'
        });
    }

    function toggle(){
        var $toggler = $(this);
        var $example = $('div[data-toggle=' + $toggler.attr('for') + ']');
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