# Lightning UI - Lightning API

- [/api/lightning/getinfo](#get-info)
- [/api/lightning/getpeers](#get-peers)
- [/api/lightning/getnodes](#get-nodes)
- [/api/lightning/getchannels](#get-channels)
- [/api/lightning/getnewaddress](#generate-new-address)
- [/api/lightning/openchannel](#open-channel)
- [/api/lightning/addfunds](#add-funds)
- [/api/lightning/fundchannel](#fund-channel)
- [/api/lightning/closechannel](#close-channel)
- [/api/lightning/getroute](#get-route)
- [/api/lightning/createinvoice](#create-invoice)
- [/api/lightning/listinvoice](#list-invoices)
- [/api/lightning/invoice/{label}](#delete-invoice)
- [/api/lightning/withdraw](#withdraw)
- [/api/lightning/sendpay](#send-payment)

---

## get info
- path: /api/lightning/getinfo
- request: GET
- response: JSON
```json
{
   "id":"036cc6f4aa007f10964993aba1b8535e20e36f6d7c455ca93452f66adbf28e8182",
   "port":9911,
   "network":"regtest",
   "version":"v0.5.2-2016-11-21-901-ge418f2a",
   "blockheight":500
}
```

## get peers
- path: /api/lightning/getpeers
- request: GET
- response: JSON
```json
{
   "peers":[
      {
         "unique_id":0,
         "state":"CHANNELD_NORMAL",
         "netaddr":"::1:9912",
         "peerid":"03b01a87d7922bf4d8017644ae75d0bcbf238e11ee31f6d1a5a6ddb014d33197b2",
         "connected":true,
         "owner":"lightning_channeld",
         "channel":"523:2:0",
         "msatoshi_to_us":100000000,
         "msatoshi_total":100000000
      }
   ]
}
```

## get nodes
- path: /api/lightning/getnodes
- request: GET
- response: JSON
```json
{
   "nodes":[
      {
         "nodeid":"03a1c56b699077c2596c86ecc529891a7f188a599774cf91594654fc28c5554045",
         "addresses":[

         ]
      },
      {
         "nodeid":"03b01a87d7922bf4d8017644ae75d0bcbf238e11ee31f6d1a5a6ddb014d33197b2",
         "addresses":[

         ]
      }
   ]
}
```

## get channels
- path: /api/lightning/getchannels
- request: GET
- response: JSON
```json
{
   "channels":[
      {
         "source":"03a1c56b699077c2596c86ecc529891a7f188a599774cf91594654fc28c5554045",
         "destination":"03b01a87d7922bf4d8017644ae75d0bcbf238e11ee31f6d1a5a6ddb014d33197b2",
         "short_id":"512:2:0/0",
         "flags":0,
         "active":true,
         "last_update":1505898540,
         "base_fee_millisatoshi":1,
         "fee_per_millionth":10,
         "delay":36
      }
   ]
}
```

## generate new address
- path: /api/lightning/getnewaddress
- request: GET
- response: JSON
```json
{
   "address":"2NCxz1cAcg9fCgF9KW9m8usXgZKjVHfxqfh"
}
```

## open channel
- path: /api/lightning/openchannel
- request: POST
- params: {"ip":"localhost","port":"8899","nodeid":"<nodeid>","amount":100000}
- response: JSON
```json
{}
```

## add funds
- path: /api/lightning/addfunds
- request: POST
- params: {"rawtx":"<raw transaction hex>"}
- response: JSON
```json
{
   "outputs":1,
   "satoshis":100000000
}
```

## fund channel
- path: /api/lightning/fundchannel
- request: POST
- params: {"nodeid":"<node id>", "amount": 1000}
- response: JSON
```json
{}
```

## connect
- path: /api/lightning/connect
- request: POST
- params: {"nodeid":"<node id>", "ip": "127.0.0.1", "port":10000}
- response: JSON
```json
{}
```

## close channel
- path: /api/lightning/closechannel
- request: POST
- params: {"nodeid":"<nodeid>"}
- response: JSON
```json
{}
```

## get route
- path: /api/lightning/getroute
- request: POST
- params: {"nodeid":"nodeid","amount":"1000","riskFactor":"1"}
- note: amount is in millisatoshi.
- response: JSON
```json
{
   "route":[
      {
         "id":"03b01a87d7922bf4d8017644ae75d0bcbf238e11ee31f6d1a5a6ddb014d33197b2",
         "channel":"512:2:0",
         "msatoshi":1000,
         "delay":36
      }
   ]
}
```

## create invoice
- path: /api/lightning/createinvoice
- request: POST
- params: {"amount":"1000","label":"invoice name"}
- note: amount is in millisatoshi.
- response: JSON
```json
{
    "rhash": "06W9WTfJDpkHwXt9JQYSoPB2JYBrxngJ2Mup2W9WTfJDpkHwXt9JQYSod18"
}
```

## list invoices
- path: /api/lightning/listinvoice
- request: GET
- response: JSON
```json
[
   {
      "label":"label",
      "rhash":"f19b481b91b62da05298d7b1bc3beb8898aa7213fb8de6d31627e98d3d2011fc",
      "msatoshi":1000,
      "complete":false
   }
]
```
## delete invoice
- path: /api/lightning/invoice/{label}
- request: DELETE
- params: {"amount":1000,"address":"<address>"}
- response: JSON
```json
{}
```

## withdraw
- path: /api/lightning/withdraw
- request: POST
- params: {"amount":1000,"address":"<address>"}
- response: JSON
```json
{
  "tx":"...",
  "txid":"..."
}
```

## send payment
- path: /api/lightning/sendpay
- request: POST
- params: {"route":[...],"hash":""}
- response: JSON
```json
{
   "preimage":"aeaf224f68fbe05f011dbe49d8db1365b0caf3baca09333f62fa10f36b0bc09d"
}
```
