require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "Tracks a link being clicked" do
    click_link "Standard link"
    tracked('event').must_include sitecat_mapping['click_event'] # link clicked
    tracked('link_tracking').must_include 'standard-link' # link name
    tracked('link_tracking').must_include 'global/analytics-demo-page' # page name included on link click
    tracked('pageName').must_include 'Analytics demo page' # page name
  end

  it "Tracks a button being clicked" do
    click_button "Normal Button"
    tracked('event').must_include sitecat_mapping['click_event']
    tracked('link_tracking').must_include 'normal-button'
  end
  it "A button being clicked twice doesn't have the events stacked'" do
    click_button "Normal Button"
    click_button "Normal Button"
    tracked('event').must_equal sitecat_mapping['click_event']
    tracked('link_tracking').must_include 'normal-button'
  end

  it "Tracks a button with an event attached" do
    click_link "Custom Event"
    tracked('event').must_include sitecat_mapping['magic_happened']
    tracked('link_tracking').must_include 'custom-event'
  end

  it "Tracks a link being clicked within a module and pod" do
    find(:css, "[data-tracking-module='testing'] [data-tracking-pod='pod-1'] a").click
    tracked('event').must_include sitecat_mapping['click_event']
    tracked('link_tracking').must_include 'testing'
    tracked('link_tracking').must_include 'pod-1'
    tracked('link_tracking').wont_include 'pod-2'
  end

  it "tracks non-anchor elements that have the data-tracking attribute" do
    find('#a-non-anchor').click
    tracked('link_tracking').must_include 'tracking-everything-else'
  end

  it "does not track elements which have data-tracking=false" do
    find('#anchor-not-tracked').click
    find('#button-not-tracked').click
    find('#submit-not-tracked').click
    tracked('link_tracking').must_be_nil
  end

  it "does not track non-anchors which have data-tracking=false" do
    find('h3[data-tracking="false"]').click
    tracked('link_tracking').must_be_nil
  end

end