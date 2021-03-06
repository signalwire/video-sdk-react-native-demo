import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export default StyleSheet.create({
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
    marginTop: 50,
    justifyContent: 'center',
    backgroundColor: Colors.white,
    ...StyleSheet.absoluteFill,
  },
  body2: {
    marginTop: 50,
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  logo: {width: '100%', height: '13%', resizeMode: 'stretch'},
});
