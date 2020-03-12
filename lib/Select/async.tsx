import React, { Component } from 'react'
import ReactSelect from 'react-select/async'
import Axios from 'axios'
import { isFunction, isNil, isUndefined, isString } from 'lodash'
import { getClassName, SelectThemeData, getUnit, transition, Color } from '../utils'
import { Consumer } from '../ThemeProvider'
import Empty from '../Empty'
import Icon from '../Icon'
import styled from 'styled-components'

interface ISelectOptionsProps {
    value: string | number
    label: string
    isDisabled?: boolean
    color?: string
}

export interface ISelectProps {
    className?: string
    options: ISelectOptionsProps[]
    onChange?: (value: string | number) => void
    value?: string | number
    placeholder?: string
    isSearchable?: boolean
    isMulti?: boolean
    isDisabled?: boolean
    url?: string
    loadOptions?: Promise<ISelectOptionsProps[]>
    noOptionsMessage?: string | JSX.Element
    theme?: SelectThemeData
}

const prefixClass = 'select'

interface IStyleProps {
    selectTheme: SelectThemeData
}

const SelectIcon = styled(Icon)``

const SelectView = styled(ReactSelect)<IStyleProps>`
    height: ${({ selectTheme }) => getUnit(selectTheme.height)};
    background: #fff;
    ${({ selectTheme, theme }) => selectTheme.borderRadius || theme.borderRadius}

    >span {
        display: none;
    }

    .select_icon {
        width: ${getUnit(24)};
    }

    .select__control {
        min-height: initial;
        height: 100%;
        box-shadow: inherit;
        border-radius: inherit;
        ${({ selectTheme }: any) => selectTheme.border};
        background: inherit;
        ${transition(0.5)};
        ${SelectIcon} {
            ${transition(0.5)};
            transform: rotate(0deg);
        }

        &--is-focused {
            border-color: ${({ selectTheme, theme }) => selectTheme.selectColor || theme.primarySwatch};
            box-sizing: border-box;
            border-width: ${getUnit(1)};
            ${SelectIcon} {
                fill: ${({ selectTheme, theme }) => selectTheme.selectColor || theme.primarySwatch};
            }
            &.select__control--menu-is-open ${SelectIcon} {
                transform: rotate(180deg);
            }
        }

        &:hover {
            border-color: ${({ selectTheme, theme }) => selectTheme.selectColor || theme.primarySwatch};
            ${SelectIcon} {
                fill: ${({ selectTheme, theme }) => selectTheme.selectColor || theme.primarySwatch};
            }
        }
    }

    .select__placeholder {
        white-space: nowrap;
    }

    .select__value-container {
        min-width: ${getUnit(70)};
    }

    .select__indicator {
        padding: 0 ${getUnit(8)};

        &-separator {
            display: none;
        }
    }

    .select__menu {
        ${({ selectTheme, theme }) => selectTheme.borderRadius || theme.borderRadius};
    }
    .select__option {
        &:hover {
            background: ${({ selectTheme, theme }) => Color.setOpacity(selectTheme.selectColor || theme.primarySwatch, 0.65).toString()};
        }

        &--is-selected {
            background: ${({ selectTheme, theme }) => selectTheme.selectColor || theme.primarySwatch};
        }

        &--is-focused {
            background: ${({ selectTheme, theme }) => Color.setOpacity(selectTheme.selectColor || theme.primarySwatch, 0.8).toString()};
        }
    }

    .select__desc {
        line-height: ${({ selectTheme }) => getUnit(selectTheme.height)};
    }
`

interface IState {
    value: any
}

export default class AsyncSelect extends Component<ISelectProps, IState> {
    constructor(props: ISelectProps) {
        super(props)
        this.state.value = isNil(props.value) ? undefined : props.options.find((i) => i.value === props.value)
    }

    public static defaultProps: ISelectProps = {
        options: [],
        placeholder: '请选择数据',
        isSearchable: false,
        isMulti: false,
        isDisabled: false,
    }

    public state: IState = {
        value: undefined
    }

    public render(): JSX.Element {
        const { className, options, placeholder, isSearchable, isMulti, isDisabled, theme, loadOptions, url } = this.props
        const { value } = this.state
        return (
            <Consumer>
                {
                    (val) => (
                        <SelectView
                            value={value}
                            options={options}
                            selectTheme={theme || val.theme.selectTheme}
                            className={className}
                            classNamePrefix="select"
                            cacheOptions
                            defaultOptions
                            onChange={this.handleChange}
                            isSearchable={isSearchable}
                            loadOptions={loadOptions ? loadOptions : url ? this.getOptions : loadOptions}
                            placeholder={placeholder}
                            isMulti={isMulti}
                            isDisabled={isDisabled}
                            components={{
                                IndicatorsContainer: () =>
                                    <div className={getClassName(`${prefixClass}_icon flex_center`)} >
                                        <SelectIcon
                                            icon="ios-arrow-down"
                                            theme={theme ? theme.iconTheme : val.theme.selectTheme.iconTheme}
                                        />
                                    </div>,
                                NoOptionsMessage: this.handleMessage
                            }}
                        />)
                }
            </Consumer>

        )
    }

    private getOptions = () => {
        const { url } = this.props
        return Axios.post(url || '', {}, {
            timeout: 25000,
            withCredentials: true,
        }).then((res) => {
            return res.data.data
        })
    }

    public UNSAFE_componentWillReceiveProps(nextProps: ISelectProps) {
        const { value } = this.state
        const { options } = this.props
        if (nextProps.value !== value) {
            const data = options.find((i) => i.value === nextProps.value)
            this.setState({
                value: data || null
            })
        }
    }

    private handleChange = (data: any) => {
        const { onChange } = this.props
        this.setState({
            value: data
        })
        if (isFunction(onChange)) {
            onChange(data.value)
        }
    }
    private handleMessage = () => {
        const { noOptionsMessage } = this.props
        return (isUndefined(noOptionsMessage) || isString(noOptionsMessage)) ?
            <Empty description={noOptionsMessage} descClassName={getClassName(`${prefixClass}__desc`)} image={null} /> :
            noOptionsMessage
    }
}
