import React, { CSSProperties, createContext, Component } from 'react'
import { isFunction } from 'lodash'
import styled, { css } from 'styled-components'
import { MenuGroup } from './MenuGroup'
import { MenuItem } from './MenuItem'
import { Consumer as ThemeConsumer } from '../ThemeProvider'
import { transition, IStyledProps, MenuThemeData, getUnit } from '../utils'
import { iconType } from '../Icon'
import Color from '../utils/Color'
export * from './MenuGroup'
export * from './MenuItem'

export interface IMenuProps {
    className?: string
    style?: CSSProperties
    collapsed?: boolean
    arrowIcon?: iconType
    arrowIconPos?: 'right' | 'left'
    defaultSelected?: number | string
    selected?: number | string
    onChange?: (index: number | string) => void
    fieldToUrl?: boolean
    arrowIconColor?: string
    fontColor?: Color
    theme?: MenuThemeData
}

interface IState {
    field: number | string
}

export interface IProvider extends IState {
    onPress: (index: number | string) => void
    collapsed: boolean
    fieldToUrl: boolean
    arrowIcon?: iconType
    arrowIconColor?: string
    arrowIconPos?: 'right' | 'left'
    fontColor?: Color
    theme: MenuThemeData
}

const defaultValue: IProvider = {
    field: '',
    onPress: (index: number | string) => { return },
    collapsed: false,
    fieldToUrl: false,
    fontColor: undefined,
    theme: new MenuThemeData()
}

export const { Consumer, Provider } = createContext(defaultValue)

interface IStylePorps extends IStyledProps {
    collapsed?: boolean
    menuTheme: MenuThemeData
}

const Ul = styled.ul<IStylePorps>`
    background-color: ${({ menuTheme }) => menuTheme.menuColor.toString()};
    width: ${({ menuTheme }) => getUnit(menuTheme.width)};
    height: ${({ menuTheme }) => getUnit(menuTheme.height)};
    overflow: hidden;
    ${transition(0.2)};
    margin: 0;
    ${({ collapsed }) => {
        if (collapsed) return css`width: ${getUnit(52)};`
    }}
`

export default class Menu extends Component<IMenuProps, IState> {

    public static Group = MenuGroup

    public static Item = MenuItem

    constructor(props: IMenuProps) {
        super(props)
        this.state.field = props.defaultSelected === undefined ? '' : props.defaultSelected
    }

    public state: IState = {
        field: ''
    }

    public render(): JSX.Element {
        const { className, children, style, theme, collapsed, fieldToUrl, arrowIcon, arrowIconColor, arrowIconPos, fontColor, selected } = this.props
        const { field } = this.state
        return (
            <ThemeConsumer>
                {
                    (value) => (
                        <Ul
                            className={className}
                            collapsed={collapsed}
                            style={style}
                            menuTheme={theme || value.theme.menuTheme}
                        >
                            <Provider
                                value={{
                                    field: selected || field,
                                    onPress: this.handlePress,
                                    collapsed: collapsed || false,
                                    fieldToUrl: fieldToUrl || false,
                                    arrowIcon: arrowIcon || 'ios-arrow-down',
                                    arrowIconColor: arrowIconColor || '#333',
                                    arrowIconPos: arrowIconPos || 'right',
                                    fontColor,
                                    theme: theme || value.theme.menuTheme
                                }}
                            >
                                {
                                    React.Children.map(children, (item: any, index: number) => {
                                        if (item.type === MenuItem || item.type === MenuGroup) {
                                            const field = item.props.field
                                            return React.cloneElement(item, { field: field ? field : index })
                                        }
                                        return item
                                    })
                                }
                            </Provider>
                        </Ul>
                    )
                }
            </ThemeConsumer>

        )
    }

    private handlePress = (field: number | string) => {
        const { onChange } = this.props
        this.setState({ field }, () => { if (isFunction(onChange)) { onChange(field) } })
    }
}
