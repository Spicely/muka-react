import React, { Component, CSSProperties, Children } from 'react'
import { isNumber, isFunction, isNil, isObject } from 'lodash'
import styled, { css } from 'styled-components'
import { Consumer } from '../ThemeProvider'
import Image from '../Image'
import { getClassName, CarouselThemeData, getUnit, transition, getRatioUnit, Color, IValue } from '../utils'

export interface ICarouselValueProps {
    url: string
    link?: string
}

type IDotPos = 'top' | 'bottom' | 'left' | 'right' | 'bottomRight' | 'bottomLeft'

type IDotType = 'rectangle' | 'circular'

interface ICarouselViewProps {
    carouselTheme: CarouselThemeData
}

const CarouselView = styled.div<ICarouselViewProps>`
    height: ${({ carouselTheme }) => getUnit(carouselTheme.height)};
    ${({ carouselTheme }) => {
        if (!isNil(carouselTheme.width)) {
            return css` width: ${getUnit(carouselTheme.width)};`
        }
    }}
    position: relative;
    overflow: hidden;
`
interface ICarouselViewItemProps {
    fade: boolean
}
const CarouselViewItem = styled.div<ICarouselViewItemProps>`
    height: 100%;
    width: 100%;
    overflow: hidden;
    flex-shrink: 0;
    ${transition(0.3)};
    ${({ fade }) => {
        if (fade) return css`position: absolute;top: 0;left: 0;`
    }}
`

const CarouselViewItemImg = styled(Image)`
    width: 100%;
`

interface ICarouselDotProps {
    dotPosition?: IDotPos
}

const CarouselDot = styled.div<ICarouselDotProps>`
    position: absolute;
    ${transition(0.3)};
    ${({ dotPosition }) => {
        switch (dotPosition) {
            case 'bottomLeft': return css`top: calc(100% - ${getRatioUnit(20)});left: ${getRatioUnit(20)};height: ${getRatioUnit(20)};`
            case 'bottomRight': return css`top: calc(100% - ${getRatioUnit(20)});left: calc(100% - ${getRatioUnit(20)});height: ${getRatioUnit(20)};transform: translate(-100%, 0);`
            case 'top': return css`width: 100%;top: 0;left: 0;height: ${getRatioUnit(20)};`
            case 'left': return css`width: ${getRatioUnit(20)};top: 0;left: 0;height: 100%;`
            case 'right': return css`width: ${getRatioUnit(20)};top: 0;left: calc(100% - ${getRatioUnit(20)});height: 100%;`
            default: return css`width: 100%; top: calc(100% - ${getRatioUnit(20)});left: 0;height: ${getRatioUnit(20)};`
        }
    }}
`

interface ICarouselDotItemProps {
    carouselTheme: CarouselThemeData
    dotType?: IDotType
    dotPos?: IDotPos
    dotColor?: Color
    active: boolean
}

const CarouselDotItem = styled.div<ICarouselDotItemProps>`
    cursor: pointer;
    ${transition(0.3)};
    ${({ dotPos }) => {
        if (dotPos === 'left' || dotPos === 'right') {
            return css`margin-bottom: ${getRatioUnit(5)};`
        } else {
            return css`margin-right: ${getRatioUnit(5)};`
        }
    }}
    ${({ dotType, carouselTheme, theme, dotPos }) => {
        if (dotType === 'circular') return css`height: ${getRatioUnit(carouselTheme.dotSize)};width: ${getUnit(carouselTheme.dotSize)}; border-radius: 50%;`
        if (dotType === 'rectangle') {
            if (dotPos === 'left' || dotPos === 'right') {
                return css`height: ${getUnit(carouselTheme.dotSize)};width: ${getRatioUnit(carouselTheme.dotSize / 2)};border-radius: ${getRatioUnit(carouselTheme.dotBorderRadius || theme.borderRadius)};`
            } else {
                return css`height: ${getUnit(carouselTheme.dotSize / 2)};width: ${getRatioUnit(carouselTheme.dotSize)};border-radius: ${getRatioUnit(carouselTheme.dotBorderRadius || theme.borderRadius)};`
            }
        }
    }}
    ${({ active, carouselTheme, theme, dotColor }) => {
        if (active) return css`background: ${dotColor || carouselTheme.dotColor || theme.primarySwatch};`
        else return css`background: ${Color.setOpacity(dotColor || carouselTheme.dotColor || theme.primarySwatch, 0.6).toString()};`
    }}
    ${({ active, dotType, carouselTheme, dotPos }) => {
        if (active && dotType === 'rectangle') {
            if (dotPos === 'left' || dotPos === 'right') {
                return css`height: ${getRatioUnit(carouselTheme.dotSize * 1.5)};`
            } else {
                return css`width: ${getRatioUnit(carouselTheme.dotSize * 1.5)};`
            }
        }
    }}
    &:last-child {
        margin-right: 0;
    }
`

export interface ICarouselProps {
    className?: string
    dotPosition?: IDotPos
    dotType?: IDotType
    dotColor?: Color
    dotClassName?: string
    value: ICarouselValueProps[]
    dots?: boolean
    autoplay?: boolean
    defaultSelected?: number
    style?: CSSProperties
    time?: number
    onChnage?: (selected: number) => void
    effect?: 'scrollx' | 'scrolly' | 'fade'
    baseUrl?: string
    selected?: number
    theme?: CarouselThemeData
}

interface IState {
    selectIndex: number
    left: number
    top: number
    animate: boolean
}

const prefixClass = 'carousel'

export default class Carousel extends Component<ICarouselProps, IState> {

    constructor(props: ICarouselProps) {
        super(props)
        if (isNumber(props.defaultSelected)) {
            this.state.selectIndex = props.selected || props.defaultSelected
        }
    }

    public static defaultProps: ICarouselProps = {
        dotPosition: 'bottom',
        dotType: 'rectangle',
        dots: true,
        time: 2000,
        value: [],
        autoplay: false,
        effect: 'scrollx',
        baseUrl: ''
    }

    public state: IState = {
        selectIndex: 0,
        top: 0,
        left: 0,
        animate: true
    }

    private carouselNode: Element | null = null

    private timer?: any

    private animateNode: Element | null = null

    public render(): JSX.Element {
        const { className, dotPosition, dotClassName, dots, effect, style, autoplay, value, dotType, dotColor, baseUrl, theme, children } = this.props
        const { selectIndex, left, top, animate } = this.state
        const cssStyle: CSSProperties = {}
        const dotStyle: CSSProperties = {}
        if (dotColor) {
            dotStyle.background = dotColor.toString()
        }
        if (effect === 'scrollx') {
            cssStyle.transform = `translate3d(-${selectIndex * left}px, 0, 0)`
            cssStyle.transition = animate ? '' : 'none'
        } else if (effect === 'scrolly') {
            cssStyle.transform = `translate3d(0, -${selectIndex * top}px, 0)`
            cssStyle.transition = animate ? '' : 'none'
        }
        const childs = children || value
        return (
            <Consumer>
                {
                    (init) => (
                        <CarouselView
                            className={getClassName(`${prefixClass}${effect === 'scrollx' ? ' flex' : ''}`, className)}
                            style={style}
                            carouselTheme={theme || init.theme.carouselTheme}
                            ref={(e) => this.carouselNode = e}
                        >
                            {
                                Children.map(childs, (child?: IValue, index?: any) => {
                                    return (
                                        <CarouselViewItem
                                            className="flex_center"
                                            fade={effect === 'fade'}
                                            style={{
                                                ...cssStyle,
                                                opacity: effect === 'fade' ? index === selectIndex ? 1 : 0 : 1
                                            }}
                                            ref={this.domAddEvent.bind(this, index)}
                                            key={index}
                                        >
                                            {
                                                isObject(child) ? child._owner ? child : <CarouselViewItemImg src={baseUrl + child.url} /> : child
                                            }
                                        </CarouselViewItem>
                                    )
                                })
                            }
                            {autoplay && effect !== 'fade' && Children.map(childs, (child?: IValue, index?: any) => {
                                if (index === 0) {
                                    return (
                                        <CarouselViewItem
                                            className="flex_center"
                                            fade={false}
                                            style={cssStyle}
                                            key={`extend_${index}`}
                                            ref={(e) => this.animateNode = e}
                                        >
                                            {
                                                isObject(child) ? child._owner ? child : <CarouselViewItemImg src={baseUrl + child.url} /> : child
                                            }
                                        </CarouselViewItem>
                                    )
                                }
                                return undefined
                            })
                            }
                            {
                                dots && (
                                    <CarouselDot
                                        dotPosition={dotPosition}
                                        className="flex_justify"
                                    >
                                        <div className="flex_center">
                                            <span className={(dotPosition === 'bottom' || dotPosition === 'top' || dotPosition === 'bottomRight' || dotPosition === 'bottomLeft') ? 'flex' : ''}>
                                                {
                                                    Children.map(childs, (child, index) => {
                                                        return (
                                                            <CarouselDotItem
                                                                carouselTheme={theme || init.theme.carouselTheme}
                                                                dotType={dotType}
                                                                dotPos={dotPosition}
                                                                dotColor={dotColor}
                                                                active={selectIndex % (value.length || Children.count(children)) === index}
                                                                className={dotClassName}
                                                                key={index}
                                                                onClick={this.handleTabIndex.bind(this, index)}
                                                            />
                                                        )
                                                    })
                                                }
                                            </span>
                                        </div>
                                    </CarouselDot>
                                )
                            }
                        </CarouselView>
                    )
                }
            </Consumer>

        )
    }

    public componentDidMount() {
        const { autoplay } = this.props
        if (this.carouselNode) {
            const obj = this.carouselNode.getBoundingClientRect()
            this.setState({
                top: obj.height,
                left: obj.width
            })
        }
        if (this.animateNode) {
            this.animateNode.addEventListener('transitionend', this.handleAnimate)
        }
        this.interval(autoplay || false)
    }

    private domAddEvent = (index: number, animateNode: HTMLDivElement) => {
        if (index === 0 && animateNode) {
            animateNode.removeEventListener('transitionend', this.handleAnimate)
            animateNode.addEventListener('transitionend', this.handleAnimate)
        }
    }

    public UNSAFE_componentWillReceiveProps(nextProps: ICarouselProps) {
        const { autoplay, selected, time } = this.props
        if (autoplay !== nextProps.autoplay) {
            if (nextProps.autoplay && !this.timer) {
                this.interval(true)
            } else {
                clearInterval(this.timer)
                this.timer = undefined
            }
        }
        if (nextProps.autoplay && time !== nextProps.time) {
            clearInterval(this.timer)
            this.interval(true)
        }
        if (isNumber(nextProps.selected) && selected !== nextProps.selected) {
            clearInterval(this.timer)
            this.setState({
                selectIndex: nextProps.selected || 0
            }, () => {
                this.interval(nextProps.autoplay || false)
            })
        }
    }

    public componentWillUnmount() {
        clearInterval(this.timer)
        if (this.animateNode) {
            this.animateNode.removeEventListener('transitionend', this.handleAnimate)
        }
        this.timer = undefined
    }

    private interval(autoPlay: boolean) {
        const { time, effect, children } = this.props
        if (autoPlay) {
            this.timer = setInterval(() => {
                const { value } = this.props
                const { selectIndex } = this.state
                const length = (value.length || Children.count(children))
                const status = effect !== 'fade' ? selectIndex === length : selectIndex === length - 1
                this.handleTabIndex(status ? 0 : selectIndex + 1)
            }, time)
        }
    }

    private handleAnimate = () => {
        const { effect, value, children } = this.props
        const { selectIndex } = this.state
        if (selectIndex === (value.length || Children.count(children)) && effect !== 'fade') {
            this.setState({
                selectIndex: 0,
                animate: false
            }, () => {
                setTimeout(() => {
                    this.setState({
                        animate: true
                    })
                }, 20)
            })
        }
    }

    private handleTabIndex(index: number) {
        const { onChnage, value, children } = this.props
        this.setState({
            selectIndex: index
        })
        if (isFunction(onChnage)) {
            onChnage(index % (value.length || Children.count(children)))
        }
    }
}
