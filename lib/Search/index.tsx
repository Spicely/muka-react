import * as React from 'react'
import { omit } from 'muka'
import Icon from '../Icon'
import { getClassName } from '../utils'

interface IProps extends React.InputHTMLAttributes<any> {
    className?: string
    style?: React.CSSProperties
    placeholder?: string
    onPress?: (e?: React.MouseEvent<HTMLDivElement>) => void
    iconPos?: 'left' | 'right'
}

export default class Search extends React.Component<IProps, any> {

    public static defaultProps = {
        iconPos: 'right'
    }

    public render(): JSX.Element {
        const { className, style, onPress, iconPos } = this.props
        const otherProps = omit(this.props, ['className', 'style', 'onPress', 'iconPos'])
        return (
            <div
                className={getClassName('search flex', className)}
                style={style}
                onClick={onPress}
            >
                <input className={`flex_1 ${iconPos}`} {...otherProps} />
                <Icon />
                {/* <img src={require('../../assets/search.png')} /> */}
            </div>
        )
    }

}