# lighthouse-ui
User interface for Lighthouse


# Running a Local Testnet

For development, one can spin up a local lighthouse testnet. This can be used
for the UI to connect to and retrieve real-time results from a local testnet.

## Requirements

In order to run a local lighthouse network, lighthouse needs to be installed on
the system. For detailed instructions see the [Lighthouse Book](https://lighthouse-book.sigmaprime.io/).

Both `lighthouse` and `lcli` are required to be installed. This can be done by
cloning the Lighthouse repository, entering the cloned repository and running:

```bash
$ make
$ make install-lcli
```

`ganache` is also required to be installed. This can be installed via `npm` or via the OS. If using `npm` it can be installed as:
```
$ npm install ganache --global
```

## Starting the Testnet

To start a local testnet, move into the `local-testnet` directory. Then run:
```bash
./start_local_testnet.sh
```

This will spin up both a validator client and a beacon node. These will run in
the background and can be accessed via their local http APIs.

## Stopping the Testnet

A running local testnet can be stopped by running:

```bash
./stop_local_testnet.sh
```

## Configuring the Testnet

The default settings should be sufficient for a development network useful for
testing the UI. However various configurations can be modified by modifying the
`vars.env` file.

## Creating a new testnet

The data for a previously run testnet is stored at
`./local-testnet/testnet-data` (assuming the scripts were run inside the
`local-testnet` directory. Simply removing this directory and its
subdirectories will create a new testnet when running these commands again.

## Logs and Errors

Logs and errors can be found in the `./local-testnet/testnet-data` directory.


# Running Local Electron App
You can run this app locally with react scripts and electronJs. 

## Requirements
`Node v16.16.0` and `yarn`

## How to setup and run local

CD into root of the project and run to setup node modules
```bash 
yarn
```

Then run local server and electron by running:
```bash 
yarn dev
```

## Run webapp in docker

build image:  
`docker build -t lighthouse-ui-dev -f Dockerfile.dev .`

run it:  
`docker run --rm -ti -p 5000:5000 lighthouse-ui-dev`

a Dockerfile for a production build is provided but fails on linting warnings, we'll fix that when we need it. 
