.PHONY: tailwind-watch
tailwind-watch:
	./tailwindcss -i ./src/input.css -o ./src/style.css --watch

.PHONY: tailwind-build
tailwind-build:
	./tailwindcss -i ./static/css/input.css -o ./static/css/style.min.css --minify