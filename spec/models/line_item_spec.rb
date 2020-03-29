require "rails_helper"
require "time"

# * { post date, bucket id (null if not set), amount, description  }
RSpec.describe LineItem, type: :model do
  context "validations" do
    it "Ensures a post_date is set" do
      lineItem = LineItem.new(amount: 1, description: "desc").save
      expect(lineItem).to eq(false)
    end

    it "Ensures an description is set" do
      lineItem = LineItem.new(
        post_date: Time.parse("2020-10-5").iso8601,
        amount: 1,
      ).save
      expect(lineItem).to eq(false)
    end

    it "Ensures an amount is set" do
      lineItem = LineItem.new(
        post_date: Time.parse("2020-10-5").iso8601,
        description: "desc",
      ).save
      expect(lineItem).to eq(false)
    end

    it "Successfully saves" do
      LineItem.create!(
        post_date: Time.parse("2020-10-5").iso8601,
        amount: 1,
        description: "desc",
      )
      lineItem = LineItem.new(
        post_date: Time.parse("2020-10-5").iso8601,
        amount: 1,
        description: "desc",
      ).save
      expect(lineItem).to eq(true)
    end
  end

  context "associations" do
    it "Allows for optional bucket" do
      lineItem = LineItem.create!(
        post_date: Time.parse("2020-10-5").iso8601,
        amount: 1,
        description: "desc",
      )

      expect(lineItem.bucket).to eq(nil)
    end

    it "Sets a bucket" do
      bucket = Bucket.create!(name: "foo")

      lineItem = LineItem.create!(
        post_date: Time.parse("2020-10-5").iso8601,
        amount: 1,
        description: "desc",
        bucket: bucket,
      )

      expect(lineItem.bucket).to eq(bucket)
    end
  end
end
