require "rails_helper"

RSpec.describe LineItemsController, type: :controller do
  context "#assign_line_item" do
    it "Generates a route for assigning line items to a description" do
      assert_routing(
        { path: "line-items/:line_item_id/assign-line-item", method: :put },
        {
          controller: "line_items",
          action: "assign_line_item",
          line_item_id: ":line_item_id",
        },
      )
    end

    it "Assigns a line item description to a bucket" do
      d = Description.create! value: "no bucket yet"
      b = Bucket.create! name: "foo"
      l = LineItem.create! post_date: Time.now.iso8601, amount: 1, description: d.value

      expect(b.descriptions.pluck(:value)).to eq([])

      put :assign_line_item, params: { bucket: { id: b.id }, line_item_id: l.id }

      notice = "'#{l.description}' has been assigned to '#{b.name}'"
      expect(response).to redirect_to root_url({ notice: notice })

      expect(b.descriptions.pluck(:value)).to eq([l.description])
    end

    it "Unassigns a line item description from a bucket" do
      d = Description.create! value: "no bucket yet"
      b = Bucket.create! name: "foo"
      l = LineItem.create! post_date: Time.now.iso8601, amount: 1, description: d.value

      expect(b.descriptions.pluck(:value)).to eq([])
      put :assign_line_item, params: { bucket: { id: b.id }, line_item_id: l.id }
      expect(b.descriptions.pluck(:value)).to eq([l.description])
      put :assign_line_item, params: { bucket: { id: "" }, line_item_id: l.id }
      expect(b.descriptions.pluck(:value)).to eq([])
    end
  end

  context "#upload_cc" do
    it "generates a route for uploading a credit card csv" do
      assert_routing(
        { path: "line_items/upload/cc", method: :post },
        {
          controller: "line_items",
          action: "upload_cc",
        },
      )
    end

    it "Creates LineItems from an uploaded csv" do
      file = fixture_file_upload("files/credit_card.csv", "text/csv")
      post :upload_cc, params: { attachment: { file: file } }

      expect(LineItem.count).to eq(3)
      expect(response).to have_http_status(:see_other)

      notice = "Successfully uploaded Credit Card CSV"
      expect(response).to redirect_to root_url({ notice: notice })

      expect(Description.count).to eq(3)
    end
  end

  context "#upload_account" do
    it "generates a route for uploading an account csv" do
      assert_routing(
        { path: "line_items/upload/account", method: :post },
        {
          controller: "line_items",
          action: "upload_account",
        },
      )
    end

    it "Creates LineItems from an uploaded csv" do
      file = fixture_file_upload("files/account.csv", "text/csv")
      post :upload_account, params: { attachment: { file: file } }

      expect(LineItem.count).to eq(3)
      expect(response).to have_http_status(:see_other)

      notice = "Successfully uploaded Account CSV"
      expect(response).to redirect_to root_url({ notice: notice })

      expect(Description.count).to eq(3)
    end
  end

  context "#delete_all" do
    it "generates a route for uploading an account csv" do
      assert_routing(
        { path: "line_items/all", method: :delete },
        {
          controller: "line_items",
          action: "delete_all_line_items",
        },
      )
    end

    it "deletes all line_items from the db" do
      LineItem.create! post_date: Time.now.iso8601, amount: 1, description: "foo"
      LineItem.create! post_date: Time.now.iso8601, amount: 1, description: "bar"
      expect(LineItem.count).to eq(2)

      delete :delete_all_line_items
      expect(LineItem.count).to eq(0)
      expect(response).to have_http_status(:see_other)
      expect(response).to redirect_to root_url
    end
  end
end
