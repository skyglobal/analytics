window.s,_analytics = {config:{}};

function setupOmnitureSpec(){
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

setupOmnitureSpec();
function omnitureSpec(config, omniture) {


    beforeEach(function () {
        setupOmnitureSpec();
    });

    afterEach(function() {
        // restore the environment as it was before
    });

    describe('omniture can setVariables and ', function() {

        it('returns a string', function() {
            var linkDetails = omniture.setVariable('propFirst', 0);
            expect(linkDetails).to.equal('0');
        });
        it('map an eVar to a prop', function() {
            var linkDetails = omniture.setVariable('propFirst', 'my-link-clicked');
            expect(linkDetails).to.equal('my-link-clicked');
            expect(s['eVar7']).to.equal('D=c15');
            expect(s['prop15']).to.equal('my-link-clicked');
        });
        it('map a prop to and eVar', function() {
            var linkDetails = omniture.setVariable('eVarFirst', 'my-link-clicked');
            expect(linkDetails).to.equal('my-link-clicked');
            expect(s['eVar1']).to.equal('my-link-clicked');
            expect(s['prop11']).to.equal('D=v1');
        });
        it('handle a single prop', function() {
            var linkDetails = omniture.setVariable('propOnly', 'my-link-clicked');
            expect(linkDetails).to.equal('my-link-clicked');
            expect(s['prop12']).to.equal('my-link-clicked');
        });
        it('handle a single eVar', function() {
            var linkDetails = omniture.setVariable('eVarOnly', 'my-link-clicked');
            expect(linkDetails).to.equal('my-link-clicked');
            expect(s['eVar122']).to.equal('my-link-clicked');
        });
        it('handle a channel', function() {
            var linkDetails = omniture.setVariable('withChannel', 'my-link-clicked');
            expect(linkDetails).to.equal('my-link-clicked');
            expect(s['eVar14']).to.equal('my-link-clicked');
            expect(s['prop13']).to.equal('D=v14');
            expect(s['channel']).to.equal('D=v14');
        });
        it('handle a channel first', function() {
            var linkDetails = omniture.setVariable('withChannelFirst', 'my-link-clicked');
            expect(linkDetails).to.equal('my-link-clicked');
            expect(s['channel']).to.equal('my-link-clicked');
            expect(s['prop13']).to.equal('D=ch');
            expect(s['eVar14']).to.equal('D=ch');
        });
        it('handle a pagename', function() {
            var linkDetails = omniture.setVariable('pagename', 'my-link-clicked');
            expect(linkDetails).to.equal('my-link-clicked');
            expect(s['pagename']).to.equal('my-link-clicked');
        });
        it('handle a pagename with others', function() {
            var linkDetails = omniture.setVariable('pagenameWithOthers', 'my-link-clicked');
            expect(linkDetails).to.equal('my-link-clicked');
            expect(s['pagename']).to.equal('my-link-clicked');
            expect(s['prop69']).to.equal('D=pagename');
        });
        it('handle an unknown variable', function() {
            var linkDetails = omniture.setVariable('woah', 'my-link-clicked');
            expect(linkDetails).to.equal('my-link-clicked');
            expect(s['woah']).to.equal('my-link-clicked');
        });
    });

    describe('omniture can set events and ', function() {

        it('maps the event correctly', function() {
            omniture.setEvent('pageLoad');
            expect(s['events']).to.equal('event1');
        });

        it('stack them', function() {
            omniture.setEvent('pageLoad');
            omniture.setEvent('error');
            expect(s['events']).to.equal('event1,event3');
        });

        it('doesnt care about duplicates', function() {
            omniture.setEvent('pageLoad');
            omniture.setEvent('pageLoad');
            expect(s['events']).to.equal('event1,event1');
        });
    });

    describe('omniture can set variables and ', function() {
        it('maps it correctly', function() {
            omniture.setLinkTrackVariable('pagename');
            expect(s['linkTrackVars']).to.equal('pagename');
        });

        it('stack them', function() {
            omniture.setLinkTrackVariable('pagename');
            omniture.setLinkTrackVariable('propFirst');
            expect(s['linkTrackVars']).to.equal('pagename,prop15,eVar7');
        });

        it('doesnt care about duplicates', function() {
            omniture.setLinkTrackVariable('pagename');
            omniture.setLinkTrackVariable('pagename');
            expect(s['linkTrackVars']).to.equal('pagename,pagename');
        });

    });

    describe('omniture can set link track events and ', function() {
        it('maps it correctly', function() {
            omniture.setLinkTrackEvent('pageLoad');
            expect(s['linkTrackEvents']).to.equal('event1');
        });

        it('stack them', function() {
            omniture.setLinkTrackEvent('pageLoad');
            omniture.setLinkTrackEvent('firstPageVisited');
            expect(s['linkTrackEvents']).to.equal('event1,event7');
        });

        it('doesnt care about duplicates', function() {
            omniture.setLinkTrackEvent('pageLoad');
            omniture.setLinkTrackEvent('pageLoad');
            expect(s['linkTrackEvents']).to.equal('event1,event1');
        });

    });

    describe('omniture can set events based on variables already existing and ', function() {

        it('maps it correctly', function() {
            omniture.setVariableBasedEvents('propFirst');
            expect(s['events']).to.equal('event6');
        });

        it('doesnt set an unknown mapping', function() {
            omniture.setVariableBasedEvents('doesntExist');
            expect(s['events']).to.equal('');
        });

    });

    describe('omniture can reset the important vars ', function() {

        it('correctly', function() {
            omniture.setEvent('pageLoad','load');
            omniture.setEvent('error','click');
            omniture.setVariable('linkDetails', 'my-link-clicked', 'click');
            omniture.setVariable('pagename', 'my-link-clicked-test');
            omniture.setVariableBasedEvents('propFirst');
            omniture.reset();
            expect(s['pagename']).to.equal('my-link-clicked-test');
            expect(s['events']).to.equal('');
            expect(s['linkTrackVars']).to.equal('');
            expect(s['linkTrackEvents']).to.equal('');
            expect(s['prop15']).to.equal('');
            expect(s['eVar7']).to.equal('D=c15');
        });

    });

    return "test";
}

if (window.define) {
    define('specs/omniture-spec', ['core/config', 'core/omniture'], function (config, omniture) {
        return omnitureSpec(config, omniture);
    });
}