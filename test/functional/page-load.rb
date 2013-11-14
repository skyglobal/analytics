require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "Tracks page view with correct site details" do
    trackedEvents.must_include eventsMap[:pageLoad]
    trackedEvents.wont_include eventsMap[:linkClick]
    trackedVariable('siteName',:prop).must_equal 'sky/portal/global'
    trackedVariable('channel').must_equal 'sky/portal/global/skyglobal/analytics/demo'
    trackedVariable('channel',:hier).must_equal references('channel',:eVar)
    trackedVariable('channel',:channel).must_equal references('channel',:eVar)
    trackedVariable('fullCampaign',:prop).must_equal nil #in theory, could be 'direct load' if this test is the very first
  end

  it "tracks 'section' as page name id 'page' is omitted" do
    click_link 'Click here to see this basic config in action'
    trackedVariable('pageName', :pagename).must_equal 'sky/portal/global/skyglobal/analytics/demo'
  end

  it "tracks 'section' + 'contentType' as page name id when 'page' is omitted and contentType is provided" do
    click_link 'Click here to see another custom config in action'
    trackedVariable('pageName', :pagename).must_equal 'sky/portal/global/skyglobal/analytics/demo/analytics'
  end

  it "tracks 'page' as page name over section if provided" do
    click_link 'Click here to see this custom config in action'
    trackedVariable('pageName', :pagename).must_equal 'sky/portal/global/Sky Analytics API Demo Page'
  end

  it "Tracks the correct page name, without debug info" do
    trackedVariable('pageName', :pagename).must_equal 'sky/portal/global/skyglobal/analytics/demo'
    trackedVariable('url', :prop).must_equal current_url  # url
    trackedVariable('section0', :prop).must_include 'sky/portal/global/skyglobal'
    trackedVariable('section1', :prop).must_include 'analytics'
    trackedVariable('linkDetails').must_be_nil
    assert has_no_css?('#analytics-debug')
  end

  it "Debug can be turned on on page load" do
    click_link 'Click here to see debug on load'
    trackedVariable('pageName', :pagename).must_equal 'sky/portal/global/skyglobal/analytics/debug/demo'
    trackedVariable('url', :prop).must_equal current_url  # url
    trackedVariable('section0', :prop).must_include 'sky/portal/global/skyglobal'
    trackedVariable('section1', :prop).must_include 'analytics'
    trackedVariable('section2', :prop).must_include 'debug'
    find('#analytics-debug .pageLoad').text.must_equal 'pageLoad: event1'
    find('#analytics-debug .pageName').text.must_equal 'pageName: sky/portal/global/skyglobal/analytics/debug/demo'
  end

  it "Tracks page view using requireJS" do
    click_link 'Click here to see a requireJS example'
    #trackedVariable('pageName', :pagename).must_equal 'sky/portal/global/Analytics require demo page'
    #trackedVariable('url').must_equal current_url  # url
    #trackedVariable('section0').must_include 'sky/portal/global/skyglobal'
    #trackedVariable('section1').must_include 'analytics'
    #trackedVariable('section2').must_include 'require'
  end

end