import React, { Component } from 'react'
import { Spin as ASpin } from 'antd'
import { SpinProps } from 'antd/lib/spin'
import styled from 'styled-components'

const SpinStyle = styled(ASpin)`
`

export default class Spin extends Component<SpinProps> {

    public render(): JSX.Element {
        return (
            <SpinStyle
                {...this.props}
            />
        )
    }

}