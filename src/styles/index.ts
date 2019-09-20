import { Platform, StatusBarProps, StyleSheet } from 'react-native'
import { TextStyle }                            from '../components/Text'

export const regularFont: string = Platform.select({
    ios    : 'Montserrat',
    android: 'montserrat_regular',
})

export const lightFont: string = Platform.select({
    ios    : 'Montserrat-Light',
    android: 'montserrat_light',
})

export const boldFont: string = Platform.select({
    ios    : 'Montserrat-Bold',
    android: 'montserrat_bold',
})

export const fontSize    = 16
export const bigFontSize = 20

export const text: TextStyle = {
    fontSize       : fontSize,
    fontFamily     : lightFont,
    color          : '#FFF',
    backgroundColor: 'transparent',
}

export const mainGradient        = ['#FF8E61', '#C43652']
export const transparentGradient = ['rgba(255,142,97,0.6)', 'rgba(196,54,82,0.6)']

export const orangeText = '#F77062'
export const grayText   = '#878787'

export const statusBar: StatusBarProps = {
    backgroundColor: '#FF8E61',
    barStyle       : 'light-content',
}

export const errorMessageStyle: TextStyle = {
    color     : '#F00',
    fontSize  : 12,
    fontWeight: '300',
    marginTop : 2,
}

export const common = StyleSheet.create({
    text        : text,
    errorMessage: errorMessageStyle,
})