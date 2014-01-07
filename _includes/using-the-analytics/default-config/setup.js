//page view event
$('#session-cam-id-page-view-link').on('click', function(e){
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
$('#session-cam-id-link-click-link').on('click', function(e){
    e.preventDefault();
    window.sessionCamRecorder = {
        log :  function(){ },
        sessionId :  function(){ return '123,343';}
    };
});