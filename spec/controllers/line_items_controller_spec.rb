require "rails_helper"

RSpec.describe LineItemsController, type: :controller do
  context "#bucket" do
    it "generates a route for assigning line items to a bucket" do
      assert_routing(
        { path: "line_items/1/bucket", method: :post },
        {
          only: [:update],
          controller: "line_items",
          action: "bucket",
          line_item_id: "1",
        },
      )
    end

    pending "Assigns all line items with a matching description to a bucket" do
      desc = "test desc"

      line_item = LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 1,
        description: desc,
      )

      # line_item2 = LineItem.create!(
      #   post_date: Time.now.iso8601,
      #   amount: 2,
      #   description: desc,
      # )

      # bucket = Bucket.create!(name: "test")

      post :line_item_bucket, params: { line_item_id: line_item.id }
      expect(response).to have_http_status(:see_other)

      notice = "New bucket '#{buckets[0].name}' was created successfully"
      expect(response).to redirect_to root_url({ notice: notice })
    end
  end
end
