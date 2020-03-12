import React, { Component, CSSProperties } from 'react'
import styled, { css } from 'styled-components'
import { AlertThemeData, getRatioUnit, Color } from '../utils'
import { Consumer } from '../ThemeProvider'
import { iconType } from '../Icon'
import Border, { BorderStyle } from '../utils/Border'

type AlertType = 'success' | 'warning' | 'error'

export interface IAlertProps {
    className?: string
    showIcon?: boolean
    icon?: iconType | JSX.Element
    type?: AlertType
    title?: string | JSX.Element
    inheritColor?: boolean
    message: string | JSX.Element
    style?: CSSProperties
    theme?: AlertThemeData
}

// tslint:disable-next-line: no-empty-interface
interface IState {

}

interface IAlertBoxProps {
    alertType?: AlertType
    inheritColor?: boolean
}

const AlertBox = styled.div<IAlertBoxProps>`
    padding: ${() => getRatioUnit(15)};
    ${({ alertType, theme, inheritColor }) => {
        switch (alertType) {
            case 'success': return css`${Border.all({ width: 1, style: BorderStyle.solid, color: Color.setOpacity(theme.successColor, 0.4) }).toString()};background:${Color.setOpacity(theme.successColor, 0.2).toString()};${inheritColor ? `color: ${theme.successColor}` : ''}`;
            case 'warning': return css`${Border.all({ width: 1, style: BorderStyle.solid, color: Color.setOpacity(theme.warningColor, 0.4) }).toString()};background:${Color.setOpacity(theme.warningColor, 0.2).toString()};${inheritColor ? `color: ${theme.warningColor}` : ''}`
            case 'error': return css`${Border.all({ width: 1, style: BorderStyle.solid, color: Color.setOpacity(theme.errorColor, 0.4) }).toString()};background:${Color.setOpacity(theme.errorColor, 0.2).toString()};${inheritColor ? `color: ${theme.errorColor}` : ''}`
            default: return css`${Border.all({ width: 1, style: BorderStyle.solid, color: Color.setOpacity(theme.primarySwatch, 0.4) }).toString()};background:${Color.setOpacity(theme.primarySwatch, 0.2).toString()};${inheritColor ? `color: ${theme.primarySwatch}` : ''}`
        }
    }}
`

const AlertTitle = styled.div`
    margin-bottom: ${() => getRatioUnit(6)};
`

export default class Alert extends Component<IAlertProps, IState> {

    public static defaultProps: IAlertProps = {
        showIcon: false,
        inheritColor: false,
        message: ''
    }

    public render(): JSX.Element {
        const { type, message, title, inheritColor, style, className } = this.props
        return (
            <Consumer>
                {
                    (value) => (
                        <AlertBox
                            className={className}
                            style={style}
                            alertType={type}
                            inheritColor={inheritColor}
                            theme={value.theme}
                        >
                            {
                                title ? (
                                    <AlertTitle
                                        style={{ marginBottom: message ? '' : 0 }}
                                        theme={value.theme}
                                    >
                                        {title}
                                    </AlertTitle>
                                ) : null
                            }
                            <div>
                                {message}
                            </div>
                        </AlertBox>
                    )
                }
            </Consumer>
        )
    }
}
