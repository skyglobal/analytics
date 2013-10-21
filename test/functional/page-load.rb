require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "Tracks page view" do
    trackedEvents.must_include eventsMap[:pageLoad]
  end

  it "Tracks the correct page name, without debug info" do
    trackedVariable('pageName', :pagename).must_equal 'sky/portal/global/Analytics demo page'
    trackedVariable('url', :prop).must_equal current_url  # url
    trackedVariable('section0', :prop).must_include 'sky/portal/global/skyglobal'
    trackedVariable('section1', :prop).must_include 'analytics'
    #find('#analytics-debug ') todo: assert this doesnt exist
    #trackedVariable('link_tracking').must_be nil #todo: this.
  end

  it "Debug can be turned on on page load" do
    click_link 'Click here to see debug on load'
    trackedVariable('pageName', :pagename).must_equal 'sky/portal/global/Analytics debug demo page'
    trackedVariable('url', :prop).must_equal current_url  # url
    trackedVariable('section0', :prop).must_include 'sky/portal/global/skyglobal'
    trackedVariable('section1', :prop).must_include 'analytics'
    trackedVariable('section2', :prop).must_include 'debug'
    #find('#analytics-debug .pageLoad').must_equal 'pageLoad: event1'todo: assert this exists
    #find('#analytics-debug .pageName').must_equal 'pageName: sky/portal/anlytics/Analytics debug demo page'
  end

  it "Tracks page view using requireJS" do
    click_link 'Click here to see a requireJS example'#todo: wait for js to finish loading as is async
    #trackedVariable('pageName', :pagename).must_equal 'sky/portal/global/Analytics require demo page'
    #trackedVariable('url').must_equal current_url  # url
    #trackedVariable('section0').must_include 'sky/portal/global/skyglobal'
    #trackedVariable('section1').must_include 'analytics'
    #trackedVariable('section2').must_include 'require'
  end

end