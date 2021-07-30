import 'react-native-get-random-values';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import { Video } from '@signalwire/js';
import { RTCView } from 'react-native-webrtc';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Colors, Header } from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [stream, setStream] = useState(null)

  const TOKEN = "<JWT-HERE>"

  // useEffect(() => {
  //   Video.joinRoom({
  //     token: TOKEN,
  //   })
  //   .then((room) => {
  //     console.log('Room Object', room, room?.remoteStream?.toURL())

  //     setStream(room?.remoteStream?.toURL())
  //   })
  //   .catch((error) => {
  //     console.error('Error', error)
  //   })
  // }, [])

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            flex: 1, width:'100%', height:'100%', backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>

          {stream && <RTCView streamURL={stream} style={{ flex: 1, width: 400, height: 300, backgroundColor: 'black' }}  />}

        </View>
      </ScrollView>
    </SafeAreaView>
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
});

export default App;
