import React from 'react'
import { ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'
import { NavigationScreenProps } from 'react-navigation'
import { TitleBar } from '../containers/TitleBar'
import { getCurrentLanguage } from '../translate'

export enum LegalDocument {
    PRIVACY_POLICY = 'footer.personalData.description.html',
    TERMS_OF_USE = 'footer.cgu.description.html',
    DEAL_GENERAL_TERMS = 'footer.deal.description.html',
}

interface ScreenParams {
    document?: LegalDocument
}

interface ScreenProps extends NavigationScreenProps<ScreenParams> {
}

interface State {
    loading: boolean
    privacyPolicyLang: string
    privacyPolicy: string
}

export default class LegalDocumentScreen extends React.Component<ScreenProps, State> {
    public readonly state: State = {
        loading          : true,
        privacyPolicy    : '',
        privacyPolicyLang: getCurrentLanguage(),
    }

    public async componentDidMount() {
        this.setState({
            loading      : false,
            privacyPolicy: await this.getPrivacyPolicy(),
        })
    }

    public render() {
        return (
            <React.Fragment>
                <TitleBar
                    titleId="screens.legal_document.title"
                    titleDefault="Skeep"
                />

                {this.renderPrivacyPolicy()}
            </React.Fragment>
        )
    }

    private renderPrivacyPolicy() {
        if (this.state.loading) {
            return (
                <ActivityIndicator/>
            )
        }

        return (
            <WebView
                source={{
                    baseUrl: 'https://skeep.co',
                    html   : this.state.privacyPolicy || this.getLegalDocument(),
                }}
            />
        )
    }

    private async getPrivacyPolicy(): Promise<string> {
        return (
            await this.fetchPrivacyPolicy(getCurrentLanguage()) ||
            await this.fetchPrivacyPolicy('fr')
        )
    }

    private async fetchPrivacyPolicy(language: string): Promise<string | null> {
        const document = this.getLegalDocument()
        const resp = await fetch(`https://skeep.co/i18n/${language}/${document}`)
        if (resp.status < 400) {
            this.setState({privacyPolicyLang: language})
            return resp.text()
        }
        return null
    }

    private getLegalDocument() {
        const { document = LegalDocument.PRIVACY_POLICY } = this.props.navigation.state.params || {}
        return document
    }
}
