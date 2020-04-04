class LineItem < ApplicationRecord
  belongs_to :bucket, optional: true

  validates :post_date, presence: true
  validates :description, presence: true
  validates :amount, presence: true

  scope :nil_buckets, -> { where(bucket_id: nil) }
end
