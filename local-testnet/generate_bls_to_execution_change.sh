#!/usr/bin/env bash
# 
# This script generates a BLS to execution change for given validator indices on the local testnet.
#
# Prerequisites: jq, docker

source ./vars.env

# The index position for the keys to start generating withdrawal credentials in ERC-2334 format.
VALIDATOR_START_INDEX=$1
# Comma separated list of validator indices to use, e.g. 0,1,2
VALIDATOR_INDICES=$2
# The execution (Eth1) address you want to change to for withdrawals.
EXECUTION_ADDRESS=$3
BEACON_API_URL='http://localhost:8001'

function print_help() {
  echo ""
  echo "Usage:"
  echo "$0 <VALIDATOR_START_INDEX> <VALIDATOR_INDICES> <EXECUTION_ADDRESS>"
  echo ""
  echo "Example:"
  echo "$0 0 0,1,2 0x49011adbCC3bC9c0307BB07F37Dda1a1a9c69d2E"
}

vars=("GENESIS_FORK_VERSION" "MNEMONIC_PHRASE")
for varname in "${vars[@]}"; do
  if [ -z "${!varname}" ]; then
    echo "Error: Variable $varname is not set. Please set it in vars.env" >&2
    exit 1
  fi
done

args=("VALIDATOR_START_INDEX" "VALIDATOR_INDICES" "EXECUTION_ADDRESS")
for argname in "${args[@]}"; do
  if [ -z "${!argname}" ]; then
    echo "Error: $argname is not set." >&2
    print_help
    exit 1
  fi
done

genesis_validators_root=$(curl -s $BEACON_API_URL/eth/v1/beacon/genesis | jq -r .data.genesis_validators_root)

if [[ -z "$genesis_validators_root" ]]; then
  echo "Error: genesis_validators_root not found. Make sure the beacon chain is started correctly." >&2
  exit 1
fi

echo "Generating BLS to execution change for validators: $VALIDATOR_INDICES"

validator_withdrawal_credentials_list=()
for index in $(echo "$VALIDATOR_INDICES" | tr ',' ' '); do
  withdrawal_credentials=$(curl -s $BEACON_API_URL/eth/v1/beacon/states/head/validators | jq -r ".data[] | select(.index == \"$index\") | .validator.withdrawal_credentials")
  validator_withdrawal_credentials_list+=($withdrawal_credentials)
  echo "Validator $index withdrawal credentials: $withdrawal_credentials"
done

# Convert the array to a comma separated list
validator_withdrawal_credentials_list=$(IFS=, ; echo "${validator_withdrawal_credentials_list[*]}")
devnet_chain_setting="{\"network_name\": \"local\", \"genesis_fork_version\": \"$GENESIS_FORK_VERSION\", \"genesis_validator_root\": \"$genesis_validators_root\"}"

docker run -it --rm -v $(pwd)/bls_to_execution_changes:/app/bls_to_execution_changes ethereum/staking-deposit-cli \
  --language English \
  --non_interactive \
  generate-bls-to-execution-change \
  --chain mainnet \
  --devnet_chain_setting "$devnet_chain_setting" \
  --validator_start_index "$VALIDATOR_START_INDEX" --validator_indices "$VALIDATOR_INDICES" \
  --bls_withdrawal_credentials_list "$validator_withdrawal_credentials_list" \
  --mnemonic "$MNEMONIC_PHRASE" \
  --execution_address "$EXECUTION_ADDRESS"

echo "BLS to execution change generated in bls_to_execution_changes directory."
