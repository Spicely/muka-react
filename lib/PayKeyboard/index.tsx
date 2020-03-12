import React, { Component, Fragment } from 'react'
import { isFunction } from 'lodash'
import styled, { createGlobalStyle, keyframes } from 'styled-components'
import Dialog from '../Dialog'
import { DialogThemeData, getUnit, IconThemeData } from '../utils'
import Icon from '../Icon'

const dialogTheme = new DialogThemeData({
    height: '60%',
    width: '100%',
})

const iconTheme = new IconThemeData({
    size: 32
})

interface IStyleProps {
    type?: 'es'
}

const PayItem = styled.div<IStyleProps>`
    height: ${getUnit(60)};
    color: #000;
    background: ${({ type }) => {
        if (type) return '#d6d6d6'
        else return '#fff'
    }};
    font-size: ${getUnit(22)};
`

const PayIntBox = styled.div`
    border: ${getUnit(1)} solid ${({ theme }) => theme.dividerColor.toString()};
    border-radius: ${getUnit(5)};
`

const PayInt = styled.div`
    width: ${getUnit(50)};
    height: ${getUnit(40)};
    border-left: ${getUnit(1)} solid ${({ theme }) => theme.dividerColor.toString()};
    font-size: ${getUnit(40)};
    font-weight: 900;
    &:first-child{
        border-left: 0;
    }
`
const vslipToUp = keyframes`
    from {
        transform: translate3d(0, 100vh, 0);
    }

    to {
        transform: translate3d(0, 30%, 0);
    }
`

const vslipToBottom = keyframes`
    from {
        transform: translate3d(0, 30%, 0);
    }

    to {
        transform: translate3d(0, 100vh, 0);
    }
`

const GlobalStyle = createGlobalStyle`
    .vslipUp {
        transform: translate3d(0, 100vh, 0);
        animation: ${vslipToUp} 0.5s 0.2s forwards cubic-bezier(0.3, 0.23, 0.22, 1.04);
    }

    .vslipBottom {
        animation: ${vslipToBottom} 0.5s forwards;
    }
`
interface IProps {
    title?: string
    onSuccess?: (value: string) => void
    visible?: boolean
}

interface IState {
    value: string
}

export default class PayKeyboard extends Component<IProps, IState> {

    public state: IState = {
        value: ''
    }

    public render(): JSX.Element {
        const { title, visible } = this.props
        const { value } = this.state
        return (
            <Fragment>
                <GlobalStyle />
                <Dialog
                    title={title}
                    visible={visible}
                    footer={null}
                    theme={dialogTheme}
                    animateInClass="vslipUp"
                    animateOutClass="vslipBottom"
                >
                    <div className="flex_column" style={{ height: '100%' }}>
                        <div className="flex_1 flex_center">
                            <PayIntBox className="flex">
                                <PayInt className="flex_center">{value.split('')[0] ? '·' : ''}</PayInt>
                                <PayInt className="flex_center">{value.split('')[1] ? '·' : ''}</PayInt>
                                <PayInt className="flex_center">{value.split('')[2] ? '·' : ''}</PayInt>
                                <PayInt className="flex_center">{value.split('')[3] ? '·' : ''}</PayInt>
                                <PayInt className="flex_center">{value.split('')[4] ? '·' : ''}</PayInt>
                                <PayInt className="flex_center">{value.split('')[5] ? '·' : ''}</PayInt>
                            </PayIntBox>
                        </div>
                        <div className="flex">
                            <div className="flex_1 mk_divider_top">
                                <div className="mk_divider">
                                    <PayItem
                                        className="flex_center mk_divider_right"
                                        onClick={this.handleNumber.bind(this, 1)}
                                    >
                                        1
                                    </PayItem>
                                </div>
                            </div>
                            <div className="flex_1 mk_divider_top">
                                <div className="mk_divider">
                                    <PayItem
                                        className="flex_center mk_divider_right"
                                        onClick={this.handleNumber.bind(this, 2)}
                                    >
                                        2
                                    </PayItem>
                                </div>
                            </div>
                            <div className="flex_1 mk_divider_top">
                                <PayItem
                                    className="flex_center mk_divider"
                                    onClick={this.handleNumber.bind(this, 3)}
                                >
                                    3
                                </PayItem>
                            </div>

                        </div>
                        <div className="flex">
                            <div className="mk_divider flex_1">
                                <PayItem
                                    className="flex_center mk_divider_right"
                                    onClick={this.handleNumber.bind(this, 4)}
                                >
                                    4
                            </PayItem>
                            </div>
                            <div className="mk_divider flex_1">
                                <PayItem
                                    className="flex_center mk_divider_right"
                                    onClick={this.handleNumber.bind(this, 5)}
                                >
                                    5
                            </PayItem>
                            </div>
                            <PayItem
                                className="flex_1 flex_center mk_divider"
                                onClick={this.handleNumber.bind(this, 6)}
                            >
                                6
                        </PayItem>
                        </div>
                        <div className="flex">
                            <div className="mk_divider flex_1">
                                <PayItem
                                    className="flex_center mk_divider_right"
                                    onClick={this.handleNumber.bind(this, 7)}
                                >
                                    7
                            </PayItem>
                            </div>
                            <div className="mk_divider flex_1">
                                <PayItem
                                    className="flex_center mk_divider_right"
                                    onClick={this.handleNumber.bind(this, 8)}
                                >
                                    8
                            </PayItem>
                            </div>
                            <PayItem
                                className="flex_1 flex_center mk_divider"
                                onClick={this.handleNumber.bind(this, 9)}
                            >
                                9
                        </PayItem>
                        </div>
                        <div className="flex">
                            <div className="mk_divider flex_1">
                                <PayItem className="flex_center mk_divider_right" type="es"></PayItem>
                            </div>
                            <div className="mk_divider flex_1">
                                <PayItem className="flex_center mk_divider_right">0</PayItem>
                            </div>
                            <PayItem
                                className="flex_1 flex_center mk_divider"
                                type="es"
                                onClick={this.handleDel}
                            >
                                <Icon
                                    icon="md-backspace"
                                    theme={iconTheme}
                                />
                            </PayItem>
                        </div>
                    </div>
                </Dialog>
            </Fragment>
        )
    }

    private handleNumber = (num: number) => {
        const { onSuccess } = this.props
        const { value } = this.state
        if (value.length >= 6) return
        const newVal = value + num
        this.setState({
            value: newVal
        }, () => {
            if (newVal.length === 6 && isFunction(onSuccess)) {
                onSuccess(newVal)
            }
        })

    }

    private handleDel = () => {
        const { value } = this.state
        this.setState({
            value: value.substring(0, value.length - 1)
        })
    }

}