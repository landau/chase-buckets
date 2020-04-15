require "csv"

module CsvFieldFormatter
  def self.format_date(field)
    DateTime.strptime(field, "%m/%d/%Y")
  end
end

class LineItem < ApplicationRecord
  validates :post_date, presence: true
  validates :description, presence: true
  validates :amount, presence: true

  scope :nil_buckets, -> {
          where(description: Description.unassigned.pluck(:value))
        }
  scope :total_nil_buckets, -> { nil_buckets.sum(:amount) }

  def self.create_from_cc_csv!(string_or_io)
    return self.create_from_csv!(
             string_or_io,
             header_converters: [:symbol],
             converters: [
               :float,
               ->field, info {
                 info.header == :post_date ?
                   CsvFieldFormatter::format_date(field) :
                   field
               },
             ],
             headers_to_delete: [:transaction_date, :category, :type],
           )
  end

  def self.create_from_account_csv!(string_or_io)
    return self.create_from_csv!(
             string_or_io,
             header_converters: [
               ->header { header == "Posting Date" ? "Post Date" : header },
               ->header { header == "Check or Slip #" ? "check" : header },
               :symbol,
             ],
             converters: [
               :float,
               ->field, info {
                 info.header == :post_date ?
                   CsvFieldFormatter::format_date(field) :
                   field
               },
             ],
             headers_to_delete: [:details, :balance, :type, :check],
           )
  end

  def self.create_from_csv!(
    string_or_io, header_converters:, converters:, headers_to_delete:
  )
    # Trim surrounding whitespace for all fields
    converters << ->field, info { field.is_a?(String) ? field.strip : field }

    csv = CSV.new(
      string_or_io,
      headers: true,
      header_converters: header_converters,
      converters: converters,
    ).read

    # In the case an unknown column is entered
    headers_to_delete << nil

    # TODO: can discard columns at read time?
    headers_to_delete.each { |s| csv.delete(s) }

    line_items = nil
    LineItem.transaction do
      line_items = LineItem.create!(csv.map { |row| row.to_hash })
    end
    return line_items
  end
end
