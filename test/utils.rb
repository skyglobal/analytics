
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

def last_sitecat_request
  Addressable::URI.parse http_request(/metrics.sky.com/).first.url
end

def trackedVariable(name, variable_type=:eVar)
  last_sitecat_request.query_values[variablesMap[name.to_sym][variable_type.to_sym]]
end

def trackedEvents()
  last_sitecat_request.query_values['events'].split(',')
end

def references(name, variable_type=:eVar)
  'D=' + variablesMap[name.to_sym][variable_type.to_sym]
end

def variablesMap
  {
      searchType:{prop: 'c12',eVar: 'v31'},
      searchTerm:{prop: 'c1',eVar: 'v1'},
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
      videoTitle:{prop: 'c26',eVar: 'v28'},
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
  }
end