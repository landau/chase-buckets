class CreateLineItems < ActiveRecord::Migration[5.2]
  def change
    create_table :line_items do |t|
      t.datetime :post_date
      t.text :description
      t.integer :amount
      t.timestamps
    end

    add_index :line_items, :post_date
  end
end
