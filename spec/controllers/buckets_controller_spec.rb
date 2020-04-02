require "rails_helper"

RSpec.describe BucketsController, type: :controller do
  context "#create" do
    it "Creates a new post" do
      post :create, params: { :name => "bucket" }
      expect(response).to have_http_status(:see_other)

      buckets = Bucket.take(1)
      expect(buckets.size).to eq(1)
      expect(buckets[0][:name]).to eq("bucket")
    end

    it "Renders a 500 page if fails to save" do
      post :create, params: {}
      buckets = Bucket.take(1)
      expect(buckets.size).to eq(0)
      expect(response).to have_http_status(:internal_server_error)
    end
  end
end
