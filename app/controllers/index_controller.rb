# frozen_string_literal: true

# Index controller
class IndexController < ApplicationController
  def index
    @notice = params[:notice]
    @lineItems = LineItem.all.order "post_date desc"
    render "index"
  end
end
