ENV['RACK_ENV'] = 'test'
require 'minitest/autorun'
require 'minitest-capybara'
require 'capybara/poltergeist'
require 'rack/test'
require 'addressable/uri'

require File.expand_path '../../app.rb', __FILE__

class AcceptanceTest < MiniTest::Spec
  include Capybara::RSpecMatchers
  include Capybara::DSL
  Capybara.default_driver = :poltergeist
  Capybara.app_host = 'http://localhost:4000'
  Capybara.app = App
end
