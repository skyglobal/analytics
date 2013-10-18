#require_relative '../test_helper.rb'
#
#class AnalyticsTest < AcceptanceTest
#
#  before do
#    visit '/'
#  end
#
#  #setPartnerAndKeyWords
#
#  #mock getVariable
#    #to include _keywords, _partner, _channel, _referringDomain, _campaignID
#
#  #mock setVariable
#
#  #mock httpsSearch
#
#
#  #test output of fullCampaign, externalSearchProvider, externalSearchTerm
#
#  partner = 'out-partner'
#  keyword = 'out-keyword'
#
#  it "setting different campaign values still returns the correct search details and campaign" do
#
#    when the campaign is <campaign>
#    and the channel is <chan>
#    and the referrer is <ref>
#    then the fullCampaign output is <fullCampaign>
#    and the externalSearchProvider output is <externalSearchProvider>
#    and the externalSearchTerm output is <externalSearchTerm>
#
#    | campaign | chan | ref | fullCampaign | externalSearchProvider | externalSearchTerm |
#        '' | '' | '' | '' | '' | '' |
#        'knc-pete' | '' | '' | 'knc-pete-out-partner:out-keyword' | 'out-partner' | 'out-keyword' |
#        'knc-' | '' | '' | 'knc-out-partner:out-keyword' | 'out-partner' | 'out-keyword' |
#        '' | 'natural search' | '' | 'okc-natural search' | 'out-partner' | 'out-keyword' |
#        '' | 'other search' | '' | '' | '' | '' |
#        '' | 'direct load' | '' | 'direct load' | '' | '' |
#        '' | '' | 'google' | 'okc-secured natural search' | 'google' | 'secured search term' |
#        '' | '' | 'pete' | 'oth-pete' | '' | '' |
#        'ilc-analytics' | '' | '' | 'ilc-analytics' | '' | '' |
#        'afc-analytics2' | '' | '' | 'afc-analytics2' | '' | '' |
#
#  end
#
#  #setupCampaignCookies
#
#  #mock getVariable
#    #to include fullCampaign, _channel, campaignCookie
#
#  #mock setVariable
#  #mock getValOnce
#  #mock httpsSearch
#  #mock getValOnce to return 'out-getValOnce-' + input
#
#  #mock session.cmp_cookie_session, persistant.cmp_cookie
#
#  #test output of fullCampaign, externalSearchProvider, externalSearchTerm
#
#  campaignCookie = 'out-campaignCookie'
#  campaign = 'out-campaign'
#
#  it "setting different campaign values still returns the correct search details and campaign" do
#
#    when the fullCampaign is <fullCampaign>
#    and the session is <session>
#    and the persistant is <persistant>
#    then the fullCampaign output is <fullCampaign>
#    and the campaignCookie output is <campaignCookie>
#    and the campaign output is <campaign>
#
#    | campaign |  session | persistant | fullCampaign | campaignCookie | campaign |
#      '' |  '' | '' | '' | '' | '' |
#      'ilc-analytics' |  '' | '' | 'ilc-analytics' | '' | '' |
#      'direct load'  |  '' | '' | 'direct load' | 'direct load' | 'direct load' |
#      'oth-pete'  |  '' | '' | 'oth-pete' | 'oth-pete' | 'oth-pete' |
#      'direct load'  |  'afc-analytics2' | '' | '' | '' | '' |
#      'oth-pete'  |  'afc-analytics2' | '' | '' | '' | '' |
#      'direct load'  |  '' | 'afc-analytics2' | 'direct load' | 'direct load' | '' |
#      'oth-pete'  |  '' | 'afc-analytics2' | 'oth-pete' | 'oth-pete' | '' |
#      'afc-analytics2'  | '' | '' | 'afc-analytics2' | 'afc-analytics2' | 'afc-analytics2' |
#      'new-analytics2' | 'afc-analytics2' | 'afc-analytics2' | 'afc-analytics2' | '' | '' |
#      'ajg-analytics2' | '' | 'afc-analytics2' | 'ajg-analytics2' | 'ajg-analytics2' | '' |
#
#  end
#
#end
