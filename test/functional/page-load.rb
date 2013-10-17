
require_relative '../test_helper.rb'
require 'pry'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "Tracks page view" do
    tracked('event').must_include 'event1'
  end

  it "Tracks the correct page name" do
    tracked('pageName').must_equal 'sky/portal/mysky/Analytics demo page'
    tracked('url').must_equal current_url  # url
    tracked('sub_section_1').must_include 'sky/portal/mysky/skyglobal'
    tracked('sub_section_2').must_include 'analytics'
    # subsection 3 isn't set on this site
  end

end