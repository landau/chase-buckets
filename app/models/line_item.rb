class LineItem < ApplicationRecord
  belongs_to :bucket, optional: true

  validates :post_date, presence: true
  validates :description, presence: true
  validates :amount, presence: true
end
