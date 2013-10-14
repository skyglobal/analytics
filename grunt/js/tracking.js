if (typeof toolkit==='undefined') toolkit={};
toolkit.tracking = (function(omniture, logger){
//todo: test turn verify on in config
//todo: test val vs attr value and the rest of getText |
//todo: test for live binding

    var page,
        utils = omniture.utils,
        mandatory = ['site', 'section', 'account', 'page'];

    function bindVars(){
        page = {
            events:[],
            loadEvents:[],
            variables:{},
            loadVariables:{}
        };
    }

    function reset(){
        bindVars();
        omniture.reset();
    }

    function setup(custom){
        $.extend(page, custom);
        if (custom.debug){
            logger.debug(true);
        }
//        todo: console warning if no site or section
        checkMandatoryConfig();
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

    function checkMandatoryConfig(){
        for (var name in mandatory){
            if (!page[mandatory[name]]){
                console.error('Mandatory config is missing: ', mandatory[name]);
            }
        }
    }



//PAGE VIEW TRACKING
    function pageView(custom){
        reset();
        if (custom){
            setup(custom);
        }
        page.events.push(omniture.events.pageLoad);
        omniture.pageView ( page );
        logger.logPageView(omniture.s);
    }


//LINK TRACKING
    function track(e){
        checkMandatoryConfig();
        reset();
        logger.log('start','tracking event', e);
        var refDomain = document.referrer,
            url = window.location.href.split('?')[0],
            $el = $(e.currentTarget),
            context;

        addEvent('linkClick');
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
            addEvent('search');
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

        logger.logLinkDetails(linkDetails, page);

        return linkDetails.join('|');
    }



//    BELOW THIS LINE
//    ADD EVENTS/VARS TO tracking CODE
    function setupCustomVariable(item) {
        var trackedData = [],
            prop;
        if (item.prop){
            prop = 'prop' + item.prop;
            trackedData.push(prop);
        }
        if (item.eVar){
            prop = 'eVar' + item.eVar;
            trackedData.push(prop);
        }
        omniture.variables[item.name] = trackedData;
        if (item.onPageLoad) {
            page.loadVariables[item.name] = item.value;
        }
    }

    function setupCustomEvents(item) {
        omniture.events[item.name] =  'event' + item.event;
        page.events.push('event' + item.event);
        if (item.onPageLoad) {
            page.loadEvents.push(item.name);
        }
    }

    function normaliseItem(item){
        var properties, name;
        for (name in item) {
            if(item.hasOwnProperty(name)) {
                properties = item[name];
            }
        }
        return {
            value: properties.value,
            onPageLoad: properties.onPageLoad,
            event: properties.event,
            eVar: properties.eVar,
            prop: properties.prop,
            name: name
        };
    }

    function setupCustomEventsAndVariables(type){
        var arr = page['custom' + type],
            i = 0,
            len = arr.length,
            item, trackedData;
        for(i;i<len;i++){
            item = normaliseItem(arr[i]);
            if (type=='Variables') {
                setupCustomVariable(item);
            } else if (type=='Events') {
                setupCustomEvents(item);
            }
        }
    }


//    BELOW THIS LINE
//    ADD EVENTS/VARS TO OMNITURE CODE
    function addCustomClickEvents($el){
        var customEvent = $el.attr('data-tracking-event');
        if (!customEvent) return;
        addEvent(customEvent);
    }

    function addCustomClickVariable($el){
        var customVariable = $el.attr('data-tracking-variable');
        if (!customVariable) return;
        addVariable(customVariable,utils.getText($el));
    }

    function addVariable(variable, val){
        omniture.addVariable(variable, val);
        omniture.addLinkTrackVariable(variable);
        logger.log('prop',variable, val);
    }

    function addEvent(event){
        omniture.addEvent(event);
        logger.log('events', event, '');
    }

    bindEvents();
    bindVars();

    return {
        debug: logger.debug,
        verify: logger.debug, //for backwards compatibility. added v0.6.0 8th Oct 2013. PM. remove once everyone know not to use it!
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