# Make the Siren App


# Default rule
# Builds the electron app and executes it
build:
	yarn && yarn dev

# Builds a development server
dev:
	yarn && yarn start

# Runs a docker production webserver
docker:
	docker build -t siren . && docker run --rm -it --name siren -p 80:80 siren

# Compile into a number of releases
release:
	yarn && yarn build-all

# Remove compiled artifacts
clean:
	rm -r out
