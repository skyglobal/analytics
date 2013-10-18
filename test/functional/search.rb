require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  # login test - party_id
  # should fire on every page after login

  # login complete test - login_complete
  # should only fire on the first page after logging in
  # After this, subsequent pages should not have event16

  #todo: test the search event!
  it "tracks search vars" do
    fill_in 'weather-search', with: 'Milkshake search'
    find('button[data-tracking-search]').click
    tracked('event').must_include sitecat_mapping['click_event'] # link clicked
    #tracked('event').must_include sitecat_mapping['search'] # link clicked
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
