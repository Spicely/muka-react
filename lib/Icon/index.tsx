import React, { Component, MouseEvent, CSSProperties, HtmlHTMLAttributes } from 'react'
import styled, { keyframes } from 'styled-components'
import { Consumer } from '../ThemeProvider'
import { omit } from 'lodash'
import { IStyledProps, transition, IconThemeData, ThemeData } from '../utils'

export type iconType = 'logo-google' | 'ios-refresh' | 'md-refresh' | 'ios-document' | 'md-document' | 'md-more' | 'md-arrow-down' | 'ios-image' | 'ios-more' | 'ios-paper-plane' | 'ios-arrow-forward' | 'md-close-circle' | 'ios-arrow-down' | 'md-thumbs-up' | 'md-thumbs-down' | 'ios-home' | 'md-home' | 'ios-arrow-dropdown' | 'md-arrow-dropdown' | 'md-volume-mute' | 'ios-volume-high' | 'menu-open' | 'menu-close' | 'ios-close-circle-outline' | 'ios-close' | 'md-close' | 'md-checkmark' | 'ios-checkmark' | 'md-add' | 'ios-add' | 'loading' | 'ios-menu' | 'ios-settings' | 'md-settings' | 'ios-keypad' | 'md-create' | 'ios-arrow-back' | 'md-arrow-back' | 'md-search' | 'ios-search' | 'md-exit' | 'ios-exit' | 'shop' | 'double-arrow-left' | 'double-arrow-right' | 'shopping' | 'md-person' | 'ios-person' | 'shop-setting' | 'md-gift' | 'ios-gift' | 'purse' | 'md-trending-up' | 'ios-trending-up' | 'small-routine' | 'md-apps' | 'ios-apps' | 'md-remove' | 'ios-remove' | 'md-close-circle-outline' | 'md-expand' | 'ios-expand' | 'md-contract' | 'ios-contract' | 'msg' | 'file-box' | 'notifice' | 'md-lock' | 'ios-lock' | 'md-folder' | 'ios-folder' | 'security' | 'ios-filing' | 'md-filing' | 'md-alarm' | 'ios-alarm' | 'md-help' | 'ios-help' | 'md-help-circle' | 'ios-help-circle' | 'md-help-circle-outline' | 'ios-help-circle-outline'

export interface IIconProps extends HtmlHTMLAttributes<any> {
    icon?: iconType
    style?: CSSProperties
    className?: string
    rotate?: boolean
    shake?: boolean
    beat?: boolean
    onClick?: (event: MouseEvent<any>) => void
    theme?: IconThemeData
}

interface IState {
    path: string
    icon: iconType | undefined
    viewBox: string
}

const paths: any = {
    'md-search': import('./md/search').then((data) => data.default),
    'ios-search': import('./ios/search').then((data) => data.default),
    'md-home': import('./md/home').then((data) => data.default),
    'ios-home': import('./ios/home').then((data) => data.default),
    'md-exit': import('./md/exit').then((data) => data.default),
    'ios-exit': import('./ios/exit').then((data) => data.default),
    'md-arrow-down': import('./md/arrow-down').then((data) => data.default),
    'ios-arrow-down': import('./ios/arrow-down').then((data) => data.default),
    'md-contract': import('./md/contract').then((data) => data.default),
    'ios-contract': import('./ios/contract').then((data) => data.default),
    'md-person': import('./md/person').then((data) => data.default),
    'ios-person': import('./ios/person').then((data) => data.default),
    'md-document': import('./md/document').then((data) => data.default),
    'ios-document': import('./ios/document').then((data) => data.default),
    'md-expand': import('./md/expand').then((data) => data.default),
    'ios-expand': import('./ios/expand').then((data) => data.default),
    'md-filing': import('./md/filing').then((data) => data.default),
    'ios-filing': import('./ios/filing').then((data) => data.default),
    'md-trending-up': import('./md/trending-up').then((data) => data.default),
    'ios-trending-up': import('./ios/trending-up').then((data) => data.default),
    'md-gift': import('./md/gift').then((data) => data.default),
    'ios-gift': import('./ios/gift').then((data) => data.default),
    'md-close': import('./md/close').then((data) => data.default),
    'ios-close': import('./ios/close').then((data) => data.default),
    'md-arrow-back': import('./md/arrow-back').then((data) => data.default),
    'ios-arrow-back': import('./ios/arrow-back').then((data) => data.default),
    'md-apps': import('./md/apps').then((data) => data.default),
    'ios-apps': import('./ios/apps').then((data) => data.default),
    'md-add': import('./md/add').then((data) => data.default),
    'ios-add': import('./ios/add').then((data) => data.default),
    'md-remove': import('./md/remove').then((data) => data.default),
    'ios-remove': import('./ios/remove').then((data) => data.default),
    'md-more': import('./md/more').then((data) => data.default),
    'ios-more': import('./ios/more').then((data) => data.default),
    'md-arrow-forward': import('./md/arrow-forward').then((data) => data.default),
    'ios-arrow-forward': import('./ios/arrow-forward').then((data) => data.default),
    'md-checkmark': import('./md/checkmark').then((data) => data.default),
    'ios-checkmark': import('./ios/checkmark').then((data) => data.default),
    'md-folder': import('./md/folder').then((data) => data.default),
    'ios-folder': import('./ios/folder').then((data) => data.default),
    'md-close-circle-outline': import('./md/close-circle-outline').then((data) => data.default),
    'ios-close-circle-outline': import('./ios/close-circle-outline').then((data) => data.default),
    'md-close-circle': import('./md/close-circle').then((data) => data.default),
    'ios-close-circle': import('./ios/close-circle').then((data) => data.default),
    'md-settings': import('./md/settings').then((data) => data.default),
    'ios-settings': import('./ios/settings').then((data) => data.default),
    'md-create': import('./md/create').then((data) => data.default),
    'ios-keypad': import('./ios/keypad').then((data) => data.default),
    'md-lock': import('./md/lock').then((data) => data.default),
    'ios-lock': import('./ios/lock').then((data) => data.default),
    'ios-menu': import('./ios/menu').then((data) => data.default),
    'md-volume-mute': import('./md/volume-mute').then((data) => data.default),
    'ios-volume-high': import('./ios/volume-high').then((data) => data.default),
    'md-alarm': import('./md/alarm').then((data) => data.default),
    'ios-alarm': import('./ios/alarm').then((data) => data.default),
    'md-arrow-dropdown': import('./md/arrow-dropdown').then((data) => data.default),
    'ios-arrow-dropdown': import('./ios/arrow-dropdown').then((data) => data.default),
    'md-thumbs-down': import('./md/thumbs-down').then((data) => data.default),
    'md-help': import('./md/help').then((data) => data.default),
    'ios-help': import('./ios/help').then((data) => data.default),
    'md-help-circle': import('./md/help-circle').then((data) => data.default),
    'ios-help-circle': import('./ios/help-circle').then((data) => data.default),
    'md-help-circle-outline': import('./md/help-circle-outline').then((data) => data.default),
    'ios-help-circle-outline': import('./ios/help-circle-outline').then((data) => data.default),
    'md-thumbs-up': import('./md/thumbs-up').then((data) => data.default),
    'md-refresh': import('./md/refresh').then((data) => data.default),
    'ios-paper-plane': import('./ios/paper-plane').then((data) => data.default),
    'ios-image': import('./ios/image').then((data) => data.default),
    'menu-open': import('./global/menu-open').then((data) => data.default),
    'menu-close': import('./global/menu-close').then((data) => data.default),
    'shop': import('./global/shop').then((data) => data.default),
    'shopping': import('./global/shopping').then((data) => data.default),
    'shop-setting': import('./global/shop-setting').then((data) => data.default),
    'purse': import('./global/purse').then((data) => data.default),
    'small-routine': import('./global/small-routine').then((data) => data.default),
    'double-arrow-left': import('./global/double-arrow-left').then((data) => data.default),
    'double-arrow-right': import('./global/double-arrow-right').then((data) => data.default),
    'msg': import('./global/msg').then((data) => data.default),
    'file-box': import('./global/file-box').then((data) => data.default),
    'notifice': import('./global/notifice').then((data) => data.default),
    'loading': import('./global/loading').then((data) => data.default),
    'security': import('./global/security').then((data) => data.default),
}

const beat = keyframes`
    0% {
        transform: scale(.75);
    }

    20% {
        transform: scale(1);
    }

    40% {
        transform: scale(.75);
    }

    60% {
        transform: scale(1);
    }

    80% {
        transform: scale(.75);
    }

    100% {
        transform: scale(.75);
    }
`
const rotate = keyframes`
    100% {
        transform: rotate(360deg)
    }
`

const shake = keyframes`
    10%,
    90% {
        transform: translate3d(${ -1 * ThemeData.ratio + ThemeData.unit}, 0, 0);
    }

    20%,
    80% {
        transform: translate3d(${2 * ThemeData.ratio + ThemeData.unit}, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: translate3d(${-4 * ThemeData.ratio + ThemeData.unit}, 0, 0);
    }

    40%,
    60% {
        transform: translate3d(${4 * ThemeData.ratio + ThemeData.unit}, 0, 0);
    }
`

interface IsrtleProps extends IStyledProps {
    iconTheme: IconThemeData
}
const Svg = styled.svg<IsrtleProps>`
    display: inline-block;
    color: inherit;
    fill: ${({ iconTheme }) => iconTheme.color.toString()};
    font-style: normal;
    line-height: 0;
    font-size:${({ iconTheme }) => iconTheme.size * ThemeData.ratio + ThemeData.unit};
    width: ${({ iconTheme }) => iconTheme.size * ThemeData.ratio + ThemeData.unit};
    height: ${({ iconTheme }) => iconTheme.size * ThemeData.ratio + ThemeData.unit};
    text-align: center;
    text-transform: none;
    vertical-align: ${() => -3 * ThemeData.ratio + ThemeData.unit};
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    
    ${transition(0.5)};

    &.beat,
    &.shake,
    &.rotate {
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }

    &.beat {
        animation-name: ${beat};
        animation-duration: 0.82s;
    }

    &.shake {
        animation-name: ${props => shake};
        animation-duration: 0.82s;
    }

    &.rotate {
        animation-name: ${rotate};
        animation-duration: 2s;
    }
`

export default class Icon extends Component<IIconProps, IState> {

    public static defaultProps: IIconProps = {
        shake: false,
        beat: false,
        rotate: false,
    }

    private status: boolean = true

    constructor(props: IIconProps) {
        super(props)
        this.state.icon = props.icon
    }
    public state: IState = {
        icon: undefined,
        path: '',
        viewBox: '0 0 512 512',
    }

    public componentDidMount() {
        const { icon } = this.props
        this.getPathByIconName(icon)
    }

    public componentWillUnmount() {
        this.status = false
    }

    public UNSAFE_componentWillReceiveProps(nextProps: IIconProps) {
        const { icon } = this.props
        if (icon !== nextProps.icon) {
            this.getPathByIconName(nextProps.icon)
        }
    }

    public render() {
        const { className, color, onClick, rotate, shake, beat, style, theme } = this.props
        const props = omit(this.props, ['className', 'color', 'fontSize', 'onClick', 'rotate', 'shake', 'beat', 'style', 'viewBox'])
        const { path, viewBox } = this.state
        return (
            <Consumer>
                {
                    (value) => (
                        <Svg
                            {...props}
                            style={style}
                            className={`${shake ? ' shake' : ''}${beat ? ' beat' : ''}${rotate ? ' rotate' : ''} ${className || ''}`}
                            fill={color}
                            theme={value.theme}
                            iconTheme={theme || value.theme.iconTheme}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox={viewBox}
                            onClick={onClick}
                            rotate={rotate ? 1 : 0}
                        >
                            <path d={path} />
                        </Svg>
                    )
                }
            </Consumer>

        )
    }

    private getPathByIconName = async (icon?: iconType) => {
        if (icon && paths[icon]) {
            const data = await paths[icon]
            if (this.status) {
                this.setState({
                    path: data.path.join(' '),
                    viewBox: data.viewBox
                })
            }
        }
    }
}
