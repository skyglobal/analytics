require_relative '../test_helper.rb'

class AnalyticsTest < AcceptanceTest

  before do
    visit '/'
  end

  it "Tracks a custom variable on page load with additional prop" do
    click_link "Custom Page Load"
    trackedVariable('my_custom_variable', :prop).must_equal 'my custom eVar value'
    trackedVariable('my_custom_variable').must_equal references('my_custom_variable', :prop)
  end

  it "Tracks a custom prop on page load" do
    click_link "Custom Page Load"
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
    trackedVariable('colour').must_equal 'Blue'
  end

end