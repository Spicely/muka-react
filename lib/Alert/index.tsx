import React, { Component, CSSProperties } from 'react'
import { getClassName, prefix, IStyledProps } from '../utils'
import { Consumer } from '../ThemeProvider'
import styled from 'styled-components'
import { iconType } from '../Icon'

export interface IAlertProps {
    className?: string
    showIcon?: boolean
    icon?: iconType | JSX.Element
    type?: 'success' | 'info' | 'warning' | 'warning'
    title?: string | JSX.Element
    inheritColor?: boolean
    message: string | JSX.Element
    style?: CSSProperties
}

// tslint:disable-next-line: no-empty-interface
interface IState {

}
// .type_color(@color) {
//     border: 1 * @unit solid rgb(@color, 0.4);
//     background: rgb(@color, 0.2);

//     &.inherit_color {
//         color: @color;
//     }
// }

// &_info {
//     .type_color(@theme_info_color);
// }

// &_success {
//     .type_color(@theme_success_color);
// }

// &_warning {
//     .type_color(@theme_warning_color);
// }

// &_error {
//     .type_color(@theme_error_color);
// }

const Div = styled.div<IStyledProps>`
    padding: ${({ theme }) => 15 * theme.ratio + theme.unit};
`
const DivChiren = styled.div<IStyledProps>`
    margin-bottom: ${({ theme }) => 6 * theme.ratio + theme.unit};
`

export default class Alert extends Component<IAlertProps, IState> {

    public static defaultProps: IAlertProps = {
        showIcon: false,
        inheritColor: false,
        type: 'info',
        message: ''
    }

    public render(): JSX.Element {
        const { type, message, title, inheritColor, style, className } = this.props
        return (
            <Consumer>
                {
                    (value) => (
                        <Div
                            className={`${prefix} ${type}${inheritColor ? ' inherit_color' : ''} ${className || ''}`}
                            style={style}
                            theme={value.theme}
                        >
                            {
                                title ? (
                                    <DivChiren
                                        style={{ marginBottom: message ? '' : 0 }}
                                        theme={value.theme}
                                    >
                                        {title}
                                    </DivChiren>
                                ) : null
                            }
                            <div>
                                {message}
                            </div>
                        </Div>
                    )
                }
            </Consumer>
        )
    }
}
