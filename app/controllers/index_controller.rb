# frozen_string_literal: true

# Index controller
class IndexController < ApplicationController
  def index
    @notice = params[:notice]
    render "index"
  end
end
