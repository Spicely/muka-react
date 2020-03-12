import React, { Component, MouseEvent, CSSProperties } from 'react'
import styled, { css } from 'styled-components'
import { omit, isFunction, isNil } from 'lodash'
import { Consumer } from '../ThemeProvider'
import Icon from '../Icon'
import { IStyledProps, transition, ButtonThemeData, getRatioUnit, getUnit } from '../utils'
import Color from '../utils/Color'

export type buttonMold = 'circle' | 'error' | 'primary'

interface IState {
    loading: boolean
}

export interface IButtonProps {
    tick?: boolean
    mold?: buttonMold
    className?: string
    fixed?: boolean
    disabled?: boolean
    async?: boolean
    onClick?: (e: MouseEvent<HTMLButtonElement, MouseEvent>) => (Promise<void> | void)
    type?: any
    style?: CSSProperties
    theme?: ButtonThemeData
}
interface IBtnStyleProps extends IStyledProps {
    mold?: buttonMold
    fixed?: boolean
    buttonTheme: ButtonThemeData
}

const Btn = styled.button<IBtnStyleProps>`
    height: ${({ buttonTheme }) => getUnit(buttonTheme.height)};
    ${({ buttonTheme }) => {
        if (!isNil(buttonTheme.width)) {
            return css`width: ${getUnit(buttonTheme.width)};`
        }
    }};
    transition: all .1s cubic-bezier(0.65, 0.05, 0.36, 1);
    ${({ buttonTheme, theme }) => css`${buttonTheme.borderRadius || theme.borderRadius}`};
    background: initial;
    border: ${() => getRatioUnit(1)} solid #ddd;
    outline: none;
    min-width: ${() => getRatioUnit(78)};
    cursor: pointer;
    ${transition(0.5)};
    -webkit-tap-highlight-color: transparent;
    ${({ buttonTheme }) => {
        if (buttonTheme.border) return css`${buttonTheme.border.toString()}`;
        else return css`border: none;`
    }}
    
   ${({ theme, buttonTheme, mold }) => {
        if (mold === 'primary') {
            return css`
                background: ${buttonTheme.buttonColor || theme.primarySwatch};
                color:${(buttonTheme.color || Color.hex('#fff')).toString()};
                border-color: ${buttonTheme.buttonColor || theme.primarySwatch};
                align-items: center;
                cursor: pointer;
                :hover {
                    color: ${Color.setOpacity(buttonTheme.color || Color.hex('#fff'), 0.8).toString()};
                    border-color: ${Color.setOpacity(buttonTheme.buttonColor || theme.primarySwatch, 0.8).toString()};
                    background: ${Color.setOpacity(buttonTheme.buttonColor || theme.primarySwatch, 0.8).toString()};
                }
            `
        }
        if (mold === 'error') {
            return css`
                color: ${buttonTheme.errorColor || theme.errorColor};
                border-color: ${buttonTheme.errorColor || theme.errorColor};
                :hover {
                    color: ${Color.setOpacity(buttonTheme.color || Color.hex('#fff'), 0.8).toString()};
                    border-color: ${buttonTheme.errorColor || theme.errorColor};
                    background: ${Color.setOpacity(buttonTheme.errorColor || theme.errorColor, 0.8).toString()};
                }
            `
        }

        if (mold === 'circle') {
            return css`
                border-radius: 50%;
                padding: 0;
                width: ${getUnit(buttonTheme.height)};
                min-width: initial;
                background: ${buttonTheme.buttonColor || theme.primarySwatch};
                color: ${buttonTheme.color ? buttonTheme.color.toString() : '#fff'};
                fill: #fff;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border: 0;
                :hover {
                    color: ${Color.setOpacity(buttonTheme.color || Color.hex('#fff'), 0.8).toString()};
                    border-color: ${Color.setOpacity(buttonTheme.buttonColor || theme.primarySwatch, 0.8).toString()};
                    background: ${Color.setOpacity(buttonTheme.buttonColor || theme.primarySwatch, 0.8).toString()};
                }
            `
        }
        return css`
            color: ${buttonTheme.color ? buttonTheme.color.toString() : Color.hex('#000').toString()};
            :hover {
                color: ${Color.setOpacity(buttonTheme.color || Color.hex('#000'), 0.8).toString()};
                border-color: ${Color.setOpacity(buttonTheme.buttonColor || theme.primarySwatch, 0.8).toString()};
            }
        `
    }}
    ${({ disabled, buttonTheme }) => {
        if (disabled) {
            return css`
                border-color: ${() => buttonTheme.disabledBorderColor.toString()};
                color: ${() => buttonTheme.disabledFontColor.toString()};
                background: ${() => buttonTheme.disabledColor.toString()};
                cursor: no-drop;
                
                &:hover {
                    border-color: ${() => buttonTheme.disabledBorderColor.toString()};
                    color: ${() => buttonTheme.disabledFontColor.toString()};
                    background: ${() => buttonTheme.disabledColor.toString()};
                }
            `
        }
    }}
    ${({ theme, buttonTheme, fixed }) => {
        if (fixed) {
            return css`
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                border-radius: 0;
                border: none;
                background: ${buttonTheme.buttonColor || theme.primarySwatch};
            `
        }
    }}
    
`

const BtnLabel = styled.span<IBtnStyleProps>`
    font-size: ${({ buttonTheme, theme }) => getUnit(buttonTheme.fontSize, theme.fontSize)};
`

export default class Button extends Component<IButtonProps, IState> {

    public static defaultProps = {
        tick: true
    }

    public state: IState = {
        loading: false
    }

    public render(): JSX.Element {
        const { children, className, fixed, mold, disabled, theme } = this.props
        const { loading } = this.state
        const otherProps = omit(this.props, ['children', 'className', 'fixed', 'mold', 'tick', 'disabled', 'onClick', 'async'])
        return (
            <Consumer>
                {
                    (value) => (
                        <Btn
                            {...otherProps}
                            className={className}
                            disabled={loading || disabled}
                            mold={mold}
                            fixed={fixed}
                            theme={value.theme}
                            buttonTheme={theme || value.theme.buttonTheme}
                            onClick={this.handelOk}
                        >
                            <div className="flex_center">
                                <span className="flex">
                                    {loading ? <Icon
                                        icon="loading"
                                        style={{ marginRight: '8px' }}
                                        theme={theme ? theme.iconTheme : value.theme.buttonTheme.iconTheme}
                                        rotate
                                    /> : ''}
                                    <BtnLabel
                                        className="flex_center"
                                        buttonTheme={theme || value.theme.buttonTheme}
                                    >
                                        {children}
                                    </BtnLabel>
                                </span>
                            </div>
                        </Btn>
                    )
                }
            </Consumer>
        )
    }

    private handelOk = (e: any) => {
        const { onClick, async } = this.props
        const { loading } = this.state
        if (loading) {
            return
        }
        if (isFunction(onClick)) {
            if (async) {
                this.setState({
                    loading: true
                }, () => {
                    const fn = onClick(e)
                    if (fn instanceof Promise) {
                        fn.then((data: any) => {
                            this.setState({
                                loading: false
                            })
                        }).catch(() => {
                            this.setState({
                                loading: false
                            })
                        })
                    } else {
                        this.setState({
                            loading: false
                        })
                    }
                })
            } else {
                onClick(e)
            }
        }
    }
}
