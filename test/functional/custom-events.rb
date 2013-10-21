require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "Tracks a custom event on page load" do
    click_link "Custom Page Load"
    trackedEvents.must_include eventsMap[:pageLoad]
    trackedEvents.must_include eventsMap[:custom_page_load]
  end

  it "Tracks a custom event on button click" do
    click_link "Custom Event"
    trackedEvents.wont_include eventsMap[:pageLoad]
    trackedEvents.must_include eventsMap[:linkClick]
    trackedEvents.must_include eventsMap[:magic_happened]
  end

end