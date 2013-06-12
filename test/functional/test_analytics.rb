require_relative '../test_helper.rb'

def http_request regex
  page.driver.network_traffic.reverse.find { |req| req.url =~ regex }
end

def last_sitecat_request
  Addressable::URI.parse http_request(/metrics.sky.com/).url
end

def tracked
  last_sitecat_request.query_values
end

def sitecat_mapping
  {
    'section' => 'c27',
    'step 3 section' => 'c31',
    'contentType' => 'c20',
    'page' => 'pageName',
    'event' => 'events'
  }
end

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "Tracks page view" do
    tracked['events'].must_include 'event1'
  end

  it "Tracks the correct page name" do
    tracked['pageName'].must_equal 'sky/portal/mysky/Analytics demo page'
  end

  it "Tracks a link being clicked" do
    click_link "Standard anchor link"
    tracked['events'].must_include 'event6'
    tracked['c15'].must_include 'standard-anchor-link'
  end

  it "Tracks a button being clicked" do
    click_button "Normal Button"
    tracked['events'].must_include 'event6'
    tracked['c15'].must_include 'normal-button'
  end

  it "Tracks a link being clicked within a module and pod" do
    find(:css, "[data-tracking-module='section-1'] [data-tracking-pod='pod-1'] a").click
    tracked['events'].must_include 'event6'
    tracked['c15'].must_include 'section-1'
    tracked['c15'].must_include 'pod-1'
    tracked['c15'].wont_include 'pod-2'
  end
end
