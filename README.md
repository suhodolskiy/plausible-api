# Plausible Stats

![NPM Version](https://img.shields.io/npm/v/%40suhodolskiy%2Fplausible-api?color=%23cb0000) ![NPM License](https://img.shields.io/npm/l/%40suhodolskiy%2Fplausible-api)

A simple wrapper over [Plausible API ](https://plausible.io/docs/stats-api)

### Installation

```
$ npm install @suhodolskiy/plausible-api
```

### Example

```js
import Plausible from '@suhodolskiy/plausible-api'

const stats = new Plausible.Stats({
  apiUrl: 'https://plausible.io', // or your own domain
  apiKey: '',
})
```

#### Realtime Visitors

```js
const result = await stats.realtimeVisitors('siteId')

console.log(result) // 99
```

#### Breakdown Stats

```js
const results = await stats.breakdown('siteId', 'event:props:method', {
  period: '6mo',
  filters: {
    'event:name': 'Download',
  },
})

console.log(results)
```

```json
[
  {
    "method": "HTTP",
    "visitors": 1477
  },
  {
    "method": "Magnet",
    "visitors": 370
  }
]
```
