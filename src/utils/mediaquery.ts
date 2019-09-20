import { Dimensions, ScaledSize } from 'react-native'

export interface Range {
    min?: number
    max?: number
}

export interface Mediaquery<T> extends Range {
    value: T | ((size: ScaledSize) => T)
}

const windowDimensions = Dimensions.get('window')
console.log(windowDimensions)

export function mediaquery<T extends {}>(mediaqueries: Mediaquery<T>[]): T {
    if (mediaqueries.length <= 0) {
        throw new Error('invalid mediaquery')
    }

    const window = windowDimensions.height * windowDimensions.scale

    for (const mediaquery of mediaqueries) {
        if (mediaquery.min && window < mediaquery.min) {
            continue
        }
        if (mediaquery.max && window > mediaquery.max) {
            continue
        }
        return run(mediaquery)
    }

    return run(mediaqueries[-1])
}

function run<T>(mediaquery: Mediaquery<T>): T {
    if (typeof mediaquery.value === 'function') {
        return this.value(windowDimensions)
    }
    return mediaquery.value
}

type ScreenSizes = 'sm' // small       (eg. iPhone SE)
                 | 'md' // medium      (eg. iPhone 8)
                 | 'lg' // large       (eg. iPhone 8+)

type ScreenSelector<T> = { [K in ScreenSizes]: T }

export function screen<T>(selector: ScreenSelector<T>): T {
    return mediaquery([
        { max: 1136,            value: selector.sm },
        { min: 1136, max: 1334, value: selector.md },
        { min: 1334,            value: selector.lg },
    ])
}