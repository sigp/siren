# Siren

This is an open-source User Interface for the Lighthouse Ethereum Beacon Node
and Validator Client.

[![Book Status]][Book Link] [![Chat Badge]][Chat Link]

[Chat Badge]: https://img.shields.io/badge/chat-discord-%237289da
[Chat Link]: https://discord.gg/jpqcHXPRVJ
[Book Status]:https://img.shields.io/badge/user--docs-unstable-informational
[Book Link]: https://lighthouse-book.sigmaprime.io/lighthouse-ui.html
[stable]: https://github.com/sigp/siren/tree/stable
[unstable]: https://github.com/sigp/siren/tree/unstable

## Documentation

The [Lighthouse Book](https://lighthouse-book.sigmaprime.io) contains information for users and
developers. Specifically the [Lighthouse UI](https://lighthouse-book.sigmaprime.io/lighthouse-ui.html) section of the book.

## Building From Source

### Requirements

Building from source requires `Node v18` and `yarn`. 

### Building From Source

The electron app can be built from source by first cloning the repository and
entering the directory:

```
$ git clone https://github.com/sigp/siren.git
$ cd siren
```

Once cloned, the electron app can be built and ran via the Makefile by:

```
$ make
```

alternatively it can be built via:

```
$ yarn
```

Once completed successfully the electron app can be run via:

```
$ yarn dev
```

### Running In The Browser

#### Docker (Recommended)

Docker is the recommended way to run a webserver that hosts Siren and can be
connected to via a web browser. We recommend this method as it established a
production-grade web-server to host the application.

`docker` is required to be installed with the service running.

The docker image can be built and run via the Makefile by running:
```
$ make docker
```

Alternatively, to run with Docker, the image needs to be built. From the repository directory
run:
```
$ docker build -t siren .
```

Then to run the image:
```
$ docker run --rm -ti --name siren -p 80:80 siren
```

This will open port 80 and allow your browser to connect. You can choose
another local port by modifying the command. For example `-p 8000:80` will open
port 8000.

To view Siren, simply go to `http://localhost` in your web browser.

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

note: you need a version of lcli that includes [these](https://github.com/sigp/lighthouse/pull/3807) changes

`ganache` is also required to be installed. This can be installed via `npm` or via the OS. If using `npm` it can be installed as:
```
$ npm install ganache --global
```

## Starting the Testnet

To start a local testnet, move into the `local-testnet` directory. Then run:
```bash
./start_local_testnet.sh genesis.json
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
