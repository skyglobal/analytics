
def http_request regex
  page.driver.network_traffic.reverse.find_all do |req|
    # Requests that navigate away from the page won't return a response code,
    # also ignore 302 redirects
    (req.url =~ regex) and (req.response_parts.first == nil or req.response_parts.first.status != 302)
  end
end

def all_sitecat_requests
  http_request(/metrics.sky.com/).collect{ |req| Addressable::URI.parse req.url}
end

def media_sitecat_request
  arr = Array.new
  all_sitecat_requests.each{ |req|
    if req.query_values.include?('pev3')
      arr.push(req)
    end
  }
  arr
end

def n_sitecat_request(n)
  Addressable::URI.parse http_request(/metrics.sky.com/)[n].url
end

def last_sitecat_request
  Addressable::URI.parse http_request(/metrics.sky.com/).first.url
end

def last_media_call
  media_sitecat_request.first.query_values['pev3'].split('--**--')
end

def trackedVariable(name, variable_type=:eVar)
  last_sitecat_request.query_values[variablesMap[name.to_sym][variable_type.to_sym]]
end

def trackedMediaVariable(name, variable_type=:eVar)
  media_sitecat_request.first.query_values[variablesMap[name.to_sym][variable_type.to_sym]]
end

def trackedEvents()
  last_sitecat_request.query_values['events'].split(',')
end

def references(name, variable_type=:eVar)
  'D=' + variablesMap[name.to_sym][variable_type.to_sym]
end

def variablesMap
  {
      searchType:{prop: 'c1',eVar: 'v1'},
      searchTerm:{prop: 'c12',eVar: 'v31'},
      searchResults:{prop: 'c34'},
      headline:{prop: 'c3',eVar: 'v13'},
      errors:{prop: 'c2',eVar: 'v2'},
      url:{prop: 'c9',eVar: 'v9'},
      refDomain:{prop: 'c36',eVar: 'v36'},
      contentType:{prop: 'c20',eVar: 'v20'},
      contentId:{prop: 'c21',eVar: 'v15'},
      siteName:{prop: 'c23',eVar: 'v14'},
      section:{prop: 'c23',eVar: 'v14'},
      browseMethod:{prop: 'c24'},
      section0:{prop: 'c25',eVar: 'v26'},
      section1:{prop: 'c27',eVar: 'v29'},
      section2:{prop: 'c31',eVar: 'v30'},
      videoTitle:{prop: 'c26', eVar: 'v28'},
      category:{hier:'h5', eVar:'v73', prop:'c73', name:'hier5'},
      mediaUrl:{eVar:'v10'},
      videoFormat:{eVar:'v74', prop:'c74'},
      type:{eVar: 'v71', prop: 'c71'},
      guid:{eVar: 'v72', prop: 'c72'},
      channel: {eVar: 'v24',channel:'ch',hier: 'h1'},
      samId:{prop: 'c39',eVar: 'v39'},
      loginStatus: {eVar: 'v11'},
      ageGender: {eVar: 'v12'},
      skyPackage: {eVar: 'v16'},
      optIn: {eVar: 'v38'},
      masthead: {prop: 'c63' },
      linkDetails:{prop: 'c15',eVar: 'v7'},
      newRepeat: {prop: "c70", eVar: "v70"},
      visitNum: {prop: "c69", eVar: "v69"},
      visitorID: {visitor: "visitorID"},
      pageName: { pagename: "pageName"},
      pageType: { pageType: "pageType"},
      pageConversion: {eVar: 'v19'},
      searchEngine:{prop: 'c16',eVar: 'v3'},
      fullPageDescription: {eVar: 'v55'},
      fullCampaign:{prop: 'c45',eVar: 'v45'},
      sessionCampaign: {eVar: 'v47'},
      sessionCamID: {prop: 'c62'},
      insightCampaign: {eVar: 'v46'},
      externalSearchTerm:{prop: 'c17',eVar: 'v8'},
      testAndTarget: {eVar: 'v18'},
      my_custom_variable: {eVar: 'v41', prop:  'c41'},
      my_custom_prop: {prop: 'c40'},
      drink: {eVar: 'v72'},
      how_about_pina_coladas: {eVar: 'v73'},
      colour: {eVar: 'v71'},
      myListOfStuff: {list:'l1'},
      customerOffers: {list:'l2'},
      myHierarchyOfStuff: {hier:'h2'},
      myHeirarchy: {hier:'h3'},
      briansCat: {prop: 'c66', eVar: 'v66'},
      petesDog: {prop: 'c67', eVar: 'v67'},
      partTime: {prop: 'c35', eVar: 'v35'},
      briansEVarAndPropCat: { eVar: 'v11', prop: 'c66'},
  }
end





def eventsMap
  {
      pageLoad: 'event1',
      error: 'event3',
      linkClick: 'event6',
      firstPageVisited: 'event7',
      secondPageVisited: 'event8',
      searchResults: 'event15',
      loginComplete: 'event16',
      loginStart: 'event17',
      regComplete: 'event18',
      regStart: 'event19',
      repeatVisit: 'event20',
      optIn: 'event25',
      zeroResults: 'event26',
      liveChat: 'event36',
      passwordStart: 'event76',
      passwordComplete: 'event77',
      activateStart: 'event78',
      activateComplete: 'event79',
      custom_page_load:'event99',
      ajax_happened: 'event101',
      magic_happened: 'event101',
      serialEvent: 'event666:devil12345',
      myAdHocEvent: 'event69',
      orderConfirmation: 'purchase',
      productSelection: 'scOpen',
      orderSummary: 'scView',
      checkout: 'scCheckout',
      basketAdd: 'scAdd',
      basketRemove: 'scRemove',
      productView: 'prodView'
  }
end
