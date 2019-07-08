class PetsController < ApplicationController
  def index
    pets = Pet.all
    render json: pets.to_json(:include => {
    :user => {:only => [:id, :username]}
    }, :except => [:created_at, :updated_at])
  end

  def new
    @pet = Pet.new
  end

  def create
    @pet = Pet.create(pet_params)
  end

  private

  def pet_params
    # need to set defaults
    params.require(:pet).permit(:user_id, :name, :level)
  end

end
