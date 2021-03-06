import 'react-native-get-random-values';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useState } from 'react';
import axios from "axios"
import { Video } from '@signalwire/js';
import { RTCView } from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import styles from './styles';
import Button from './button';
import MyPicker from './picker';
import { NativeModules, Platform } from 'react-native';
import {
  SafeAreaView,
  Text,
  View,
  Modal,
  Image,
  TextInput,
  DeviceEventEmitter,
} from 'react-native';

const SERVER_URL = 'http://localhost:8080';

const App = () => {
  const {InteractionModule} = NativeModules;

  const [stream, setStream] = useState(null);

  const [modal, setModalVisibility] = useState(true);
  const [joinEnabled, setJoinEnabled] = useState(true);
  const [room, setRoomObj] = useState(null);

  const [name, onChangeName] = React.useState('guest');
  const [roomName, onChangeRoomName] = React.useState('test');

  React.useEffect(() => {
    checkPermission();
    DeviceEventEmitter.addListener('Proximity', function (data) {
      console.log('Proximity sensor data', data);
    });
    DeviceEventEmitter.addListener('WiredHeadset', function (data) {
      console.log('WiredHeadset data', data);
    });
    DeviceEventEmitter.addListener('onAudioFocusChange', function (data) {
      console.log('onAudioFocusChange data', data);
    });
  }, []);

  const start = async () => {
    if (!joinEnabled) return
    setJoinEnabled(false)

    // Get token from a remote server
    let token
    try {
      const response = await axios.post(`${SERVER_URL}/get_token`, {
        user_name: name,
        room_name: roomName,
      });
      token = response.data.token;
    } catch (e) {
      console.error("There was an error obtaing the Room Token. Make sure " +
                    "that you have started the server, and that the correct " +
                    "SERVER_URL is configured in `react-native-app/App.js`.")
      setJoinEnabled(true)
      return
    }

    /*
      Alternatively, for the purposes of the demo you can get a token with curl:

        curl --request POST \
          --url 'https://your_space_id.signalwire.com/api/video/room_tokens' \
          --user 'project_id:api_token' \
          --header 'Content-Type: application/json' \
          --data '{"user_name": "john", "room_name": "office", "permissions": ["room.self.audio_mute", "room.self.audio_unmute", "room.self.video_mute", "room.self.video_unmute", "room.self.deaf", "room.self.undeaf", "room.hide_video_muted", "room.show_video_muted", "room.set_layout"]}'

      Remember to replace `your_space_id`, `project_id`, `api_token`.
    */
    // const token = '<YourRoomToken>'

    const room = new Video.RoomSession({
      token: token,
      logLevel: 'silent'
    })
    setRoomObj(room);

    InCallManager.start({ media: 'audio' });

    room.on('room.ended', params => {
      console.debug('>> DEMO room.ended', params);
    });

    room.on('room.joined', params => {
      console.debug('>> DEMO room.joined', params);

      setStream(room.remoteStream);
      console.log(room)
      console.log("Remote stream:", room.remoteStream.toURL())
      setModalVisibility(false);
      setJoinEnabled(true);
    });

    try {
      await room.join()
      console.log('Room Joined');
    } catch (error) {
      console.error('Error', error);
    }
  };

  const stop = () => {
    if (stream) {
      stream.release();
      setStream(null);
      setRoomObj(null);
      InCallManager.stop();
    }
  };

  const leaveMeeting = async () => {
    try {
      await room?.leave();
    } catch (e) { }
    stop();
    setModalVisibility(true);
    setJoinEnabled(true);
  };

  const startScreenShare = async () => {
    if (Platform.OS === 'android') {
      InteractionModule.launch();
    }
    await room?.startScreenShare();
  };

  const checkPermission = async () => {
    if (InCallManager.recordPermission !== 'granted') {
      InCallManager.requestRecordPermission()
        .then(requestedRecordPermissionResult => {
          console.log(
            'InCallManager.requestRecordPermission() requestedRecordPermissionResult: ',
            requestedRecordPermissionResult,
          );
        })
        .catch(err => {
          console.log('InCallManager.requestRecordPermission() catch: ', err);
        });
    }
  };

  const setSpeakerOn = () => InCallManager.setForceSpeakerphoneOn(true);
  const setSpeakerOff = () => InCallManager.setForceSpeakerphoneOn(false);

  return (
    <>
      <SafeAreaView style={styles.body}>
        {/* Login */}
        <Modal visible={modal}>
          <View style={styles.body2}>
            <Image
              style={styles.logo}
              source={require('./assets/sw_logo.png')}
            />
            <Text style={styles.titleText}>Video Demo</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeName}
              value={name}
              placeholder="Your name"
              keyboardType="default"
            />

            <TextInput
              style={styles.input}
              onChangeText={onChangeRoomName}
              value={roomName}
              placeholder="Room's name"
              keyboardType="default"
            />

            <Button
              style={styles.buttonStyleBlue}
              onTap={start}
              titleText={joinEnabled ? 'Join' : 'Loading...'}
              disabled={!joinEnabled}
            />
            <View style={{ flex: 1 }}></View>
          </View>
        </Modal>

        {/* Main */}
        {stream && <RTCView streamURL={stream.toURL()} style={styles.stream} />}
        <View style={styles.footer}>
          <View style={styles.container}>
            <MyPicker
              onValueChange={(itemValue, itemIndex) => {
                if (itemValue !== '0') {
                  room?.setLayout({ name: itemValue });
                }
              }}
            />
          </View>

          <View style={styles.footer2}>
            <Button
              style={styles.buttonStyle}
              onTap={() => room?.audioMute()}
              titleText="Mute Self"
            />

            <Button
              style={styles.buttonStyle}
              onTap={() => room?.audioUnmute()}
              titleText="UnMute Self"
            />

            <Button
              style={styles.buttonStyle}
              onTap={() => room?.deaf()}
              titleText="Deaf"
            />
            <Button
              style={styles.buttonStyle}
              onTap={() => room?.undeaf()}
              titleText="UnDeaf"
            />
          </View>

          <View style={styles.footer2}>
            <Button
              style={styles.buttonStyle}
              onTap={() => room?.videoMute()}
              titleText="Video mute"
            />

            <Button
              style={styles.buttonStyle}
              onTap={() => room?.videoUnmute()}
              titleText="Video UnMute"
            />

            <Button
              style={styles.buttonStyle}
              onTap={() => room?.hideVideoMuted()}
              titleText="Hide"
            />
            <Button
              style={styles.buttonStyle}
              onTap={() => room?.showVideoMuted()}
              titleText="Show"
            />
          </View>
          <View style={styles.footer2}>
            <Button
              style={styles.buttonStyle}
              onTap={startScreenShare}
              titleText="Screen share"
            />

            <Button
              style={styles.buttonStyle}
              onTap={setSpeakerOn}
              titleText="Speaker"
            />

            <Button
              style={styles.buttonStyle}
              onTap={setSpeakerOff}
              titleText="Earpiece"
            />
          </View>

          <Button
            style={styles.buttonStyleRed}
            onTap={leaveMeeting}
            titleText="Leave"
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default App;
