require_relative '../test_helper.rb'
require 'pry'

def http_request regex
  page.driver.network_traffic.reverse.find_all do |req| 
    # Requests that navigate away from the page won't return a response code,
    # also ignore 302 redirects
    (req.url =~ regex) and (req.response_parts.first == nil or req.response_parts.first.status != 302)
  end
end

def all_sitecat_requests
  http_request(/metrics.sky.com/).collect{ |req| Addressable::URI.parse req.url}
end

def last_sitecat_request
  Addressable::URI.parse http_request(/metrics.sky.com/).first.url
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
    'page_load' => 'event1',
    'login_complete' => 'event16',
    'link_clicked' => 'event6',
    'custom_page_load' => 'event99',
    'ajax_happened' => 'event101',
    'drink' => 'v72',
    'how_about_pina_coladas' => 'v73',
    'colour' => 'v71'
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
    tracked('sub_section_1').must_include 'sky/portal/mysky/skyglobal'
    tracked('sub_section_2').must_include 'analytics'
    # subsection 3 isn't set on this site
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
    tracked('link_tracking').must_include 'mysky/analytics-demo-page' # page name included on link click
    tracked('page').must_include 'Analytics demo page' # page name
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
    click_link "Ajax Event"
    tracked('event').must_include sitecat_mapping['page_load'] # page load
    tracked('event').must_include 'event101' # custom event
  end

  it "Tracks a custom event on page load" do
    click_link "Custom Page Load"
    tracked('event').must_include sitecat_mapping['page_load'] # page load
    tracked('event').must_include sitecat_mapping['custom_page_load'] # custom event
  end

  # Custom variable on page load
  #it "Tracks a custom variable on page load" do
    #click_link "Custom Page Load"
    #tracked('event').must_include sitecat_mapping['page_load'] # page load
  #end

  it "tracks custom variables assigned after page load in a text field" do
    fill_in 'What is your favourite drink?', with: 'Milkshake'
    within('#text-input') do
      click_button 'Submit'
    end
    tracked('drink').must_include 'Milkshake'
  end

  it "tracks custom variables assigned after page load from a radio button" do
    within('#radio-input') do
      choose 'Yes'
      click_button 'Submit'
    end
    tracked('how_about_pina_coladas').must_include 'yes_to_pina'
  end

  it "tracks a custom variable assigned on page load but set with a button click" do
    click_button 'colour-button-blue'
    tracked('colour').must_include 'Blue'
  end

  it "tracks when the toolkit.track event is triggered" do
    page.execute_script("$('span[data-tracking]').trigger('toolkit.track')")
    tracked('link_tracking').must_include 'a-non-anchor'
  end

  it "tracks non-anchor elements that have the data-tracking attribute" do
    find('span[data-tracking]').click
    tracked('link_tracking').must_include 'a-non-anchor'
  end

  it "does not track anchors which have data-tracking=false" do
    click_link 'Untracked anchor link'
    tracked('link_tracking').must_be_nil
  end

  it "does not track non-anchors which have data-tracking=false" do
    find('h3[data-tracking="false"]').click
    tracked('link_tracking').must_be_nil
  end
  # Team specific
  # Video plays?

  # Products?
end
