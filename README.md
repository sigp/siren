# Siren

This is an open-source User Interface for the Lighthouse Ethereum Beacon Node
and Validator Client.

[![Book Status]][Book Link] [![Chat Badge]][Chat Link]

[Chat Badge]: https://img.shields.io/badge/chat-discord-%237289da
[Chat Link]: https://discord.gg/jpqcHXPRVJ
[Book Status]: https://img.shields.io/badge/user--docs-unstable-informational
[Book Link]: https://lighthouse-book.sigmaprime.io/lighthouse-ui.html
[stable]: https://github.com/sigp/siren/tree/stable
[unstable]: https://github.com/sigp/siren/tree/unstable

## Documentation

The [Lighthouse Book](https://lighthouse-book.sigmaprime.io) contains information for users and
developers. Specifically the [Lighthouse UI](https://lighthouse-book.sigmaprime.io/lighthouse-ui.html) section of the book.

## Running Siren

### Docker (Recommended)

Docker is the recommended way to run Siren. This will expose Siren as a webapp. 

Configuration is done through environment variables, the best way to get started is by copying `.env.example` to `.env` and editing the relevant sections (typically, this would at least include `BEACON_URL`, `VALIDATOR_URL` and `API_TOKEN`)

Then to run the image:

`docker compose up`
or  
`docker run --rm -ti --name siren -p 3443:443 --env-file $PWD/.env sigp/siren`  

This will open port 3443 and allow your browser to connect. 


To start Siren, visit `https://localhost:3443` in your web browser (ignore the certificate warning). 

Advanced users can mount their own certificate (the config expects 3 files: `/certs/cert.pem` `/certs/key.pem` `/certs/key.pass`)

## Building From Source

### Docker 

The docker image can be built with the following command:  
`docker build -f Dockerfile -t siren .`

### Building locally

To build from source, ensure that your system has `Node v18.18` and `yarn` installed. Start by configuring your environment variables. The recommended approach is to duplicate the `.env.example` file, rename it to `.env`, and modify the necessary settings. Essential variables typically include `BEACON_URL`, `VALIDATOR_URL`, and `API_TOKEN`.

#### Build and run the backend
Navigate to the backend directory `cd backend`. Install all required Node packages by running `yarn`. Once the installation is complete, compile the backend with `yarn build`. Deploy the backend in a production environment, `yarn start:production`. This ensures optimal performance.


#### Build and run the frontend
After initializing the backend, return to the root directory. Install all frontend dependencies by executing `yarn`. Build the frontend using `yarn build`. Start the frontend production server with `yarn start`. 

This will allow you to access siren at `http://localhost:3000` by default. 
