# frozen_string_literal: true

# Index controller
class IndexController < ApplicationController
  def index
    @notice = params[:notice]
    @buckets = Bucket.all.order(:name)
    @unbucketed = LineItem.nil_buckets
    render "index"
  end
end
