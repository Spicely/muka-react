import React, { Component } from 'react'
import styled from 'styled-components'
import { Consumer } from '../ThemeProvider'
import { IStyledProps } from '../utils'

export interface ILabelHeaderProps {
    className?: string
    title?: string | JSX.Element
    right?: string | JSX.Element
    line?: 'horizontal' | 'vertical'
}

const Div = styled.div<IStyledProps>`
    padding-left: ${({ theme }) => 20 * theme.ratio + theme.unit};
`
const DivTitle = styled.div<IStyledProps>`
    position: relative;
    font-size: ${({ theme }) => 13 * theme.ratio + theme.unit};
    font-weight: 800;
    color: #3d3d3d;

    &.vertical {
        padding-left: ${({ theme }) => 10 * theme.ratio + theme.unit};
    }

    &.horizontal::after {
        content: "";
        position: absolute;
        width: 100%;
        height: ${({ theme }) => 4 * theme.ratio + theme.unit};
        background: ${({ theme }) => theme.primarySwatch};
        bottom: 0;
        left: 0;
    }

    &.vertical::after {
        content: "";
        position: absolute;
        width: ${({ theme }) => 4 * theme.ratio + theme.unit};
        height: 100%;
        left: 0;
        top: 0;
        background: ${({ theme }) => theme.primarySwatch};
    }
`

export default class LabelHeader extends Component<ILabelHeaderProps, any> {

    public render(): JSX.Element {
        const { title, line, className, right } = this.props
        return (
            <Consumer>
                {
                    (value) => (
                        <Div
                            className={className}
                            theme={value.theme}
                        >
                            <div className="flex_justify">
                                <DivTitle
                                    className={`${line || ''}`}
                                    theme={value.theme}
                                >
                                    {title}
                                </DivTitle>
                            </div>
                            <div className="flex_1"></div>
                            <div className="flex_justify">
                                <div>{right}</div>
                            </div>
                        </Div>
                    )
                }
            </Consumer>

        )
    }
}
