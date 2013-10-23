require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "an event and variable is sent when triggering an error" do
    click_link('Send Error')
    trackedEvents.must_equal [eventsMap[:error]]
    trackedVariable('errors', :prop).must_include 'myCustomError'
  end

  it "Clicking an anchor without 'data-tracking=false' and manual js tracking is fired" do
    click_link('Send Error on page load')
    trackedEvents.must_equal [eventsMap[:pageLoad],eventsMap[:error]]
    trackedVariable('errors', :prop).must_include '404'
  end

end