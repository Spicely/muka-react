import * as React from 'react'
import { isBool, isFunc } from 'muka'
import { getClassName } from '../utils'

interface IProps {
    className?: string
    checked?: boolean
    onChange?: (status?: boolean) => void
}

export default class Switch extends React.Component<IProps, any> {
    public state = {
        active: false
    }

    public render(): JSX.Element {
        const { className, checked } = this.props
        const { active } = this.state
        return (
            <div className={getClassName(`switch${(isBool(checked) ? checked : active) ? ' active' : ''}`, className)} onClick={this.handleActive} />
        )
    }

    private handleActive = () => {
        const { checked, onChange } = this.props
        const { active } = this.state
        this.setState({
            active: isBool(checked) ? !checked : !active
        })
        if (isFunc(onChange)) {
            onChange(isBool(checked) ? !checked : !active)
        }
    }
}