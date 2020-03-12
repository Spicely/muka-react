import React, { Component, CSSProperties } from 'react'
import { isFunction } from 'lodash'
import styled, { css } from 'styled-components'
import { Consumer } from '../ThemeProvider'
import { getClassName, prefix, GridThemeData, getUnit } from '../utils'
import Image from '../Image'

export interface IGridDataProps {
    url: string
    label?: string
    link?: string
}

export interface IGridProps {
    className?: string
    data: IGridDataProps[]
    columnNum?: number
    mode?: 'square' | 'rect'
    border?: boolean
    onChange?: (data: IGridDataProps) => void
    theme?: GridThemeData
    style?: CSSProperties
}

interface IStyleProps {
    gridTheme: GridThemeData
}

interface IStyleNext extends IStyleProps {
    mode?: 'square' | 'rect'
}

const GridView = styled.div<IStyleProps>`
    width: ${({ gridTheme }) => getUnit(gridTheme.width)};
    white-space: pre-line;
    background: ${({ gridTheme }) => gridTheme.gridColor.toString()};
`

const GridList = styled.div`
    :last-child::after {
        content: none;
    }
`

const GridItem = styled.div<IStyleNext>`
    flex-shrink: 0;
    height: ${({ gridTheme }) => getUnit(gridTheme.itemHeight)};
    cursor: pointer;
    ${({ mode, gridTheme }) => {
        if (mode === 'square') {
            return css`
                display: flex;
                padding: 0;
            `
        } else {
            return css`
                ${gridTheme.itemPadding.toString()};
            `
        }
    }};    
`

const GridImg = styled(Image)<IStyleNext>`
    ${({ mode, gridTheme }) => {
        if (mode === 'square') {
            return css`
                display: inline-block;
                margin: 0;
                margin-top: ${getUnit(5)};
                margin-left:  ${getUnit(15)};
                width: ${getUnit(gridTheme.imgWidth)};
                height: ${getUnit(gridTheme.imgHeight)};
            `
        } else {
            return css`
                display: block;
                margin: 0 auto;
                height: ${getUnit(gridTheme.imgHeight)};
                width: ${getUnit(gridTheme.imgWidth)};
            `
        }
    }};
`

const GridLabel = styled.div<IStyleNext>`
    ${({ mode, gridTheme }) => {
        if (mode === 'square') {
            return css`
                display: inline-block;
                margin: 0;
                margin-top: ${getUnit(5)};
                margin-left:  ${getUnit(15)};
                width: ${getUnit(gridTheme.imgWidth)};
                height: ${getUnit(gridTheme.imgHeight)};
            `
        } else {
            return css`
                text-align: center;
                padding: 0 ${getUnit(10)};
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: ${getUnit(gridTheme.fontSize)};
                margin-top: ${getUnit(10)};
            `
        }
    }};   
`

export default class Grid extends Component<IGridProps, any> {

    public static defaultProps: IGridProps = {
        columnNum: 4,
        data: [],
        mode: 'rect'
    }

    public render(): JSX.Element {
        const { className, data, columnNum, border, theme, style } = this.props
        const lineNum = Math.ceil(data.length / (columnNum || 4))
        return (
            <Consumer>
                {
                    (init) => (
                        <GridView
                            className={className}
                            gridTheme={theme || init.theme.gridTheme}
                            style={style}
                        >
                            {
                                Array.from({ length: lineNum }, (v, k) => {
                                    return (
                                        <GridList
                                            className={getClassName(`flex ${border ? prefix + 'divider' : ''}`)}
                                            key={`grid_list_${k}`}
                                        >
                                            {this.renderList(k, theme || init.theme.gridTheme)}
                                        </GridList>
                                    )
                                })
                            }
                        </GridView>
                    )
                }
            </Consumer>

        )
    }

    private renderList(k: number, theme: GridThemeData) {
        const { data, columnNum, border, mode } = this.props
        const val: JSX.Element[] = []
        for (let i = k * (columnNum || 4); i < (k + 1) * (columnNum || 4); i++) {
            if (data[i]) {
                val.push(
                    <GridItem
                        gridTheme={theme}
                        className={getClassName(`${prefix}${mode} ${(border && (i + 1) / ((k + 1) * (columnNum || 4)) !== 1) ? prefix + 'divider_right' : ''}`)}
                        mode={mode}
                        style={{ width: 100 / (columnNum || 4) + '%' }}
                        onClick={this.handleChange.bind(this, data[i])}
                        key={`grid_list_ietm_${k}_${i}`}
                    >
                        <GridImg mode={mode} gridTheme={theme} src={data[i].url} />
                        {data[i].label && <GridLabel mode={mode} gridTheme={theme}>{data[i].label}</GridLabel>}
                    </GridItem>
                )
            }
        }
        return val
    }

    private handleChange = (data: IGridDataProps) => {
        const { onChange } = this.props
        if (isFunction(onChange)) {
            onChange(data)
        }
    }
}
