require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "Tracks an ajax page load" do
    click_link "Ajax Event"
    trackedEvents.must_include eventsMap[:pageLoad]
    trackedEvents.must_include eventsMap[:ajax_happened]
  end

  it "Tracks an ajax event only once per click" do
    click_link "Ajax Event"
    click_link "Ajax Event"
    trackedEvents.must_equal [eventsMap[:pageLoad],eventsMap[:ajax_happened]]
  end

end