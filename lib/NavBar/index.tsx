import React, { Component, CSSProperties } from 'react'
import styled, { css } from 'styled-components'
import { isArray, isNumber, isNull, isFunction, isString } from 'lodash'
import { Consumer } from '../ThemeProvider'
import { IStyledProps, NavBarThemeData, getUnit, getRatioUnit, getClassName } from '../utils'
import Icon, { iconType } from '../Icon'
import Image from '../Image'

export interface INavBarRightIcon {
    type: 'icon'
    url: iconType
    link?: string
    color?: string
    onClick?: () => void
}

export interface INavBarRightImage {
    type: 'image'
    url: string
    link?: string
    onClick?: () => void
}

export interface INavBarProps {
    className?: string
    leftClassName?: string
    titleClassName?: string
    rightClassName?: string
    titleCenter?: boolean
    style?: CSSProperties
    left?: string | JSX.Element | null
    title?: string | JSX.Element
    right?: string | JSX.Element | null | INavBarRightImage[] | INavBarRightIcon[]
    fixed?: boolean
    endVal?: number
    divider?: boolean
    animate?: boolean
    onBack?: (() => void) | null
    theme?: NavBarThemeData
    onRightClick?: () => void
}

interface IStyleProps extends IStyledProps {
    fixed?: boolean
    navBarTheme: NavBarThemeData
}
const Nav = styled.div<IStyleProps>`
    background: ${({ navBarTheme, theme }) => navBarTheme.navBarColor || theme.primarySwatch};
    height: ${({ navBarTheme }) => getUnit(navBarTheme.height)};
    width: ${({ navBarTheme }) => getUnit(navBarTheme.width)};
    padding: 0 ${() => getRatioUnit(14)};
    box-sizing: border-box;
    z-index: 8;
    ${({ fixed }) => {
        if (fixed) return css`position: sticky; top: 0;`
    }}
`

const NavLeft = styled.div<IStyledProps>`
    padding-right: ${() => getRatioUnit(10)};
    min-width: ${() => getRatioUnit(28)};
`

const NavTitle = styled.div<IStyledProps>`
    font-size: ${() => getRatioUnit(14)};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const NavRight = styled.div<IStyledProps>`
    padding-left: ${() => getRatioUnit(10)};
    min-width: ${() => getRatioUnit(28)};

    &__img {
        width: ${() => getRatioUnit(22)};
        height: ${() => getRatioUnit(22)};
    }

    &__item {
        display: inline-block;
        margin-right: ${() => getRatioUnit(5)};

        &:last-child {
            margin-right: 0;
        }
    }
`

const NavImg = styled(Image) <IStyledProps>`
    width: ${() => getRatioUnit(22)};
    height: ${() => getRatioUnit(22)};
`
const NavItem = styled.div<IStyledProps>`
    display: inline-block;
    margin-right: ${() => getRatioUnit(5)};

    &:last-child {
        margin-right: 0;
    }
`

export default class NavBar extends Component<INavBarProps, any> {

    public static defaultProps: INavBarProps = {
        divider: true
    }

    public render(): JSX.Element {
        const { className, left, divider, title, right, fixed, leftClassName, titleCenter, titleClassName, rightClassName, style, onRightClick, children, theme } = this.props
        const c: any = right
        let rightValue: any = []
        return (
            <Consumer>
                {
                    (value) => {
                        if (isArray(c)) {
                            rightValue = c.map((item: INavBarRightIcon | INavBarRightImage, index: number) => {
                                if (item.type === 'icon') {
                                    return (
                                        <NavItem theme={value.theme} key={index}>
                                            <Icon
                                                icon={item.url}
                                                color={item.color}
                                                onClick={this.handleClick.bind(this, item.link, item.onClick)}
                                                theme={theme ? theme.rightIconTheme : value.theme.navBarTheme.rightIconTheme}
                                            />
                                        </NavItem>

                                    )
                                } else if (item.type === 'image') {
                                    return (
                                        <NavItem theme={value.theme} key={index}>
                                            <NavImg
                                                theme={value.theme}
                                                src={item.url}
                                                onClick={this.handleClick.bind(this, item.link, item.onClick)}
                                            />
                                        </NavItem>
                                    )
                                }
                                return null
                            })
                        } else {
                            rightValue = right
                        }
                        return (
                            <Nav
                                className={`${divider ? ' mk_divider' : ''} flex_justify ${className || ''}`}
                                style={style}
                                fixed={fixed}
                                navBarTheme={theme || value.theme.navBarTheme}
                                theme={value.theme}
                            >
                                <div className="flex">
                                    {
                                        <NavLeft
                                            className={`flex_justify ${leftClassName || ''}`}
                                            onClick={this.handleBack}
                                        >
                                            {left ? left : !isNull(left) ? <Icon
                                                icon="ios-arrow-back"
                                                theme={theme ? theme.iconTheme : value.theme.navBarTheme.iconTheme}
                                            /> : null}
                                        </NavLeft>
                                    }
                                    <NavTitle
                                        className={getClassName(`flex_1 ${titleCenter ? 'flex_center' : 'flex_justify'}`, titleClassName)}
                                    >
                                        {title || children}
                                    </NavTitle>
                                    {
                                        !isNull(rightValue) && (
                                            <NavRight
                                                className={getClassName(`flex${isString(rightValue) ? ' flex_justify' : ''}`, rightClassName)}
                                                onClick={onRightClick}
                                            >
                                                {rightValue}
                                            </NavRight>
                                        )
                                    }
                                </div>
                            </Nav>
                        )
                    }
                }
            </Consumer>

        )
    }

    public componentDidMount() {
        const { fixed, animate } = this.props
        if (fixed && animate) {
            window.addEventListener('scroll', this.handleScroll)
        }
    }

    private handleScroll = () => {
        const { endVal } = this.props
        const top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
        if (isNumber(endVal)) {
            console.log(top)
        }
    }

    private handleClick = (link?: string, onClick?: () => boolean | void) => {
        let status = true
        if (isFunction(onClick)) {
            status = onClick() || false
        }
        if (status && link) {
            // Router.push(link)
        }
    }

    private handleBack = () => {
        const { onBack } = this.props
        if (isFunction(onBack)) {
            onBack()
        } else if (isNull(onBack)) {
            return
        } else {
            // Router.back()
        }
    }
}
