class AddAliasIndexToLintItemAliases < ActiveRecord::Migration[5.2]
  def change
    add_index :line_item_aliases, :alias, unique: true
  end
end
