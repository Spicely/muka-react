import * as React from 'react'
import { getClassName } from '../utils'
import Button from '../Button'
import Icon from '../Icon'
import { isFunc, isNumber } from 'muka'

interface IProps {
    className?: string
    value?: number
    min?: number
    max?: number
    onChange?: (val?: number) => void
}

export default class InputNumber extends React.Component<IProps, any> {

    public state = {
        val: 0
    }

    public render(): JSX.Element {
        const { className, value } = this.props
        const { val } = this.state
        return (
            <div className={getClassName('input_number', className)} >
                <Button className="btn"><Icon onClick={this.handleReduce} /></Button>
                <input type="number" onChange={this.handleChange} value={isNumber(value) ? value : val} />
                <Button className="btn" onClick={this.handlePlus}><Icon /></Button>
            </div>
        )
    }

    private handleChange = (e: any) => {
        this.setState({
            val: e.target.value
        })
    }

    private handleReduce = () => {
        const { value, onChange, min } = this.props
        if (isNumber(value)) {
            if (isFunc(onChange)) {
                const val = value - 1
                if (isNumber(min)) {
                    onChange(val < min ? min : val)
                } else {
                    onChange(val)
                }
            }
        } else {
            const { val } = this.state
            const stateVal = val - 1
            if (isNumber(min)) {
                this.setState({
                    val: stateVal < min ? min : stateVal
                })
            } else {
                this.setState({
                    val: stateVal
                })
            }
        }
    }

    private handlePlus = () => {
        const { value, onChange, max } = this.props
        if (isNumber(value)) {
            if (isFunc(onChange)) {
                const val = value + 1
                if (max) {
                    onChange(val > max ? max : val)
                } else {
                    onChange(val)
                }
            }
        } else {
            const { val } = this.state
            const stateVal = val + 1
            if (isNumber(max)) {
                this.setState({
                    val: stateVal > max ? max : stateVal
                })
            } else {
                this.setState({
                    val: stateVal
                })
            }
        }
    }
}