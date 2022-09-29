curl --location --request POST 'rest_back:3000/items' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header "poussifeu: $SECRET_PASSWORD" \
--data-urlencode 'rarity=0' \
--data-urlencode 'category=rod' \
--data-urlencode 'name=default' \
--data-urlencode 'description=/rods/rod_default.png' \
--data-urlencode '='
sleep 0.2

curl --location --request POST 'rest_back:3000/items' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header "poussifeu: $SECRET_PASSWORD" \
--data-urlencode 'rarity=0' \
--data-urlencode 'category=ball' \
--data-urlencode 'name=default' \
--data-urlencode 'description=/balls/ball_default.png' \
--data-urlencode '='
sleep 0.2

curl --location --request POST 'rest_back:3000/items' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header "poussifeu: $SECRET_PASSWORD" \
--data-urlencode 'rarity=0' \
--data-urlencode 'category=sound' \
--data-urlencode 'name=default' \
--data-urlencode 'description=/sound/default' \
--data-urlencode '='
