import React, { Component, Fragment, CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import styled, { keyframes, css } from 'styled-components'
import { isFunction, isNull, isUndefined } from 'lodash'
import { Consumer } from '../ThemeProvider'
import { getClassName, IStyledProps, DialogThemeData, getUnit } from '../utils'
import Button from '../Button'
import NavBar from '../NavBar'
import Icon from '../Icon'

export interface IDialogProps {
    className?: string
    title?: string | JSX.Element
    visible?: boolean
    style?: CSSProperties
    animateInClass?: string
    animateOutClass?: string
    footer?: JSX.Element | null
    onClose?: (val: boolean) => void
    onOk?: () => Promise<void> | void
    onFirstShow?: () => void
    pos?: 'center' | 'bottom'
    async?: boolean
    theme?: DialogThemeData
}

interface IState {
    visible: boolean
    animate: boolean
}

let globalNode: Element | null

const fadeIn = keyframes`
    from {
        background: rgba(0, 0, 0, 0);
    }

    to {
        background: rgba(0, 0, 0, 0.5);
    }
`

const fadeOut = keyframes`
    from {
        background: rgba(0, 0, 0, 0.5);
    }

    to {
        background: rgba(0, 0, 0, 0);
    }
`

const slipToUp = keyframes`
    from {
        transform: translate3d(0, 100vh, 0);
    }

    to {
        transform: translate3d(0, 0vh, 0);
    }
`

const slipToBottom = keyframes`
    from {
        transform: translate3d(0, 0vh, 0);
    }

    to {
        transform: translate3d(0, 100vh, 0);
    }
`

interface IStylePorps extends IStyledProps {
    animate: boolean
}

const Div = styled.div<IStylePorps>`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 9;
    overflow: hidden;
    animation: ${({ animate }) => animate ? fadeIn : fadeOut} 0.3s forwards;
`

interface IDialogContentProps {
    dialogTheme: DialogThemeData
}

const DialogContent = styled.div<IDialogContentProps>`
    width: ${({ dialogTheme }) => getUnit(dialogTheme.width)};
    max-width: 90%;
    max-height: 90%;
    ${({ dialogTheme }) => {
        if (dialogTheme.minHeight) {
            return css`min-height: ${() => getUnit(dialogTheme.minHeight)};`
        }
    }};
    ${({ dialogTheme }) => {
        if (dialogTheme.minWidth) {
            return css`min-width: ${() => getUnit(dialogTheme.minWidth)};`
        }
    }};
    height: ${({ dialogTheme }) => getUnit(dialogTheme.height)};
    background: ${({ dialogTheme }) => dialogTheme.dialogColor.toString()};
    ${({ dialogTheme, theme }) => dialogTheme.borderRadius || theme.borderRadius};
    overflow: hidden;
    box-shadow: 0 0 ${() => getUnit(10)} rgb(107, 107, 107);

    &.slipUp {
        transform: translate3d(0, 100vh, 0);
        animation: ${slipToUp} 0.5s 0.2s forwards cubic-bezier(0.3, 0.23, 0.22, 1.04);
    }

    &.slipBottom {
        animation: ${slipToBottom} 0.5s forwards;
    }
`

const DialogBox = styled.div<IDialogContentProps>`
    min-height: ${() => getUnit(300)};
    ${({ dialogTheme }) => dialogTheme.padding.toString()};
    position: relative;
    margin: 0;
    overflow: auto;
`

const NavTitle = styled.div<IStyledProps>`
    font-size: ${() => getUnit(14)};
`
export default class Dialog extends Component<IDialogProps, IState> {

    public static defaultProps: IDialogProps = {
        animateInClass: 'slipUp',
        animateOutClass: 'slipBottom',
        pos: 'center'
    }

    constructor(props: IDialogProps) {
        super(props)
        if (props.visible) {
            this.state.animate = props.visible
            this.state.visible = props.visible
            this.status = true
            this.index++
        }

        if (typeof document !== 'undefined') {
            globalNode = document.querySelector(`.${getClassName('mask_box')}`)
            if (globalNode) {
                this.node = globalNode
            } else {
                const dom = document.createElement('div')
                dom.className = getClassName('mask_box')
                const body = document.querySelector('body')
                if (body) {
                    body.appendChild(dom)
                }
                this.node = dom
                globalNode = dom
            }
        }
    }

    private index: number = 0

    public state: IState = {
        visible: false,
        animate: false
    }

    private node: Element | null = null

    private animateNode: Element | null = null

    private timer: any

    private status: boolean = false

    public UNSAFE_componentWillReceiveProps(nextProps: IDialogProps) {
        const { visible } = this.state
        if (visible !== nextProps.visible) {
            const obj: any = {
                animate: nextProps.visible || false,
            }
            if (nextProps.visible) {
                this.index++
                obj.visible = nextProps.visible
                this.status = true
            }
            this.setState(obj)
        }
    }

    public componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }

    public render(): JSX.Element {
        const { className, title, children, footer, animateInClass, animateOutClass, style, pos, onOk, async, theme } = this.props
        const { visible, animate } = this.state
        if (this.node && this.status) {
            return createPortal(
                <Consumer>
                    {
                        (value) => (
                            <Div
                                className={`flex_${pos}`} style={{ display: visible ? '' : 'none' }}
                                animate={animate}
                            >
                                <DialogContent
                                    className={`flex_column ${animate ? animateInClass : animateOutClass} ${className || ''}`}
                                    style={style}
                                    dialogTheme={theme || value.theme.dialogTheme}
                                    onAnimationEnd={this.handelAnimate}
                                >
                                    <NavBar
                                        left={
                                            <NavTitle>{title}</NavTitle>
                                        }
                                        theme={theme ? theme.navBarTheme : value.theme.dialogTheme.navBarTheme}
                                        right={<Icon icon="ios-close" style={{ cursor: 'pointer' }} onClick={this.handleClose} />}
                                    />
                                    <DialogBox
                                        dialogTheme={theme || value.theme.dialogTheme}
                                        className="flex_1"
                                    >
                                        {children}
                                    </DialogBox>
                                    {isNull(footer) ? null :
                                        <NavBar
                                            className="mk_divider_top"
                                            theme={theme ? theme.navBarTheme : value.theme.dialogTheme.navBarTheme}
                                            divider={false}
                                            left={null}
                                            right={
                                                <div className="flex">
                                                    {
                                                        isUndefined(footer) ?
                                                            (
                                                                <Fragment>
                                                                    <Button onClick={this.handleClose} style={{ marginRight: '10px' }}>取消</Button>
                                                                    <Button mold="primary" async={async} onClick={onOk}>确定</Button>
                                                                </Fragment>
                                                            ) : footer
                                                    }
                                                </div>
                                            }
                                        />}
                                </DialogContent>
                            </Div>
                        )
                    }
                </Consumer>,
                this.node
            )
        }
        return <Fragment />
    }

    private handelAnimate = () => {
        const { onFirstShow } = this.props
        const { animate } = this.state
        if (!animate) {
            this.timer = setTimeout(() => {
                clearTimeout(this.timer)
                this.setState({
                    visible: false
                })
            }, 200)
        }
        if (animate && this.index === 1 && isFunction(onFirstShow)) {
            this.index++
            onFirstShow()
        }
    }

    private handleClose = () => {
        const { onClose } = this.props
        if (isFunction(onClose)) {
            onClose(false)
        } else {
            this.setState({
                animate: false
            })
        }
    }
}
