require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "tracks search vars and is mapped correctly" do
    fill_in 'weather-search', with: 'Milkshake search'
    find('button[data-tracking-search]').click
    trackedEvents.must_include eventsMap[:linkClick] # link clicked
    #trackedEvents.must_include eventsMap[:search] # link clicked #todo: add search event into config
    trackedVariable('linkDetails', :prop).must_include '|search|'
    trackedVariable('linkDetails', :prop).must_include '|milkshake-search|'
    trackedVariable('searchType', :prop).must_include 'weather'
    trackedVariable('searchType').must_include references('searchType', :prop)
    trackedVariable('searchTerm', :prop).must_include 'Milkshake search'
    trackedVariable('searchTerm').must_include references('searchTerm', :prop)
  end

  #todo: andrew, why do this? --- > when zero this should also send the zeroResults event
  it "tracks search results" do
    click_button('Show Results page')
    trackedEvents.must_include eventsMap[:searchResults] # link clicked
    #trackedVariable('searchResults', :prop).must_include '1'
    trackedVariable('searchType', :prop).must_include 'weather'
    trackedVariable('searchTerm', :prop).must_include 'london'
  end

end
