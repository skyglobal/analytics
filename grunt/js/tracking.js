if (typeof toolkit==='undefined') toolkit={};
toolkit.tracking = (function(omniture){

    var vars = {
        verifying: false,
        verifyOutputId: 'toolkit-tracking-verify'
    };

    var config = {
        events:[],
        loadEvents:[],
        variables:{}
    };

    function pageView(extendedConfig){
        if (extendedConfig){
            setup(extendedConfig);
        }
        omniture.pageView ( config );
    }

    function setup(extendedConfig){
        $.extend(config, extendedConfig);
        addCustomLoadEvents(config.customEvents);
        addCustomVariables(config.customVariables);
    }

    function bindEvents(selector, evnt) {
        var clickSelector = selector || 'input[type=submit]:not([data-tracking=false]), button:not([data-tracking=false]), a:not([data-tracking=false]), [data-tracking]:not([data-tracking=false])';
        evnt = evnt || 'click toolkit.track';
        $(document).on(evnt, clickSelector, function(e) {
            track(e);
        });
    }

    function log(type, prop, val){
        if (!vars.verifying){ return; }
        if (type=='start'){
            val.preventDefault();
            console.group(prop);
            $('#' + vars.verifyOutputId).html('');
        } else if (type=='end'){
            console.groupEnd();
        } else {
            console.log(prop +': ', val);
            $('#' + vars.verifyOutputId).append('<div class="' + prop + '">' + prop +': ' + val + '</div>');
        }
    }



    function track(e){
        resetOmniture();
        log('start','tracking event', e);
        var refDomain = document.referrer,
            url = location.href.split('?')[0],
            $el = $(e.currentTarget),
            context;

        addEvents('linkClick');
        addData('events');
        addData('linkDetails', getProperties($el));
        addData('refDomain', refDomain);
        addData('url', url);
        addCustomClickData($el);
        addCustomClickEvents($el);

        if ($el.attr('data-tracking-search')){
            context = $el.attr('data-tracking-context') || getText($('#' + $el.attr('data-tracking-context-id')));
            addData('searchType', $el.attr('data-tracking-search'));
            addData('searchTerms', context);
            addEvents('search');
        }

        log('end');
        omniture.s.trackLink(this,'o','Link Click');
    }

    function resetOmniture(){
        omniture.s.linkTrackVars = '';
        omniture.s.events = '';
        omniture.s.linkTrackEvents = '';
    }

    function verify(on){
        if (on || on === undefined){
            vars.verifying = true;
            $('body').append('<div id="' + vars.verifyOutputId + '"></div>');
        } else {
            vars.verifying = false;
            $('#' + vars.verifyOutputId).remove();
        }
    }

    function getText($el){
        return $el.attr('data-tracking-label') || $el.attr('alt') || $el.attr('value') || $el.val() || $el.attr('name') || $el.text();
    }

//    not using jQuery .parents([data-tracking-whatever]) as is slow in ie and ff
    function checkParentForAttribute(el, attr){
        if (!el || !el.getAttribute) { return ''; }
        if (!!el.getAttribute(attr)){
            return el.getAttribute(attr);
        }
        return checkParentForAttribute(el.parentNode, attr);
    }

    function getProperties($el){
        var textClicked = getText($el),
            context = $el.attr('data-tracking-context') || getText($('#' + $el.attr('data-tracking-context-id'))),
            theme =  $el.attr('data-tracking-theme') || checkParentForAttribute($el[0],'data-tracking-theme'),
            other = checkParentForAttribute($el[0],'data-tracking-other'),
            pod =  checkParentForAttribute($el[0],'data-tracking-pod'),
            module = checkParentForAttribute($el[0],'data-tracking-module');

        if (vars.verifying){
            console.groupCollapsed('linkDetails');
            console.log('module: ', module);
            console.log('pod: ', pod);
            console.log('other: ', other);
            console.log('context: ', context);
            console.log('theme: ', theme);
            console.log('textClicked: ', textClicked);
            console.log('site: ', config.site);
            console.log('page: ', config.page);
            console.groupEnd();
        }

        return [
            safeString(module),
            safeString(pod),
            safeString(other),
            safeString(context),
            safeString(theme),
            safeString(textClicked),
            safeString(omniture.s.pageName.replace(/sky\/portal\//g, ''))
        ].join('|');
    }

    function safeString(str){
        if (typeof str === 'undefined') { return ''; }
        return $.trim(str).replace(/ /g,'-').replace(/[&,\+,:]/g,'').toLowerCase();
    }

    function addCustomVariables(customVars) {
        if (!customVars) return;
        var i=0,len=customVars.length,
            value, evar, name;
        for(i;i<len;i++){
            value = [];
            for (name in customVars[i]) {
                if(customVars[i].hasOwnProperty(name)) {
                    evar = customVars[i][name];
                    if (evar['var']){value.push('eVar' + evar['var']);}
                    if (evar.prop){value.push('prop' + evar.prop);}
                    omniture.vmap[name] = value;
                    config.variables[name] = evar.valueSelector;
                }
            }
        }
    }

    function addCustomLoadEvents(eventsArray) {
        if (!eventsArray) return;
        var i = 0,
            len = eventsArray.length,
            event, name, eventProperties;
        for(i;i<len;i++){
            event = eventsArray[i];
            for (name in event) {
                if(event.hasOwnProperty(name)) {
                    eventProperties = event[name];
                    omniture.eventMap[name] = 'event' + eventProperties.var;
                    config.events.push(name);
                    if (eventProperties.onPageLoad) {
                        config.loadEvents.push(name);
                        omniture.vmap.events.push(omniture.eventMap[name]);
                    }
                }
            }
        }
    }
























    function addData(prop, val){
        if(val){
            if (omniture.vmap[prop].length==1){
                omniture.s[omniture.vmap[prop][0]] = val;
            } else {
                var map = 'D=' + omniture.vmap[prop][1].replace('eVar','v').replace('prop','c');
                omniture.s[omniture.vmap[prop][0]] = map;
                omniture.s[omniture.vmap[prop][1]] = val;
            }
        }
        omniture.s.linkTrackVars += ',' + omniture.vmap[prop];
        log('prop',prop, val);
    }

    function addEvents(event){
        if (omniture.s.events.length>0) omniture.s.events += ',';
        omniture.s.events += omniture.eventMap[event];
        omniture.s.linkTrackEvents = omniture.s.events;
        log('events', event, omniture.eventMap[event]);
    }

    function addCustomClickEvents($el){
        var customEvent = $el.attr('data-tracking-custom-event');
        if (!customEvent) return;
        var event;
        for (event in config.events) {
            if(config.events.hasOwnProperty(event)) {
                addEvents(config.events[event]);
            }
        }
    }

    function addCustomClickData($el){
        var customVariable = $el.attr('data-tracking-custom-variable');
        var $trackingElement = (config.variables[customVariable]) ? $(config.variables[customVariable]) : $el;
        var value = getText($trackingElement);
        if (!customVariable) return;
        addData(customVariable,value);
    }

    bindEvents();

    return {
        verify: verify,
        setup: setup,
        pageView: pageView,
        bind: bindEvents,
        track: track
    };

}(toolkit.omniture));

if (typeof window.define === "function" && window.define.amd) {
    define("tracking", ["omniture"], function() {
        return toolkit.tracking;
    });
}