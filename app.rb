require 'bundler'
Bundler.require :default

class App < Sinatra::Base
  get '/' do
    redirect to('/_site/')
  end
  get '/_site/' do
    send_file File.join('_site','index.html')
  end

  get '/_site/:page' do
    send_file File.join('_site', params[:page])
  end

  get '/_site/dist/:filetype/:filename' do
    filename = File.join('_site/dist',params[:filetype], params[:filename])
    send_file filename
  end
end
