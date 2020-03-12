import React, { Component, Fragment, MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

interface IProps {
    visible: boolean
    onClose: (status: boolean) => void
}

let globalNode: Element | null

const ColorMask = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
`

export default class Mask extends Component<IProps, any> {

    constructor(props: IProps) {
        super(props)
        if (typeof document !== 'undefined') {
            globalNode = document.querySelector('.mask_box')
            if (globalNode) {
                this.node = globalNode
            } else {
                const dom = document.createElement('div')
                dom.className = 'mask_box'
                const body = document.querySelector('body')
                if (body) {
                    body.appendChild(dom)
                }
                this.node = dom
                globalNode = dom
            }
        }
    }

    private node: Element | null = null

    private boxNode: Element | null = null

    public render(): JSX.Element {
        const { children, visible } = this.props
        if (this.node) {
            return createPortal(
                <ColorMask
                    style={{ display: !visible ? 'none' : '' }}
                    ref={(e) => this.boxNode = e}
                    onClick={this.handleClick}
                >
                    {children}
                </ColorMask>
                , this.node
            )
        }
        return <Fragment />
    }

    private handleClick = (e: MouseEvent<HTMLDivElement>) => {
        const { onClose } = this.props
        if (e.target !== this.boxNode) {
            return
        }
        onClose(false)
    }
}
