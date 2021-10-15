import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
export default class Button extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onTap}>
        <View style={this.props.style}>
          <Text style={{color: 'white'}}>{this.props.titleText}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
