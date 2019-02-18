import * as React from 'react'
import Item from './Item'
import Input from './Input'
import { getClassName } from '../utils'

interface IProps {
    className?: string
    style?: React.CSSProperties
}

export default class Gird extends React.Component<IProps, any> {

    public static Item = Item

    public static Input = Input

    public render(): JSX.Element {
        const { className, style } = this.props
        const { children } = this.props
        return (
            <div className={`${getClassName('gird', className)}`} style={style}>
                {children}
            </div>
        )
    }
}