class LineItemsController < ApplicationController
  def bucket
    bucket_params = params.require(:bucket).permit(:id)
    bucket_id = bucket_params[:id] == "" ? nil : bucket_params[:id]

    # Update all line items matching this description
    line_item = LineItem.find(params.permit(:line_item_id)[:line_item_id])
    line_item.set_matching_line_items_to_bucket(bucket_id)

    redirect_to_index notice_for_item_and_bucket(line_item, bucket_id)
  end

  def upload_cc
    LineItem.create_from_cc_csv!(
      params.require(:attachment).permit(:file)[:file].read
    )

    return redirect_to_index "Successfully uploaded Credit Card CSV"
  end

  private

  def redirect_to_index(notice)
    redirect_to controller: :index,
                action: :index,
                status: :see_other,
                notice: notice
  end

  def notice_for_item_and_bucket(line_item, bucket_id)
    notice = "'#{line_item.description}' has been unassigned"

    if bucket_id != nil
      bucket = Bucket.select(:name).find(bucket_id)
      notice = "'#{line_item.description}' has been assigned to '#{bucket.name}'"
    end

    return notice
  end
end
