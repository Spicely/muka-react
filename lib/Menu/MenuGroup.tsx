import React, { Component, Fragment } from 'react'
import { isString } from 'lodash'
import { Tooltip } from 'antd'
import { Consumer as ThemeConsumer } from '../ThemeProvider'
import styled from 'styled-components'
import { MenuItem } from './MenuItem'
import { Consumer, IProvider } from './index'
import { getClassName, transition, getUnit, MenuThemeData, IconThemeData } from '../utils'
import Icon, { iconType } from '../Icon'
import Color from '../utils/Color'

export interface IMenuGroup {
    className?: string
    icon?: JSX.Element | iconType
    title?: string | JSX.Element
    field?: string | number
    iconHighlight?: string
    iconInitColor?: string
}

interface IStylePorps {
    menuTheme: MenuThemeData
}

const Group = styled.div<IStylePorps>`
    min-height: ${({ menuTheme }) => getUnit(menuTheme.itemHeight)};
    line-height: ${({ menuTheme }) => getUnit(menuTheme.itemHeight)};
    color: ${({ menuTheme, theme }) => Color.setOpacity(menuTheme.color || theme.fontColor, 0.7).toString()};
    position: relative;
    cursor: pointer;
`

const GroupBox = styled.li<IStylePorps>`
    min-height: ${({ menuTheme }) => getUnit(menuTheme.itemHeight)};
`


const GroupIcon = styled.div`
   padding: ${getUnit(6)};
`

const GroupLabel = styled.div`
    white-space: nowrap;
`

const GroupContent = styled.li<IStylePorps & { number: number }>`
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    ${transition(0.5)};

    &.active {
        max-height: ${({ number, menuTheme }) => getUnit(number * menuTheme.itemHeight)};
        opacity: 1;
    }
`
const iconTheme = new IconThemeData({
    size: 13
})

export class MenuGroup extends Component<IMenuGroup, any> {
    public static defaultProps = {
        iconHighlight: '#FFFFFF',
        iconInitColor: '#A8AdAF'
    }

    public state = {
        visible: false
    }

    private selected: boolean = false

    private status: boolean = true

    public render(): JSX.Element {
        const { children, className, title, icon, field, iconHighlight, iconInitColor } = this.props
        const { visible } = this.state
        return (
            <ThemeConsumer>
                {
                    (value) => (
                        <Consumer>
                            {
                                (val: IProvider) => {
                                    const node = React.Children.map(children, (item: any, index: number) => {
                                        if (item.type === MenuItem) {
                                            const fieldProps = item.props.field
                                            if (fieldProps === val.field && this.status) {
                                                this.selected = true
                                            }
                                            return React.cloneElement(item, { field: fieldProps ? fieldProps : `${field}-${index}` })
                                        }
                                        return item
                                    })
                                    const nodeView = (child: JSX.Element) => {
                                        if (val.collapsed) {
                                            return (
                                                <Tooltip title={title} placement="right">
                                                    {child}
                                                </Tooltip>
                                            )
                                        } else {
                                            return (
                                                <Fragment>
                                                    {child}
                                                </Fragment>
                                            )
                                        }
                                    }
                                    const jsxNode = (
                                        <Group
                                            className={className}
                                            menuTheme={value.theme.menuTheme}
                                        >
                                            <ul className={getClassName('menu_group_title', className)}>
                                                <GroupBox
                                                    className="flex"
                                                    onClick={this.handleShowBox}
                                                    menuTheme={value.theme.menuTheme}
                                                >
                                                    <GroupIcon className="flex_justify">
                                                        {
                                                            (!val.collapsed && React.Children.count(children) && val.arrowIconPos === 'left') ?
                                                                (
                                                                    <div className="flex_justify" style={{ transform: (this.selected || visible) ? 'rotate(0deg)' : 'rotate(-90deg)', transition: '0.5s all' }}>
                                                                        <Icon
                                                                            icon={val.arrowIcon}
                                                                            theme={iconTheme}
                                                                        />
                                                                    </div>
                                                                ) : null
                                                        }
                                                        {(isString(icon) && val.arrowIconPos === 'right') ? <Icon icon={icon} color={val.field === field ? iconHighlight : iconInitColor} /> : icon}
                                                    </GroupIcon>
                                                    {!val.collapsed ? <GroupLabel className="flex_1">{title}</GroupLabel> : null}
                                                    {
                                                        (!val.collapsed && React.Children.count(children) && val.arrowIconPos === 'right') ?
                                                            (
                                                                <div className="flex_justify" style={{ transform: (this.selected || visible) ? 'rotate(0deg)' : 'rotate(-90deg)', transition: '0.5s all' }}>
                                                                    <Icon
                                                                        icon={val.arrowIcon}
                                                                        theme={iconTheme}
                                                                    />
                                                                </div>
                                                            ) : null
                                                    }
                                                </GroupBox>
                                                {
                                                    !val.collapsed ? (
                                                        <GroupContent
                                                            className={getClassName('flex_1', (this.selected || visible) ? 'active' : '')}
                                                            menuTheme={value.theme.menuTheme}
                                                            number={React.Children.count(children)}
                                                        >
                                                            <ul>
                                                                {node}
                                                            </ul>
                                                        </GroupContent>
                                                    ) : null
                                                }
                                            </ul>
                                        </Group>
                                    )
                                    return nodeView(jsxNode)
                                }
                            }
                        </Consumer>
                    )
                }
            </ThemeConsumer>
        )
    }

    private handleShowBox = () => {
        this.selected = !this.selected
        this.status = false
        this.setState({
            visible: this.selected
        })
    }
}
