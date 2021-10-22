import 'react-native-get-random-values';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useState} from 'react';
import {Video} from '@signalwire/js';
import {RTCView} from 'react-native-webrtc';
import Slider from 'react-native-slider';
import InCallManager from 'react-native-incall-manager';
import styles from './styles';
import Button from './button';
import MyPicker from './picker';
import {NativeModules, Platform} from 'react-native';
import {
  SafeAreaView,
  Picker,
  Text,
  View,
  Modal,
  Image,
  TextInput,
  DeviceEventEmitter,
} from 'react-native';

const min = -4;
const max = 4;
const step = 1;
const gMin = 0;
const gMax = 12;
const TOKEN =
  'eyJ0eXAiOiJWUlQiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2Mjg2NzY4MTQsImp0aSI6ImRmYTlmZDFlLTY3YjgtNDk5Ni04NWRjLWZkYjNjZGM1MWVmMSIsInN1YiI6IjY0OWRjMDhlLTM1NTgtNGVmZS1hNTk4LTQ2YTk2NjE2NGI4MyIsInUiOiJaZWVzaGFuIiwiciI6InRlcyIsInMiOlsicm9vbS5zZXRfbGF5b3V0Iiwicm9vbS5zZWxmLmF1ZGlvX211dGUiLCJyb29tLnNlbGYuYXVkaW9fdW5tdXRlIiwicm9vbS5zZWxmLnZpZGVvX211dGUiLCJyb29tLnNlbGYudmlkZW9fdW5tdXRlIiwicm9vbS5zZWxmLmRlYWYiLCJyb29tLnNlbGYudW5kZWFmIiwicm9vbS5zZWxmLnNldF9pbnB1dF9zZW5zaXRpdml0eSIsInJvb20uc2VsZi5zZXRfaW5wdXRfdm9sdW1lIiwicm9vbS5zZWxmLnNldF9vdXRwdXRfdm9sdW1lIiwicm9vbS5oaWRlX3ZpZGVvX211dGVkIiwicm9vbS5zaG93X3ZpZGVvX211dGVkIl0sImFjciI6dHJ1ZX0.SfXfr1YFTES8bGlgZxcXNMAeo9zeS0k5TirTuCEpF5M43alyByKkXet0ic1iAd6AgXQUi3SWlsB0Yn4AwcJ9Tw';

const App = () => {
  const {InteractionModule} = NativeModules;

  const [stream, setStream] = useState(null);

  const [modal, setModalVisibility] = useState(true);
  const [mVolume, setMVolume] = useState(0);
  const [sVolume, setSVolume] = useState(0);
  const [nGate, setNGate] = useState(6);
  const [room, setRoomObj] = useState(null);

  const [name, onChangeName] = React.useState('John Smith');
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

  const start = () => {
    Video.createRoomObject({
      host: 'relay.signalwire.com',
      token: TOKEN,
    })
      .then(room => {
        setRoomObj(room);
        InCallManager.start({media: 'audio'});
        console.log('Room Object', room, room?.remoteStream?.toURL());
        room?.on('room.ended', params => {
          console.debug('>> DEMO room.ended', params);
        });

        room?.on('room.joined', params => {
          console.debug('>> DEMO room.joined', params);
        });
        room
          ?.join()
          .then(room2 => {
            console.log('Room Joined');
            setStream(room?.remoteStream);
            setModalVisibility(false);
          })
          .catch(error => {
            console.error('Error', error);
          });
      })
      .catch(error => {
        console.error('Error', error);
      });
  };

  const stop = () => {
    if (stream) {
      stream.release();
      setStream(null);
      setRoomObj(null);
      InCallManager.stop();
    }
  };

  const leaveMeeting = () => {
    room?.hangup();
    stop();
    setModalVisibility(true);
  };

  const createScreenShareObj = async () => {
    if (Platform.OS === 'android') {
      InteractionModule.launch();
    }
    await room?.createScreenShareObject();
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
  const setSpeakerOf = () => InCallManager.setForceSpeakerphoneOn(false);

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
              titleText="Join"
            />
          </View>
        </Modal>

        {/* Main */}
        {stream && <RTCView streamURL={stream.toURL()} style={styles.stream} />}
        <View style={styles.footer}>
          <View style={styles.container}>
            <MyPicker
              onValueChange={(itemValue, itemIndex) => {
                if (itemValue !== '0') {
                  room?.setLayout({name: itemValue});
                }
              }}
            />
          </View>
          <View style={styles.slider}>
            <Text style={styles.mediumText}>Microphone Volume</Text>
            <Slider
              minimumValue={min}
              maximumValue={max}
              step={step}
              value={mVolume}
              onValueChange={value => {
                console.log({value});
                setMVolume(value);
                room?.setMicrophoneVolume({volume: value});
              }}
            />
          </View>

          <View style={styles.slider}>
            <Text style={styles.mediumText}>Speaker Volume</Text>
            <Slider
              minimumValue={min}
              maximumValue={max}
              step={step}
              value={sVolume}
              onValueChange={value => {
                console.log({value});
                setSVolume(value);
                room?.setSpeakerVolume({volume: value});
              }}
            />
          </View>

          <View style={styles.slider}>
            <Text style={styles.mediumText}>Noise Gate</Text>
            <Slider
              minimumValue={gMin}
              maximumValue={gMax}
              step={step}
              value={nGate}
              onValueChange={value => {
                console.log({value});
                setNGate(value);
                room?.setInputSensitivity({value: value});
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
              onTap={createScreenShareObj}
              titleText="Screen share"
            />

            <Button
              style={styles.buttonStyle}
              onTap={setSpeakerOn}
              titleText="Speaker"
            />

            <Button
              style={styles.buttonStyle}
              onTap={setSpeakerOf}
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
