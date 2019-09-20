import React                                         from 'react'
import { Dimensions, Image, ImageProps, ScrollView } from 'react-native'
import { Overlay, OverlayProps }                     from './Overlay'

interface ImageOverlayProps extends OverlayProps {
    imageProps: ImageProps
}

export const ImageOverlay = ({imageProps, ...props}: ImageOverlayProps) => (
    <Overlay
        {...props}
        overlaidStyle={{backgroundColor: 'black'}}
        overlaid={
            <ScrollableImage {...imageProps} />
        }
    />
)

function ScrollableImage({style, ...props}: ImageProps) {
    const windowSize = Dimensions.get('window')

    return (
        <ScrollView contentContainerStyle={{minHeight: windowSize.height}}>
            <ScrollView contentContainerStyle={{minWidth: windowSize.width}} horizontal
                        minimumZoomScale={1} maximumZoomScale={6}>
                <Image
                    {...props}
                    style={[style, {minHeight: windowSize.height, minWidth: windowSize.width}]}
                    resizeMode="center"
                    loadingIndicatorSource={require('../../assets/LogoNew.png')}
                />
            </ScrollView>
        </ScrollView>
    )
}
