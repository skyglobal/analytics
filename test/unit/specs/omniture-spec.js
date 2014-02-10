function omnitureSpec(config, om) {

    var describeSpec = "omniture can setVariables and ";

    window.s,_analytics = {config:{}};

    function setup() {
        s = {events:''};
        _analytics.config.variablesMap= {
            propOnly: ['prop12'],
            eVarOnly: ['eVar122'],
            propFirst: ['prop15','eVar7'],
            linkDetails: ['prop15','eVar7'],
            eVarFirst: ['eVar1', 'prop11'],
            withChannel: ['eVar14', 'prop13','channel'],
            withChannelFirst: ['channel','eVar14', 'prop13'],
            withHierarchy: ['eVar1', 'prop1','heir1'],
            pagename: ['pagename'],
            pagenameWithOthers: ['pagename','prop69']
        };
        _analytics.config.eventsMap = {
            pageLoad: 'event1',
            error: 'event3',
            linkClick: 'event6',
            firstPageVisited: 'event7'
        };
        _analytics.config.variableBasedEvents = {
            'propFirst': 'linkClick',
            'withHierarchy': 'firstPageVisited'
        };
    }

    setup();

    beforeEach(function() {
        setup();
    });

    describe(describeSpec, function() {
        it('returns a string', function() {
            var linkDetails = om.setVariable('propFirst', "0");
            expect(linkDetails).to.equal('0');
        });
        it('map an eVar to a prop', function() {
            var linkDetails = om.setVariable('propFirst', 'my-link-clicked');
            expect(s['propFirst']).to.equal('my-link-clicked')
            expect(linkDetails).to.equal('my-link-clicked');
            debugger;
            expect(s['eVar7']).to.equal('D=c15');
            expect(s['prop15']).to.equal('my-link-clicked');
        });

        it.skip('map a prop to and eVar', function() {
            var linkDetails = om.setVariable('eVarFirst', 'my-link-clicked');
            expect(linkDetails).to.equal('my-link-clicked');
            expect(s['eVar1']).to.equal('my-link-clicked');
            expect(s['prop11']).to.equal('D=v1');
        });

    });

    return describeSpec;
}
if (window.define) {
    define('specs/omniture-spec', ['core/config','core/omniture'], function (config, om) {
        return omnitureSpec(config, om);
    });
}
