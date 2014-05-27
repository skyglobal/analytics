if (typeof _analytics==='undefined') _analytics={};
_analytics.config = (function(){

    var linkDetailsMap = [
            'module','pod','other','context','theme','textClicked','pageName'
        ],
        variablesMap = {
            '404Page': ['pageType'],
            ageGender: ['eVar12'],
            browseMethod: ['prop24'],
            channel: ['eVar24','channel','hier1'],
            contentId: ['prop21','eVar15'],
            contentType: ['prop20','eVar20'],
            errors: ['prop2','eVar2'],
            externalSearchTerm: ['prop17','eVar8'],
            fullCampaign: ['prop45','eVar45'],
            fullPageDescription: ['eVar55'],
            headline: ['prop3','eVar13'],
            insightCampaign: ['eVar46'],
            linkDetails: ['prop15','eVar7'],
            list1: ['list1'],
            list2: ['list2'],
            list3: ['list3'],
            list4: ['list4'],
            list5: ['list5'],
            loginStatus: ['eVar11'],
            masthead: ['prop63'],
            newRepeat: ["prop70", "eVar70"],
            optIn: ['eVar38'],
            pageConversion: ['eVar19'],
            pageName: ["pageName"],
            partTime: ['prop35','eVar35'],
            persistentLoginType: ['prop64'],
            product: ['products'],
            refDomain: ['prop36','eVar36'],
            samId: ['prop39','eVar39'],
            searchEngine: ['prop16','eVar3'],
            searchResults: ['prop34'],
            searchTerm: ['prop12','eVar31'],
            searchType: ['prop1','eVar1'],
            section0: ['prop25','eVar26'],
            section1: ['prop27','eVar29'],
            section2: ['prop31','eVar30'],
            section: ['section'],
            sessionCamID: ['prop62'],
            sessionCampaign: ['eVar47'],
            siteName: ['prop23','eVar14'],
            skyPackage: ['eVar16'],
            testAndTarget: ['eVar18'],
            url: ['prop9','eVar9'],
            visitNum: ["prop69", "eVar69"],
            visitorID: ["visitorID"]
        },
        mediaVariablesMap ={
            category: ['hier5', 'eVar70', 'eVar73', 'prop70', 'prop73'],
            guid: ['eVar72', 'prop72'],
            mediaUrl: ['eVar10'],
            type: ['eVar71', 'prop71'],
            videoFormat: ['eVar74', 'prop74'],
            videoTitle: ['prop26','eVar28']
        },
        eventsMap = {
            pageLoad: 'event1',
            error: 'event3',
            linkClick: 'event6',
            firstPageVisited: 'event7',
            secondPageVisited: 'event8',
            searchResults: 'event15',
            loginComplete: 'event16',
            loginStart: 'event17',
            regComplete: 'event18',
            regStart: 'event19',
            repeatVisit: 'event20',
            optIn: 'event25',
            zeroResults: 'event26',
            liveChat: "event36",
            passwordStart: 'event76',
            passwordComplete: 'event77',
            activateStart: 'event78',
            activateComplete: 'event79',
            orderConfirmation: 'purchase',
            productSelection: 'scOpen',
            orderSummary: 'scView',
            checkout: 'scCheckout',
            basketAdd: 'scAdd',
            basketRemove: 'scRemove',
            productView: 'prodView'


        },
        variableBasedEvents = {
            'searchResults': 'searchResults',
            'errors': 'error'
        };

    var linkInternalFilters = [
        'skyintranet','javahscript:'.replace('h',''),'sky.com','skysports.co.uk','skyarts.co.uk','skybet.com','skypoker.com','skybingo.com','skyvegas.com','teamtalk.com',
        'football365.com','sportinglife.com','sportal.com','bettingzone.co.uk','fixtures365.com','teamsky.com','oddschecker.com','sport365.com','skysports.com',
        'sky.zoopla.co.uk','skyoneonline.co.uk','bskybpensionplan.com','skymobileiphone.com','skymovies.com','skyone.co.uk','sky1.co.uk','skyoneonline.co.uk',
        'm.skynews.com','skyrainforestrescueschoolschallenge.org','skybroadband.com','skyartsonline.co.uk','skymoviesactive.com','skyhub.bskyb.com',
        'skyone.co.uk','sky.co.uk','skybet.mobi','socceram.com','teamtalk.co.za','football365.co.uk','jointhebiggerpicture.com','skysportsnewsradio.com','file',
        'contact.sky.com','rainforestrescue.com','nowtv.com',    window.location.host
    ];

    return {
        browseMethod: 'web',
        charSet: 'UTF-8',
        eventsMap: eventsMap,
        forceLinkTrackingTimeout: 150,
        linkDetailsMap: linkDetailsMap,
        linkDownloadFileTypes: 'exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx,air,wma,dmg',
        linkInternalFilters: linkInternalFilters.join(),
        linkLeaveQueryString: false,
        linkTrackEvents: 'None',
        linkTrackVars: 'None',
        loadEvents:[],
        loadVariables:{},
        variablesMap: variablesMap,
        mediaVariablesMap: mediaVariablesMap,
        QScmpId: 'cmpid,aff',
        QScmpIdInt: 'cmpid_int',
        server: window.location.hostname,
        setObjectIDs: true,
        trackClicks: true,
        trackDownloadLinks: true,
        trackExternalLinks: true,
        trackingServer: 'metrics.sky.com',
        trackingServerSecure: 'smetrics.sky.com',
        trackInlineStats: true,
        url: window.location.href.toString().split('?')[0],
        useForcedLinkTracking: true,
        variableBasedEvents: variableBasedEvents,
        visitorNamespace: 'bskyb'
    };

}());


if (typeof window.define === "function" && window.define.amd) {
    define("core/config", function() {
        return _analytics.config;
    });
}
