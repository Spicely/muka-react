import * as React from 'react'
import { isFunc, isBool } from 'muka'
import { getClassName } from '../utils'
import Icon from '../Icon'

interface IProps {
    className?: string
    checked?: boolean
    onChange?: (val?: boolean) => void
    type?: 'square'
}

interface IState {
    status: boolean
}

export default class Cart extends React.Component<IProps, IState> {

    public state = {
        status: false
    }

    public render(): JSX.Element {
        const { className, children, checked, type } = this.props
        const { status } = this.state
        return (
            <div className={getClassName(`radio flex`, className)} onClick={this.handleClick}>
                <div className={`circular${(isBool(checked) ? checked : status) ? ' active' : ''} ${type}`}>
                    {(isBool(checked) ? checked : status) && <Icon />}
                </div>
                <span className="label">
                    {children}
                </span>
            </div>
        )
    }

    private handleClick = () => {
        const { checked, onChange } = this.props
        const { status } = this.state
        if (isFunc(onChange)) {
            onChange(isBool(checked) ? !checked : !status)
        }
        this.setState({
            status: isBool(checked) ? !checked : !status
        })
    }
}