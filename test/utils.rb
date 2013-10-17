
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

def tracked(value)
  last_sitecat_request.query_values[sitecat_mapping[value]]
end

def sitecat_mapping
  {
      'section' => 'c27',
      'step 3 section' => 'c31',
      'contentType' => 'c20',
      'pageName' => 'pageName',
      'event' => 'events',
      'url' => 'c9',
      'link_tracking' => 'c15',
      'click_event' => 'event6',
      'sub_section_1' => 'c25',
      'sub_section_2' => 'c27',
      'sub_section_3' => 'c31',
      'party_id' => 'c39',
      'page_load' => 'event1',
      'login_complete' => 'event16',
      'link_clicked' => 'event6',
      'custom_page_load' => 'event99',
      'my_custom_variable' => 'v41',
      'my_custom_variable_prop' => 'c41',
      'my_custom_prop' => 'c40',
      'ajax_happened' => 'event101',
      'magic_happened' => 'event101',
      'drink' => 'v72',
      'how_about_pina_coladas' => 'v73',
      'colour' => 'v71',
      'search_term' => 'c1',
      'search_type' => 'c12'
  }
end