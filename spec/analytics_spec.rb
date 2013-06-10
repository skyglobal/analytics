require 'minitest/autorun'
require 'minitest-capybara'
require 'capybara/poltergeist'
require_relative '../app'

class AcceptanceTest < MiniTest::Spec
  include Capybara::RSpecMatchers
  include Capybara::DSL
  Capybara.default_driver = :poltergeist
  Capybara.app = App
end


require 'addressable/uri'                                             
                                                                      
def http_request regex                                                
    page.driver.network_traffic.reverse.find { |req| req.url =~ regex } 
end                                                                   
                                                                      
def last_sitecat_request                                              
    Addressable::URI.parse http_request(/metrics.sky.com/).url          
end                                      

def tracked
  last_sitecat_request.query_values
end
                                                                      
def sitecat_mapping                                                   
    {                                                                   
       'section' => 'c27',                                               
       'step 3 section' => 'c31',                                        
       'contentType' => 'c20',                                           
       'page' => 'pageName',                                             
       'event' => 'events'                                               
    }                                                                   
end                                                                   

require 'pry'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "Tracks page view" do
     tracked['events'].must_include 'event1'
  end

  it "Tracks the correct page name" do
     tracked['pageName'].must_equal 'sky/portal/mysky/Analytics demo page'
  end

  it "Tracks a link being clicked" do
    click_link "Standard anchor link"
  end

  
end
