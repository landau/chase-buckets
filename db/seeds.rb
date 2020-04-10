require "time"

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

d1 = Description.create! value: "BDay Money from Grandma"
d2 = Description.create! value: "Coffee"
d3 = Description.create! value: "No bucket"

check_bucket = Bucket.create! name: "Checks", descriptions: [d1]
groceries_bucket = Bucket.create! name: "Groceries", descriptions: [d2]

LineItem.create(
  post_date: Time.parse("2020-10-5").iso8601,
  amount: 500.23,
  description: d1.value,
)

LineItem.create(
  post_date: Time.parse("2020-10-4").iso8601,
  amount: -10.54,
  description: d2.value,
)

LineItem.create(
  post_date: Time.parse("2020-10-4").iso8601,
  amount: -4.50,
  description: d2.value,
)

LineItem.create(
  post_date: Time.parse("2020-10-4").iso8601,
  amount: -10.54,
  description: d3.value,
)
