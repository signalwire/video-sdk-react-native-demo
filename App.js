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
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  SafeAreaView,
  Picker,
  StyleSheet,
  Button,
  Text,
  useColorScheme,
  View,
  Modal,
  Image,
  TextInput,
} from 'react-native';

const min = -4;
const max = 4;
const step = 1;
const gMin = 0;
const gMax = 12;
const TOKEN = '<JWT-token>';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [stream, setStream] = useState(null);

  const [modal, setModalVisibility] = useState(true);
  const [selectedValue, setSelectedValue] = useState('2x1');
  const [mVolume, setMVolume] = useState(0);
  const [sVolume, setSVolume] = useState(0);
  const [nGate, setNGate] = useState(6);
  const [room, setRoomObj] = useState(null);

  const [name, onChangeName] = React.useState('John Smith');
  const [roomName, onChangeRoomName] = React.useState('testZee');

  const start = () => {
    Video.joinRoom({
      token: TOKEN,
    })
      .then(room => {
        setRoomObj(room);
        console.log('Room Object', room, room?.remoteStream?.toURL());
        setStream(room?.remoteStream);
      })
      .catch(error => {
        console.error('Error', error);
      });
  };
  const stop = () => {
    if (stream) {
      stream.release();
      setStream(null);
    }
  };

  const checkAndProceed = () => {
    start();
    setModalVisibility(false);
  };

  const leaveMeeting = () => {
    room?.hangup();
    // stop();
    setModalVisibility(true);
  };

  const createScreenShareObj = async () => {
    await room?.createScreenShareObject();
  };
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
            <View style={{marginHorizontal: 5, marginVertical: 10}}>
              <Button
                color="#ffc107"
                title="Stop Screen share"
                style={styles.button}
              />
            </View>
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
