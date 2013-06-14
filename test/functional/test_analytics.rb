require_relative '../test_helper.rb'

def http_request regex
  page.driver.network_traffic.reverse.find { |req| req.url =~ regex }
end

def last_sitecat_request
  Addressable::URI.parse http_request(/metrics.sky.com/).url
end

def tracked(value)
  last_sitecat_request.query_values[sitecat_mapping[value]]
end

def sitecat_mapping
  {
    'section' => 'c27',
    'step 3 section' => 'c31',
    'contentType' => 'c20',
    'page' => 'pageName',
    'event' => 'events',
    'url' => 'c9',
    'link_tracking' => 'c15',
    'click_event' => 'event6',
    'sub_section_1' => 'c25',
    'sub_section_2' => 'c27',
    'sub_section_3' => 'c31',
    'party_id' => 'c39',
    'login_complete' => 'event16',
    'link_clicked' => 'event6'
  }
end

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "Tracks page view" do
    tracked('event').must_include 'event1'
  end

  it "Tracks the correct page name" do
    tracked('page').must_equal 'sky/portal/mysky/Analytics demo page'
    tracked('url').must_equal current_url  # url
    # subsection 1, 2, 3
  end

  # login test - party_id
  # should fire on every page after login

  # login complete test - login_complete
  # should only fire on the first page after logging in
  # After this, subsequent pages should not have event16 

  it "Tracks a link being clicked" do
    click_link "Standard anchor link"
    tracked('event').must_include sitecat_mapping['click_event'] # link clicked
    tracked('link_tracking').must_include 'standard-anchor-link' # link name
    tracked('link_tracking').must_include 'Analytics-demo-page' # page name
  end

  it "Tracks a button being clicked" do
    click_button "Normal Button"
    tracked('event').must_include sitecat_mapping['click_event']
    tracked('link_tracking').must_include 'normal-button'
  end

  it "Tracks a link being clicked within a module and pod" do
    find(:css, "[data-tracking-module='section-1'] [data-tracking-pod='pod-1'] a").click
    tracked('event').must_include sitecat_mapping['click_event']
    tracked('link_tracking').must_include 'section-1'
    tracked('link_tracking').must_include 'pod-1'
    tracked('link_tracking').wont_include 'pod-2'
  end

  it "Tracks an ajax page load" do
    click_link "Custom Page Load"
    tracked('event').must_include 'event1' # page load
    tracked('event').must_include 'event99'
  end

  it "Tracks a custom event on page load" do
    click_link "Ajax Event"
    tracked('event').must_include 'event1' # page load
    tracked('event').must_include 'event101'
  end

  # Custom variable on page load (merge with above)

  # Team specific
  # Video plays?

  # Products?
end
