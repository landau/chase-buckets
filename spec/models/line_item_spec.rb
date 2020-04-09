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
    context "nil_buckets" do
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

    context "total_nil_buckets" do
      it "returns total of all unassigned buckets" do
        LineItem.create!(
          post_date: Time.now.iso8601,
          amount: 1,
          description: "has bucket",
          bucket: Bucket.create!(name: "foo"),
        )

        no_bucket = LineItem.create!(
          post_date: Time.now.iso8601,
          amount: 2,
          description: "no bucket",
        )

        no_bucket2 = LineItem.create!(
          post_date: Time.now.iso8601,
          amount: 3,
          description: "no bucket as well",
        )

        expect(LineItem.total_nil_buckets).to eq(
          no_bucket.amount + no_bucket2.amount
        )
      end

      it "returns 0 if all buckets are assigned" do
        LineItem.create!(
          post_date: Time.now.iso8601,
          amount: 1,
          description: "has bucket",
          bucket: Bucket.create!(name: "foo"),
        )

        LineItem.create!(
          post_date: Time.now.iso8601,
          amount: 1,
          description: "has bucket as well",
          bucket: Bucket.create!(name: "bar"),
        )

        expect(LineItem.total_nil_buckets).to eq(0)
      end
    end
  end

  context "set_matching_line_items_to_bucket" do
    it "successfully sets all matching descriptions to a bucket" do
      bucket = Bucket.create!(name: "setting buckets")

      desc = "matching"

      a = LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 1,
        description: desc,
      )

      b = LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 1,
        description: desc,
      )

      no_match = LineItem.create!(
        post_date: Time.now.iso8601,
        amount: 1,
        description: "not matching",
        bucket: Bucket.create!(name: "no_match"),
      )

      a.set_matching_line_items_to_bucket(bucket.id)

      # expect(a.bucket_id).to eq(bucket.id)
      expect(LineItem.find(a.id).bucket_id).to eq(bucket.id)
      expect(LineItem.find(b.id).bucket_id).to eq(bucket.id)
      expect(LineItem.find(no_match.id).bucket_id).not_to eq(bucket.id)
    end
  end

  context "create_from_cc_csv" do
    it "Creates LineItems from a credit card csv file" do
      expect(LineItem.count).to eq(0)

      csv = fixture_file_upload("files/credit_card.csv", "text/csv")

      line_items = LineItem.create_from_cc_csv!(csv)
      expect(line_items.length).to eq(2)

      expect(LineItem.count).to eq(line_items.length)
      expect(LineItem.take(line_items.length)).to eq(line_items)

      expect(line_items[0].post_date).to eq(
        DateTime.strptime("03/23/2020", "%m/%d/%Y")
      )
      expect(line_items[0].description).to eq("foo")
      # FIXME: will be fixed when field is adjusted to float
      expect(line_items[0].amount).to eq(-5)

      expect(line_items[1].post_date).to eq(
        DateTime.strptime("03/24/2020", "%m/%d/%Y")
      )
      expect(line_items[1].description).to eq("bar")
      expect(line_items[1].amount).to eq(-10)
    end
  end
end
