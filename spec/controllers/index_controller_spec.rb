require "rails_helper"

RSpec.describe IndexController, type: :controller do
  context "GET #index" do
    it "returns the index page" do
      get :index
      expect(response.successful?).to eq(true)
      # TODO: How else to verify this page is rendering properly?
    end
  end
end
