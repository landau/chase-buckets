class CreateLineItemAliases < ActiveRecord::Migration[5.2]
  def change
    create_table :line_item_aliases do |t|
      t.string :name
      t.string :alias

      t.timestamps
    end
  end
end
