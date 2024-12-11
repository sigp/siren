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

## Running Local Testnet

If you want to run the local testnet, before running the `backend` you must start the `Kurtosis` network. Navigate to the testnet directory with `cd local-testnet` and run the script with `./start_local_testnet.sh`. When the script completes and the testnet is online you can reach the `Kurtosis Enclave Manager` via `http://localhost:9711/`.

#### Finding the VALIDATOR_URL

To find the variables needed for the `VALIDATOR_URL` open the `Kurtosis Enclave Manager` and click on the running `local-testnet` to gain access to all the services. There may be multiple `VC` running, you can select `vc-1-geth-lighthouse` and copy the `public port` from the `http-validator` row in the ports table. It should resemble `http://127.0.0.1:[YOUR-PORT-NUMBER]`

#### Finding the BEACON_URL

In a similar process to the validator url open the `Kurtosis Enclave Manager`and click on the running `local-testnet`. There may also be multiple `CL` running, you can select `cl-1-lighthouse-geth` and copy the `public ports` for the `http` row in the ports table. It will also resemble `http://127.0.0.1:[YOUR-PORT-NUMBER]`.

#### Finding the API_TOKEN

From your command line you can run the following command: `docker exec -ti $(docker ps -q -f name=vc-1) cat /validator-keys/keys/api-token.txt`. This will print your token, do not copy the `%` at the end of the string. It is not a part of the token.

#### Connection with your wallet

If you want to connect to siren with your browser wallet you must add some additional fields to your `.env` file. Firstly, you must set the `NEXT_PUBLIC_TESTNET_CHAIN_ID` to the one that corresponds to your local testnet. This should be the same as in the example, if not you can find it via the `Kurtosis Enclave Manager` in the local testnet file artifacts section. Scroll down and find the `genesis-el-cl-env-file` and open the `values.env`. Here you will find the `CHAIN_ID`, `MNEMONIC` and other node data.

Lastly you need to add the `NEXT_PUBLIC_TESTNET_RPC` variable to allow siren to connect your wallet. This can be found in the services table in the `EL`. There may be multiple but you can select `el-1-geth-lghthouse`. In the ports table you need to copy the `public ports` for the `rpc` row. It should resemble `http://127.0.0.1:YOUR-KUBERNET-RPC`

When everything is added correctly you need to import the `kurtosis` wallet into your browser wallet provider and add the same `NEXT_PUBLIC_TESTNET_RPC` as the `RPC_URL` so you can see the balance and make movements correctly.
