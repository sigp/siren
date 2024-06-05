# Simple Local Testnet

These scripts allow for running a small local testnet with multiple beacon nodes and validator clients and a geth execution client.
This setup can be useful for testing and development.

## Requirements

The scripts require `docker`, `kurtosis`, `yq` to be installed on `PATH`.

## Starting the testnet

Modify `network_params.yaml` as desired, and start the testnet with the following command:

```bash
./start_local_testnet.sh
```

## Stopping the testnet

This is not necessary before `start_local_testnet.sh` as it invokes `stop_local_testnet.sh` automatically.

```bash
./stop_local_testnet.sh
```
