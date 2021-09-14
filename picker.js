import React from 'react';
import {Picker} from 'react-native';
export default class MyPicker extends React.Component {
  constructor(props) {
    super(props);
    this.selectedValue = this.selectedValue.bind(this);
    this.state = {selectedValue: '2x1'};
  }

  selectedValue(e) {
    this.setState({selectedValue: e});
  }

  render() {
    return (
      <Picker
        selectedValue={this.selectedValue}
        style={{height: 50}}
        onValueChange={(itemValue, itemIndex) => {
          this.selectedValue(itemValue);
          this.props.onValueChange((itemValue, itemIndex));
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
    );
  }
}
