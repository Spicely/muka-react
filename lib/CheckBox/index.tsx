import React, { Component, CSSProperties } from 'react'
import { isEqual } from 'lodash'
import { RadioThemeData, ThemeData } from '../utils'
import { Consumer } from '../ThemeProvider'
import { iconType } from '../Icon'
import Radio from '../Radio'

interface ICheckBoxOptionsProps {
    label: string
    value: string | number | boolean
    className?: string
    icon?: iconType
}

type typeItem = string | number | boolean

export interface ICheckBoxProps {
    className?: string
    style?: CSSProperties
    options: ICheckBoxOptionsProps[]
    icon?: iconType
    value?: typeItem[]
    theme?: RadioThemeData
}

interface IState {
    value: typeItem[]
}


export default class CheckBox extends Component<ICheckBoxProps, IState> {

    constructor(props: ICheckBoxProps) {
        super(props)
        this.state.value = props.value || []
    }

    public static defaultProps: ICheckBoxProps = {
        options: []
    }

    public static getDerivedStateFromProps(nextProps: ICheckBoxProps, prevState: IState) {
        if (nextProps.value && !isEqual(nextProps.value, prevState.value)) {
            return {
                value: nextProps.value
            }
        }
        return null
    }

    public state: IState = {
        value: []
    }

    public render(): JSX.Element {
        const { className, style, options, icon, theme } = this.props
        const { value } = this.state
        return (
            <Consumer>
                {
                    (data) => (
                        <div
                            className={className}
                            style={style}
                        >
                            {
                                options.map((item, index) => {
                                    return (
                                        <Radio
                                            className={item.className}
                                            checked={value.includes(item.value) ? true : false}
                                            type="square"
                                            key={index}
                                            theme={theme || data.theme.radioTheme}
                                            icon={item.icon || icon}
                                            onChange={this.handleChange.bind(this, item.value)}
                                            style={{marginRight: `${10 * ThemeData.ratio + ThemeData.unit}`}}
                                        >
                                            {item.label}
                                        </Radio>
                                    )
                                })
                            }
                        </div>
                    )
                }
            </Consumer>

        )
    }

    private handleChange = (val: string | number | boolean) => {
        const { value } = this.state
        if (value.includes(val) && val) {
            const index = value.indexOf(val)
            value.splice(index, 1)
            this.setState({
                value
            })
            return
        }
        if (!value.includes(val) && val) {
            value.push(val)
        }
        this.setState({
            value
        })
    }
}
