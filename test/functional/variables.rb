require_relative '../test_helper.rb'

module AnalyticsTest
class Variables < AcceptanceTest

  before do
    visit '/'
  end

  it "Tracks a custom var on page load" do
    click_link "Custom Var Page Load"
    trackedEvents.wont_include eventsMap[:linkClick]
    trackedEvents.must_include eventsMap[:pageLoad]
    trackedVariable('how_about_pina_coladas').must_equal 'my val on load'
  end

  it "Tracks a custom var with only a prop on page load" do
    click_button "Send Custom Prop"
    trackedEvents.wont_include eventsMap[:linkClick]
    trackedEvents.must_include eventsMap[:pageLoad]
    trackedVariable('briansCat', :prop).must_equal 'is great'
  end

  it "Tracks a custom var with eVar and a prop on click" do
    click_link "Send Custom eVar and Prop"
    trackedEvents.must_include eventsMap[:linkClick]
    trackedEvents.wont_include eventsMap[:pageLoad]
    trackedVariable('briansEVarAndPropCat', :prop).must_equal 'is great'
    trackedVariable('briansEVarAndPropCat').must_equal 'D=c66'
  end

  it "Tracks a custom list on page load" do
    click_link "List Variable on page load"
    trackedEvents.wont_include eventsMap[:linkClick]
    trackedEvents.must_include eventsMap[:pageLoad]
    trackedVariable('myListOfStuff',:list).must_equal 'val1|my second|final value'
  end

  it "Tracks a custom list on click" do
    click_link "List Variable on click"
    trackedEvents.must_include eventsMap[:linkClick]
    trackedEvents.wont_include eventsMap[:pageLoad]
    trackedVariable('customerOffers',:list).must_equal 'offer1|offer2'
  end

  it "Tracks a custom hierarchy on page load" do
    click_link "Hierarchy Variable on page load"
    trackedEvents.wont_include eventsMap[:linkClick]
    trackedEvents.must_include eventsMap[:pageLoad]
    trackedVariable('myHierarchyOfStuff',:hier).must_equal 'h1|second h|final hier'
  end

  it "Tracks a custom hierarchy on click" do
    click_link "Hierarchy Variable on click"
    trackedEvents.must_include eventsMap[:linkClick]
    trackedEvents.wont_include eventsMap[:pageLoad]
    trackedVariable('myHeirarchy',:hier).must_equal 'click val 1|2nd click val'
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

  it "tracks a standard variable sent on page load" do
    click_link 'Send Standard Variable on load'
    trackedEvents.must_include eventsMap[:pageLoad]
    trackedVariable('videoTitle', :prop).must_equal 'My Home Video'
    trackedVariable('externalSearchTerm', :prop).must_equal 'thrill rides'
  end

end
end