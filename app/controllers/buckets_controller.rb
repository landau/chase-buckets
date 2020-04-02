class BucketsController < ApplicationController
  def create
    bucket = Bucket.new(get_post_params)

    if bucket.save
      return redirect_to controller: :index, action: :index, status: :see_other
    end

    # TODO: Handle 409 conflict
    render :file => "public/500.html",
           :status => :internal_server_error,
           :layout => false
  end

  private

  def get_post_params
    params.permit(:name)
  end
end
