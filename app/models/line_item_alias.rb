class LineItemAlias < ApplicationRecord
  validates :name, presence: true
  validates :alias, presence: true
end
