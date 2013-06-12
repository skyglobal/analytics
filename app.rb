require 'bundler'
Bundler.require :default

class App < Sinatra::Base
  get '/' do
    erb :index
  end

  get '/js/:filename' do
    send_file File.join('lib', params[:filename])
  end
end
