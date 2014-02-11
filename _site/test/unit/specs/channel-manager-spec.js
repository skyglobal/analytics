var s = {}, omniture_s = {}, _analytics = {},session={},
    cookieValue, referredByGoogle, getValOnce;

function setupOmnitureSepc() {
    s['getValOnce'] = function (val, name) {
        return val
    };
    cookieValue = {};
    referredByGoogle = false;
    omniture_s = {
        _keywords: 'dummy_keyword',
        _partner: 'dummy_partner',
        _channel: '',
        _referringDomain: '',
        _campaignID: '',
        fullCampaign: '',
        sessionCampaign: '',
        campaign: '',
        searchEngine: '',
        externalSearchTerm: ''
    },
    _analytics = {
        omniture: {
            getVariable: function (name) {
                return omniture_s[name];
            },
            setVariable: function (name, value) {
                return omniture_s[name] = value;
            }
        },
        plugins: {
            utils: {
            getCookie: function (name) {
                return cookieValue[name];
            },
            referredByGoogle: function () {
                return referredByGoogle;
            }
        }}
    };
}
setupOmnitureSepc();
function channelSpec(cm) {


    describe('Channel manager sets search engine and key words', function () {

        beforeEach(function () {
            setupOmnitureSepc();
        });

        it('when nothing exists', function () {
            cm.setPartnerAndKeyWords();
            expect(omniture_s['fullCampaign']).to.equal('');
            expect(omniture_s['searchEngine']).to.equal('');
            expect(omniture_s['externalSearchTerm']).to.equal('');
        });

        it('when a paid-for campaign is set (knc-)', function () {
            omniture_s._campaignID = 'knc-';
            cm.setPartnerAndKeyWords();
            expect(omniture_s['fullCampaign']).to.equal('knc-dummy_partner:dummy_keyword');
            expect(omniture_s['searchEngine']).to.equal('dummy_partner');
            expect(omniture_s['externalSearchTerm']).to.equal('dummy_keyword');
        });

        it('when a paid-for campaign is set (knc-xxx)', function() {
            omniture_s._campaignID = 'knc-pete';
            cm.setPartnerAndKeyWords();
            expect(omniture_s['fullCampaign']).to.equal('knc-pete-dummy_partner:dummy_keyword');
            expect(omniture_s['searchEngine']).to.equal('dummy_partner');
            expect(omniture_s['externalSearchTerm']).to.equal('dummy_keyword');
        });

        it('when a natural search is performed', function() {
            omniture_s._channel = 'natural search';
            cm.setPartnerAndKeyWords();
            expect(omniture_s['fullCampaign']).to.equal('okc-natural search');
            expect(omniture_s['searchEngine']).to.equal('dummy_partner');
            expect(omniture_s['externalSearchTerm']).to.equal('dummy_keyword');
        });

        it('when page is a loaded directly', function() {
            omniture_s._channel = 'direct load';
            cm.setPartnerAndKeyWords();
            expect(omniture_s['fullCampaign']).to.equal('direct load');
            expect(omniture_s['searchEngine']).to.equal('');
            expect(omniture_s['externalSearchTerm']).to.equal('');
        });

        it('when page is a loaded from a different search method', function() {
            omniture_s._channel = 'other load';
            cm.setPartnerAndKeyWords();
            expect(omniture_s['fullCampaign']).to.equal('');
            expect(omniture_s['searchEngine']).to.equal('');
            expect(omniture_s['externalSearchTerm']).to.equal('');
        });

        it('when a search comes via google', function() {
            referredByGoogle = true;
            cm.setPartnerAndKeyWords();
            expect(omniture_s['fullCampaign']).to.equal('okc-secured natural search');
            expect(omniture_s['searchEngine']).to.equal('google');
            expect(omniture_s['externalSearchTerm']).to.equal('secured search term');
        });

        it('when a search comes via not-google', function() {
            omniture_s._referringDomain = 'pete';
            cm.setPartnerAndKeyWords();
            expect(omniture_s['fullCampaign']).to.equal('oth-pete');
            expect(omniture_s['searchEngine']).to.equal('');
            expect(omniture_s['externalSearchTerm']).to.equal('');
        });

        it('when a search comes via ilc', function() {
            omniture_s._campaignID = 'ilc-analytics';
            cm.setPartnerAndKeyWords();
            expect(omniture_s['fullCampaign']).to.equal('ilc-analytics');
            expect(omniture_s['searchEngine']).to.equal('');
            expect(omniture_s['externalSearchTerm']).to.equal('');
        });

        it('when a search comes via afc', function() {
            omniture_s._campaignID = 'afc-analytics2';
            cm.setPartnerAndKeyWords();
            expect(omniture_s['fullCampaign']).to.equal('afc-analytics2');
            expect(omniture_s['searchEngine']).to.equal('');
            expect(omniture_s['externalSearchTerm']).to.equal('');
        });

    });

    describe('Channel manager sets campaign cookies', function() {
        beforeEach(function () {
            setupOmnitureSepc();
        });

        it('when nothing exists', function() {
            cm.setupCampaignCookies();
            expect(omniture_s['fullCampaign']).to.equal('');
            expect(omniture_s['searchEngine']).to.equal('');
            expect(omniture_s['externalSearchTerm']).to.equal('');
        });

        it('when vistor has come via the ilc campaign', function() {
            omniture_s._campaignID = 'ilc-analytics';
            cm.setupCampaignCookies();
            expect(omniture_s['fullCampaign']).to.equal('');
            expect(omniture_s['sessionCampaign']).to.equal('');
            expect(omniture_s['campaign']).to.equal('');
        });

        it('when vistor has come via dirtect load with no cookies already set', function() {
            omniture_s._campaignID = 'direct load';
            omniture_s.fullCampaign = 'direct load';
            omniture_s.sessionCampaign = 'direct load';
            cm.setupCampaignCookies();
            expect(omniture_s['fullCampaign']).to.equal('direct load');
            expect(omniture_s['sessionCampaign']).to.equal('direct load');
            expect(omniture_s['campaign']).to.equal('direct load');
        });

        it('when vistor has come via somewhere else with no cookies already set', function() {
            omniture_s._campaignID = 'oth-pete';
            omniture_s.fullCampaign = 'oth-pete';
            omniture_s.sessionCampaign = 'oth-pete';
            cm.setupCampaignCookies();
            expect(omniture_s['fullCampaign']).to.equal('oth-pete');
            expect(omniture_s['sessionCampaign']).to.equal('oth-pete');
            expect(omniture_s['campaign']).to.equal('oth-pete');
        });

        it('when vistor has come via direct load with a session cookie already set', function() {
            omniture_s._campaignID = 'direct load';
            cookieValue['cmp_cookie_session'] = 'afc-analcytics2';
            omniture_s.fullCampaign = 'oth-pete';
            omniture_s.sessionCampaign = 'oth-pete';
            cm.setupCampaignCookies();
            expect(omniture_s['fullCampaign']).to.equal('');
            expect(omniture_s['sessionCampaign']).to.equal('oth-pete');
            expect(omniture_s['campaign']).to.equal('oth-pete');
        });

        it('when vistor has come via direct load with a persistant cookie already set', function() {
            omniture_s._campaignID = 'direct load';
            cookieValue['cmp_cookie'] = 'afc-analcytics2';
            omniture_s.fullCampaign = 'direct load';
            omniture_s.sessionCampaign = 'direct load';
            cm.setupCampaignCookies();
            expect(omniture_s['fullCampaign']).to.equal('direct load');
            expect(omniture_s['sessionCampaign']).to.equal('direct load');
            expect(omniture_s['campaign']).to.equal('');
        });

    });
}

if (window.define) {
    define('specs/channel-manager-spec', ['plugins/channel-manager','core/config', 'plugins/utils'], function (cm) {
        return channelSpec(cm);
    });
}
