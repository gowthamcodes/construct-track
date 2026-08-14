import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import AwesomeAlert, { AwesomeAlertProps } from 'react-native-awesome-alerts';
import { Colors, Fonts } from '../../constants';

export interface AlertProp extends AwesomeAlertProps {}

interface AlertState {
  visibility: boolean;
  message: string;
  closeOnTouchOutside?: boolean;
  closeOnHardwareBackPress?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  cancelText?: string;
  confirmText?: string;
  confirmButtonColor?: string;
  onCancelPressed?: () => void;
  onConfirmPressed?: () => void;
}

export default class Alert extends Component<AlertProp, AlertState> {
  constructor(props: AlertProp) {
    super(props);
    this.state = {
      visibility: false,
      message: '',
      closeOnTouchOutside: false,
      closeOnHardwareBackPress: false,
      showCancelButton: false,
      showConfirmButton: true,
      cancelText: 'Cancel',
      confirmText: 'OK',
      confirmButtonColor: Colors.PRIMARY,
      onCancelPressed: this.hide.bind(this),
      onConfirmPressed: this.hide.bind(this),
    };
  }

  static _ref: any = null;

  static setRef(ref: any) {
    Alert._ref = ref;
  }

  static getRef() {
    return Alert._ref;
  }

  static clearRef() {
    Alert._ref = null;
  }

  static show(options: Omit<AlertState, 'visibility'>) {
    Alert._ref.show(options);
  }

  static hide() {
    Alert._ref.hide();
  }

  show(options: Omit<AlertState, 'visibility'>) {
    this.setState({
      visibility: true,
      cancelText: 'Cancel',
      confirmText: 'OK',
      showCancelButton: false,
      onConfirmPressed: () => undefined,
      onCancelPressed: () => undefined,
      ...options,
    });
  }

  hide() {
    this.setState({ visibility: false });
  }

  override render(): React.JSX.Element {
    return (
      <AwesomeAlert
        useNativeDriver
        show={this.state.visibility}
        message={this.state.message}
        closeOnTouchOutside={this.state.closeOnTouchOutside}
        closeOnHardwareBackPress={this.state.closeOnHardwareBackPress}
        showCancelButton={this.state.showCancelButton}
        showConfirmButton={this.state.showConfirmButton}
        cancelText={this.state.cancelText}
        confirmText={this.state.confirmText}
        confirmButtonColor={this.state.confirmButtonColor}
        confirmButtonStyle={styles.confirmButtonStyle}
        confirmButtonTextStyle={styles.confirmButtonTextStyle}
        messageStyle={styles.messageStyle}
        onCancelPressed={() => {
          if (this.state.onCancelPressed) {
            this.state.onCancelPressed();
            this.setState({ ...this.state, onCancelPressed: () => undefined });
          }
          this.hide();
        }}
        onConfirmPressed={() => {
          if (this.state.onConfirmPressed) {
            this.state.onConfirmPressed();
            this.setState({ ...this.state, onConfirmPressed: () => undefined });
          }
          this.hide();
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  confirmButtonStyle: {
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: Colors.PRIMARY,
  },
  confirmButtonTextStyle: {
    fontFamily: Fonts.NOTO_MEDIUM,
    color: Colors.WHITE,
    fontSize: 12,
    lineHeight: 12 * 1.4,
  },
  messageStyle: {
    fontFamily: Fonts.NOTO_MEDIUM,
    fontSize: 14,
    lineHeight: 14 * 1.4,
    color: Colors.BLACK,
  },
});
