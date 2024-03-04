const toFixedIfNecessary = (value: number, decimals: number) => +parseFloat(value.toFixed(decimals))

export default toFixedIfNecessary
