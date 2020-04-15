require "rails_helper"

RSpec.describe IndexController, type: :controller do
  context "GET #index" do
    it "returns the index page" do
      # These need to be created to get 100% coverage
      d = Description.create! value: "test"
      Bucket.create! name: "foo", descriptions: [d]
      Bucket.create! name: "bar"

      LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 1,
        description: d.value,
      )

      get :index
      expect(response.successful?).to eq(true)
      # TODO: How else to verify this page is rendering properly?
    end
  end
end
