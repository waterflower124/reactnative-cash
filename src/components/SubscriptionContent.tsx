import React from 'react'
import { ActivityIndicator, WebViewIOSLoadRequestEvent } from 'react-native'
import { WebView } from 'react-native-webview'
import * as promises from '../utils/promises'
import { Overlay, OverlayProps } from './Overlay'

interface SubscriptionContentProps extends OverlayProps {
  content: PromiseState<string>
}

export class SubscriptionContent extends React.PureComponent<SubscriptionContentProps> {
  public render() {
    const { content, ...props } = this.props

    return (
      <Overlay
        {...props}
        overlaid={
          <WebView
            scalesPageToFit
            source={{html: promises.unwrap(content, '<html/>')}}
            onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
            renderLoading={this.renderWebViewLoading}
            style={{
              flex: 1,
              alignSelf: 'stretch',
            }}
          />
        }
      />
    )
  }

  private renderWebViewLoading = () => (
    <ActivityIndicator
      size="large"
      color="#041f43"
    />
  )

  private onShouldStartLoadWithRequest = (evt: WebViewIOSLoadRequestEvent) => {
    return evt.url === 'about:blank' && evt.navigationType !== 'click'
  }
}
