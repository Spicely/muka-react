import * as React from 'react'
import { isFunction, isNumber } from 'lodash'
import { getClassName, prefix, IconThemeData } from '../utils'
import Button from '../Button'
import Icon, { iconType } from '../Icon'

export interface IInputNumberProps {
    className?: string
    border?: boolean
    value?: number
    min?: number
    max?: number
    addIcon?: iconType
    removeIcon?: iconType
    onChange?: (val: number) => void
}

const prefixClass = 'input_number'

export default class InputNumber extends React.Component<IInputNumberProps, any> {

    public static defaultProps: IInputNumberProps = {
        border: true,
        addIcon: 'md-add',
        removeIcon: 'md-remove'
    }

    public state = {
        val: 0
    }

    public render(): JSX.Element {
        const { className, value, border, addIcon, removeIcon } = this.props
        const { val } = this.state
        return (
            <div className={getClassName(`${prefixClass}${border ? ' ' + prefix + 'border' : ''} flex`, className)} >
                <Button className={getClassName(`${prefixClass}_btn`)} onClick={this.handleReduce}><Icon icon={removeIcon} theme={new IconThemeData({size: 12})} /></Button>
                <input type="number" onChange={this.handleChange} value={isNumber(value) ? value : val} />
                <Button className={getClassName(`${prefixClass}_btn`)} onClick={this.handlePlus}><Icon icon={addIcon} theme={new IconThemeData({size: 12})} /></Button>
            </div>
        )
    }

    private handleChange = (e: any) => {
        const { onChange, min, max } = this.props
        let val = Number(e.target.value)
        if (isNumber(min) && isNumber(max)) {
            val = val > max ? max : val < min ? min : val
        }
        if (isNumber(min) && !isNumber(max)) {
            val = val < min ? min : val
        }
        if (!isNumber(min) && isNumber(max)) {
            val = val > max ? max : val
        }
        this.setState({
            val
        })
        if (isFunction(onChange)) {
            onChange(val)
        }
        return

    }

    private handleReduce = () => {
        const { value, onChange, min } = this.props
        if (isNumber(value)) {
            if (isFunction(onChange)) {
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
            if (isFunction(onChange)) {
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
