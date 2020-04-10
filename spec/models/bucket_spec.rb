require "rails_helper"

RSpec.describe Bucket, type: :model do
  context "validations" do
    it "Ensures name is set" do
      bucket = Bucket.new().save
      expect(bucket).to eq(false)
    end

    it "Ensures a bucket is unique" do
      bucket = Bucket.new(name: "foo").save
      expect(bucket).to eq(true)

      bucket = Bucket.new(name: "foo").save
      expect(bucket).to eq(false)
    end

    it "Saves successfully" do
      bucket = Bucket.new(name: "foo").save
      expect(bucket).to eq(true)
    end
  end

  context "total_line_items" do
    it "returns 0 if line items are not assigned to a bucket" do
      bucket = Bucket.create!(name: "foo")
      expect(bucket.total_line_items).to eq(0)
    end

    it "returns total of line item assigned to bucket" do
      bucket = Bucket.create!(name: "foo")
      Bucket.create!(name: "unaffected_bucket")

      line_item = LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 10,
        description: "has bucket",
        bucket: bucket,
      )

      LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 10,
        description: "unaffected_line_item",
      )

      expect(bucket.total_line_items).to eq(line_item.amount)
    end
  end

  context ":descriptions field" do
    it "Serializes properly" do
      descriptions = ["foo"]
      b = Bucket.create!(name: "unaffected_bucket", descriptions: descriptions)
      expect(b.descriptions).to eq(descriptions)
    end
  end
end
