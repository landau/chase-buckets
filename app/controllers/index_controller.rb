# frozen_string_literal: true

# Index controller
class IndexController < ApplicationController
  def index
    unbucketed_line_items = LineItem.nil_buckets

    no_buckets = unbucketed_line_items.length > 0 ? [
      {
        id: "None",
        name: "",
        total: unbucketed_line_items.sum(:amount),
        line_items: unbucketed_line_items,
      },
    ] : []

    buckets = Bucket.where_has_line_items.map do |b|
      {
        id: b.id,
        name: b.name,
        total: b.total_line_items,
        line_items: b.line_items,
      }
    end

    @buckets = no_buckets + buckets
    @notice = params[:notice]
    @all_buckets = Bucket.all
    @bucket_count = @all_buckets.count

    render "index"
  end
end
