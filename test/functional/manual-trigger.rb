require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "Clicking a span without 'data-tracking' but with manual js tracking is fired" do
    find('#manualTrack').click
    trackedEvents.must_equal [eventsMap[:linkClick]]
    trackedVariable('linkDetails', :prop).must_include '|span-manually-tracked-by-js|'
  end

  it "Clicking an anchor without 'data-tracking=false' and manual js tracking is fired" do
    click_link 'Anchor being tracked with JS'
    trackedEvents.must_equal [eventsMap[:linkClick]]
    trackedVariable('linkDetails', :prop).must_include '|anchor-being-tracked-with-js|'
  end

end