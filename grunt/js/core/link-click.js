if (typeof _analytics==='undefined') _analytics={};
_analytics.linkClick = (function(config, omniture){

    function bindEvents(selector, evnt) {
        if(!config.trackLinks){return;}
        var clickSelector = selector || 'input[type=submit]:not([data-tracking=false]), button:not([data-tracking=false]), a:not([data-tracking=false]), [data-tracking]:not([data-tracking=false])';
        evnt = evnt || 'click';
        $(document).on(evnt, clickSelector, function(e) {
            track(e);
        });
        $(document).on('analytics-track','*', function(e) {
            e.stopPropagation();
            track(e);
        });
    }

    function track(e){
        var $el = $(e.currentTarget || e),
            context;

        addEvent('linkClick');
        addVariable('events');
        addVariable('linkDetails', getProperties($el));
        addVariable('refDomain', (document.referrer) ? document.referrer.split('/')[2] : '');
        addVariable('url', window.location.href.split('?')[0]);
        addCustomClickVariable($el);
        addCustomClickEvents($el);

        if ($el.attr('data-tracking-search')){
            context = $el.attr('data-tracking-context') || getText($('#' + $el.attr('data-tracking-context-id')));
            addVariable('searchType', $el.attr('data-tracking-search'));
            addVariable('searchTerm', context);
            addEvent('search');
        }
        omniture.trackLink(this);
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
    }

    function addEvent(event){
        omniture.setEvent(event);
        omniture.setLinkTrackEvent(event);
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

}(_analytics.config, _analytics.omniture));

if (typeof window.define === "function" && window.define.amd) {
    define("core/link-click", ["core/config","core/page-view"], function() {
        return _analytics.linkClick;
    });
}