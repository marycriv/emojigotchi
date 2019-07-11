class Pet < ApplicationRecord
  belongs_to :user
  validates :name, uniqueness: true
  validates :name, length: { in: 2..20 }
end
