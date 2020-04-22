# frozen_string_literal: true

# Bucket model
class Bucket < ApplicationRecord
  has_many :descriptions, dependent: :nullify
  validates :name, presence: true, uniqueness: true

  scope :where_has_line_items, ->() {
          where("descriptions_count > ?", 0).select do |b|
            b.total_line_items > 0
          end
        }

  # TODO: Technically, there is no relation between Bucket and LineItem
  # This should be refactored into a different module or directly where it's used
  def line_items
    LineItem.where(description: self.descriptions.select(:value))
  end

  def total_line_items
    self.line_items.sum :amount
  end
end
