class Description < ApplicationRecord
  belongs_to :bucket, optional: true, counter_cache: true
  validates :value, presence: true, uniqueness: true

  scope :unassigned, -> { where(bucket_id: nil) }
  scope :create_batch, ->(descs) {
          existing_descs = all.pluck :value
          new_descs = descs.uniq - existing_descs

          # Wrap in transaction for more speed. Plus, it makes sense for the
          # all or none to succeed.
          output = nil
          Description.transaction do
            output = create(new_descs.map { |d| { value: d } })
          end
          return output
        }
end
