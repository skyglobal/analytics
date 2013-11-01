require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "tracks search vars and is mapped correctly" do
    fill_in 'weather-search', with: 'Milkshake search'
    find('button[data-tracking-search]').click
    trackedEvents.must_include eventsMap[:linkClick]
    trackedVariable('linkDetails', :prop).must_include '|search|'
    trackedVariable('linkDetails', :prop).must_include '|milkshake-search|'
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
