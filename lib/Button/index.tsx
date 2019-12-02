import React, { Component, MouseEvent, CSSProperties } from 'react'
import styled, { css } from 'styled-components'
import { omit, isFunction } from 'lodash'
import { Consumer } from '../ThemeProvider'
import Icon from '../Icon'
import { IStyledProps, transition } from '../utils'
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
}
interface IBtnStyleProps extends IStyledProps {
    mold?: buttonMold
    fixed?: boolean
    spinning: boolean
}

const Btn = styled.button<IBtnStyleProps>`
    height: ${({ theme }) => theme.buttonTheme.height * theme.ratio + theme.unit};
    transition: all .1s cubic-bezier(0.65, 0.05, 0.36, 1);
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius * theme.ratio + theme.unit};
    background: initial;
    border: ${({ theme }) => 1 * theme.ratio + theme.unit} solid #ddd;
    outline: none;
    min-width: ${({ theme }) => 78 * theme.ratio + theme.unit};
    cursor: pointer;
    ${transition(0.5)};
    -webkit-tap-highlight-color: transparent;

    &:hover {
        border-color: ${({ theme }) => Color.setOpacity(theme.primarySwatch, 0.8).toString()};
    }

   ${props => {
        if (props.mold === 'primary') {
            return css`
                min-width: ${78 * props.theme.ratio + props.theme.unit};
                background: ${props.theme.primarySwatch};
                color: #fff;
                border-color: ${props.theme.primarySwatch};
                align-items: center;
                cursor: pointer;
                &:hover {
                    border-color: ${Color.setOpacity(props.theme.primarySwatch, 0.8).toString()};
                    background: ${Color.setOpacity(props.theme.primarySwatch, 0.8).toString()};
                }
            `
        }
        if (props.mold === 'error') {
            return css`
                color: ${props.theme.errorColor};
                border-color: ${props.theme.errorColor};
        
                &:hover {
                    border-color: ${props.theme.errorColor};
                    background: ${Color.setOpacity(props.theme.errorColor, 0.4).toString()};
                }
            `
        }

        if (props.mold === 'circle') {
            return css`
                border-radius: 50%;
                padding: 0;
                width: ${props.theme.buttonTheme.height * props.theme.ratio + props.theme.unit};
                min-width: initial;
                background: ${props.theme.primarySwatch};
                color: #fff;
                fill: #fff;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border: 0;
            `
        }
    }}
    ${props => {
        if (props.disabled) {
            return css`
                border-color: #dfd8d8;
                color: rgba(0, 0, 0, 0.25);
                background: #dfd8d8;
                cursor: no-drop;
                
                &:hover {
                    border-color: #dfd8d8;
                    color: rgba(0, 0, 0, 0.25);
                    background: #dfd8d8;
                }
            `
        }
    }}
    ${props => {
        if (props.fixed) {
            return css`
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                border-radius: 0;
                border: none;
                background: ${props.theme.primarySwatch};
            `
        }
    }}
    ${props => {
        if (props.spinning) {
            return css`
                vertical-align: middle;
                position: relative;
                fill: #fff;
                top: ${-2 * props.theme.ratio + props.theme.unit};
                right: ${-5 * props.theme.ratio + props.theme.unit};
            `
        }
    }}
`

export default class Button extends Component<IButtonProps, IState> {

    public static defaultProps = {
        mold: 'default',
        tick: true
    }

    public state: IState = {
        loading: false
    }

    public render(): JSX.Element {
        const { children, className, fixed, mold, disabled } = this.props
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
                            spinning={loading}
                            mold={mold}
                            fixed={fixed}
                            theme={value.theme}
                            onClick={this.handelOk}
                        >
                            <div className="flex_center">
                                <span className="flex">
                                    {loading ? <Icon icon="loading" style={{ marginRight: '8px' }} color="#fff" rotate /> : ''}
                                    <span className="flex_center">{children}</span>
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
                    const fn: any = onClick(e)
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
                    } else if (fn.constructor.name === 'GeneratorFunction') {
                        fn()
                        this.setState({
                            loading: false
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
