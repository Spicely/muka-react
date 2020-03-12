import React, { CSSProperties, Component } from 'react'
import styled, { css } from 'styled-components'
import { isFunction, isBoolean } from 'lodash'
import { RadioThemeData, transition, getRatioUnit } from '../utils'
import Icon, { iconType } from '../Icon'
import { Consumer } from '../ThemeProvider'


export type IRadioType = 'square' | 'btn' | 'circular'

export interface IRadioProps {
    className?: string
    defaultChecked?: boolean
    checked?: boolean
    onChange?: (val: boolean) => void
    type?: IRadioType
    style?: CSSProperties
    iconStyle?: CSSProperties
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
    ${({ type, radioTheme, theme }) => {
        if (type === 'square') return css`vertical-align: middle;&:hover ${RadioSquare}{border-color: ${radioTheme.hoverBorderColor || theme.primarySwatch}}`
        if (type === 'btn') return css`
            ${radioTheme.border.toString()};
            height: ${getRatioUnit(radioTheme.size)};
            border-radius: ${getRatioUnit(radioTheme.size / 2)};
            padding: 0 ${getRatioUnit(10)};
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
    height: ${({ radioTheme }) => getRatioUnit(radioTheme.size)};
    width: ${({ radioTheme }) => getRatioUnit(radioTheme.size)};
    border-radius: 50%;
    ${({ radioTheme }) => css`${radioTheme.border.toString()}`};
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
    width: ${({ radioTheme }) => getRatioUnit(radioTheme.size)};
    height: ${({ radioTheme }) => getRatioUnit(radioTheme.size)};
    ${({ radioTheme }) => css`${radioTheme.border.toString()}`};
    ${transition(0.5)};
    ${({ active, radioTheme, theme }) => {
        if (active) return css`border-color: ${radioTheme.radioColor || theme.primarySwatch};background: ${radioTheme.radioColor || theme.primarySwatch};`
    }}
`

interface IRadioCoreCircleProps {
    radioTheme: RadioThemeData
    status: boolean
}

const RadioCoreCircle = styled.div<IRadioCoreCircleProps>`
    background: ${({ radioTheme, theme }) => radioTheme.radioColor || theme.primarySwatch};
    border-radius: 50%;
    width: ${({ radioTheme }) => getRatioUnit(radioTheme.size - 8)};
    height: ${({ radioTheme }) => getRatioUnit(radioTheme.size - 8)};
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
    font-size: ${({ radioTheme }) => getRatioUnit(radioTheme.fontSize)};
    vertical-align: middle;
    ${transition(0.5)};
    ${({ type }) => {
        if (type !== 'btn') return css`  margin-left: ${getRatioUnit(5)};`
    }};
     ${({ radioTheme, type, active, theme }) => {
        if (type !== 'btn') return css`color: ${radioTheme.color.toString()};`
        if (type === 'btn' && active) return css`color: ${radioTheme.radioColor || theme.primarySwatch};`
    }};
    line-height: ${({ radioTheme }) => getRatioUnit(radioTheme.size)};
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

    public UNSAFE_componentWillReceiveProps(nextProps: IRadioProps) {
        const { checked } = this.state
        if (isBoolean(nextProps.checked) && checked !== nextProps.checked) {
            this.setState({
                status: nextProps.checked,
                checked: nextProps.checked
            })
        }
    }

    public state = {
        status: false,
        checked: false
    }

    public render(): JSX.Element {
        const { className, children, checked, type, style, icon, theme, iconStyle } = this.props
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
                                    <div className="flex_justify">
                                        <RadioSquare
                                            theme={value.theme}
                                            radioTheme={theme || value.theme.radioTheme}
                                            active={isBoolean(checked) ? checked : status}
                                            className="flex_justify"
                                            style={iconStyle}
                                        >
                                            {
                                                (isBoolean(checked) ? checked : status) ?
                                                    <Icon
                                                        icon={icon || 'md-checkmark'}
                                                        theme={theme ? theme.iconTheme : value.theme.radioTheme.iconTheme}
                                                    />
                                                    : null
                                            }
                                        </RadioSquare>
                                    </div>
                                ) : null}
                                {
                                    type === 'circular' ? (
                                        <div className="flex_justify">
                                            <RadioCore
                                                active={isBoolean(checked) ? checked : status}
                                                radioTheme={theme || value.theme.radioTheme}
                                                theme={value.theme}
                                                style={iconStyle}
                                            >
                                                <div className="flex_center" style={{ width: '100%', height: '100%' }}>
                                                    <RadioCoreCircle
                                                        radioTheme={theme || value.theme.radioTheme}
                                                        theme={value.theme}
                                                        status={status}
                                                    />
                                                </div>
                                            </RadioCore>
                                        </div>
                                    ) : null
                                }
                                <RadioLabel
                                    className="flex_justify"
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
