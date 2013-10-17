require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "Tracks a custom event on page load" do
    click_link "Custom Page Load"
    tracked('event').must_include sitecat_mapping['page_load'] # page load
    tracked('event').must_include sitecat_mapping['custom_page_load'] # custom event
  end

end