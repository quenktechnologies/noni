lib: $(shell find src -type f)
	rm -R lib 2> /dev/null || true
	./node_modules/.bin/tsc --project .
