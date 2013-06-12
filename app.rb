require 'bundler'
Bundler.require :default

class App < Sinatra::Base
  get '/' do
    erb :index
  end


  # ASSETS
  get '/js/lib/:filename' do
    send_file File.join('lib', params[:filename])
  end
  get '/js/:filename' do
    send_file File.join('views', 'js', params[:filename])
  end

  get '/css/:filename' do
    filename = File.join('views','styles', params[:filename])
    if File.exists?(filename)
      send_file filename
    else
      filename = params[:filename].gsub(/\.css$/,'')
      scss "styles/#{filename}".to_sym, :style => :expanded
    end
  end
end
