require "rails_helper"
require "time"

RSpec.describe LineItem, type: :model do
  context "validations" do
    it "Ensures a post_date is set" do
      line_item = LineItem.new(amount: 1, description: "desc").save
      expect(line_item).to eq(false)
    end

    it "Ensures an description is set" do
      line_item = LineItem.new(
        post_date: Time.now.iso8601,
        amount: 1,
      ).save
      expect(line_item).to eq(false)
    end

    it "Ensures an amount is set" do
      line_item = LineItem.new(
        post_date: Time.now.iso8601,
        description: "desc",
      ).save
      expect(line_item).to eq(false)
    end

    it "Successfully saves" do
      LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 1,
        description: "desc",
      )
      line_item = LineItem.new(
        post_date: Time.now.iso8601,
        amount: 1,
        description: "desc",
      ).save
      expect(line_item).to eq(true)
    end
  end

  context "associations" do
    it "Allows for optional bucket" do
      line_item = LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 1,
        description: "desc",
      )

      expect(line_item.bucket).to eq(nil)
    end

    it "Sets a bucket" do
      bucket = Bucket.create!(name: "foo")

      line_item = LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 1,
        description: "desc",
        bucket: bucket,
      )

      expect(line_item.bucket).to eq(bucket)
    end
  end

  context "scopes" do
    it "returns line_items without an assigned bucket" do
      LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 1,
        description: "has bucket",
        bucket: Bucket.create!(name: "foo"),
      )

      no_bucket = LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 1,
        description: "no bucket",
      )

      items = LineItem.nil_buckets
      expect(items.size).to eq(1)
      expect(items[0]).to eq(no_bucket)
    end
  end
end
