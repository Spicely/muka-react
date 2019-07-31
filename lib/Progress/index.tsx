import React, { Component } from 'react'
import { getClassName } from '../utils'

export interface IProgressProps {
    className?: string
    percent: number
    successPercent?: number
    text?: string | JSX.Element
    percentColor?: string
    successPercentColor?: string
}

const prefixClass = 'progress'

export default class Progress extends Component<IProgressProps, any> {

    public static defaultProps: IProgressProps = {
        percent: 0,
        successPercentColor: '#52c41a'
    }

    public render(): JSX.Element {
        const { className, percent, successPercent, text, successPercentColor, percentColor } = this.props
        let val = percent > 100 ? 100 : percent < 0 ? 0 : percent
        let succerss = (successPercent || 0) > 100 ? 100 : (successPercent || 0) < 0 ? 0 : (successPercent || 0)
        return (
            <div className={getClassName(`${prefixClass} flex`, className)}>
                <div className="flex_1 flex_justify">
                    <div className={getClassName(`${prefixClass}_inter`)}>
                        <div className={getClassName(`${prefixClass}_inter__bg`)} style={{ width: `${val}%`, background: val !== 100 ? percentColor : successPercentColor }} />
                        <div className={getClassName(`${prefixClass}_inter_success__bg`)} style={{ width: `${succerss}%`, background: successPercentColor }} />
                    </div>
                </div>
                {
                    text && (
                        <div className={getClassName(`${prefixClass}__text`)}>
                            {text}
                        </div>
                    )
                }
            </div>
        )
    }
}
