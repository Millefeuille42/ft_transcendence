sleep 20

PGPASSWORD="$DB_PASS" psql -U $DB_USER -h db -tAc 'select 1' -d has_run || sh initDB.sh
nginx -g 'daemon off;'
