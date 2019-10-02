import React       from 'react'
import { connect } from 'react-redux'

import { NavigationScreenProps } from 'react-navigation'
import { Action, Dispatch }      from '../store'

import {
    Image, StatusBar,
    ImageSourcePropType,
    TouchableOpacity, View,
}                       from 'react-native'
import { Background }   from '../components/Background'
import { Message }      from '../components/Message'
import { SafeAreaView } from '../components/SafeAreaView'
import { Header }       from '../containers/Header'
import { Wrapper }      from '../containers/Wrapper'

import * as navigationActions from '../store/navigation/actions'
import * as sessionActions    from '../store/session/actions'
import { HeaderText } from '../components/HeaderText';

interface ConfigureAppScreenProps extends NavigationScreenProps {
    dispatch: Dispatch
}

interface ConfigureAppItem {
    icon: ImageSourcePropType
    labelId: string
    labelDefault: string
    onSelect: Action
}

const items: Array<ConfigureAppItem> = [
    // {
    //     icon        : require('../../assets/icons/User.png'),
    //     labelId     : 'screens.configure_app.settings_account',
    //     labelDefault: 'My Account',
    //     onSelect    : navigationActions.navigateTo('SettingsAccount'),
    // },
    {
        icon        : require('../../assets/icons/bx-globe.png'),
        labelId     : 'screens.configure_app.settings_app_language',
        labelDefault: 'Languages',
        onSelect    : navigationActions.navigateTo('SettingsAppLanguage'),
    },
    // {
    //     icon        : require('../../assets/icons/Settings.png'),
    //     labelId     : 'screens.configure_app.settings_alert_frequency',
    //     labelDefault: 'Alerts frequency',
    //     onSelect    : navigationActions.navigateTo('SettingsAlertFrequency'),
    // },
    {
        icon        : require('../../assets/icons/bx-book-bookmark.png'),
        labelId     : 'screens.configure_app.personal_archive',
        labelDefault: 'Ask for my personal data archive',
        onSelect    : sessionActions.openPersonalArchiveDownloadPage(),
    },
    {
        icon        : require('../../assets/icons/bx-file.png'),
        labelId     : 'screens.configure_app.privacy_policy',
        labelDefault: 'Privacy Policy',
        onSelect    : navigationActions.navigateTo('LegalDocument'),
    },
    // {
    //     icon        : require('../../assets/icons/Logout.png'),
    //     labelId     : 'screens.configure_app.delete_account',
    //     labelDefault: 'Delete my account',
    //     onSelect    : navigationActions.navigateTo(''),
    // },

]

class ConfigureAppScreen extends React.Component<ConfigureAppScreenProps> {
    public render() {
        return (
            <Wrapper>
                {/* <Background> */}
                    <SafeAreaView style={{flex: 1}}>
                    <StatusBar barStyle="dark-content" />

                    <Header containerStyle={{marginTop: 10}} style={{alignItems: 'center'}} color='dark' noMenu={false}> 
                            {/* <Message
                                id="screens.configure_app.title"
                                defaultMessage="Settings"
                            /> */}
                        </Header>
                        <HeaderText dark>
                            My Account
                        </HeaderText>

                        <View style={{
                            flexWrap      : 'wrap',
                            flex          : 1,
                            paddingHorizontal:20,
                            marginTop: 50
                        }}>
                            {items.map((item, idx) => (
                                <TouchableOpacity key={idx} onPress={this.onSelect(item)} style={{
                                    flexDirection:'row',
                                    // marginBottom:20,
                                    alignItems:'center'
                                }}>
                                    <Image source={item.icon} style={{flex: -1, resizeMode: 'cover', marginBottom: 5, marginRight:20, height:20}}/>
                                    <Message
                                        id={item.labelId}
                                        defaultMessage={item.labelDefault}
                                        style={{ color:'#000', fontSize: 25, marginBottom: 20  }}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </SafeAreaView>
                {/* </Background> */}
            </Wrapper>
        )
    }

    private onSelect = (item: ConfigureAppItem) => () => {
        this.props.dispatch(item.onSelect as any)
    }
}

export default connect(null)(ConfigureAppScreen)