class User < ApplicationRecord
    has_many :pets
    validates :username, uniqueness: true
    validates :username, length: { in: 2..20 }
end
