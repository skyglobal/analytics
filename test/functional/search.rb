require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "tracks search vars" do
    fill_in 'weather-search', with: 'Milkshake search'
    find('button[data-tracking-search]').click
    tracked('event').must_include sitecat_mapping['click_event'] # link clicked
    tracked('event').must_include sitecat_mapping['search'] # link clicked
    tracked('link_tracking').must_include '|search|'
    tracked('link_tracking').must_include '|milkshake-search|'
    tracked('search_type').must_include 'weather'
    tracked('search_term').must_include 'Milkshake search'
  end

#  todo: test searchResults on page view. when zero this should also send the zeroResults event

end
