# frozen_string_literal: true

# Bucket model
class Bucket < ApplicationRecord
  has_many :line_items, dependent: :nullify
  validates :name, presence: true, uniqueness: true

  def total_line_items
    self.line_items.sum(:amount)
  end
end
