Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root "index#index"
  resource :buckets
  post "/line_items/upload/cc", to: "line_items#upload_cc", as: "upload_cc"
  put "/line-items/:line_item_id/assign-line-item",
    to: "line_items#assign_line_item",
    as: "assign_line_item"
end
