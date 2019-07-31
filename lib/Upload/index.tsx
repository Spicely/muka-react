import React, { Component } from 'react'
import { getClassName } from '../utils'
import { Consumer } from '../ConfigProvider'
import Dragger from './dragger'

export interface IUploadProps {
    className?: string
}

interface IState { }

const prefixClass = 'upload'
export default class Upload extends Component<IUploadProps, IState> {

    public static Dragger = Dragger

    public render(): JSX.Element {
        const { className, children } = this.props
        return (
            <Consumer>
                {
                    (value) => {
                        return (
                            <div className={getClassName(`${prefixClass}`, className)}></div>
                        )
                    }
                }
            </Consumer>

        )
    }
}