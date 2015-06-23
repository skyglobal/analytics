if (typeof _analytics==='undefined') _analytics={};
if (typeof _analytics.plugins==='undefined') _analytics.plugins={};

_analytics.plugins.timeParting = (function(omniture, config){

    function isBST(date){

        var currentYear= new Date().getFullYear();

        var d = new Date ( currentYear , 2 , 29 );
        var dstStart =  new Date("03/"+(31-d.getDay())+"/"+currentYear);
        d = new Date ( currentYear , 9 , 25 );
        var dstEnd =  new Date("10/"+(31-d.getDay())+"/"+currentYear);
        return (date > dstStart && date < dstEnd) ? true : false;

    }


    function getUTC(date) {
        return new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
    }

    function adjustDateForTimezone(date){

        var utc = getUTC(date);
        utc = new Date(isBST(date) ? utc + 3600000 : utc);

        return utc;

    }

        /*
        * Plugin: getTimePartingJH
        * Based on getTimeParting 2.0 - Set timeparting values based on time zone
        * This version is altered for BSKYB to return WeekDay_hr_quarter
        * as in Wednesday_17_15  (when called with t="h")
        * By Jeroen Hustinx sept 24, 2010
        *
        * UPDATE
        * Refactored. Note that this was originally returning actual minute and not quarter.
        *
        * By SkyCom Jan 7, 2014
        */

    var getTimeParting = function(date){
        var dateCheck=new Date('1/1/2000');
        if(dateCheck.getDay() != 6 || dateCheck.getMonth() != 0) { return 'Data Not Available';}

        date = date || new Date();
        var timeZone = (isBST(date) ? date : getUTC(date));

        var hour = timeZone.getHours();
        var minute = timeZone.getMinutes();
        var day = timeZone.getDay();

        var hourPadded = (hour < 10 ? '0' + hour : hour);
        var minutePadded = (minute < 10 ? '0' + minute : minute);

        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        return days[day] + '_' + hourPadded + '_' + minutePadded;
    };

    function load(){

        omniture.addPlugin('getTimeParting', getTimeParting);

        var partTime = s.getTimeParting();
        omniture.setVariable('partTime', partTime);

    }

    return {
        load: load,
        getTimeParting: getTimeParting,
        adjustDateForTimezone: adjustDateForTimezone
    };

}(_analytics.omniture, _analytics.config));

if (typeof window.define === "function" && window.define.amd) {
    define("plugins/time-parting", ['core/omniture', 'core/config'], function(omniture, config) {
        return _analytics.plugins.timeParting;
    });
}
