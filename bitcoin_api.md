# Lightning UI - Bitcoin API

- [/api/bitcoin/getinfo](#get-info)
- [/api/bitcoin/getconfirmedbalance](#get-confirmed-balance)
- [/api/bitcoin/getunconfirmedbalance](#get-unconfirmed-balance)
- [/api/bitcoin/getnewaddress](#generate-new-address)
- [/api/bitcoin/sendtoaddress](#send-amount-to-address)
- [/api/bitcoin/getrawtransaction](#get-raw-transaction)

---

## get info
- path: /api/bitcoin/getinfo
- request: GET
- response: JSON
```json
{
    "version": 130200,
    "protocolversion": 70015,
    "walletversion": 130000,
    "balance": 0.08978611,
    "blocks": 1091165,
    "timeoffset": 0,
    "connections": 8,
    "proxy": "",
    "difficulty": 1141934.859617691,
    "testnet": true,
    "keypoololdest": 1487267298,
    "keypoolsize": 100,
    "paytxfee": 0,
    "relayfee": 1e-05,
    "errors": "Warning: unknown new rules activated (versionbit 28)"
}
```
## get confirmed balance
- path: /api/bitcoin/getconfirmedbalance
- request: GET
- response: JSON
```json
{
  "amount": 0.08978611
}
```

## get unconfirmed balance
- path: /api/bitcoin/getunconfirmedbalance
- request: GET
- response: JSON
```json
{
  "amount": 0
}
```

## generate new address
- path: /api/bitcoin/getnewaddress
- request: GET
- response: JSON
```json
{
  "address": "n1934UT9LmxVwoXAttQxYMFsZ8yWn7jQUr"
}
```

## send amount to address
- path: /api/bitcoin/sendtoaddress
- request: POST
```json
{
    "amount":"0.005",
    "address":"mhKXFQi2qf1XTbNgKF4isqNvqspBG4of2M"
}
```
- response: JSON
```json
{
  "txid":"dd4ed7b43ab1edadc5dbf2c31e000d742e9cda543eb6534804dce46687233d04"
}
```

## get raw transaction
- path: /api/bitcoin/getrawtransaction
- request: POST
```json
{
    "txid":"dd4ed7b43ab1edadc5dbf2c31e000d742e9cda543eb6534804dce46687233d04"
}
```
- response: JSON
```json
{
   "rawtx":"..."
}
```


