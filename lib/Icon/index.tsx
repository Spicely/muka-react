import * as React from 'react'
import icons from './icons'
import { getClassName } from '../utils'

interface IProps extends React.HtmlHTMLAttributes<any> {
    icon?: 'logo-google' | 'ios-refresh' | 'md-refresh' | 'ios-document' | 'md-document' | 'md-refresh' | 'md-more' | 'md-arrow-down' | 'ios-image' | 'ios-more' | 'ios-arrow-back-outline'| 'ios-paper-plane' | 'ios-arrow-down-outline' | 'ios-arrow-forward' | 'input_close_icon' | 'input_close_icon' | 'md-close-circle' | 'ios-arrow-down' | 'md-thumbs-up' | 'md-thumbs-down'
    fontSize?: string
    color?: string
    style?: React.CSSProperties
    className?: string
    rotate?: boolean
    shake?: boolean
    beat?: boolean
    onClick?: () => void
}

export default class Icon extends React.Component<IProps, any> {

    public static defaultProps = {
        // style
        style: {},
        color: '#000000',
        fontSize: '22px',

        // animation
        shake: false,
        beat: false,
        rotate: false,
    }

    public state = {
        classNames: [],
        animationActive: false
    }

    public render() {
        const { className, color, fontSize, onClick, rotate, shake, beat, style } = this.props
        const styles = {
            ...style,
            color: this.props.color,
            fontSize: this.props.fontSize,
        }
        return (
            <svg
                style={styles}
                className={getClassName(`icon${shake ? ' shake' : ''}${beat ? ' beat' : ''}${rotate ? ' rotate' : ''}`, className)}
                fill={color}
                width={fontSize}
                height={fontSize}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                onClick={onClick}
                rotate={rotate ? 1 : 0}
            >
                <path d={this.getPathByIconName()} />
            </svg>
        )
    }

    private getPathByIconName = () => {
        let icon = icons.find((item: { tags: any[] }) => item.tags[0] === this.props.icon)
        if (icon) {
            return icon.paths.join(' ')
        }
        return ''
    }
}