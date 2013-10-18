require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "Tracks page view" do
    tracked('event').must_include 'event1'
  end

  it "Tracks the correct page name, without debug info" do
    tracked('pageName').must_equal 'sky/portal/global/Analytics demo page'
    tracked('url').must_equal current_url  # url
    tracked('sub_section_1').must_include 'sky/portal/global/skyglobal'
    tracked('sub_section_2').must_include 'analytics'
    #find('#analytics-debug ') todo: assert this doesnt exist
  end

  it "Debug can be turned on on page load" do
    click_link 'Click here to see debug on load'
    tracked('pageName').must_equal 'sky/portal/global/Analytics debug demo page'
    tracked('url').must_equal current_url  # url
    tracked('sub_section_1').must_include 'sky/portal/global/skyglobal'
    tracked('sub_section_2').must_include 'analytics'
    tracked('sub_section_3').must_include 'debug'
    #find('#analytics-debug .pageLoad').must_equal 'pageLoad: event1'todo: assert this exists
    #find('#analytics-debug .pageName').must_equal 'pageName: sky/portal/anlytics/Analytics debug demo page'
  end

  it "Tracks page view using requireJS" do
    click_link 'Click here to see a requireJS example'#todo: wait for js to finish loading as is async
    #tracked('pageName').must_equal 'sky/portal/global/Analytics require demo page'
    #tracked('url').must_equal current_url  # url
    #tracked('sub_section_1').must_include 'sky/portal/global/skyglobal'
    #tracked('sub_section_2').must_include 'analytics'
    #tracked('sub_section_3').must_include 'require'
  end

end