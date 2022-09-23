export PGPASSWORD="$DB_PASS" && echo "CREATE DATABASE has_run;" | psql -h db -U $DB_USER
sleep 0.3
sh initDefault.sh
sleep 0.3
sh initRods.sh
sleep 0.3
sh initBalls.sh
sleep 0.3
sh initUsersForTests.sh
