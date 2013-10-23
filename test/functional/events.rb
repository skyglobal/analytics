require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "Tracks a custom event on page load" do
    click_link "Custom Page Load"
    trackedEvents.wont_include eventsMap[:linkClick]
    trackedEvents.must_include eventsMap[:pageLoad]
    trackedEvents.must_include eventsMap[:custom_page_load]
  end

  it "Tracks a custom event on button click" do
    click_link "Custom Event"
    trackedEvents.wont_include eventsMap[:pageLoad]
    trackedEvents.must_include eventsMap[:linkClick]
    trackedEvents.must_include eventsMap[:magic_happened]
    trackedVariable('linkDetails', :prop).must_include 'custom-event'
  end

  it "Tracks a standard event on page load" do
    click_link "Send Standard Events on load"
    trackedEvents.must_equal [eventsMap[:pageLoad], eventsMap[:liveChat]]
  end

  it "Tracks a standard event on button click" do
    click_link "Send Standard Event"
    trackedEvents.wont_include eventsMap[:pageLoad]
    trackedEvents.must_equal [eventsMap[:linkClick], eventsMap[:liveChat]]
  end

end