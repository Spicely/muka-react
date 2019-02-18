import * as React from 'react'
import { getClassName } from '../utils'

interface IProps {
    className?: string
    source?: string
}

export default class Card extends React.Component<IProps, any> {
    public render(): JSX.Element {
        const { className, source, children } = this.props
        return (
            <div className={getClassName('card', className)}>
                {source && <img src={source} />}
                <div className={getClassName('card_info')}>
                    {children}
                </div>
            </ div>
        )
    }
}