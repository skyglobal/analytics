if (typeof _analytics==='undefined') _analytics={};
_analytics.trackMedia = (function(config,omniture,media){

    var videoEl, isVideoPlaying, duration;

    function bindEvents(){
        $(videoEl).on('loadedmetadata durationchange seeked seeking play pause ended', eventHandler);
    }

    function setup(mediaConfig){
        videoEl = mediaConfig.videoElement;
        media.setVideoTitle(mediaConfig.videoTitle);
        media.setPlayerName(mediaConfig.playerName || 'html5player');
        omniture.setMediaVariable('videoTitle', mediaConfig.videoTitle);
        omniture.setMediaVariable('category', mediaConfig.category);
        omniture.setMediaVariable('mediaUrl', mediaConfig.mediaUrl);
        omniture.setMediaVariable('videoFormat', mediaConfig.videoFormat);
        omniture.setMediaVariable('type', mediaConfig.type);
        omniture.setMediaVariable('guid', mediaConfig.guid);
        duration = mediaConfig.duration?mediaConfig.duration:60;
    }

    var eventHandler = function(e) {
        var currentTime, medialength;
        if (videoEl.currentTime > 0) {
            currentTime = videoEl.currentTime;
        } else {
            currentTime = 0;
        }

        if (e.type == "loadedmetadata"){
            duration = videoEl.duration ? videoEl.duration : duration;
        }

        if (e.type == "seeking" && isVideoPlaying) {
            s.Media.stop(media.getMediaVariable('videoTitle'),currentTime);
        }
        if (e.type == "play" && isVideoPlaying) {
            s.Media.play(media.getMediaVariable('videoTitle'),currentTime);
        }
        if (e.type == "play" && !isVideoPlaying) {
            isVideoPlaying = true;
            medialength = videoEl.duration ? videoEl.duration : duration;
            s.Media.open(media.getMediaVariable('videoTitle'),medialength, media.getMediaVariable('playerName'));
            s.Media.play(media.getMediaVariable('videoTitle'),currentTime);
        }
        if (e.type == "seeked" && isVideoPlaying) {
            s.Media.play(media.getMediaVariable('videoTitle'),currentTime);
        }
        if (e.type == "pause" && isVideoPlaying) {
            s.Media.stop(media.getMediaVariable('videoTitle'),currentTime);
            if (currentTime == videoEl.duration) {
                isVideoPlaying = false;
                s.Media.close(media.getMediaVariable('videoTitle'));
            }
        }
        if (e.type == "ended") {
            isVideoPlaying = false;
            medialength = videoEl.currentTime? videoEl.currentTime: duration;
            s.Media.stop(media.getMediaVariable('videoTitle'),medialength);
            s.Media.close(media.getMediaVariable('videoTitle'));
        }
    };

    function track(mediaConfig) {
        media.load();
        setup(mediaConfig);
        bindEvents();
    }

    return {
        track: track
    };

}(  _analytics.config,
    _analytics.omniture,
    _analytics.plugins.media
));

if (typeof window.define === "function" && window.define.amd) {//just for require
    define("core/track-media", [
        'core/config',
        'core/omniture',
        'plugins/media'
    ], function(config, omniture, media) {
        return _analytics.trackMedia;
    });
}