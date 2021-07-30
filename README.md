### VideoSDK ReactNative Demo

To run the App follow these steps:

> Install the deps using `npm` or `yarn`

```sh
npm install
# or
yarn
```

Locate `node_modules/@signalwire/webrtc/dist/webrtc/srcRTCPeer.js` and update these methods:

```diff
    _getSenderByKind(kind) {
+        if (!this.instance.getSenders) {
+            return null
+        }
        return this.instance
            .getSenders()
            .find(({ track }) => track && track.kind === kind);
    }
```

```diff
    _checkMediaToNegotiate(kind) {
        // addTransceiver of 'kind' if not present
        const sender = this._getSenderByKind(kind);
-        if (!sender) {
+        if (!sender && this.instance.addTransceiver) {
            const transceiver = this.instance.addTransceiver(kind);
            logger.debug('Add transceiver', kind, transceiver);
        }
    }
```

Generate a JWT and use it into `./App.js`:

> App.js

```
const TOKEN = "<JWT-HERE>"
```

Run the App on a device.
