class Description < ApplicationRecord
  belongs_to :bucket, optional: true
  validates :value, presence: true, uniqueness: true

  scope :unassigned, -> { where(bucket_id: nil) }
end
