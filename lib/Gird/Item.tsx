import * as React from 'react'
import { withRouter } from 'react-router-dom'
import Item, { IProps } from '../Item'
import { getClassName } from '../utils'
import { omit } from 'muka'

class GirdItem extends React.Component<IProps, any> {

    public render(): JSX.Element {
        const { className } = this.props
        const otherProps: any = omit(this.props, ['className'])
        return (
            <Item className={getClassName('gird_item', className)} {...otherProps} />
        )
    }
}
export default withRouter(GirdItem)