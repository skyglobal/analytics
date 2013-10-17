require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
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


end