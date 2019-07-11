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
    pet = Pet.find_by(user_id: params[:user_id], name: params[:name])
    if !pet
      pet = Pet.create(pet_params)
      render json: pet.to_json(:include => {
        :user => {:only => [:id, :username]}
        }, :except => [:created_at, :updated_at])
    else
      render :json => { :errors => "That name is already taken.  Please pick another name." }
    end
    
  end

  def edit
    pet = Pet.find(params[:id])
  end

  def update
    pet = Pet.find(params[:id])
    pet.update(pet_params)
    render json: pet.to_json(:include => {
    :user => {:only => [:id, :username]}
    }, :except => [:created_at, :updated_at])
  end

  def show
      pet = Pet.find(params[:id])
      render json: pet.to_json(:include => {
      :user => {:only => [:id, :username]}
      }, :except => [:created_at, :updated_at])
  end

  private

  def pet_params
    # need to set defaults
    defaults = { level: 10, dead: false }
    params.require(:pet).permit(:user_id, :name, :level, :dead).reverse_merge(defaults)
  end

end
