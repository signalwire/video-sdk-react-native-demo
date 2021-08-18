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
import {RTCView, mediaDevices} from 'react-native-webrtc';
import Slider from 'react-native-slider';
// import * as Progress from 'react-native-progress';
// import InCallManager from 'react-native-incall-manager';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  SafeAreaView,
  Picker,
  StyleSheet,
  Button,
  ProgressBarAndroid,
  Text,
  useColorScheme,
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
  const isDarkMode = useColorScheme() === 'dark';
  const [stream, setStream] = useState(null);

  const [modal, setModalVisibility] = useState(true);
  const [progressBar, setProgressBarVisibility] = useState(false);
  const [headset, setHeadsetVisibility] = useState(false);
  const [selectedValue, setSelectedValue] = useState('2x1');
  const [mVolume, setMVolume] = useState(0);
  const [sVolume, setSVolume] = useState(0);
  const [nGate, setNGate] = useState(6);
  const [room, setRoomObj] = useState(null);

  const [name, onChangeName] = React.useState('John Smith');
  const [roomName, onChangeRoomName] = React.useState('testZee');

  React.useEffect(() => {
    // checkPermission();
    // DeviceEventEmitter.addListener('Proximity', function (data) {
    //   console.log('Proximity sensor data', data);
    // });
    // DeviceEventEmitter.addListener('WiredHeadset', function (data) {
    //   console.log('WiredHeadset data', data);
    // });
  }, []);

  const start = () => {
    Video.createRoomObject({
      host: 'relay.signalwire.com',
      token: TOKEN,
    })
      .then(room => {
        setRoomObj(room);
        // InCallManager.start({media: 'audio'});
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
            setProgressBarVisibility(false);
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
    }
  };

  const checkAndProceed = () => {
    setProgressBarVisibility(true);
    start();
  };

  const leaveMeeting = () => {
    room?.hangup();
    stop();
    setModalVisibility(true);
  };

  const createScreenShareObj = async () => {
    await room?.createScreenShareObject();
  };

  // const createScreenShareObj = () => {
  //   mediaDevices
  //     .getDisplayMedia({video: true})
  //     .then(stream => {
  //       setStream(stream);
  //       console.log('Succeeded to get screen!');
  //     })
  //     .catch(error => {
  //       console.log('Failed to get screen!');
  //       console.log(error);
  //     });
  // };

  // const checkPermission = async () => {
  //   if (InCallManager.recordPermission !== 'granted') {
  //     InCallManager.requestRecordPermission()
  //       .then(requestedRecordPermissionResult => {
  //         console.log(
  //           'InCallManager.requestRecordPermission() requestedRecordPermissionResult: ',
  //           requestedRecordPermissionResult,
  //         );
  //       })
  //       .catch(err => {
  //         console.log('InCallManager.requestRecordPermission() catch: ', err);
  //       });
  //   }
  // };
  return (
    <>
      <SafeAreaView style={styles.body}>
        <Modal visible={modal}>
          <View style={styles.body2}>
            <Image
              style={styles.logo}
              source={require('./assets/sw_logo.png')}
            />
            <Text style={styles.titleText}>Video Demo</Text>
            {/* {progressBar && <Progress.Circle size={30} indeterminate={true} />} */}
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
            <View style={{marginHorizontal: 10}}>
              <Button title="Join" onPress={checkAndProceed} />
            </View>
          </View>
        </Modal>
        {stream && <RTCView streamURL={stream.toURL()} style={styles.stream} />}
        <View style={styles.footer}>
          <View style={styles.container}>
            <Picker
              selectedValue={selectedValue}
              style={{height: 50}}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedValue(itemValue);
                if (itemValue != '0') {
                  room?.setLayout({name: itemValue});
                }
              }}>
              <Picker.Item label="Change Layout" value="0" />
              <Picker.Item label="8x8" value="8x8" />
              <Picker.Item label="2x1" value="2x1" />
              <Picker.Item label="1x1" value="1x1" />
              <Picker.Item label="5up" value="5up" />
              <Picker.Item label="5x5" value="5x5" />
              <Picker.Item label="4x4" value="4x4" />
              <Picker.Item label="10x10" value="10x10" />
              <Picker.Item label="2x2" value="2x2" />
              <Picker.Item label="6x6" value="6x6" />
              <Picker.Item label="grid-responsive" value="grid-responsive" />
              <Picker.Item
                label="highlight-1-responsive"
                value="highlight-1-responsive"
              />
            </Picker>
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
            <View style={{marginVertical: 10, marginHorizontal: 5}}>
              <Button
                color="#ffc107"
                title="Mute Self"
                style={styles.button}
                onPress={() => room?.audioMute()}
              />
            </View>

            <View style={{marginVertical: 10, marginHorizontal: 5}}>
              <Button
                color="#ffc107"
                title="UnMute Self"
                style={styles.button}
                onPress={() => room?.audioUnmute()}
              />
            </View>

            <View style={{marginVertical: 10, marginHorizontal: 5}}>
              <Button
                color="#ffc107"
                title="Deaf"
                style={styles.button}
                onPress={() => room?.deaf()}
              />
            </View>

            <View style={{marginVertical: 10, marginHorizontal: 5}}>
              <Button
                color="#ffc107"
                title="UnDeaf"
                style={styles.button}
                onPress={() => room?.undeaf()}
              />
            </View>
          </View>

          <View style={styles.footer2}>
            <View style={{marginHorizontal: 5}}>
              <Button
                color="#ffc107"
                title="Video mute"
                style={styles.button}
                onPress={() => room?.videoMute()}
              />
            </View>
            <View style={{marginHorizontal: 5}}>
              <Button
                color="#ffc107"
                title="Video UnMute"
                style={styles.button}
                onPress={() => room?.videoUnmute()}
              />
            </View>
            <View style={{marginHorizontal: 5}}>
              <Button
                color="#ffc107"
                title="Hide"
                style={styles.button}
                onPress={() => room?.hideVideoMuted()}
              />
            </View>
            <View style={{marginHorizontal: 5}}>
              <Button
                color="#ffc107"
                title="Show"
                style={styles.button}
                onPress={() => room?.showVideoMuted()}
              />
            </View>
          </View>
          <View style={styles.footer2}>
            <View style={{marginHorizontal: 5, marginVertical: 10}}>
              <Button
                color="#ffc107"
                title="Screen share"
                style={styles.button}
                onPress={createScreenShareObj}
              />
            </View>
            {/* <View style={{marginHorizontal: 5, marginVertical: 10}}>
              <Button
                color="#ffc107"
                title="S"
                style={styles.button}
                pressed={() => InCallManager.setSpeakerphoneOn(true)}
              />
            </View>
            <View style={{marginHorizontal: 5, marginVertical: 10}}>
              <Button
                color="#ffc107"
                title="E"
                style={styles.button}
                pressed={() => InCallManager.setSpeakerphoneOn(false)}
              />
            </View>
            {headset && (
              <View style={{marginHorizontal: 5, marginVertical: 10}}>
                <Button color="#ffc107" title="H" style={styles.button} />
              </View>
            )} */}
          </View>
          <View style={{marginHorizontal: 5}}>
            <Button title="Leave" color="red" onPress={leaveMeeting} />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  body: {
    justifyContent: 'center',
    backgroundColor: Colors.white,
    ...StyleSheet.absoluteFill,
  },
  body2: {
    justifyContent: 'center',
    backgroundColor: Colors.white,
    ...StyleSheet.absoluteFill,
  },
  stream: {
    marginVertical: 10,
    top: 0,
    position: 'absolute',
    height: '30%',
    width: '100%',
  },
  footer: {
    backgroundColor: Colors.lighter,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footer2: {
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.lighter,
  },
  button: {
    alignSelf: 'center',
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
    margin: 8,
  },
  mediumText: {
    color: 'black',
    flex: 1,
  },
  titleText: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'black',
    flex: 1,
  },
  slider: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  logo: {width: '100%', height: '13%', resizeMode: 'stretch'},
});

export default App;
