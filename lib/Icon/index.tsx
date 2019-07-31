import React, { Component, MouseEvent, CSSProperties, HtmlHTMLAttributes } from 'react'
import { getClassName } from '../utils'
import { omit } from 'muka'

export type iconType = 'logo-google' | 'ios-refresh' | 'md-refresh' | 'ios-document' | 'md-document' | 'md-more' | 'md-arrow-down' | 'ios-image' | 'ios-more' | 'ios-paper-plane' | 'ios-arrow-forward' | 'md-close-circle' | 'ios-arrow-down' | 'md-thumbs-up' | 'md-thumbs-down' | 'ios-home' | 'md-home' | 'ios-arrow-dropdown' | 'md-arrow-dropdown' | 'custom-service' | 'md-volume-mute' | 'ios-volume-high' | 'menu-open' | 'menu-close' | 'ios-close-circle-outline' | 'ios-close' | 'md-close' | 'md-checkmark' | 'ios-checkmark' | 'md-add' | 'ios-add' | 'loading' | 'ios-menu' | 'ios-settings' | 'ios-settings-outline' | 'md-settings' | 'ios-keypad' | 'ios-arrow-back-outline' | 'md-create' | 'ios-arrow-back' | 'md-arrow-back' | 'md-search' | 'ios-search' | 'ios-search-outline' | 'md-exit' | 'ios-exit' | 'shop' | 'double-arrow-left' | 'double-arrow-right' | 'shopping' | 'md-person' | 'ios-person' | 'shop-setting' | 'md-gift' | 'ios-gift' | 'purse' | 'md-trending-up' | 'ios-trending-up' | 'small-routine' | 'md-apps' | 'ios-apps' | 'md-remove' | 'ios-remove' | 'md-close-circle-outline' | 'ios-close-circle-outline' | 'md-expand' | 'ios-expand' | 'md-contract' | 'ios-contract' | 'msg' | 'file_box'

export interface IIconProps extends HtmlHTMLAttributes<any> {
    icon?: iconType
    fontSize?: string
    color?: string
    style?: React.CSSProperties
    className?: string
    rotate?: boolean
    shake?: boolean
    beat?: boolean
    onClick?: (event: MouseEvent<any>) => void
}

interface IState {
    path: string
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
    'md-close-circle-outline': import('./md/close-circle-outline').then((data) => data.default),
    'ios-close-circle-outline': import('./ios/close-circle-outline').then((data) => data.default),
    'md-close-circle': import('./md/close-circle').then((data) => data.default),
    'ios-close-circle': import('./ios/close-circle').then((data) => data.default),
    'md-settings': import('./md/settings').then((data) => data.default),
    'ios-settings': import('./ios/settings').then((data) => data.default),
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
    'file_box': import('./global/file_box').then((data) => data.default),
}

export default class Icon extends Component<IIconProps, IState> {

    public static defaultProps: IIconProps = {
        style: {},
        color: '#000000',
        fontSize: '22px',
        shake: false,
        beat: false,
        rotate: false,
    }

    public state: IState = {
        path: '',
        viewBox: '0 0 512 512',
    }

    public componentDidMount() {
        const { icon } = this.props
        this.getPathByIconName(icon)
    }

    public componentWillReceiveProps(nextProps: IIconProps) {
        const { icon } = this.props
        if (icon !== nextProps.icon) {
            this.getPathByIconName(nextProps.icon)
        }
    }

    public render() {
        const { className, color, fontSize, onClick, rotate, shake, beat, style } = this.props
        const props = omit(this.props, ['className', 'color', 'fontSize', 'onClick', 'rotate', 'shake', 'beat', 'style', 'viewBox'])
        const { path, viewBox } = this.state
        const styles: CSSProperties = {
            ...style,
            fill: color,
            fontSize,
        }
        return (
            <i className={getClassName('icon')}>
                <svg
                    {...props}
                    style={styles}
                    className={getClassName(`icon${shake ? ' shake' : ''}${beat ? ' beat' : ''}${rotate ? ' rotate' : ''}`, className)}
                    fill={color}
                    width={fontSize}
                    height={fontSize}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={viewBox}
                    onClick={onClick}
                    rotate={rotate ? 1 : 0}
                >
                    <path d={path} />
                </svg>
            </i>
        )
    }

    private getPathByIconName = (icon?: iconType) => {
        if (icon && paths[icon]) {
            paths[icon].then((data: { path: string[], viewBox: string }) => {
                this.setState({
                    path: data.path.join(' '),
                    viewBox: data.viewBox
                })
            })
        }
    }
}
