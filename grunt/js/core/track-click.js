if (typeof _analytics==='undefined') _analytics={};
_analytics.trackClick = (function(config, omniture, logger){

    var eventsBound = false;

    function bindEvents() {
        if(!config.trackClicks || eventsBound ){ return; }
        var clickSelector =  'input[type=submit]:not([data-tracking=false]), button:not([data-tracking=false]), a:not([data-tracking=false]), [data-tracking]:not([data-tracking=false])';
        $(document).on('keydown', 'input, ' + clickSelector, function(e){
            if (e.keyCode === 13){
                setOther(e);
            }
        });
        $(document).on('click', clickSelector, function(e) {
            setOther(e);
            if (logger.debugging()) {
                e.preventDefault();
                e.stopPropagation();
            }
            track(e);
            unsetOther(e);
        });
        $(document).on('analytics-track','*', function(e) {
            e.stopPropagation();
            track(e);
        });
        eventsBound = true;
    }

    function unsetOther(e){
        if ($('body').attr('data-setOther') && $('body').attr('data-tracking-other')){
            $('body').removeAttr('data-setOther');
            $('body').removeAttr('data-tracking-other');
        }
    }

    function setOther(e){
        if (!$('body').attr('data-tracking-other')){
            $('body').attr('data-setOther',true);
            $('body').attr('data-tracking-other', e.type);
        }
    }

    function track(e){

        var $el = $(e.currentTarget || e),
            context, linkDetails;

        if ($el.attr('data-tracking-search')){
            context = $el.attr('data-tracking-context') || getText($('#' + $el.attr('data-tracking-context-id')));
            setVariable('searchType', $el.attr('data-tracking-search'));
            setVariable('searchTerm', context);
        }

        linkDetails = getProperties($el);

        setEvent('linkClick');
        setVariable('linkDetails', linkDetails);
        setVariable('refDomain', (document.referrer) ? document.referrer.split('/')[2] : '');
        setVariable('url', window.location.href.split('?')[0]);
        addCustomClickVariable($el);

        addCustomClickEvents($el);
        if (linkDetails[0] === 'masthead'){
            setVariable('masthead',[linkDetails[5],omniture.getVariable('site')]);
        }

        if (window.sessionCamRecorder && window.sessionCamRecorder.sessionId){
            setVariable('sessionCamID', window.sessionCamRecorder.sessionId().split(',')[0]);
        }
        omniture.trackClick(e);
    }


    function getProperties($el){
        var textClicked = getText($el),
            context = $el.attr('data-tracking-context') ||
                getText($('#' + $el.attr('data-tracking-context-id'))) ||
                checkParentForAttribute($el[0],'data-tracking-context'),
            theme =  $el.attr('data-tracking-theme') || checkParentForAttribute($el[0],'data-tracking-theme'),
            other = checkParentForAttribute($el[0],'data-tracking-other'),
            pod =  checkParentForAttribute($el[0],'data-tracking-pod'),
            module = checkParentForAttribute($el[0],'data-tracking-module');

        var linkDetails = [
            safeString(module),
            safeString(pod),
            safeString(other),
            safeString(context),
            safeString(theme),
            safeString(textClicked),
            safeString(omniture.getVariable('pageName').replace(/sky\/portal\//g, ''))
        ];

        return linkDetails;
    }


    function addCustomClickEvents($el){
        var customEvent = $el.attr('data-tracking-event');
        if (!customEvent) return;
        setEvent(customEvent);
    }

    function addCustomClickVariable($el){
        var customVariable = $el.attr('data-tracking-variable');
        if (!customVariable) return;
        var jsValue;
        if (!$el.attr('data-tracking-value') && config.variablesMap[customVariable]) {
            jsValue = $.grep(config.variablesMap[customVariable], function(e) { return e.indexOf('value') === 0; }).pop();
            if (jsValue) { jsValue = jsValue.replace(/^value/, ''); }
        }
        setVariable(customVariable, jsValue || getText($el));
    }

    function setVariable(variable, val){
        omniture.setVariable(variable, val, 'click');
    }

    function setEvent(event){
        omniture.setEvent(event, 'click');
    }


    function safeString(str){
        if (typeof str === 'undefined') { return ''; }
        return str.trim().replace(/ /g,'-').replace(/[&,\+,:|]/g,'').toLowerCase();
    }

    function checkParentForAttribute(el, attr){//    not using jQuery.parents([data-tracking-whatever]) as is slow in ie and ff
        if (!el || !el.getAttribute) { return ''; }
        if (!!el.getAttribute(attr)){
            return el.getAttribute(attr);
        }
        return checkParentForAttribute(el.parentNode, attr);
    }

    function checkForParent(el, tag){//    not using jQuery.parents([data-tracking-whatever]) as is slow in ie and ff
        if (!el || !el.tagName) { return ''; }
        if (el.tagName === tag.toUpperCase()){
            return el;
        }
        return checkForParent(el.parentNode, tag);
    }

    function getText($el){
        return $el.attr('data-tracking-label') ||
            $el.attr('data-tracking-value') ||
            $el.attr('alt') ||
            $el.val() ||
            $el.attr('name') ||
            $el.text();
    }

    return {
        bind: bindEvents,
        track: track,
        getText: getText //for testing
    };

}(_analytics.config, _analytics.omniture, _analytics.logger));



if (typeof window.define === "function" && window.define.amd) {
    define("core/track-click", ["core/config","core/track-page", "utils/logger"], function() {
        return _analytics.trackClick;
    });
}