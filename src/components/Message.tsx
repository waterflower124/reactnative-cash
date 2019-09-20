import React                          from 'react'
import { getMessageById }             from '../translate'
import Text, { TextProps, TextStyle } from './Text'

export type MessageStyle = TextStyle

type MessageInterpolable = string | React.ReactElement<any>

export interface MessageValues {
    [key: string]: MessageInterpolable
}

export interface MessageProps extends TextProps {
    id: string
    defaultMessage: string
    values?: MessageValues
}

export class Message extends React.PureComponent<MessageProps> {
    render() {
        const {id, defaultMessage, values, ...props} = this.props

        if (!id) throw new Error('need message id: ' + JSON.stringify(this.props))

        return (
            <Text {...this.props} allowFontScaling={false}>{translate(id, defaultMessage, values, props)}</Text>
        )
    }
}

function translate(id: string,
                   defaultMessage: string,
                   values: MessageValues,
                   props: TextProps): MessageInterpolable | MessageInterpolable[] {
    const message = getMessageById(id)
    if (message) {
        return formatMessage(message, values, props)
    }
    return formatMessage(defaultMessage, values, props)
}

/**
 * Turn a "message with {value}.", with values {value: <Text bold>Hello</Text>} as :
 *
 *     <Text>message with <Text bold>Hello</Text></Text>
 *       ^   `-----------' `--------------------'
 *       |        |                      |
 *      root     first part            second part (which is a value)
 */
function formatMessage(message: string, values: MessageValues, props: TextProps): MessageInterpolable | MessageInterpolable[] {
    // accumulation of all parts
    // which can come from the message or from the values
    const texts = []

    // keep track at which point we parsed the message
    let lastIndex = 0
    // parse the whole message, but not more
    while (lastIndex < message.length) {
        // find the next value in the message, ie. {value}
        const start = message.indexOf('{', lastIndex)
        if (start < 0) {
            break
        }

        // find the value's end, ie. {value}
        const end = message.indexOf('}', start + 1)
        if (end < 0) {
            break // TODO throw an error?
        }

        // turn "{this}" into "this"
        const valueName = message.substring(start + 1, end)
        // find "this" in values
        const value     = values[valueName]

        // add to parts all the text we skipped in the message when finding the next value
        // ie. "{lastValue} some message in between {nextValue}"
        // this will add " some message in between " (note the spaces)
        const before = message.substring(lastIndex, start)
        if (before.length > 0) {
            texts.push(before)
        }

        if (typeof value === 'object') {
            // we have to assign it a `key' for performances reason
            // and also passing the parent's props
            // and merge its style
            texts.push(React.cloneElement(value, {
                ...props,
                key: texts.length,
                style: [props.style, value.props.style],
            }))
        } else {
            // just add it to the parts as a string
            texts.push(value.toString())
        }

        // we analyzed one more value, let's analyse some more
        lastIndex = end + 1
    }

    // we analyzed every values possible in the message
    // now we have to take into account what is left of the message
    // ie. "some {value} here", this will add " here" (note the spaces)
    if (lastIndex < message.length) {
        texts.push(message.substring(lastIndex))
    }

    // if we found only one part in the message
    // just return it back (for performances reason)
    if (texts.length === 1) {
        return texts[0]
    }

    // return every parts of the text
    // ie. "some {value} here" with {value: <Text bold>hello</Text>}
    // into: ["some ", <Text bold>hello</Text>, " here"]
    return texts
}
