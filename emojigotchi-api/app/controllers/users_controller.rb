class UsersController < ApplicationController
  def index
    users = User.all
    render json: users.to_json(:include => {
    :pets => {:only => [:id, :name, :user_id]}
    }, :except => [:created_at, :updated_at])
  end

  def new
    @user = User.new
  end

  def create
    user = User.find_or_create_by(user_params)
    render json: user
  end

private

  def user_params
    params.require(:user).permit(:username)
  end


end #End UsersController
