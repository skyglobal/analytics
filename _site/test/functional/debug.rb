require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "Debug can be turned on for external links and loading external link is blocked" do
    click_link 'debug on'
    click_link 'Changes'

    page.title.must_equal 'Sky Analytics API Demo Page'

    click_link 'debug off'
    click_link 'Changes'

    page.title.wont_equal 'Sky Analytics API Demo Page'
  end

  it "Debug can be turned on for hash based urls and click event is blocked" do
    click_link 'debug on'
    click_link 'Tracking'

    current_url.wont_include '#using-me'

    click_link 'debug off'
    click_link 'Tracking'

    current_url.must_include '#tracking'
  end


  it "Debug can be turned on on page load which displays analytics info within the page" do
    click_link 'Click here to see debug on load'
    assert has_css?('#analytics-debug')
    find('#analytics-debug .pageLoad').text.must_equal 'pageLoad: event1'
    find('#analytics-debug .pageName').text.must_equal 'pageName: sky/portal/global/skyglobal/analytics/debug/demo'
    find('#analytics-debug .section2').text.must_equal 'section2: sky/portal/global/skyglobal/analytics/debug'
  end

  it "Debug can be turned off which will not display analytics info within the page" do
    click_link 'debug off'
    click_link 'Standard link'
    assert has_no_css?('#analytics-debug')
  end

  it "Debug can be turned on and http requests are blocked" do
    click_link 'debug off'
    click_link 'Standard link'
    trackedEvents.must_equal [eventsMap[:linkClick]]
    trackedEvents.wont_include eventsMap[:pageLoad]

    click_link 'debug on'
    click_link 'Click here to see resetting config in action'
    trackedEvents.must_equal [eventsMap[:linkClick]]
    trackedEvents.wont_include eventsMap[:pageLoad]

    click_link 'debug off'
    click_link 'Click here to see resetting config in action'

    trackedEvents.wont_equal [eventsMap[:linkClick]]
    trackedEvents.must_include eventsMap[:pageLoad]
  end
end
