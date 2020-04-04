require "time"

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

check_bucket = Bucket.create(name: "Checks")
groceries_bucket = Bucket.create(name: "Groceries")

LineItem.create(
  post_date: Time.parse("2020-10-5").iso8601,
  amount: 500.23,
  description: "BDay Money from Grandma",
  bucket: check_bucket,
)

LineItem.create(
  post_date: Time.parse("2020-10-4").iso8601,
  amount: -10.54,
  description: "Crappy Coffee",
  bucket: groceries_bucket,
)

LineItem.create(
  post_date: Time.parse("2020-10-4").iso8601,
  amount: -10.54,
  description: "No bucket yet",
)

# FIXME: This is causing a unique constraint error
# LineItemAlias.create(name: "Crappy Coffee", alias: "Very Crappy Coffee")
