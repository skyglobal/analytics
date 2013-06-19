require 'bundler'
Bundler.require :default

class App < Sinatra::Base
  get '/' do
    redirect to('/docs/index.html')
  end

  get '/docs/index.html' do
    send_file File.join('views', 'index.html')
  end

  get '/docs/custom_page_load.html' do
    send_file File.join('views', 'custom_page_load.html')
  end

  # ASSETS
  get '/:filename' do
    send_file File.join('lib', params[:filename])
  end

  get '/docs/css/:filename' do
    filename = File.join('views','css', params[:filename])
    send_file filename
  end
end
