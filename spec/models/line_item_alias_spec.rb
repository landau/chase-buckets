require "rails_helper"

RSpec.describe LineItemAlias, type: :model do
  context "validations" do
    it "Ensures a name is set" do
      itemAlias = LineItemAlias.new(alias: "foo").save
      expect(itemAlias).to eq(false)
    end

    it "Ensures an alias is set" do
      itemAlias = LineItemAlias.new(name: "foo").save
      expect(itemAlias).to eq(false)
    end

    it "Saves Successfully" do
      itemAlias = LineItemAlias.new(name: "foo", alias: "bar").save
      expect(itemAlias).to eq(true)
    end
  end

  context "db" do
    it "Ensures name is unique" do
      itemAlias = LineItemAlias.new(name: "bar", alias: "foo").save
      expect { LineItemAlias.new(name: "bar", alias: "baz").save }.to raise_error(
        ActiveRecord::RecordNotUnique
      )
    end

    it "Ensures alias is unique" do
      itemAlias = LineItemAlias.new(name: "bar", alias: "foo").save
      expect { LineItemAlias.new(name: "baz", alias: "foo").save }.to raise_error(
        ActiveRecord::RecordNotUnique
      )
    end
  end
end
