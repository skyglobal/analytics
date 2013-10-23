require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "Tracks a custom variable on page load with additional prop" do
    click_link "Custom Page Load"
    trackedEvents.wont_include eventsMap[:linkClick]
    trackedEvents.must_include eventsMap[:pageLoad]
    trackedVariable('my_custom_variable', :prop).must_equal 'my custom eVar value'
    trackedVariable('my_custom_variable').must_equal references('my_custom_variable', :prop)
  end

  it "Tracks a custom prop on page load" do
    click_link "Custom Page Load"
    trackedEvents.wont_include eventsMap[:linkClick]
    trackedEvents.must_include eventsMap[:pageLoad]
    trackedVariable('my_custom_prop', :prop).must_equal 'my custom prop value'
  end

  it "tracks custom variables assigned after page load in a text field" do
    fill_in 'What is your favourite drink?', with: 'Milkshake'
    within('#text-input') do
      click_button 'Submit'
    end
    trackedVariable('drink').must_equal 'Milkshake'
  end

  it "tracks custom variables assigned after page load from a radio button" do
    within('#radio-input') do
      choose 'Yes'
      click_button 'Submit'
    end
    trackedVariable('how_about_pina_coladas').must_equal 'yes_to_pinas'
  end

  it "tracks a custom variable assigned on page load but set with a button click" do
    click_button 'colour-button-blue'
    trackedEvents.must_include eventsMap[:linkClick]
    trackedEvents.wont_include eventsMap[:pageLoad]
    trackedVariable('colour').must_equal 'Blue'
  end

  it "tracks a standard variable sent with a button click" do
    click_link 'Send Standard Variable'
    trackedEvents.must_include eventsMap[:linkClick]
    trackedVariable('videoTitle', :prop).must_equal 'My Videos'
  end

  it "tracks a stanard variable sent on page load" do
    click_link 'Send Standard Variable on load'
    trackedEvents.must_include eventsMap[:pageLoad]
    trackedVariable('videoTitle', :prop).must_equal 'My Home Video'
    trackedVariable('externalSearchTerm', :prop).must_equal 'thrill rides'
  end

end