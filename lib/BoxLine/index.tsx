import React, { PureComponent } from 'react'
import styled from 'styled-components'
import {  getRatioUnit } from '../utils'

export interface IBoxLineProps {
    className?: string
}

const BoxLineView = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(${getRatioUnit(70)}, 1fr));
    grid-auto-rows: minmax(${getRatioUnit(70)}, auto);
    grid-gap: .5em;
    padding-bottom: ${getRatioUnit(10)};
`

export default class BoxLine extends PureComponent<IBoxLineProps, any> {
    public render(): JSX.Element {
        const { children, className } = this.props
        return (
            <BoxLineView className={className}>
                {children}
            </BoxLineView>
        )
    }
}
