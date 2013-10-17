require_relative '../test_helper.rb'
require 'pry'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
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
    tracked('pageName').must_include 'Analytics demo page' # page name
  end

  it "Tracks a button being clicked" do
    click_button "Normal Button"
    tracked('event').must_include sitecat_mapping['click_event']
    tracked('link_tracking').must_include 'normal-button'
  end

  it "Tracks a button with an event attached" do
    click_link "Custom Event"
    tracked('event').must_include sitecat_mapping['magic_happened']
    tracked('link_tracking').must_include 'custom-event'
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

  it "Tracks an ajax event only once per click" do
    click_link "Ajax Event"
    click_link "Ajax Event"
    tracked('event').must_equal "#{sitecat_mapping['page_load']},#{sitecat_mapping['ajax_happened']}"
  end

  it "Tracks a custom event on page load" do
    click_link "Custom Page Load"
    tracked('event').must_include sitecat_mapping['page_load'] # page load
    tracked('event').must_include sitecat_mapping['custom_page_load'] # custom event
  end

  it "Tracks a custom variable on page load with additional prop" do
    click_link "Custom Page Load"
    tracked('my_custom_variable_prop').must_include 'my custom eVar value'
    tracked('my_custom_variable').must_include 'D=c41'
  end

  it "Tracks a custom prop on page load" do
    click_link "Custom Page Load"
    tracked('my_custom_prop').must_include 'my custom prop value'
  end

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
    tracked('how_about_pina_coladas').must_include 'yes_to_pinas'
  end

  it "tracks a custom variable assigned on page load but set with a button click" do
    click_button 'colour-button-blue'
    tracked('colour').must_include 'Blue'
  end

  it "tracks when the analytics.track event is triggered" do
    page.execute_script("$('span[data-tracking]').trigger('analytics.track')")
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

  it "tracks search vars" do
    fill_in 'weather-location-search', with: 'Milkshake search'
    find('button[data-tracking-search]').click
    tracked('event').must_include sitecat_mapping['click_event'] # link clicked
    tracked('link_tracking').must_include '|search|'
    tracked('link_tracking').must_include '|milkshake-search|'
    tracked('search_type').must_include 'weather'
    tracked('search_term').must_include 'Milkshake search'
  end
  # Team specific
  # Video plays?

  # Products?

#  Manually Tigger Tracking
end
