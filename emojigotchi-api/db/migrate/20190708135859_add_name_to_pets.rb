class AddNameToPets < ActiveRecord::Migration[5.2]
  def change
    add_column :pets, :name, :string
    add_column :pets, :level, :integer
  end
end
