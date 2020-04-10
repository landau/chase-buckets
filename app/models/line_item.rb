require "csv"

class LineItem < ApplicationRecord
  validates :post_date, presence: true
  validates :description, presence: true
  validates :amount, presence: true

  scope :nil_buckets, -> {
          where(description: Description.unassigned.pluck(:value))
        }
  scope :total_nil_buckets, -> { nil_buckets.sum(:amount) }

  def self.create_from_cc_csv!(string_or_io)
    csv = CSV.new(
      string_or_io,
      headers: true,
      header_converters: [:symbol, ->header { header.downcase }],
      converters: [
        :numeric,
        ->field, info {
          info.header == :post_date ?
            DateTime.strptime(field, "%m/%d/%Y") :
            field
        },
      ],
    ).read

    # TODO: can discard columns at read time?
    [:transaction_date, :category, :type].each { |s| csv.delete(s) }
    return LineItem.create!(csv.map { |row| row.to_hash })
  end
end
