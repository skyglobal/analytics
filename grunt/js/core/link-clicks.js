if (typeof analytics==='undefined') analytics={};
analytics.linkClicks = (function(omniture, logger){

    function bindEvents(selector, evnt) {
        var clickSelector = selector || 'input[type=submit]:not([data-tracking=false]), button:not([data-tracking=false]), a:not([data-tracking=false]), [data-tracking]:not([data-tracking=false])';
        evnt = evnt || 'click toolkit.track';
        $(document).on(evnt, clickSelector, function(e) {
            track(e);
        });
    }

    function track(e){
        logger.log('start','tracking event', e);
        var $el = $(e.currentTarget),
            context;

        addEvent('linkClick');
        addVariable('events');
        addVariable('linkDetails', getProperties($el));
        addVariable('refDomain', (document.referrer) ? document.referrer.split('/')[2] : '');
        addVariable('url', window.location.href.split('?')[0]);
        addCustomClickVariable($el);
        addCustomClickEvents($el);

        if ($el.attr('data-tracking-search')){//todo: merge this concept in with custom vars and events
            context = $el.attr('data-tracking-context') || getText($('#' + $el.attr('data-tracking-context-id')));
            addVariable('searchType', $el.attr('data-tracking-search'));
            addVariable('searchTerms', context);
            addEvent('search');
        }

        logger.log('end');
        omniture.trackLink(this);
    }


    function getProperties($el){
        var textClicked = getText($el),
            context = $el.attr('data-tracking-context') || getText($('#' + $el.attr('data-tracking-context-id'))),
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
        logger.logLinkDetails(linkDetails);

        return linkDetails.join('|');
    }


    function addCustomClickEvents($el){
        var customEvent = $el.attr('data-tracking-event');
        if (!customEvent) return;
        addEvent(customEvent);
    }

    function addCustomClickVariable($el){
        var customVariable = $el.attr('data-tracking-variable');
        if (!customVariable) return;
        addVariable(customVariable,getText($el));
    }

    function addVariable(variable, val){
        omniture.setVariable(variable, val);
        omniture.setLinkTrackVariable(variable);
        logger.log('prop',variable, val);
    }

    function addEvent(event){
        omniture.setEvent(event);
        omniture.setLinkTrackEvent(event);
        logger.log('events', event, '');
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

    function getText($el){
        return $el.attr('data-tracking-label') || $el.attr('data-tracking-value') || $el.attr('alt') || $el.val() || $el.attr('value') || $el.attr('name') || $el.text();
    }

    bindEvents();

    return {
        debug: logger.debug,
        verify: logger.debug, //for backwards compatibility. added v0.6.0 8th Oct 2013. PM. remove once everyone know not to use it!
        bind: bindEvents,
        track: track
    };

}(analytics.omniture, analytics.logger));

if (typeof window.define === "function" && window.define.amd) {
    define("core/link-clicks", ["core/page-view", "utils/logger"], function() {
        return analytics.linkClicks;
    });
}