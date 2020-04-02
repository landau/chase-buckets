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
end
