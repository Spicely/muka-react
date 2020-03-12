import React, { Component, CSSProperties } from 'react'
import { isFunction } from 'lodash'
import styled from 'styled-components'
import { getUnit } from '../utils'

interface ICountDown {
    className?: string
    style?: CSSProperties
    seconds: number
    initText?: string | JSX.Element
    type?: 'click' | 'auto'
    width?: number | string
    render?: (time: number) => JSX.Element | string
    onClick?: () => (boolean | Promise<boolean>)
}

interface IState {
    second: number
}

interface IViewWidthProps {
    viewWidth?: number | string
}

const CountDownView = styled.div<IViewWidthProps>`
    width: ${({ viewWidth }) => getUnit(viewWidth)};
    text-align:center;
`
export default class CountDown extends Component<ICountDown, IState> {
    constructor(props: ICountDown) {
        super(props)
        this.state.second = props.seconds
    }

    public static defaultProps: ICountDown = {
        seconds: 0,
        type: 'click',
        width: 80
    }

    private timer?: number

    public state: IState = {
        second: 0
    }

    public componentDidMount() {
        const { type } = this.props
        if (type === 'auto') {
            this.playTime()
        }
    }


    public render(): JSX.Element {
        const { className, width, style } = this.props
        return (
            <CountDownView
                style={style}
                className={className}
                onClick={this.handleClick}
                viewWidth={width}
            >
                {this.getText()}
            </CountDownView>
        )
    }

    public componentWillUnmount() {
        clearInterval(this.timer)
        this.timer = undefined
    }
    private playTime = () => {
        this.timer = setInterval(() => {
            let { second } = this.state
            if (second > 0) {
                this.setState({
                    second: --second
                })
            } else {
                const { seconds } = this.props
                clearInterval(this.timer)
                this.timer = undefined
                this.setState({
                    second: seconds
                })
            }
        }, 1000)
    }

    private handleClick = () => {
        const { onClick } = this.props
        if (this.timer) return
        if (isFunction(onClick)) {
            const value = onClick()
            if (value instanceof Promise) {
                value.then((val) => {
                    if (val) this.playTime()
                })
            } else {
                if (value) this.playTime()
            }
        } else {
            this.playTime()
        }
    }

    private getText() {
        const { initText, seconds, render } = this.props
        const { second } = this.state
        if (!this.timer && second === seconds) {
            return initText
        }
        if (this.timer && second !== 0) {
            if (isFunction(render)) {
                return render(second)
            } else {
                return second
            }

        }
        return initText
    }
}