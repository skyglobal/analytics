var s = s || {};
function setupMediaSpec(){
    s.loadModule = function(){
        this.Media = {};
    };
}

function mediaSpec(ms) {

    describe('media.js enables media tracking through omniture', function () {

        it('extends omniture for media tracking', function () {
            setupMediaSpec();
            expect(s).not.to.be.an('undefined');
            expect(s.m_Media_c).to.be.an('undefined');
            ms.load();
            expect(s.m_Media_c).not.to.be.an('undefined');
        });

    });

    describe('media.js load initialise omniture tracking with default setup', function () {

        beforeEach(function () {
            setupMediaSpec();
            ms.load();
        });

        it('should initialise the media module with default settings', function () {
            expect(s.Media).to.be.Object;
            expect(s.Media.trackWhilePlaying).to.be.equal(true);
            expect(s.Media.autoTrack).to.be.equal(true);
            expect(s.Media.playerName).to.be.equal("html5player");
            expect(s.Media.trackMilestones).to.be.equal("0,25,50,75");
        });

        it('should allow you to get the value of set parameters', function () {
            expect(s.Media.trackWhilePlaying).to.be.equal(ms.getMediaVariable('trackWhilePlaying'));
            expect(s.Media.autoTrack).to.be.equal(ms.getMediaVariable('autoTrack'));
            expect(s.Media.playerName).to.be.equal(ms.getMediaVariable('playerName'));
            expect(s.Media.trackMilestones).to.be.equal(ms.getMediaVariable('trackMilestones'));
        });

        it('should allow you to set/overwrite parameters', function () {
            ms.setMediaVariable('playerName', "notyourdefaultplayername");
            expect(ms.getMediaVariable('playerName')).to.be.equal("notyourdefaultplayername");
            ms.setMediaVariable("videoTitle","any title i want?");
            expect(ms.getMediaVariable('videoTitle')).to.be.equal("any title i want?");
        });

    });

}
if (window.define) {
    define('specs/media-spec', ['plugins/media'], function (ms) {
        return mediaSpec(ms);
    });
}
