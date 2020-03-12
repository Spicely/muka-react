import React, { Component } from 'react'
import { isUndefined, isFunction } from 'lodash'
import styled, { CSSProperties } from 'styled-components'
import Radio, { IRadioType } from '../Radio'
import { Consumer } from '../ThemeProvider'
import { IValue, RadioThemeData, getRatioUnit } from '../utils'

export interface IRadioGroupOptions {
    label: string
    value: string | number | boolean
    className?: string
}

export interface IRadioGroupProps {
    className?: string
    type?: IRadioType
    value?: string | number | boolean
    options: IRadioGroupOptions[]
    itemStyle?: CSSProperties
    onChange?: (value: string | number | boolean, data: IValue) => void
    theme?: RadioThemeData
    style?:CSSProperties
}

interface IState {
    value: any
}

const RadioItem = styled(Radio)`
    margin-right: ${getRatioUnit(10)};
    &:last-child {
        margin-right: 0;
    }
`

export default class RadioGroup extends Component<IRadioGroupProps, IState> {

    constructor(props: IRadioGroupProps) {
        super(props)
        this.state.value = props.value
    }

    public static defaultProps: IRadioGroupProps = {
        options: []
    }

    public state: IState = {
        value: ''
    }

    public render(): JSX.Element {
        const { className, options, type, theme, itemStyle, style } = this.props
        const { value } = this.state
        return (
            <Consumer>
                {(data) => (
                    <div className={className} style={style}>
                        {
                            options.map((i, index: number) => {
                                return (
                                    <RadioItem
                                        theme={theme || data.theme.radioTheme}
                                        className={i.className}
                                        key={index} type={type}
                                        onChange={this.handleRadioChange.bind(this, i.value, i)}
                                        checked={i.value === value}
                                        style={itemStyle}
                                    >
                                        {i.label}
                                    </RadioItem>
                                )
                            })
                        }
                    </div>
                )}
            </Consumer>
        )
    }

    public UNSAFE_componentWillReceiveProps(nextProps: IRadioGroupProps) {
        const { value } = this.props
        if (!isUndefined(nextProps.value) && nextProps.value !== value) {
            this.setState({
                value: nextProps.value
            })
        }
    }

    private handleRadioChange(value: string | number | boolean, data: IValue) {
        const { onChange } = this.props
        this.setState({ value })
        if (isFunction(onChange)) {
            onChange(value, data)
        }
    }
}
