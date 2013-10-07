if (typeof toolkit==='undefined') toolkit={};
toolkit.tracking = (function(omniture, logger){
//todo: turn verify on in config
//todo: write test for clicking AjaxEvent twice
//todo: test only expected events exist i.e only event101 and not 101
//todo: test val vs attr value and the rest of getText

    var page,
        utils = omniture.utils;

    function bindVars(){
        page = {
            events:[],
            variables:{},
            loadEvents:[],
            loadVariables:[]
        };
    }

    function reset(){
        bindVars();
        omniture.reset();
    }

    function setup(custom){
        $.extend(page, custom);
//        todo: console warning if no site or section
        setupCustomEventsAndVariables('Events');
        setupCustomEventsAndVariables('Variables');
    }

    function bindEvents(selector, evnt) {
        var clickSelector = selector || 'input[type=submit]:not([data-tracking=false]), button:not([data-tracking=false]), a:not([data-tracking=false]), [data-tracking]:not([data-tracking=false])';
        evnt = evnt || 'click toolkit.track';
        $(document).on(evnt, clickSelector, function(e) {
            track(e);
        });
    }



//PAGE VIEW TRACKING
    function pageView(custom){
        reset();
        if (custom){
            setup(custom);
        }
        page.events.push(omniture.events.pageLoad);
        omniture.pageView ( page );
    }


//LINK TRACKING
    function track(e){
        reset();
        logger.log('start','tracking event', e);
        var refDomain = document.referrer,
            url = window.location.href.split('?')[0],
            $el = $(e.currentTarget),
            context;

        addEvents('linkClick');
        addVariable('events');
        addVariable('linkDetails', getProperties($el));
        addVariable('refDomain', refDomain);
        addVariable('url', url);
        addCustomClickVariable($el);
        addCustomClickEvents($el);

//todo: merge this concept in with custom vars and events
        if ($el.attr('data-tracking-search')){
            context = $el.attr('data-tracking-context') || utils.getText($('#' + $el.attr('data-tracking-context-id')));
            addVariable('searchType', $el.attr('data-tracking-search'));
            addVariable('searchTerms', context);
            addEvents('search');
        }

        logger.log('end');
        omniture.s.trackLink(this,'o','Link Click');
    }


    function getProperties($el){
        var textClicked = utils.getText($el),
            context = $el.attr('data-tracking-context') || utils.getText($('#' + $el.attr('data-tracking-context-id'))),
            theme =  $el.attr('data-tracking-theme') || utils.checkParentForAttribute($el[0],'data-tracking-theme'),
            other = utils.checkParentForAttribute($el[0],'data-tracking-other'),
            pod =  utils.checkParentForAttribute($el[0],'data-tracking-pod'),
            module = utils.checkParentForAttribute($el[0],'data-tracking-module');

        var linkDetails = [
            utils.safeString(module),
            utils.safeString(pod),
            utils.safeString(other),
            utils.safeString(context),
            utils.safeString(theme),
            utils.safeString(textClicked),
            utils.safeString(omniture.s.pageName.replace(/sky\/portal\//g, ''))
        ];

        logger.logLinkDetails(linkDetails);

        return linkDetails.join('|');
    }



//    BELOW THIS LINE
//    ADD EVENTS/VARS TO tracking CODE
    function setupCustomVariable(item) {
        var trackedData = [];
        if (item.properties.var){trackedData.push('eVar' + item.properties.var);}
        if (item.properties.prop){trackedData.push('prop' + item.properties.prop);}
        omniture.variables[item.name] = trackedData;
    }

    function setupCustomEvents(item) {
        omniture.events[item.name] =  'event' + item.properties.event;
        page.events.push('event' + item.properties.event);
    }

    function normaliseItem(item){
        var properties, name;
        for (name in item) {
            if(item.hasOwnProperty(name)) {
                properties = item[name];
            }
        }
        return {
            properties: properties,
            name: name
        };
    }

    function setupCustomEventsAndVariables(type){
        var arr = page['custom' + type],
            i = 0,
            len = arr.length,
            item, map;
        for(i;i<len;i++){
            item = normaliseItem(arr[i]);
            if (type=='Variables') {
                setupCustomVariable(item);
                map = omniture.variables[item.name];
            } else if (type=='Events') {
                setupCustomEvents(item);
                map = omniture.variables.events;
            }
            if (item.properties.onPageLoad) {
                page['load' + type].push(item.name);
                map.push(omniture[type.toLowerCase()][item.name]);
            }
        }
    }


//    BELOW THIS LINE
//    ADD EVENTS/VARS TO OMNITURE CODE
    function addCustomClickEvents($el){
        var customEvent = $el.attr('data-tracking-event'),
            event;
        if (!customEvent) return;
        for (event in page.events) {
            if(page.events.hasOwnProperty(event)) {
                addEvents(page.events[event]);
            }
        }
    }

    function addCustomClickVariable($el){
        var customVariable = $el.attr('data-tracking-variable'),
            value;
        if (!customVariable) return;
        value = utils.getText($el);
        addVariable(customVariable,value);
    }

    function addVariable(prop, val){
        if(val){
            if (omniture.variables[prop].length==1){
                omniture.s[omniture.variables[prop][0]] = val;
            } else {
                var map = 'D=' + omniture.variables[prop][1].replace('eVar','v').replace('prop','c');
                omniture.s[omniture.variables[prop][0]] = map;
                omniture.s[omniture.variables[prop][1]] = val;
            }
        }
        omniture.s.linkTrackVars += ',' + omniture.variables[prop];
        logger.log('prop',prop, val);
    }

    function addEvents(event){
        if (omniture.s.events.length>0) omniture.s.events += ',';
        omniture.s.events += omniture.events[event];
        omniture.s.linkTrackEvents = omniture.s.events;
        logger.log('events', event, omniture.events[event]);
    }

    bindEvents();
    bindVars();

    return {
        verify: logger.verify,
        setup: setup,
        pageView: pageView,
        bind: bindEvents,
        track: track
    };

}(toolkit.omniture, toolkit.tracking.logger));

if (typeof window.define === "function" && window.define.amd) {
    define("tracking", ["omniture", "tracking/logger"], function() {
        return toolkit.tracking;
    });
}