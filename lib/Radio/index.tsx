import React, { CSSProperties, Component } from 'react'
import styled, { css } from 'styled-components'
import { isFunction, isBoolean } from 'lodash'
import RadioGroup from './Group'
import { RadioThemeData, ThemeData, transition, IconThemeData } from '../utils'
import Icon, { iconType } from '../Icon'
import { Consumer } from '../ThemeProvider'
// import Group from './Group'

export type IRadioType = 'square' | 'btn' | 'circular'

export interface IRadioProps {
    className?: string
    defaultChecked?: boolean
    checked?: boolean
    onChange?: (val: boolean) => void
    type?: IRadioType
    style?: CSSProperties
    icon?: iconType
    theme?: RadioThemeData
    children?: string | JSX.Element
}

interface IState {
    status: boolean
    checked: boolean
}

interface IStyleProps {
    radioTheme: RadioThemeData
    active: boolean
    type?: IRadioType
}

const RadioView = styled.div<IStyleProps>`
    display: inline-block;
    cursor: pointer;
    ${transition(0.5)};
    ${({ type, radioTheme }) => {
        if (type === 'square') return css`vertical-align: middle;`
        if (type === 'btn') return css`
            border: ${radioTheme.border.width * ThemeData.ratio + ThemeData.unit} ${radioTheme.border.style.toString()} ${radioTheme.border.color.toString()};
            height: ${radioTheme.size * ThemeData.ratio + ThemeData.unit};
            border-radius: ${radioTheme.size / 2 * ThemeData.ratio + ThemeData.unit};
            padding: 0 ${10 * ThemeData.ratio + ThemeData.unit};
        `
    }}

    ${({ active, radioTheme, theme }) => {
        if (active) return css`border-color: ${radioTheme.radioColor || theme.primarySwatch};`
    }}
`

interface IRadioCoreProps {
    radioTheme: RadioThemeData
    active: boolean
}

const RadioCore = styled.div<IRadioCoreProps>`
    height: ${({ radioTheme }) => radioTheme.size * ThemeData.ratio + ThemeData.unit};
    width: ${({ radioTheme }) => radioTheme.size * ThemeData.ratio + ThemeData.unit};
    border: ${({ radioTheme }) => `${radioTheme.border.width * ThemeData.ratio + ThemeData.unit} ${radioTheme.border.style.toString()} ${radioTheme.border.color.toString()}`};
    border-radius: 50%;
    ${transition(0.5)};
    ${({ active, radioTheme, theme }) => {
        if (active) return css`border-color: ${radioTheme.radioColor || theme.primarySwatch};`
    }}
`

interface IRadioSquareProps {
    radioTheme: RadioThemeData
    active: boolean
}

const RadioSquare = styled.div<IRadioSquareProps>`
    width: ${({ radioTheme }) => radioTheme.size * ThemeData.ratio + ThemeData.unit};
    height: ${({ radioTheme }) => radioTheme.size * ThemeData.ratio + ThemeData.unit};
    border: ${({ radioTheme }) => `${radioTheme.border.width * ThemeData.ratio + ThemeData.unit} ${radioTheme.border.style.toString()} ${radioTheme.border.color.toString()}`};
    ${transition(0.5)};
    ${({ active, radioTheme, theme }) => {
        if (active) return css`border-color: ${radioTheme.radioColor || theme.primarySwatch};`
    }}
`

interface IRadioCoreCircleProps {
    radioTheme: RadioThemeData
    status: boolean
}

const RadioCoreCircle = styled.div<IRadioCoreCircleProps>`
    background: ${({ radioTheme, theme }) => radioTheme.radioColor || theme.primarySwatch};
    border-radius: 50%;
    width: ${({ radioTheme }) => (radioTheme.size - 8) * ThemeData.ratio + ThemeData.unit};
    height: ${({ radioTheme }) => (radioTheme.size - 8) * ThemeData.ratio + ThemeData.unit};
    ${transition(0.5)};

    ${({ status }) => {
        if (status) return css`transform: scale(1);`
        else return css`transform: scale(0);`
    }}
`

interface IRadioLabelProps {
    radioTheme: RadioThemeData
    type: IRadioType
    active: boolean
}

const RadioLabel = styled.span<IRadioLabelProps>`
    font-size: ${({ radioTheme }) => radioTheme.fontSize * ThemeData.ratio + ThemeData.unit};
    vertical-align: middle;
    ${transition(0.5)};
    ${({ type }) => {
        if (type !== 'btn') return css`  margin-left: ${5 * ThemeData.ratio + ThemeData.unit};`
    }};
     ${({ radioTheme, type, active, theme }) => {
        if (type !== 'btn') return css`color: ${radioTheme.color.toString()};`
        if (type === 'btn' && active) return css`color: ${radioTheme.radioColor || theme.primarySwatch};`
    }};
    line-height: ${({ radioTheme }) => radioTheme.size * ThemeData.ratio + ThemeData.unit};
`

export default class Radio extends Component<IRadioProps, IState> {

    constructor(props: IRadioProps) {
        super(props)
        this.state.status = props.checked || props.defaultChecked || false
        this.state.checked = props.checked || props.defaultChecked || false
    }

    public static defaultProps: IRadioProps = {
        type: 'circular'
    }

    // public Group = Group

    public UNSAFE_componentWillReceiveProps(nextProps: IRadioProps) {
        const { checked } = this.state
        if (isBoolean(nextProps.checked) && checked !== nextProps.checked) {
            this.setState({
                status: nextProps.checked,
                checked: nextProps.checked
            })
        }
    }

    public static Group = RadioGroup

    public state = {
        status: false,
        checked: false
    }

    public render(): JSX.Element {
        const { className, children, checked, type, style, icon, theme } = this.props
        const { status } = this.state
        return (
            <Consumer>
                {
                    (value) => (
                        <RadioView
                            className={className}
                            style={style}
                            type={type}
                            active={isBoolean(checked) ? checked : status}
                            theme={value.theme}
                            radioTheme={theme || value.theme.radioTheme}
                            onClick={this.handleClick}
                        >
                            <div className="flex">
                                {type === 'square' ? (
                                    <RadioSquare
                                        theme={value.theme}
                                        radioTheme={theme || value.theme.radioTheme}
                                        active={isBoolean(checked) ? checked : status}
                                        className="flex_justify"
                                    >
                                        {
                                            (isBoolean(checked) ? checked : status) ?
                                                <Icon
                                                    icon={icon || 'md-checkmark'}
                                                    theme={
                                                        new IconThemeData({
                                                            color: theme ? theme.radioColor : value.theme.primarySwatch,
                                                            size: theme ? theme.size : value.theme.radioTheme.size
                                                        })
                                                    }
                                                />
                                                : null
                                        }
                                    </RadioSquare>
                                ) : null}
                                {
                                    type === 'circular' ? (
                                        <RadioCore
                                            active={isBoolean(checked) ? checked : status}
                                            radioTheme={theme || value.theme.radioTheme}
                                            theme={value.theme}
                                        >
                                            <div className="flex_center" style={{ width: '100%', height: '100%' }}>
                                                <RadioCoreCircle
                                                    radioTheme={theme || value.theme.radioTheme}
                                                    theme={value.theme}
                                                    status={status}
                                                />
                                            </div>
                                        </RadioCore>
                                    ) : null
                                }
                                <RadioLabel
                                    radioTheme={theme || value.theme.radioTheme}
                                    type={type || 'circular'}
                                    theme={value.theme}
                                    active={isBoolean(checked) ? checked : status}
                                >
                                    {children}
                                </RadioLabel>
                            </div>
                        </RadioView>
                    )
                }
            </Consumer>
        )
    }

    private handleClick = () => {
        const { checked, onChange } = this.props
        if (isFunction(onChange)) {
            onChange(isBoolean(checked) ? checked ? true : false : true)
        }
        this.setState({
            status: isBoolean(checked) ? checked ? true : false : true
        })
    }
}
