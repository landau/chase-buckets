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

  context "scopes" do
    it "returns a list of buckets that have matching line_item descriptions" do
      d1 = Description.create value: "has bucket"
      b1 = Bucket.create! name: "foo", descriptions: [d1]
      Bucket.create! name: "bar"

      buckets = Bucket.where_has_line_items
      expect(buckets.length).to eq(1)
      expect(buckets[0]).to eq(b1)
    end
  end

  context "descriptions" do
    it "Returns associated descriptions" do
      d = Description.create([{ value: "foo" }, { value: "bar" }])
      b = Bucket.create!(name: "unaffected_bucket", descriptions: d)
      expect(b.descriptions).to eq(d)
    end
  end

  context "line_items" do
    it "returns [] if there arent line items with matching descriptions" do
      d = Description.create! value: "foo"
      b = Bucket.create! name: "foo", descriptions: [d]
      l1 = LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 10,
        description: "no bucket",
      )

      expect(b.line_items).to eq([])
    end

    it "returns line items associated with bucket descriptions" do
      d1 = Description.create value: "shared line item bucket"
      d2 = Description.create value: "has same bucket"
      d3 = Description.create value: "no bucket"

      l1 = LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 10,
        description: d1.value,
      )

      l2 = LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 11,
        description: d2.value,
      )

      l3 = LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 13,
        description: d1.value,
      )

      LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 500,
        description: d3.value,
      )

      b = Bucket.create!(name: "foo", descriptions: [d1, d2])
      expect(b.line_items).to eq([l1, l2, l3])
    end
  end

  context "total_line_items" do
    it "returns total of line item assigned to bucket" do
      d1 = Description.create value: "has bucket"
      d2 = Description.create value: "has same bucket"

      l1 = LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 10,
        description: d1.value,
      )

      l2 = LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 11,
        description: d2.value,
      )

      l3 = LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 13,
        description: d1.value,
      )

      b = Bucket.create!(name: "foo", descriptions: [d1, d2])
      expect(b.total_line_items).to eq(l1.amount + l2.amount + l3.amount)
    end
  end
end
