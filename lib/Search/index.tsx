import * as React from 'react'
import { getClassName } from '../utils'

interface IProps {
    className?: string
    style?: React.CSSProperties
    placeholder?: string
}

export default class Search extends React.Component<IProps, any> {

    public render(): JSX.Element {
        const { className, placeholder, style } = this.props
        return (
            <div 
                className={getClassName('search', className)}
                style={style}
            >
                <input placeholder={placeholder} />
                <img src={require('../../assets/search.png')}/>
            </div>
        )
    }

}