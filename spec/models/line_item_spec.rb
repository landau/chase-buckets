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

  context "scopes" do
    context "nil_buckets" do
      it "returns line_items without an assigned bucket" do
        d = Description.create! value: "has bucket"
        d2 = Description.create! value: "no bucket"
        b = Bucket.create! name: "foo", descriptions: [d]

        LineItem.create!(
          post_date: Time.now.iso8601,
          amount: 1,
          description: d.value,
        )

        no_bucket = LineItem.create!(
          post_date: Time.now.iso8601,
          amount: 1,
          description: d2.value,
        )

        items = LineItem.nil_buckets
        expect(items.size).to eq(1)
        expect(items[0]).to eq(no_bucket)
      end
    end

    context "total_nil_buckets" do
      it "returns total of all unassigned buckets" do
        d = Description.create! value: "has bucket"
        Bucket.create! name: "foo", descriptions: [d]

        LineItem.create!(
          post_date: Time.now.iso8601,
          amount: 1,
          description: d.value,
        )

        d2 = Description.create! value: "no bucket"
        d3 = Description.create! value: "no bucket as well"

        no_bucket = LineItem.create!(
          post_date: Time.now.iso8601,
          amount: 2,
          description: d2.value,
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
        d = Description.create! value: "has bucket"
        d2 = Description.create! value: "has same bucket"
        Bucket.create! name: "foo", descriptions: [d, d2]

        LineItem.create!(
          post_date: Time.now.iso8601,
          amount: 1,
          description: d.value,
        )

        LineItem.create!(
          post_date: Time.now.iso8601,
          amount: 1,
          description: d2.value,
        )

        expect(LineItem.total_nil_buckets).to eq(0)
      end
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

  context "create_from_account_csv" do
    it "Creates LineItems from an account csv file" do
      expect(LineItem.count).to eq(0)

      csv = fixture_file_upload("files/account.csv", "text/csv")

      line_items = LineItem.create_from_account_csv!(csv)
      expect(line_items.length).to eq(2)

      expect(LineItem.count).to eq(line_items.length)
      expect(LineItem.take(line_items.length)).to eq(line_items)

      expect(line_items[0].post_date).to eq(
        DateTime.strptime("03/27/2020", "%m/%d/%Y")
      )
      expect(line_items[0].description).to eq("foo")
      # FIXME: will be fixed when field is adjusted to float
      expect(line_items[0].amount).to eq(-65)

      expect(line_items[1].post_date).to eq(
        DateTime.strptime("03/26/2020", "%m/%d/%Y")
      )
      expect(line_items[1].description).to eq("bar")
      expect(line_items[1].amount).to eq(-234)
    end
  end
end
