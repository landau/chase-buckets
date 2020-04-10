require "rails_helper"

RSpec.describe Description, type: :model do
  # TODO: unique key test

  context "scope" do
    context "unassigned" do
      it "Returns descriptions lacking a bucket_id" do
        d = Description.create! value: "foo"
        d2 = Description.create! value: "bar"
        expect(Description.unassigned.count).to eq(2)

        Bucket.create! name: "foo", descriptions: [d]
        expect(Description.unassigned.count).to eq(1)
      end
    end
  end
end
