require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "Debug can be turned on for external links and loading external link is blocked" do
    click_link 'debug by clicking here'
    click_link 'Sky.com'

    page.title.must_equal 'Sky Analytics API Demo Page'

    click_link 'debug by clicking here'
    click_link 'Sky.com'

    page.title.wont_equal 'Sky Analytics API Demo Page'
  end

  it "Debug can be turned on for hash based urls and click event is blocked" do
    click_link 'debug by clicking here'
    click_link 'Searches'

    current_url.wont_include '#searches'

    click_link 'debug by clicking here'
    click_link 'Searches'

    current_url.must_include '#searches'
  end
end
