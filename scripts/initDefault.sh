curl --location --request POST 'localhost:3000/items' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rarity=0' \
--data-urlencode 'category=rod' \
--data-urlencode 'name=default' \
--data-urlencode 'description=/rods/rod_default.png' \
--data-urlencode '='

curl --location --request POST 'localhost:3000/items' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rarity=0' \
--data-urlencode 'category=ball' \
--data-urlencode 'name=default' \
--data-urlencode 'description=/balls/ball_default.png' \
--data-urlencode '='

curl --location --request POST 'localhost:3000/items' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rarity=0' \
--data-urlencode 'category=sound' \
--data-urlencode 'name=default' \
--data-urlencode 'description=/sound/default' \
--data-urlencode '='

