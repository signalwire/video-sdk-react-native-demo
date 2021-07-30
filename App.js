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

  const TOKEN =
  "eyJ0eXAiOiJWUlQiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2Mjc1NTU5NTgsImp0aSI6IjI4ZTc5MzhjLTNmNmMtNDI4Zi1iZWNkLTQ0YjllZGQwZWVkMiIsInN1YiI6IjliMTg3ZmZlLTIxOTgtNGE4YS05ZWMxLWJlOWI3ZWExOTUxYSIsInUiOiJFZG8iLCJyIjoicHJvZHVjdGlvbiIsInMiOlsicm9vbS5zZWxmLmF1ZGlvX211dGUiLCJyb29tLnNlbGYuYXVkaW9fdW5tdXRlIiwicm9vbS5zZWxmLnZpZGVvX211dGUiLCJyb29tLnNlbGYudmlkZW9fdW5tdXRlIiwicm9vbS5zZWxmLmRlYWYiLCJyb29tLnNlbGYudW5kZWFmIiwicm9vbS5tZW1iZXIuYXVkaW9fbXV0ZSIsInJvb20ubWVtYmVyLnNldF9pbnB1dF92b2x1bWUiLCJyb29tLm1lbWJlci5zZXRfb3V0cHV0X3ZvbHVtZSIsInJvb20ubWVtYmVyLnNldF9pbnB1dF9zZW5zaXRpdml0eSIsInJvb20uc2V0X2xheW91dCIsInJvb20uaGlkZV92aWRlb19tdXRlZCIsInJvb20uc2hvd192aWRlb19tdXRlZCJdLCJhY3IiOnRydWV9.IJzsPCqdnAFHHP2tFLIfzdCGzM2ieoWaR8XNlrMLis3yl1GBZOOP9c2KjBvE9QjpiinXFOQg7SHzQvPB0A7umg"

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
