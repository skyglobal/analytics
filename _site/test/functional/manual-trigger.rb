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

  it "Tracks an adHoc event/variable" do
    click_link "Send AdHoc Tracking"
    trackedEvents.must_equal [eventsMap[:myAdHocEvent]]
    trackedVariable('testAndTarget').must_include 'is poo'
    trackedVariable('petesDog').must_include 'is better'
  end

  it "Tracks a page view then adHoc event/variable" do
    click_link "Send AdHoc Tracking page view"
    trackedEvents.must_equal [eventsMap[:pageLoad]]
    trackedVariable('testAndTarget').must_be_nil
    trackedVariable('briansCat').must_be_nil

    click_link "Send AdHoc Tracking after page view"
    trackedEvents.must_equal [eventsMap[:myAdHocEvent]]
    trackedVariable('testAndTarget').must_include 'is poo'
    trackedVariable('briansCat').must_include 'is still great'
    trackedVariable('url').must_be_nil
  end

  it "adHoc event(s)/variable(s) must not be tracked on additional page views" do
    click_link "Send AdHoc Tracking page view"
    click_link "Send AdHoc Tracking after page view"
    click_link "Send AdHoc Tracking page view"
    trackedEvents.must_equal [eventsMap[:pageLoad]]
    trackedVariable('testAndTarget').must_be_nil
    trackedVariable('briansCat').must_be_nil
    trackedVariable('url').must_include 'D=c9'
  end

  it "Tracks multiple adHoc event/variables without polluting each other" do
    click_link "Send AdHoc Tracking"
    trackedEvents.must_equal [eventsMap[:myAdHocEvent]]
    trackedVariable('testAndTarget').must_include 'is poo'
    trackedVariable('petesDog').must_include 'is better'
    trackedVariable('briansCat').must_be_nil

    click_link "Send AdHoc Tracking after page view"
    trackedVariable('petesDog').must_be_nil
    trackedVariable('briansCat').must_include 'is still great'
  end
end