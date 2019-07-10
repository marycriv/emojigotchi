class AddDeadToPets < ActiveRecord::Migration[5.2]
  def change
    add_column :pets, :dead, :boolean
  end
end
