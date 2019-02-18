import * as React from 'react'
import Item from '../Item'
import Input, { IProps as IInputProps } from '../Input'
import { getClassName } from '../utils'
import { omit } from 'muka'

interface IGirdInput extends IInputProps {
    title?: string
}
export default class GirdInput extends React.Component<IGirdInput, any> {

    public render(): JSX.Element {
        const { className, title } = this.props
        const otherProps = omit(this.props, ['className', 'title'])
        return (
            <Item className={getClassName('gird_input', className)} title={title || ''} value={<Input {...otherProps} />} />
        )
    }
}