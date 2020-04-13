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

    context "create_batch" do
      it "creates descriptions" do
        d = ["foo", "bar"]
        res = Description.create_batch d
        expect(res.length).to eq(d.length)
        expect(res.map { |d| d.value }).to eq(d)
      end

      it "creates non-existant descriptions" do
        d = ["foo", "bar"]
        Description.create_batch d

        d2 = ["baz"]
        res = Description.create_batch d + d2
        expect(res.map { |d| d.value }).to eq(d2)

        expect(Description.count).to eq(d.length + d2.length)
      end
    end
  end
end
