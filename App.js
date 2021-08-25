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

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  SafeAreaView,
  Picker,
  StyleSheet,
  Button,
  Text,
  View,
  Modal,
  Image,
  TextInput,
  DeviceEventEmitter,
  TouchableOpacity,
} from 'react-native';

const min = -4;
const max = 4;
const step = 1;
const gMin = 0;
const gMax = 12;
const TOKEN = '<JWT-TOKEN>';

const App = () => {
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
      InCallManager.stop();
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
            <TouchableOpacity onPress={checkAndProceed}>
              <View style={styles.buttonStyleBlue}>
                <Text style={{color: 'white'}}>Join</Text>
              </View>
            </TouchableOpacity>
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
            <TouchableOpacity onPress={() => room?.audioMute()}>
              <View style={styles.buttonStyle}>
                <Text style={{color: 'white'}}>Mute Self</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => room?.audioUnmute()}>
              <View style={styles.buttonStyle}>
                <Text style={{color: 'white'}}>UnMute Self</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => room?.deaf()}>
              <View style={styles.buttonStyle}>
                <Text style={{color: 'white'}}>Deaf</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => room?.undeaf()}>
              <View style={styles.buttonStyle}>
                <Text style={{color: 'white'}}>UnDeaf</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footer2}>
            <TouchableOpacity onPress={() => room?.videoMute()}>
              <View style={styles.buttonStyle}>
                <Text style={{color: 'white'}}>Video mute</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => room?.videoUnmute()}>
              <View style={styles.buttonStyle}>
                <Text style={{color: 'white'}}>Video UnMute</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => room?.hideVideoMuted()}>
              <View style={styles.buttonStyle}>
                <Text style={{color: 'white'}}>Hide</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => room?.showVideoMuted()}>
              <View style={styles.buttonStyle}>
                <Text style={{color: 'white'}}>Show</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.footer2}>
            <TouchableOpacity onPress={createScreenShareObj}>
              <View style={styles.buttonStyle}>
                <Text style={{color: 'white'}}>Screen share</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={setSpeakerOn}>
              <View style={styles.buttonStyle}>
                <Text style={{color: 'white'}}>Speaker</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={setSpeakerOf}>
              <View style={styles.buttonStyle}>
                <Text style={{color: 'white'}}>Earpiece</Text>
              </View>
            </TouchableOpacity>
            {headset && (
              <View style={{marginHorizontal: 5, marginVertical: 10}}>
                <Button color="#ffc107" title="H" style={styles.button} />
              </View>
            )}
          </View>
          <TouchableOpacity onPress={leaveMeeting}>
            <View style={styles.buttonStyleRed}>
              <Text style={{color: 'white'}}>Leave</Text>
            </View>
          </TouchableOpacity>
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
  buttonStyle: {
    marginTop: 5,
    marginStart: 8,
    marginBottom: 5,
    padding: 8,
    backgroundColor: '#ffc107',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.9,
    shadowRadius: 3,
    alignItems: 'center',
    elevation: 3,
  },
  buttonStyleRed: {
    marginTop: 5,
    marginStart: 8,
    marginBottom: 5,
    marginEnd: 8,
    padding: 8,
    alignItems: 'center',
    backgroundColor: 'red',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonStyleBlue: {
    marginTop: 5,
    marginStart: 8,
    marginBottom: 5,
    marginEnd: 8,
    padding: 8,
    alignItems: 'center',
    backgroundColor: 'dodgerblue',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 3,
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
