class LineItemsController < ApplicationController
  def bucket
    bucket_params = params.require(:bucket).permit(:id)
    bucket_id = bucket_params[:id] == "" ? nil : bucket_params[:id]

    p = params.permit(:line_item_id)

    # Update all line items matching this description
    line_item = LineItem.find(params.permit(:line_item_id)[:line_item_id])
    line_item.set_matching_line_items_to_bucket(bucket_id)

    return redirect_to controller: :index,
                       action: :index,
                       status: :see_other,
                       notice: notice_for_item_and_bucket(line_item, bucket_id)
  end

  private

  def notice_for_item_and_bucket(line_item, bucket_id)
    notice = "'#{line_item.description}' has been unassigned"

    if bucket_id != nil
      bucket = Bucket.select(:name).find(bucket_id)
      notice = "'#{line_item.description}' has been assigned to '#{bucket.name}'"
    end

    return notice
  end
end
