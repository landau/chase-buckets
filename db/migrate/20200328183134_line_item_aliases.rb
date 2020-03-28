class LintItemAliases < ActiveRecord::Migration[5.2]
  def change
    add_index :line_item_aliases, :name, unique: true
  end
end
