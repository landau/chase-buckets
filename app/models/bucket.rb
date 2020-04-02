# frozen_string_literal: true

# Bucket model
class Bucket < ApplicationRecord
  has_many :line_items, dependent: :nullify
  validates :name, presence: true, uniqueness: true
end
