class Bucket < ApplicationRecord
  has_many :line_items, dependent: :nullify
  validates :name, presence: true
end
