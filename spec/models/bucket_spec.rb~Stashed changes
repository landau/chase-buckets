require "rails_helper"

RSpec.describe Bucket, type: :model do
  context "validations" do
    it "Ensures name is set" do
      bucket = Bucket.new().save
      expect(bucket).to eq(false)
    end

    it "Saves successfully" do
      bucket = Bucket.new(name: "foo").save
      expect(bucket).to eq(true)
    end
  end

  context "db" do
    it "Ensures name is unique" do
      bucket = Bucket.new(name: "foo").save
      expect(bucket).to eq(true)

      expect { Bucket.new(name: "foo").save }.to raise_error(
        ActiveRecord::RecordNotUnique
      )
    end
  end
end
