ENV['RACK_ENV'] = 'test'
require 'minitest/autorun'
require 'minitest-capybara'
require 'capybara/rspec/matchers'
require 'capybara/poltergeist'
require 'rack/test'
require 'addressable/uri'
require_relative 'utils.rb'
require "minitest/reporters"
require File.expand_path '../../app.rb', __FILE__

class AcceptanceTest < MiniTest::Spec
  Minitest::Reporters.use!

  Minitest::Reporters.use! [Minitest::Reporters::SpecReporter.new, Minitest::Reporters::JUnitReporter.new]
  include Capybara::RSpecMatchers
  include Capybara::DSL
  Capybara.default_driver = :poltergeist
  Capybara.app = App

end
