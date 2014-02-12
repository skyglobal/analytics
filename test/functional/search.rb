require_relative '../test_helper.rb'

module AnalyticsTest
class Search < AcceptanceTest

  before do
    visit '/'
  end

  it "tracks search vars and is mapped correctly" do
    fill_in 'weather-search', with: 'Milkshake search'
    click_button('Search with event type')
    trackedEvents.must_include eventsMap[:linkClick]
    trackedVariable('linkDetails', :prop).must_include '|search-with-event-type|'
    trackedVariable('linkDetails', :prop).must_include '|milkshake-search|'
    trackedVariable('linkDetails', :prop).must_include '|click|'
    trackedVariable('searchType', :prop).must_include 'weather'
    trackedVariable('searchType').must_include references('searchType', :prop)
    trackedVariable('searchTerm', :prop).must_include 'Milkshake search'
    trackedVariable('searchTerm').must_include references('searchTerm', :prop)
  end

  it "tracks search results and prop of 0 (int) is sent to omniture" do
    click_button('Show Results page')
    trackedEvents.must_include eventsMap[:searchResults]
    trackedVariable('searchResults', :prop).must_include '0'
    trackedVariable('searchType', :prop).must_include 'weather'
    trackedVariable('searchTerm', :prop).must_include 'london'
  end

end
end
