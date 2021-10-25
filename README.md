# Signalwire Video SDK Demo

This example demonstrate the use of [`@signalwire/js`](https://www.npmjs.com/package/@signalwire/js) with react-native application.

## Features

- Join the room
- Mute/Unmute
- Video mute/unmute
- Deaf/Undeaf self
- Hide/Show muted videos

Screen-sharing does not currently work.

To try the example, follow the Getting Started section. If instead you'd like to setup the video SDK into your existing application, jump to the Setup Guide section. In any case, you can find step by step instructions at https://developer.signalwire.com/apis/docs/video-api-in-react-native.

# Getting Started

This repository includes the react-native example app, and a backend server that you can use to generate Room Tokens. To get started:

1.  Clone the repo
2.  Install dependencies
    - `npm install`
    - `cd react-native-app/ios && pod install`
3.  Configure the server (config file at [backend/.env](backend/.env))
4.  Start the server (`npm run backend`)
5.  Start the app (`npm run ios` or `npm run android`)

The URL of the backend server is configured in [react-native-app/App.js](react-native-app/App.js). If you are running the application from a physical device, you may need to update it with the IP address on which the backend is listening (e.g., the one of your computer).

# Setup Guide

Note: this is not needed for running the demo app included in this repo.

#### Requirements

- npm 7+ ([more info](https://docs.npmjs.com/cli/v7/using-npm/workspaces))
- [Node.js](https://nodejs.org/) 14+
- Tested with [react-native](https://github.com/facebook/react-native/releases/tag/v0.64.0) v.0.64
- Tested with IOS Deployment target 12.1
- Tested with Android minSdkVersion 24
- Make sure to register your `BundleId` & `AppGroupId`(in case of screensharing) with `Apple Developer Account`

##### Register BundleId

- Go to `Preferences` in xcode.
- Log in to `Apple Developer Account` in `Accounts` section.
- Now select your app's target & jump to `Signin & Capabilities` tab.
- check the `Automatically manage signin`.
- And select your team from the dropdown.
- If your `BundleId` is not in `RED` color you are done creating provisioning profiles.

#### Installation packages

| Package                                                                                          | README                                                                           |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| [`@signalwire/js`](https://www.npmjs.com/package/@signalwire/js)                                 | [`README.md`](packages/js/README.md)                                             |
| [`react-native-webrtc`](https://www.npmjs.com/package/react-native-webrtc)                       | [`README.md`](https://github.com/react-native-webrtc/react-native-webrtc#readme) |
| [`react-native-get-random-values`](https://www.npmjs.com/package/react-native-get-random-values) | [`README.md`](https://github.com/LinusU/react-native-get-random-values#readme)   |
| [`react-native-incall-manager`](https://www.npmjs.com/package/react-native-incall-manager)       | [`README.md`](https://github.com/zxcpoiu/react-native-incall-manager#readme)     |

Refer to the README of each package for further details.

#### Screen Share Integration (experimental)

- Android screen sharing works by default below `Android 10` but for `Android 10` & above `Media Projection Foreground Service` is used
- However for ios `Broadcast Upload Extension` is used

#### Creating Media Projection Foreground Service

- For screen sharing to work, your app needs to be running [`Foreground Services`][fservice].
- Also for triggering `Foreground Service` from React code you need a native module which is there in the sample project.

#### TL;DR

- Copy `OngoingNotification` file from the sample project & put it with the `MainActivity` class.
- Copy `MediaProjectionService` file from the sample project & put it with the `MainActivity` class.
- Copy `InteractionModule` file from the sample project & put it with the `MainActivity` class.
- Copy `MyAppPackage` file from the sample project & put it with the `MainActivity` class.
- Now inside `MainApplication` class, within the `getPackages()` method add a package called `MyAppPackage` as shown below.

```
@Override
protected List<ReactPackage> getPackages() {
    List<ReactPackage> packages = new PackageList(this).getPackages();
    packages.add(new MyAppPackage());
    return packages;
}
```

- Make sure to request the foreground service permission in `AndroidManifest.xml` as shown below
  `<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>`
- Make sure to provide type of service as `mediaProjection` in `AndroidManifest.xml` as shown below.

```
<service
    android:name=".MediaProjectionService"
    android:foregroundServiceType="mediaProjection" />
```

#### Creating the Broadcast Upload Extension

The `Broadcast Upload Extension` is one of the App Extensions types defined in iOS and is used for capturing the contents of the user's screen.

For creating the extension you need to add a new target to your application, selecting the `Broadcast Upload Extension` template. Fill in the desired name, change the language to Swift, make sure `Include UI Extension` is not selected, as we don't need custom UI for our case, then press Finish (screenshot 1). You will see that a new folder with the extension's name was added to the project's tree, containing the `SampleHandler.swift` class.

With the extension created the next steps are to set up the socket connection, add the functionality for handling the received frames, and send them to RN WebRTC for processing. We will be using the code provided with the sample project for this. Copy `SampleUploader.swift` file to your extension's folder and make sure they're added to the target.

#### TL;DR

- Add a `Broadcast Upload Extension`, without UI, to your app.
- Copy `SampleHandler.swift` file from the sample project to your extension. Make sure it is added to the extension's target.
- Add both the app and the extension to the same App Group. Next, add the app group id value to the app's `Info.plist` for the `RTCAppGroupIdentifier` key.
- Add a new key `RTCScreenSharingExtension` to the app's `Info.plist` with the extension's Bundle Identifier as the value.
- Update `SampleHandler.swift` with the code from the sample project. Update `appGroupIdentifier` constant with the App Group name your app and extension are both registered to.
- Make sure `voip` is added to `UIBackgroundModes`, in the app's `Info.playlist`, in order to work when the app is in the background.
- Make sure to add `BroadcastPod` to your `Broadcast Upload Extension` target as shown below.

```
target 'BroadCastExtension' do
   # Pods for Broadcast Extension
  pod 'BroadcastPod', '~> 1.0.2'
end
```

> Note: If you can't find screen record button into your iPhone follow this [`link`][ssguide]

[permissions]: https://developer.signalwire.com/apis/reference/video_permissions
[generate jwt token]: https://codesandbox.io/s/lingering-glitter-r8bxl
[ssguide]: https://support.logmeininc.com/joinme/help/sharing-your-screen-on-ipad-or-iphone-joinme-t-joinme-share-ios
[fservice]: https://developer.android.com/guide/components/foreground-services
