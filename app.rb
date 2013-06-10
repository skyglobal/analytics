require 'bundler'                                                                                             
Bundler.require :default                                                                                      

class App < Sinatra::Base
  get '/' do
    erb :index 
  end
end
