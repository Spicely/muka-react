import React, { CSSProperties, Component } from 'react'
import { isFunction, isBool, isUndefined } from 'muka'
import RadioGroup from './Group'
import { getClassName, prefix } from '../utils'
import Icon from '../Icon'

export type IRadioType = 'square' | 'button' | 'circular'

export interface IRadioProps {
    className?: string
    defaultChecked?: boolean
    checked?: boolean
    onChange?: (val: boolean) => void
    type?: IRadioType
    style?: CSSProperties
    children?: string | JSX.Element
}

interface IState {
    status: boolean
}

const prefixClass = 'radio'

export default class Radio extends Component<IRadioProps, IState> {

    constructor(props: IRadioProps) {
        super(props)
        this.state.status = props.checked || props.defaultChecked || false
    }

    public static Group = RadioGroup

    public state = {
        status: false
    }

    public render(): JSX.Element {
        const { className, children, checked, type, style } = this.props
        const { status } = this.state
        return (
            <div
                className={getClassName(`${prefixClass} ${(isBool(checked) ? checked : status) ? prefix + 'active' : ''} ${type ? prefix + type : ''}`, className)}
                style={style}
                onClick={this.handleClick}
            >
                <div className="flex">
                    {(type === 'square' || type === 'circular') && (
                        <div className={getClassName(`${prefixClass}_btn`)}>
                            {(isBool(checked) ? checked : status) && <Icon className="icon" icon="md-checkmark" fontSize="0.8rem" />}
                        </div>
                    )}
                    {
                        isUndefined(type) && (
                            <div className={getClassName(`${prefixClass}_core`)}>
                                <div className="flex_center" style={{ width: '100%', height: '100%' }}>
                                    <div className={getClassName(`${prefixClass}_core_circle ${status ? prefix + prefixClass + '_show' : prefix + prefixClass + '_hide'}`)} />
                                </div>
                            </div>
                        )
                    }
                    <span className={getClassName(`${prefixClass}_label`)}>
                        {children}
                    </span>
                </div>
            </div>
        )
    }

    public componentWillReceiveProps(nextProps: IRadioProps) {
        const { checked } = this.props
        if (isBool(nextProps.checked) && checked !== nextProps.checked) {
            this.setState({
                status: nextProps.checked
            })
        }
    }

    private handleClick = () => {
        const { checked, onChange } = this.props
        const { status } = this.state
        if ((isBool(checked) && checked) || status) return
        if (isFunction(onChange)) {
            onChange(isBool(checked) ? !checked : !status)
        }
        this.setState({
            status: isBool(checked) ? !checked : !status
        })
    }
}
