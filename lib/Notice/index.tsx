import React, { Component, CSSProperties } from 'react'
import Link from 'next/link'
import { getClassName, prefix } from '../utils'
import Image from '../Image'

export interface INoticeProps {
    className?: string
    logo?: string
    title?: string | JSX.Element
    label: string | JSX.Element
    style?: CSSProperties
    link?: string
}

// tslint:disable-next-line: no-empty-interface
interface IState {

}

const prefixClass = 'notice'

export default class Notice extends Component<INoticeProps, IState> {

    public render(): JSX.Element {
        const { className, logo, title, label, style, link } = this.props
        return (
            <Link href={link || ''}>
                <div className={getClassName(`${prefixClass} flex`, className)} style={style}>
                    {logo && (
                        <div className={getClassName(`${prefixClass}_logo ${prefix}divider_right`)}>
                            <Image className={getClassName(`${prefixClass}_logo__img`)} src={logo} />
                        </div>
                    )}

                    <div className={getClassName(`${prefixClass}_view flex_1`)}>
                        {title && <div className={getClassName(`${prefixClass}_view_title`)}>{title}</div>}
                        <div className={getClassName(`${prefixClass}_view_label ${title ? prefix + 'text__hide' : ''}`)}>{label}</div>
                    </div>
                </div>
            </Link>
        )
    }
}
