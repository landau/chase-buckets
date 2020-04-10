class CreateDescriptions < ActiveRecord::Migration[5.2]
  def change
    create_table :descriptions do |t|
      t.text :value
      t.references :bucket, foreign_key: true

      t.timestamps
    end

    add_index :descriptions, :value, unique: true
  end
end
