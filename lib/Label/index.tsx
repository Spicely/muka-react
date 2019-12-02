import React, { Component, CSSProperties, MouseEvent } from 'react'
import styled from 'styled-components'
import { omit } from 'lodash'
import { Consumer } from '../ThemeProvider'
import { IStyledProps } from '../utils'

export interface ILabelProps {
    onClick?: (event: MouseEvent<HTMLSpanElement>) => void
    className?: string
    color?: string
    style?: CSSProperties
}

const Span = styled.span<IStyledProps>`
    padding: ${({ theme }) => `${4 * theme.ratio + theme.unit} ${8 * theme.ratio + theme.unit}`};
    cursor: pointer;
`

export default class Label extends Component<ILabelProps, any> {

    public static defaultProps = {
        color: '#4395FF'
    }

    public render(): JSX.Element {
        const { className, children, style, color } = this.props
        const cssStyle: CSSProperties = { ...style }
        if (!cssStyle.color) {
            cssStyle.color = color
        }
        const props = omit(this.props, ['style', 'color', 'className'])
        return (
            <Consumer>
                {
                    (value) => (
                        <Span
                            {...props}
                            style={cssStyle}
                            className={className}
                            theme={value.theme}
                        >
                            {children}
                        </Span>
                    )
                }
            </Consumer>

        )
    }
}
