import React                     from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { connect }               from 'react-redux'
import { State }                 from '../store'

import { ScrollView, StyleSheet, View } from 'react-native'
import { Background }                   from '../components/Background'
import { Checkbox }                     from '../components/Checkbox'
import { Message }                      from '../components/Message'
import { SafeAreaView }                 from '../components/SafeAreaView'
import Switch                           from '../components/Switch'
import { Header }                       from '../containers/Header'
import { Wrapper }                      from '../containers/Wrapper'

interface SettingsAlertFrequencyScreenProps extends NavigationScreenProps {
    notifyNewsletters: boolean
}

interface SettingsAlertFrequencyScreenState {
    notifyNewsletters: boolean
    notifyProcessingNewsletters: boolean
    alertFrequency: 'asap' | 'daily' | 'weekly' | 'monthly' | 'never'
}

class SettingsAlertFrequencyScreen extends React.Component<SettingsAlertFrequencyScreenProps> {
    public readonly state: SettingsAlertFrequencyScreenState = {
        notifyNewsletters          : false,
        notifyProcessingNewsletters: false,
        alertFrequency             : 'asap',
    }

    public static mapStateToProps(_state: State): Partial<SettingsAlertFrequencyScreenProps> {
        return {}
    }

    public render() {
        return (
            <Wrapper>
                <Background>
                    <SafeAreaView style={{flex: 1}}>
                        <Header containerStyle={{marginTop: 10}} style={{alignItems: 'center'}}>                           
                        </Header>

                        <ScrollView style={styles.container}>
                            <View style={styles.section}>
                                <Message
                                    id="screen.alert_frequency.push_notifications"
                                    defaultMessage="Push Notifications"
                                    style={styles.sectionTitle}
                                />

                                <View style={styles.row}>
                                    <View style={styles.rowLeft}>
                                        <Message
                                            id="screen.alert_frequency.new_elements"
                                            defaultMessage="New elements"
                                            style={styles.rowLeftText}
                                        />
                                    </View>

                                    <View style={styles.rowRight}>
                                        <Switch
                                            value={this.state.notifyNewsletters}
                                            onValueChange={this.onToggle('notifyNewsletters')}
                                        />
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.rowLeft}>
                                        <Message
                                            id="screen.alert_frequency.follow_recourses"
                                            defaultMessage="Follow recourses"
                                            style={styles.rowLeftText}
                                        />
                                    </View>

                                    <View style={styles.rowRight}>
                                        <Switch
                                            value={this.state.notifyProcessingNewsletters}
                                            onValueChange={this.onToggle('notifyProcessingNewsletters')}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.section, {marginBottom: 0}]}>
                                <Message
                                    id="screen.alert_frequency.newsletters"
                                    defaultMessage="Newsletters"
                                    style={styles.sectionTitle}
                                />

                                <View style={styles.row}>
                                    <View style={styles.rowLeft}>
                                        <Message
                                            id="screen.alert_frequency.asap"
                                            defaultMessage="As Soon As Possible"
                                            style={styles.rowLeftText}
                                        />
                                    </View>

                                    <View style={styles.rowRight}>
                                        <Checkbox
                                            checked={this.state.alertFrequency === 'asap'}
                                            onChecked={this.onSelect('alertFrequency', 'asap')}
                                        />
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.rowLeft}>
                                        <Message
                                            id="screen.alert_frequency.daily"
                                            defaultMessage="Daily"
                                            style={styles.rowLeftText}
                                        />
                                    </View>

                                    <View style={styles.rowRight}>
                                        <Checkbox
                                            checked={this.state.alertFrequency === 'daily'}
                                            onChecked={this.onSelect('alertFrequency', 'daily')}
                                        />
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.rowLeft}>
                                        <Message
                                            id="screen.alert_frequency.weekly"
                                            defaultMessage="Weekly"
                                            style={styles.rowLeftText}
                                        />
                                    </View>

                                    <View style={styles.rowRight}>
                                        <Checkbox
                                            checked={this.state.alertFrequency === 'weekly'}
                                            onChecked={this.onSelect('alertFrequency', 'weekly')}
                                        />
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.rowLeft}>
                                        <Message
                                            id="screen.alert_frequency.monthly"
                                            defaultMessage="Monthly"
                                            style={styles.rowLeftText}
                                        />
                                    </View>

                                    <View style={styles.rowRight}>
                                        <Checkbox
                                            checked={this.state.alertFrequency === 'monthly'}
                                            onChecked={this.onSelect('alertFrequency', 'monthly')}
                                        />
                                    </View>
                                </View>

                                <View style={[styles.row, {marginBottom: 0}]}>
                                    <View style={styles.rowLeft}>
                                        <Message
                                            id="screen.alert_frequency.never"
                                            defaultMessage="Never"
                                            style={styles.rowLeftText}
                                        />
                                    </View>

                                    <View style={styles.rowRight}>
                                        <Checkbox
                                            checked={this.state.alertFrequency === 'never'}
                                            onChecked={this.onSelect('alertFrequency', 'never')}
                                        />
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </Background>
            </Wrapper>
        )
    }

    private onToggle = <F extends keyof SettingsAlertFrequencyScreenState>(field: F) => (value: SettingsAlertFrequencyScreenState[F]) => {
        this.setState({[field]: value})
    }

    private onSelect = <F extends keyof SettingsAlertFrequencyScreenState>(field: F, value: SettingsAlertFrequencyScreenState[F]) => () => {
        this.setState({[field]: value})
    }
}

const styles = StyleSheet.create({
    container: {
        flex  : 1,
        margin: 10,
    },

    section: {
        marginBottom: 20,
    },

    sectionTitle: {
        textAlign   : 'center',
        fontSize    : 22,
        marginBottom: 20,
    },

    row: {
        flexDirection: 'row',
        marginBottom : 20,
    },

    rowLeft: {
        flex          : 1,
        justifyContent: 'center',
        marginRight   : 10,
    },

    rowLeftText: {
        fontSize: 14,
    },

    rowRight: {
        flex: -1,
    },
})

export default connect(SettingsAlertFrequencyScreen.mapStateToProps)(SettingsAlertFrequencyScreen)