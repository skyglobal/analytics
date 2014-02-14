require_relative '../test_helper.rb'


module AnalyticsTest
class Errors < AcceptanceTest

  before do
    visit '/'
  end

  it "an event and variable is sent when triggering an error" do
    click_link('Send Error')
    trackedEvents.must_equal [eventsMap[:error]]
    trackedVariable('errors', :prop).must_include 'myCustomError'
  end

  it "Can send errors variable" do
    click_link('Send Error on page load')
    trackedEvents.must_equal [eventsMap[:pageLoad],eventsMap[:error]]
    trackedVariable('errors', :prop).must_include 'nnn-service-down'
  end


  it "can send pageType error" do
    click_link('Send 404 on page load')
    trackedEvents.must_equal [eventsMap[:pageLoad]]
    trackedVariable('pageType', :pageType).must_include 'errorPage'
  end

end
  end