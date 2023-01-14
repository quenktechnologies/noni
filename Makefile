# Copy all the sources to the lib folder then run tsc.
lib: $(shell find src -type f)
	rm -R lib 2> /dev/null || true 
	mkdir lib
	cp -R -u src/* lib
	./node_modules/.bin/tsc --project lib

.PHONY: browser-tests
browser-tests:
	./node_modules/.bin/browserify --no-builtins $(shell find test/browser \
	-name *_test.js) > test/browser/all.js

# Generate typedoc documentation.
.PHONY: docs
docs: lib
	./node_modules/.bin/typedoc \
	--mode modules \
	--out $@ \
	--tsconfig lib/tsconfig.json \
	--excludeNotExported \
	--excludePrivate lib && \
	echo "" > docs/.nojekyll
