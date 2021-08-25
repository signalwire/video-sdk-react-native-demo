# Signalwire Video SDK Demo

This example demonstrate the use of [`@signalwire/js`](https://www.npmjs.com/package/@signalwire/js) with react-native application.

## Features

- Join the room
- Mute/Unmute
- Video mute/unmute
- Deaf/Undeaf self
- Hide/Show vMuted
- Change layout
- Set microphone volume
- Set speaker volume
- Set noise gate
- Screenshare

This example is ready to use. Follow below steps to get it working.
However if you want to setup everything into your existing application jump to `Setup Guide` section.

- Checkout
- [Generate JWT Token]
  > Note: While generating token you can add other [Permissions], apart from deafault permissions
- Replace that token in the `App.js`
- Run below commands

```sh
cd video-sdk-react-native-demo
npm i
cd ios && pod install

cd .. && npm run android
or
cd .. && npm run ios
```

# Setup Guide

#### Requirements

- npm 7+ ([more info](https://docs.npmjs.com/cli/v7/using-npm/workspaces))
- [Node.js](https://nodejs.org/) 14+
- Tested with [react-native](https://github.com/facebook/react-native/releases/tag/v0.64.0) v.0.64
- Tested with IOS Deployment target 12.1
- Tested with Android minSdkVersion 21

#### Installation packages

| Package                                                                                          | README                                                                           |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| [`@signalwire/js`](https://www.npmjs.com/package/@signalwire/js)                                 | [`README.md`](packages/js/README.md)                                             |
| [`react-native-webrtc`](https://www.npmjs.com/package/react-native-webrtc)                       | [`README.md`](https://github.com/react-native-webrtc/react-native-webrtc#readme) |
| [`react-native-get-random-values`](https://www.npmjs.com/package/react-native-get-random-values) | [`README.md`](https://github.com/LinusU/react-native-get-random-values#readme)   |
| [`react-native-incall-manager`](https://www.npmjs.com/package/react-native-incall-manager)       | [`README.md`](https://github.com/zxcpoiu/react-native-incall-manager#readme)     |

Refer to the README of each package for further details.

#### Screen Share Integration

- Android screen sharing works by default
- However for ios `Broadcast Upload Extension` is used

#### Creating the Broadcast Upload Extension

The `Broadcast Upload Extension` is one of the App Extensions types defined in iOS and is used for capturing the contents of the user's screen.

For creating the extension you need to add a new target to your application, selecting the `Broadcast Upload Extension` template. Fill in the desired name, change the language to Swift, make sure `Include UI Extension` is not selected, as we don't need custom UI for our case, then press Finish (screenshot 1). You will see that a new folder with the extension's name was added to the project's tree, containing the `SampleHandler.swift` class.

With the extension created the next steps are to set up the socket connection, add the functionality for handling the received frames, and send them to RN WebRTC for processing. We will be using the code provided with the sample project for this. Copy `SampleUploader.swift`, `SocketConnection.swift`, `DarwinNotificationCenter.swift`, and `Atomic.swift` files to your extension's folder and make sure they're added to the target.

#### TL;DR

- Add a `Broadcast Upload Extension`, without UI, to your app.
- Copy `SampleUploader.swift`, `SocketConnection.swift`, `DarwinNotificationCenter.swift` and `Atomic.swift` files from the sample project to your extension. Make sure they are added to the extension's target.
- Add both the app and the extension to the same App Group. Next, add the app group id value to the app's `Info.plist` for the `RTCAppGroupIdentifier` key.
- Add a new key `RTCScreenSharingExtension` to the app's `Info.plist` with the extension's Bundle Identifier as the value.
- Update `SampleHandler.swift` with the code from the sample project. Update `appGroupIdentifier` constant with the App Group name your app and extension are both registered to.
- Make sure `voip` is added to `UIBackgroundModes`, in the app's `Info.playlist`, in order to work when the app is in the background.

> Note: If you can't find screen record button into your iPhone follow this [`link`][ssguide]

[permissions]: https://developer.signalwire.com/apis/reference/video_room_permissions
[generate jwt token]: https://codesandbox.io/s/lingering-glitter-r8bxl
[ssguide]: https://support.logmeininc.com/joinme/help/sharing-your-screen-on-ipad-or-iphone-joinme-t-joinme-share-ios
