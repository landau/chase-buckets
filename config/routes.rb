Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root "index#index"
  resource :buckets
  resources :line_items do
    post :bucket, only: [:update]
  end
  post "/line_items/upload/cc", to: "line_items#upload_cc", as: "upload_cc"
end
