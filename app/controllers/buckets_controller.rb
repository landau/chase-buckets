# frozen_string_literal: true

# Handlers for /buckets
class BucketsController < ApplicationController
  def create
    bucket = Bucket.new(post_params)

    if bucket.save
      return redirect_to controller: :index,
                         action: :index,
                         status: :see_other,
                         notice: create_bucket_create_success_message(bucket)
    end

    # TODO: Handle 409 conflict
    puts bucket.errors.full_messages_for(:name)[0]

    # TODO: Maybe render this via an alert in redirect_to
    render file: "public/500.html",
           status: :internal_server_error,
           layout: false
  end

  private

  def create_bucket_create_success_message(bucket)
    "New bucket '#{bucket.name}' was created successfully"
  end

  def post_params
    params.permit(:name)
  end
end
