import React, { Component, CSSProperties } from 'react'
import styled, { css } from 'styled-components'
import { Consumer } from '../ThemeProvider'
import { getClassName, ProgressThemeData, getUnit, transition, getRatioUnit } from '../utils'

interface IProgressInterProps {
    progressTheme: ProgressThemeData
}

const ProgressInter = styled.div<IProgressInterProps>`
    position: relative;
    height: ${({ progressTheme }) => getUnit(progressTheme.height)};
    background:${({ progressTheme }) => progressTheme.progressColor.toString()};
    border-radius: ${({ progressTheme, theme }) => getUnit(progressTheme.borderRadius || theme.borderRadius)};
    overflow: hidden;
    ${transition(0.5)};
`
interface IProgressGbProps {
    progressTheme: ProgressThemeData
    status: boolean
    percentColor?: string
    successPercentColor?: string
}

const ProgressGb = styled.div<IProgressGbProps>`
    ${({ progressTheme, theme, status, percentColor, successPercentColor }) => {
        if (status) {
            return css`background: ${successPercentColor || progressTheme.successColor || theme.successColor};`
        } else {
            return css`background: ${(percentColor || progressTheme.percentColor || theme.primarySwatch).toString()};`
        }
    }};
    height: 100%;
    ${transition(0.5)};
    position: absolute;
    left: 0;
    top: 0;
`

interface IProgressSuccessProps {
    progressTheme: ProgressThemeData
    successPercentColor?: string
}

const ProgressSuccess = styled.div<IProgressSuccessProps>`
    background: ${({ progressTheme, theme, successPercentColor }) => successPercentColor || progressTheme.successColor || theme.successColor};
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    ${transition(0.5)};
`

const ProgressText = styled.div`
    display: inline-block;
    margin-left: ${getRatioUnit(8)};
    color: rgba(0, 0, 0, 0.45);
    line-height: 1;
    white-space: nowrap;
    text-align: left;
    vertical-align: middle;
    word-break: normal;
`

export interface IProgressProps {
    className?: string
    percent: number
    style?: CSSProperties
    successPercent?: number
    text?: string | JSX.Element
    percentColor?: string
    successPercentColor?: string
    theme?: ProgressThemeData
}

interface IState {
    status: boolean
}

export default class Progress extends Component<IProgressProps, IState> {

    constructor(props: IProgressProps) {
        super(props)
        if (props.percent === 100) {
            this.state.status = true
        }
    }

    public static defaultProps: IProgressProps = {
        percent: 0,
    }

    public state: IState = {
        status: false
    }

    public render(): JSX.Element {
        const { className, percent, successPercent, text, successPercentColor, percentColor, theme, style } = this.props
        const { status } = this.state
        const val = percent > 100 ? 100 : percent < 0 ? 0 : percent
        const succerss = (successPercent || 0) > 100 ? 100 : (successPercent || 0) < 0 ? 0 : (successPercent || 0)
        return (
            <Consumer>
                {
                    (init) => (
                        <div className={getClassName('flex', className)} style={style}>
                            <div className="flex_1 flex_justify">
                                <ProgressInter
                                    progressTheme={theme || init.theme.progressTheme}
                                >
                                    <ProgressGb
                                        progressTheme={theme || init.theme.progressTheme}
                                        style={{ width: `${val}%` }}
                                        status={status}
                                        successPercentColor={successPercentColor}
                                        percentColor={percentColor}
                                        onTransitionEnd={this.handleTransitionEnd.bind(this, val)}
                                    />
                                    <ProgressSuccess
                                        progressTheme={theme || init.theme.progressTheme}
                                        successPercentColor={successPercentColor}
                                        style={{ width: `${succerss}%` }}
                                    />
                                </ProgressInter>
                            </div>
                            {
                                text && (
                                    <ProgressText>
                                        {text}
                                    </ProgressText>
                                )
                            }
                        </div>
                    )
                }
            </Consumer>
        )
    }

    private handleTransitionEnd = (val: number) => {
        if (val === 100) {
            this.setState({
                status: true
            })
        }
    }
}
