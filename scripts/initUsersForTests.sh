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

curl --location --request POST 'localhost:3000/game/patate' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rival=tester' \
--data-urlencode 'points=0' \
--data-urlencode 'rPoints=5' \
--data-urlencode 'mode=Normal'

curl --location --request POST 'localhost:3000/game/patate' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rival=tester' \
--data-urlencode 'points=5' \
--data-urlencode 'rPoints=2' \
--data-urlencode 'mode=Normal'

curl --location --request POST 'localhost:3000/game/patate' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rival=tester' \
--data-urlencode 'points=2' \
--data-urlencode 'rPoints=5' \
--data-urlencode 'mode=White_Mode'

curl --location --request POST 'localhost:3000/game/patate' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rival=tester' \
--data-urlencode 'points=5' \
--data-urlencode 'rPoints=4' \
--data-urlencode 'mode=Normal'

curl --location --request POST 'localhost:3000/game/patate' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rival=tester' \
--data-urlencode 'points=5' \
--data-urlencode 'rPoints=3' \
--data-urlencode 'mode=Normal'

curl --location --request POST 'localhost:3000/game/patate' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rival=tester' \
--data-urlencode 'points=5' \
--data-urlencode 'rPoints=0' \
--data-urlencode 'mode=White_Mode'

curl --location --request POST 'localhost:3000/game/patate' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rival=tester' \
--data-urlencode 'points=5' \
--data-urlencode 'rPoints=1' \
--data-urlencode 'mode=Normal'

curl --location --request POST 'localhost:3000/game/patate' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rival=tester' \
--data-urlencode 'points=5' \
--data-urlencode 'rPoints=4' \
--data-urlencode 'mode=Normal'

curl --location --request POST 'localhost:3000/game/patate' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rival=tester' \
--data-urlencode 'points=5' \
--data-urlencode 'rPoints=2' \
--data-urlencode 'mode=Normal'

curl --location --request POST 'localhost:3000/game/patate' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rival=tester' \
--data-urlencode 'points=4' \
--data-urlencode 'rPoints=5' \
--data-urlencode 'mode=Normal'

curl --location --request POST 'localhost:3000/game/patate' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rival=tester' \
--data-urlencode 'points=0' \
--data-urlencode 'rPoints=5' \
--data-urlencode 'mode=Normal'

curl --location --request POST 'localhost:3000/game/patate' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rival=tester' \
--data-urlencode 'points=5' \
--data-urlencode 'rPoints=1' \
--data-urlencode 'mode=Normal'

curl --location --request POST 'localhost:3000/game/patate' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rival=tester' \
--data-urlencode 'points=3' \
--data-urlencode 'rPoints=5' \
--data-urlencode 'mode=Normal'

curl --location --request POST 'localhost:3000/game/patate' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rival=tester' \
--data-urlencode 'points=5' \
--data-urlencode 'rPoints=2' \
--data-urlencode 'mode=Normal'
