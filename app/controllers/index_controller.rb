# frozen_string_literal: true

# Index controller
class IndexController < ApplicationController
  def index
    @notice = params[:notice]
    @buckets = Bucket.where_has_line_items
    @unbucketed = LineItem.nil_buckets
    render "index"
  end
end
