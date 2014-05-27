
require_relative '../test_helper.rb'

module AnalyticsTest
class Media < AcceptanceTest

  before do
    visit '/'
  end

  it "Tracks a video being played" do
    find("#play-pooh").click

    trackedMediaVariable('videoTitle', :prop).must_equal 'Winnie the Pooh: Trailer'
    trackedMediaVariable('videoTitle').must_equal references('videoTitle', :prop)

    trackedMediaVariable('category', :hier).must_equal 'skymovies'
    trackedMediaVariable('category', :prop).must_equal references('category', 'name')
    trackedMediaVariable('category').must_equal references('category', 'name')

    trackedMediaVariable('mediaUrl').must_equal 'http://static.video.sky.com/skymovies/2014/02/73756/73756-576p_2000K_H264.mp4'

    trackedMediaVariable('videoFormat').must_equal '576p|2000k|video/mp4'
    trackedMediaVariable('videoFormat', :prop).must_equal references('videoFormat')

    trackedMediaVariable('type').must_equal 'video'
    trackedMediaVariable('type', :prop).must_equal references('type')

    trackedMediaVariable('guid').must_equal 'clip-0044tyky'
    trackedMediaVariable('guid', :prop).must_equal references('guid')

  end

  it "Tracks a video from start to end" do
    find("#play-pooh").click
    last_media_call[0].must_equal 'Winnie the Pooh: Trailer'
    last_media_call[1].must_equal '126'
    last_media_call[2].must_equal 'html5player'
    last_media_call[3].must_equal '0' #current time is start of video

    find("#end-pooh").click

    last_media_call[0].must_equal 'Winnie the Pooh: Trailer'
    last_media_call[1].must_equal '126'
    last_media_call[2].must_equal 'html5player'
    last_media_call[3].must_equal '126' #current time is end of video

  end

end
end