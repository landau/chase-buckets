class CreateLineItems < ActiveRecord::Migration[5.2]
  def change
    create_table :line_items do |t|
      t.datetime :post_date
      t.text :description
      t.integer :amount
      t.references :bucket, foreign_key: true

      t.timestamps
    end
  end
end
