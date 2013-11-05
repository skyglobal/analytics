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

  it "Clicking a span with manual binding fires the linkclick event" do
    find('#manualBind').click
    trackedEvents.must_equal [eventsMap[:linkClick]]
    trackedVariable('linkDetails', :prop).must_include '|span-manually-bound|'
  end

  it "Clicking an anchor with a manual binding fires the linkclick event" do
    click_link 'Anchor manually bound'
    trackedEvents.must_equal [eventsMap[:linkClick]]
    trackedVariable('linkDetails', :prop).must_include '|anchor-manually-bound|'
  end

  it "Tracks an ajax page load" do
    click_link "Ajax Event / Single page app"
    trackedEvents.must_include eventsMap[:pageLoad]
    trackedEvents.must_include eventsMap[:ajax_happened]
  end

  it "Tracks an ajax event only once per click" do
    click_link "Ajax Event / Single page app"
    click_link "Ajax Event / Single page app"
    trackedEvents.must_equal [eventsMap[:pageLoad],eventsMap[:ajax_happened]]
  end

end