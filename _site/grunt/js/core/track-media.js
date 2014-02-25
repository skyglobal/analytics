if (typeof _analytics==='undefined') _analytics={};
_analytics.trackMedia = (function(config,omniture,media){

    var videoEl;
    var isVideoPlaying;

    function bindEvents(){
        videoEl.addEventListener('loadedmetadata',eventHandler,false);
        videoEl.addEventListener('durationchange',eventHandler,false);
        videoEl.addEventListener('seeked',eventHandler,false);
        videoEl.addEventListener('seeking',eventHandler,false);
        videoEl.addEventListener('play',eventHandler,false);
        videoEl.addEventListener('pause',eventHandler,false);
        videoEl.addEventListener('ended',eventHandler,false);
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
    }


    var eventHandler = function(e) {
        var currentTime;
        if (videoEl.currentTime > 0) {
            currentTime = videoEl.currentTime;
        } else {
            currentTime = 0;
        }

        if (e.type == "seeking" && isVideoPlaying) {
            s.Media.stop(media.get('videoTitle'),currentTime);
        }
        if (e.type == "play" && isVideoPlaying) {
            s.Media.play(media.get('videoTitle'),currentTime);
        }
        if (e.type == "play" && !isVideoPlaying) {
            isVideoPlaying = true;
            var medialength = videoEl.duration ? videoEl.duration : 60;
            s.Media.open(media.get('videoTitle'),medialength, media.get('playerName'));
            s.Media.play(media.get('videoTitle'),currentTime);
        }
        if (e.type == "seeked" && isVideoPlaying) {
            s.Media.play(media.get('videoTitle'),currentTime);
        }
        if (e.type == "pause" && isVideoPlaying) {
            s.Media.stop(media.get('videoTitle'),currentTime);
            if (currentTime == videoEl.duration) {
                isVideoPlaying = false;
                s.Media.close(media.get('videoTitle'));
            }
        }
        if (e.type == "ended") {
            isVideoPlaying = false;
            s.Media.stop(media.get('videoTitle'),currentTime);
            s.Media.close(media.get('videoTitle'));
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