//page view event
$('#sessionCamId-page-view-link').on('click', function(e){
    e.preventDefault();
    window.sessionCamRecorder = {
        log :  function(){ },
        sessionId :  function(){ return '987,654';}
    };
    analytics.trackPage({
        site: 'global',
        section: 'skyglobal/analytics/demo',
        account: 'bskybdemodev'
    });
});


//link click event
$('#sessionCamId-link-click-link').on('click', function(e){
    e.preventDefault();
    window.sessionCamRecorder = {
        log :  function(){ },
        sessionId :  function(){ return '123,343';}
    };
});