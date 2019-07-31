import React, { Component, ChangeEvent } from 'react'
import { omit, isUndefined, isString, isBool, isFunction } from 'muka'
import Input, { IInputProps } from './index'
import { getClassName } from '../utils'
import Button from '../Button'
import Icon from '../Icon'

export interface IInputSearchProps extends IInputProps {
    className?: string
    enterButton?: boolean | string
    onSearch?: (value: string, event: ChangeEvent<HTMLButtonElement>) => void
}

interface IState {
    value: string
}

const prefixClass = 'input_search'

export default class InputSearch extends Component<IInputSearchProps, IState> {

    public static defaultProps: IInputSearchProps = {
        closeIconShow: false
    }

    public state: IState = {
        value: ''
    }

    public render(): JSX.Element {
        const { className } = this.props
        const props = omit(this.props, ['className', 'extend', 'enterButton', 'onChange'])
        return (
            <Input {...props} className={getClassName(`${prefixClass}`, className)} onChange={this.handleInputChange} extend={this.getExtendNode()} />
        )
    }

    private getExtendNode(): JSX.Element | undefined {
        const { enterButton, disabled } = this.props
        if (isBool(enterButton) && !enterButton) {
            return undefined
        }
        if (isUndefined(enterButton) || isString(enterButton)) {
            return (
                <Button disabled={disabled} onChange={this.handleSearchChange} className={getClassName(`${prefixClass}_btn`)} mold="primary">
                    {isString(enterButton) ? enterButton : <Icon icon="md-search" color="#fff" />}
                </Button>
            )
        }
        return undefined
    }

    private handleInputChange = (event: ChangeEvent<HTMLButtonElement>) => {
        const { onChange } = this.props
        this.setState({
            value: event.target.value
        })
        if (isFunction(onChange)) {
            onChange(event)
        }
    }

    private handleSearchChange = (event: ChangeEvent<HTMLButtonElement>) => {
        const { onSearch } = this.props
        const { value } = this.state
        if (isFunction(onSearch)) {
            onSearch(value, event)
        }
    }
}
