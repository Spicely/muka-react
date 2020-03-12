import React, { Component, CSSProperties, createContext } from 'react'
import styled, { css } from 'styled-components'
import { isUndefined, isNil, isNumber, isFunction } from 'lodash'
import { getUnit, getClassName } from '../utils'

export interface IScrollViewProps {
    height?: string | number
    className?: string
    style?: CSSProperties
    scrollY?: boolean
    scrollX?: boolean
    onEndReachedThreshold?: number
    onGetData?: (success: () => void) => void
}

interface IScrollViewBoxProps {
    scrollHeight?: number | string
    scrollY: boolean
    scrollX: boolean
}

const ScrollViewBox = styled.div<IScrollViewBoxProps>`
    overflow: hidden;
    ${({ scrollHeight }) => {
        if (!isNil(scrollHeight)) {
            return css`height: ${getUnit(scrollHeight)};`
        }
    }};
    -webkit-overflow-scrolling: touch;
    overflow-y: ${({ scrollY }) => scrollY ? 'auto' : 'hidden'};
    overflow-x: ${({ scrollX }) => scrollX ? 'auto' : 'hidden'};
    ${({ scrollY }) => {
        if (scrollY) {
            return css`> * {flex-shrink: 0;}`
        }
    }}
`

export const { Consumer, Provider } = createContext({
    controller: null
})

export default class ScrollView extends Component<IScrollViewProps, any> {

    public static defaultProps: IScrollViewProps = {
        onEndReachedThreshold: 20
    }

    private controller: HTMLDivElement | null = null

    public state = {
        status: true,
        controller: null
    }

    public render(): JSX.Element {
        const { children, className, style, scrollY, scrollX, height } = this.props
        return (
            <Provider value={{
                ...this.state
            }}>
                <ScrollViewBox
                    scrollHeight={height}
                    ref={(e) => this.controller = e}
                    className={getClassName(`${scrollX ? 'flex' : ''}`, className)}
                    scrollY={isUndefined(scrollY) ? true : scrollY}
                    scrollX={scrollX || false}
                    style={style}
                >
                    {children}
                </ScrollViewBox>
            </Provider>
        )
    }
    public componentDidMount() {
        const { onGetData } = this.props
        this.setState({
            controller: this.controller
        })
        if (this.controller) {
            this.controller.addEventListener('scroll', this.handlScroll)
        }
        if (isFunction(onGetData)) {
            this.setState({
                status: false
            }, () => {
                onGetData(this.handleSuccess)
            })
        }
    }

    public componentWillUnmount() {
        if (this.controller) {
            this.controller.removeEventListener('scroll', this.handlScroll)
        }
    }

    private handleSuccess = () => {
        this.setState({
            status: true
        })
    }

    private handlScroll = () => {
        const { onEndReachedThreshold, onGetData } = this.props
        const { status } = this.state
        const thresholdNumber = isNumber(onEndReachedThreshold) ? onEndReachedThreshold : 20
        if (this.controller && this.controller.scrollHeight - this.controller.clientHeight - this.controller.scrollTop < thresholdNumber && status) {
            if (isFunction(onGetData)) {
                this.setState({
                    status: false
                }, () => {
                    onGetData(this.handleSuccess)
                })
            }
        }
    }
}
