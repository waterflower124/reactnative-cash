import React from 'react'
import { ActivityIndicator, Dimensions } from 'react-native'
import Cookies from 'react-native-cookies'
import { WebView } from 'react-native-webview'
import URL from 'url-parse'

const LOGIN_URL = 'https://m.facebook.com/login.php'

export interface FacebookCredentials {
  [fieldName: string]: string
}

export interface FacebookLoginProps {
  defaultEmail?: string
  defaultPass?: string
  onLogin: (email: string, password: string, cookies: {}) => void
}

interface State {
  pending: boolean
  currentEmail: string
  currentPass: string
}

export class FacebookLogin extends React.Component<FacebookLoginProps, State> {
  public readonly state: State = {
    pending: true,
    currentEmail: null,
    currentPass: null,
  }

  public async componentDidMount() {
    await Cookies.clearAll()
      .catch(e => console.log(e))
  }

  public render() {
    if (!this.state.pending) {
      return (
        <ActivityIndicator
          animating={true}
          color="white"
          size="large"
          style={{flex: 1}}
        />
      )
    }

    const {width: windowWidth} = Dimensions.get('window')

    return (
      <WebView
        source={{uri: LOGIN_URL, method: 'GET'}}
        onLoadStart={this.onLoadStart}
        style={{
          flex          : 1,
          width         : windowWidth,
          borderTopWidth: 3,
          borderColor   : '#FFF',
        }}
        onMessage={(evt) => {
          if (evt.nativeEvent.data) {
            try {
              const data = JSON.parse(evt.nativeEvent.data)
              if (data.email !== undefined) {
                this.setState({currentEmail: data.email})
              }

              if (data.pass !== undefined) {
                this.setState({currentPass: data.pass})
              }
            } catch (_ignored) {
              // TODO: Why ignoring it?
            }
          }
        }}
        injectedJavaScript={`
                    var originalPostMessage = window.postMessage;

                    var patchedPostMessage = function(message, targetOrigin, transfer) {
                      originalPostMessage(message, targetOrigin, transfer);
                    };

                    patchedPostMessage.toString = function() {
                      return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
                    };

                    window.postMessage = patchedPostMessage;

                    var email = document.getElementsByName('email')[0];
                    email.value = ${!this.props.defaultEmail ? 'null' : JSON.stringify(this.props.defaultEmail)};
                    email.readOnly = ${JSON.stringify(typeof this.props.defaultEmail === 'string')};
                    email.addEventListener('input', function(evt) {
                      window.postMessage(JSON.stringify({
                        email: evt.target.value,
                      }));
                    });

                    var pass = document.getElementsByName('pass')[0];
                    pass.value = ${!this.props.defaultPass ? 'null' : JSON.stringify(this.props.defaultPass)};
                    pass.readOnly = ${JSON.stringify(typeof this.props.defaultPass === 'string')};
                    pass.addEventListener('input', function(evt) {
                      window.postMessage(JSON.stringify({
                        pass: evt.target.value,
                      }));
                    });
                `}
      />
    )
  }

  private shouldLogin(url: URL): boolean {
    // make sure we are on facebook website
    if (url.host.split('.').slice(-2).join('.') !== 'facebook.com') {
      return false
    }

    // we are still logging in
    if (url.pathname === '/login.php') {
      return false
    }

    // We're logged when pathname =>
    return [
      '/',
      '/home.php',
      '/login/save-device/cancel',
      '/login/save-device/cancel/',
      '/login/device-based/update-nonce/',
    ].includes(url.pathname)
  }

  private onLoadStart = async (evt) => {
    const url     = URL(evt.nativeEvent.url)
    if (this.shouldLogin(url)) {
      const cookies = await Cookies.get('https://facebook.com')
      this.setState({pending: false})
      this.props.onLogin(this.state.currentEmail || this.props.defaultEmail, this.state.currentPass || this.props.defaultPass, cookies)
    }
  }
}
