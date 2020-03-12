import React, { Component } from 'react'
import styled, { css, CSSProperties } from 'styled-components'
import { getUnit } from '../utils'

type IType = 'horizontal' | 'vertical'

type IBorderType = 'solid' | 'dashed'

export interface IDividerProps {
    className?: string
    width?: string
    height?: string
    color?: string
    type?: IType
    style?: CSSProperties
    borderType?: IBorderType
}

interface IDiviProps {
    vColor?: string
    vType?: IType
    vWidth?: string | number
    vHeight?: string | number
    borderType: IBorderType
}

const Divi = styled.div<IDiviProps>`
    ${({ vType, vWidth, vHeight, vColor, theme, borderType }) => {
        if (vType === 'horizontal') {
            return css`
                width: ${getUnit(vWidth, '100%')};
                height: ${getUnit(vHeight, 1)};
                border-bottom: ${getUnit(vHeight, 1)} ${borderType} ${vColor || theme.dividerColor};
                `
        } else {
            return css`
                width: ${getUnit(vWidth, 1)};
                height: ${getUnit(vHeight, '100%')};
                border-left: ${getUnit(vWidth, 1)} ${borderType} ${vColor || theme.dividerColor};
            `
        }
    }}
`

export default class Divider extends Component<IDividerProps, any> {

    public static defaultProps: IDividerProps = {
        type: 'vertical'
    }

    public render(): JSX.Element {
        const { className, width, height, color, type, borderType, style } = this.props
        return (
            <Divi
                className={className}
                vType={type}
                borderType={borderType || 'solid'}
                vWidth={width}
                vHeight={height}
                vColor={color}
                style={style}
            />
        )
    }
}
