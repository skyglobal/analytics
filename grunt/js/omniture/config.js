if (typeof toolkit==='undefined') toolkit={};
if (typeof toolkit.omniture==='undefined') toolkit.omniture={};
toolkit.omniture.config = (function(){

//todo: merge these maps together into one
    var trackedData = {
        searchType: ['prop12','eVar31'],
        searchTerms: ['prop1','eVar1'],
        searchResults: ['prop34'],
        headline: ['prop3','eVar13'],
        errors: ['prop2','eVar2'],
        url: ['prop9','eVar9'],
        refDomain: ['prop36','eVar36'],
        contentType: ['prop20','eVar20'],
        contentId: ['prop21','eVar15'],
        siteName: ['prop23','eVar14'],
        browseMethod: ['prop24'],
        section0: ['prop25','eVar26'],
        section1: ['prop27','eVar29'],
        section2: ['prop31','eVar30'],
        videoTitle: ['prop26','eVar28'],
        channel: ['channel','eVar24','hier1'],
        partTime: ['prop35','eVar35'],
        samId: ['prop39','eVar39'],
        loginStatus: ['eVar11'],
        ageGender: ['eVar12'],
        skyPackage: ['eVar16'],
        optIn: ['eVar38'],
        linkDetails: ['eVar7','prop15'],
        newRepeat: ["prop70", "eVar70"],
        visitNum: ["prop69", "eVar69"],
        visitorID: ["visitorID"],
        QScmpId: [],
        QScmpIdInt: [],
        account: [],
        section: [''],
        events: []
    },
    trackedEvents = { //todo: add event1 + event20
        pageLoad: 'event1',
        loginStart: 'event17',
        loginComplete: 'event16',
        regStart: 'event19',
        regComplete: 'event18',
        optIn: 'event25',
        passwordStart: 'event76',
        passwordComplete: 'event77',
        activateStart: 'event78',
        activateComplete: 'event79',
        linkClick: 'event6',
        liveChat: "event36"
    };

    return {
        trackedEvents: trackedEvents,
        trackedData: trackedData
    };

}());


if (typeof window.define === "function" && window.define.amd) {
    define("omniture/config", function() {
        return toolkit.omniture.config;
    });
}