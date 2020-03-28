class CreateBuckets < ActiveRecord::Migration[5.2]
  def change
    create_table :buckets do |t|
      t.string :name

      t.timestamps
    end

    add_index :buckets, :name, unique: true
  end
end