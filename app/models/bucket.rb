# frozen_string_literal: true

# Bucket model
class Bucket < ApplicationRecord
  has_many :descriptions, dependent: :nullify
  validates :name, presence: true, uniqueness: true

  scope :where_has_line_items, ->() {
          where("descriptions_count > ?", 0)
        }

  # TODO: Technically, there is no relation between Bucket and LineItem
  # This should be refactored into a different module or pass descriptions to
  # a method like LineItem.with_desc
  def line_items
    LineItem.where description: self.descriptions.select(:value).all.pluck(:value)
  end

  def total_line_items
    self.line_items.sum :amount
  end
end
