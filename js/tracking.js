if (typeof toolkit==='undefined') toolkit={};
toolkit.tracking = (function(omniture){

    var vars = {
        verifying: false,
        verifyOutputId: 'bootstrap-tracking-verify',
        siteName: safeString($('#skycom-nav li.selected > a').text()),
        pageName: "",
        events:[],
        loadEvents:[],
        variables:{}
    };

    function setPageConfig(config){
        addCustomPageTrackingEvents();
        omniture.pageView ( config, "false" );
    }
    function resetPageConfig(config){
        addCustomPageTrackingEvents();
        omniture.pageView ( config, "true" );
    }

    function bindVars() {
        if (!vars.pageName)
            vars.pageName = safeString(omniture.s.pageName.replace(/sky\/portal\//g, ''));
    }

    function bindEvents(selector, evnt) {
        var clickSelector = selector || 'input[type=submit]:not([data-tracking=false]), button:not([data-tracking=false]), a:not([data-tracking=false]), [data-tracking]:not([data-tracking=false])';
        evnt = evnt || 'click toolkit.track';
        $('body').on(evnt, clickSelector, function(e) {
            track(e);
        });
    }

    function logTracking(type, prop, val){
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

    function addCustomTrackingEvents($el){
        var customEvent = $el.attr('data-tracking-custom-event');
        if (!customEvent) return;
        var event;
        for (event in vars.events) {
            if(vars.events.hasOwnProperty(event)) {
                addTrackingEvents(vars.events[event]);
            }
        }
    }

    function addCustomPageTrackingEvents(){
        var i;
        for (i in vars.loadEvents){
            if(vars.loadEvents.hasOwnProperty(i)) {
                //addTrackingEvents(vars.loadEvents[i]);
                //debugger
                loadEvent = omniture.eventMap[vars.loadEvents[i]];
                omniture.vmap.events.push(loadEvent);
            }
        }
    }

    function addCustomTrackingVars($el){
        var customVariable = $el.attr('data-tracking-custom-variable');
        var $trackingElement = (vars.variables[customVariable]) ? $(vars.variables[customVariable]) : $el;
        var value = getText($trackingElement);
        if (!customVariable) return;
        addTrackingVars(customVariable,value);
    }

    function addTrackingEvents(prop){
        if (omniture.s.events.length>0) omniture.s.events += ',';
        omniture.s.events += omniture.eventMap[prop];
        omniture.s.linkTrackEvents = omniture.s.events;
        logTracking('events', prop, omniture.eventMap[prop]);
    }

    function addTrackingVars(prop, val){
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
        logTracking('prop',prop, val);
    }

    function track(e){
        resetOmniture();
        logTracking('start','tracking event', e);
        var refDomain = document.referrer,
            url = location.href.split('?')[0],
            $el = $(e.currentTarget),
            context;

        addTrackingEvents('linkClick');
        addTrackingVars('events');
        addTrackingVars('siteName', vars.siteName);
        addTrackingVars('linkDetails', getTrackingProperties($el));
        addTrackingVars('refDomain', refDomain);
        addTrackingVars('url', url);
        addCustomTrackingVars($el);
        addCustomTrackingEvents($el);

        if ($el.attr('data-tracking-search')){
            context = $el.attr('data-tracking-context') || getText($('#' + $el.attr('data-tracking-context-id')));
            addTrackingVars('searchType', $el.attr('data-tracking-search'));
            addTrackingVars('searchTerms', context);
            addTrackingEvents('search');
        }

        logTracking('end');
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

    function getTrackingProperties($el){
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
            console.log('pageName: ', vars.pageName);
            console.groupEnd();
        }

        return [
            safeString(module),
            safeString(pod),
            safeString(other),
            safeString(context),
            safeString(theme),
            safeString(textClicked),
            vars.pageName
        ].join('|');
    }

    function safeString(str){
        if (typeof str === 'undefined') { return ''; }
        return $.trim(str).replace(/ /g,'-').replace(/[&,\+,:]/g,'').toLowerCase();
    }

    function addCustomEvents(events) {
        if (!events) return;
        var i = 0;
        var len = events.length;
        var event, name;
        for(i;i<len;i++){
            event=events[i];
            for (name in event) {
                if(event.hasOwnProperty(name)) {
                    objEvent = event[name];
                    omniture.eventMap[name] = 'event' + objEvent.event;
                    vars.events.push(name);
                    if (objEvent.onPageLoad) {
                        vars.loadEvents.push(name);
                    }
                }
            }
        }
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
                    vars.variables[name] = evar.valueSelector;
                }
            }
        }
    }

    function init(config, optional) {
        $.extend(true, vars, optional);
        addCustomEvents(config.customEvents);
        addCustomVariables(config.customVariables);
        setPageConfig(config);
        bindEvents();
        bindVars();
        var output = {
            verify: verify,
            resetPageConfig: resetPageConfig,
            bind: bindEvents,
            track: track
        };
        toolkit.tracking = output;
        return output;
    }

    return init;

}(toolkit.omniture));

if (typeof window.define === "function" && window.define.amd) {
    define("tracking", ["omniture"], function() {
        return toolkit.tracking;
    });
}
