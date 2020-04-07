class LineItem < ApplicationRecord
  belongs_to :bucket, optional: true

  validates :post_date, presence: true
  validates :description, presence: true
  validates :amount, presence: true

  scope :nil_buckets, -> { where(bucket_id: nil) }
  scope :total_nil_buckets, -> { nil_buckets.sum(:amount) }

  def set_matching_line_items_to_bucket(bucket_id)
    LineItem.where(description: self.description)
      .in_batches
      .update_all(bucket_id: bucket_id)
  end
end
