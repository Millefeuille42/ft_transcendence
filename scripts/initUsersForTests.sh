curl --location --request POST 'localhost:3000/user/' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'login=patate' \
--data-urlencode 'email=patate@letest.com' \
--data-urlencode 'name=La Patate' \
--data-urlencode 'avatar=https://picsum.photos/200/200?random'

curl --location --request POST 'localhost:3000/user/' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'login=tester' \
--data-urlencode 'email=tester@letest.com' \
--data-urlencode 'name=Le Test' \
--data-urlencode 'avatar=https://picsum.photos/200/200?random'
