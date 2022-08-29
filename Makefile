back_path="backend/back_trans/"
front_path="frontend/"

back_job="start:dev"
front_job="serve"

fst:
	@echo "Usage: make [back / front]"

back: 
	(cd $(back_path); npm run $(back_job))

front:
	(cd $(front_path); npm run $(front_job))

.PHONY: back front fst
