class SessionsController < ApplicationController

  def new
  end

  def create
    #authenticate the user
    user = User.find_by(username: params[:login_creds][:username])
    if user && user.authenticate(params[:login_creds][:password])
      log_in(user)
    else
      flash.now[:danger] = 'Invalid username/password combination'
    end
  end


  def destroy
    log_out
  end

end
