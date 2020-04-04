# frozen_string_literal: true

# Index controller
class IndexController < ApplicationController
  def index
    @notice = params[:notice]
    @buckets = Bucket.includes(:line_items).all.order(:name).order(:alias)
    @unbucketed = LineItem.nil_buckets
    render "index"
  end
end
