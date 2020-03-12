import React, { Component, CSSProperties, Children } from 'react'
import { isFunction } from 'lodash'
import styled, { css } from 'styled-components'
import ScrollView from '../ScrollView'
import { getClassName, getUnit } from '../utils'

interface IMobileLayoutViewProps {
    viewHeight?: number | string
    backgroundColor?: string
}

const MobileLayoutView = styled.div<IMobileLayoutViewProps>`
    height: ${({ viewHeight }) => getUnit(viewHeight, '100%')};
    ${({ backgroundColor }) => {
        if (backgroundColor) return css`background-color: ${backgroundColor};`
    }}
    overflow: hidden;
`

interface IMobileLayoutProps {
    className?: string
    appBar?: JSX.Element
    height?: number | string
    style?: CSSProperties
    footer?: JSX.Element
    onGetData?: (success: () => void) => void
    scrollY?: boolean
    scrollX?: boolean
    onEndReachedThreshold?: number
    backgroundColor?: string
    emptyElement?: string | JSX.Element
    children?: any
}

interface IState {
    status: boolean
}

export default class MobileLayout extends Component<IMobileLayoutProps, IState> {

    public state: IState = {
        status: false
    }

    public render(): JSX.Element {
        const { className, appBar, height, style, footer, onGetData, scrollY, scrollX, onEndReachedThreshold, backgroundColor } = this.props
        return (
            <MobileLayoutView
                viewHeight={height}
                className={getClassName('flex_column', className)}
                style={style}
                backgroundColor={backgroundColor}
            >
                {appBar}
                <ScrollView
                    className="flex_1"
                    onGetData={onGetData}
                    scrollY={scrollY}
                    scrollX={scrollX}
                    onEndReachedThreshold={onEndReachedThreshold}
                >
                    {this.getNode()}
                </ScrollView>
                {footer}
            </MobileLayoutView>
        )
    }

    public UNSAFE_componentWillReceiveProps(nextProps: IMobileLayoutProps) {
        const { children } = this.props
        if (Children.count(nextProps.children) === 0 && Children.count(children) === 0) {
            this.setState({
                status: true
            })
        } else {
            this.setState({
                status: false
            })
        }
    }

    private getNode = () => {
        const { children, emptyElement, onGetData } = this.props
        const { status } = this.state
        if (!Children.count(children) && !isFunction(onGetData)) {
            return emptyElement
        } else {
            return status ? emptyElement : children
        }
    }

}