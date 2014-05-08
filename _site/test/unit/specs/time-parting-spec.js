function timePartingSpec(timeParting) {

    describe('time parting', function () {
        it('returns the day and time for right now', function() {
            var t = 'h',z = '0';
            var result = timeParting.getTimeParting(new Date());
            var segments = result.split('_');
            var dayPattern = /^[A-Z][a-z]{2,5}day$/;
            var hourPattern = /^[0-9]{1,2}$/;
            var minutePattern = /^[0-9]{2}$/;
            expect(segments.length).to.equal(3);
            assert.match(segments[0], dayPattern, 'Days should be capital followed by 3-6 lower characters, plus "day"')
            assert.match(segments[1], hourPattern, 'Hours should be 1-2 characters')
            assert.match(segments[2], minutePattern, 'Minutes should be 2 characters')
        });
    });

    describe('get the day and time', function() {
            it('at midnight', function() {
                var date = new Date('01/01/2014 00:00');
                var result = timeParting.getTimeParting(date);
                expect(result).to.equals('Wednesday_00_00');
            });
            it('at 13:03', function() {
                var date = new Date('01/01/2014 14:03');
                var result = timeParting.getTimeParting(date);
                expect(result).to.equals('Wednesday_14_03');
            });
            it('at 3:30', function() {
                var date = new Date('01/01/2014 03:30');
                var result = timeParting.getTimeParting(date);
                expect(result).to.equals('Wednesday_03_30');
            });
    });

    describe('British summer time', function() {
        it.only('Should return the correct date when it is BST', function() {
            var date = new Date('Thu May 08 2014 12:38:13 GMT+0100 (BST)');

            var result = timeParting.getTimeParting(date);

            expect(result).to.equals('Thursday_12_38');
        });

    });
}

if (window.define) {
    define('specs/time-parting-spec', ['plugins/time-parting'], function (timeParting) {
        return timePartingSpec(timeParting);
    });
}