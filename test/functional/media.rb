require_relative '../test_helper.rb'

module AnalyticsTest
class LinkClick < AcceptanceTest

  before do
    visit '/'
  end

  it "Tracks a video being played" do
    click_link "Play Pooh"

  end

end