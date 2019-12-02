import React, { Component, Fragment, CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { isFunction, isNull, isUndefined } from 'lodash'
import { Consumer } from '../ThemeProvider'
import { getClassName, prefix, IStyledProps } from '../utils'
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
}

interface IState {
    visible: boolean
    animate: boolean
}

const prefixClass = 'dialog'

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

const DialogContent = styled.div<IStyledProps>`
    min-width: ${({ theme }) => 600 * theme.ratio + theme.unit};
    max-height:  ${({ theme }) => `calc(100% - ${100 * theme.ratio + theme.unit})`} ;
    background: #fff;
    border-radius: ${({ theme }) => theme.borderRadius};
    overflow: hidden;
    box-shadow: 0 0 ${({ theme }) => 10 * theme.ratio + theme.unit} rgb(107, 107, 107);

    &.slipUp {
        transform: translate3d(0, 100vh, 0);
        animation: ${slipToUp} 0.5s 0.2s forwards cubic-bezier(0.3, 0.23, 0.22, 1.04);
    }

    &.slipBottom {
        animation: ${slipToBottom} 0.5s forwards;
    }
`

const DialogBox = styled.div<IStyledProps>`
    min-height: ${({ theme }) => 300 * theme.ratio + theme.unit};
    position: relative;
    margin: 0 ${({ theme }) => 20 * theme.ratio + theme.unit};
    overflow: auto;
`

const NavTitle = styled.div<IStyledProps>`
    font-size: ${({ theme }) => 14 * theme.ratio + theme.unit};
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
        const { className, title, children, footer, animateInClass, animateOutClass, style, pos, onOk, async } = this.props
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
                                    className={`${animate ? animateInClass : animateOutClass} ${className || ''}`}
                                    style={style}
                                    theme={value.theme}
                                    onAnimationEnd={this.handelAnimate}
                                >
                                    <NavBar
                                        left={
                                            <NavTitle>{title}</NavTitle>
                                        }
                                        backgroundColor={value.theme.dialogColor}
                                        right={<Icon icon="ios-close" style={{ cursor: 'pointer' }} onClick={this.handleClose} />}
                                    />
                                    <DialogBox
                                        theme={value.theme}
                                        className="flex_1"
                                    >
                                        {children}
                                    </DialogBox>
                                    <NavBar
                                        className="mk_divider_top"
                                        divider={false}
                                        left={null}
                                        backgroundColor={value.theme.dialogColor}
                                        right={
                                            <div className="flex">
                                                {
                                                    isNull(footer) ? null : isUndefined(footer) ?
                                                        (
                                                            <Fragment>
                                                                <Button onClick={this.handleClose} style={{ marginRight: '10px' }}>取消</Button>
                                                                <Button mold="primary" async={async} onClick={onOk}>确定</Button>
                                                            </Fragment>
                                                        ) : footer
                                                }
                                            </div>
                                        }
                                    />
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
