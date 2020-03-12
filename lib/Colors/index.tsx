import React, { Component, ChangeEvent, MouseEvent, CSSProperties } from 'react'
import { SketchPicker, ChromePicker, BlockPicker, GithubPicker, TwitterPicker, HuePicker, AlphaPicker, CirclePicker, SliderPicker, CompactPicker, MaterialPicker, SwatchesPicker, ColorResult } from 'react-color'
import styled from 'styled-components'
import { isFunction } from 'lodash'
import Mask from './mask'
import { Consumer } from '../ThemeProvider'
import { getClassName, ColorsThemeData, getUnit, getRatioUnit } from '../utils'

export type colorsType = 'sketch' | 'chrome' | 'block' | 'github' | 'twitter' | 'hue' | 'alpha' | 'circle' | 'slider' | 'compact' | 'material' | 'swatches'

export interface IColorsProps {
    className?: string
    type?: colorsType
    initColor?: string
    style?: CSSProperties
    onChange?: (color: ColorResult, event: ChangeEvent) => void
    theme?: ColorsThemeData
    [name: string]: any
}

interface IState {
    color: string
    visible: boolean
    top: number,
    left: number
}

interface IColorViewProps {
    colorsTheme: ColorsThemeData
}

const ColorView = styled.div<IColorViewProps>`
    position: relative;
    height: ${({ colorsTheme }) => getUnit(colorsTheme.height)};
    border-radius: ${({ colorsTheme, theme }) => getRatioUnit(colorsTheme.borderRadius || theme.borderRadius)};
`

const ColorViewBox = styled.div<IColorViewProps>`
    width: ${() => getRatioUnit(80)};
    height: ${({ colorsTheme }) => getUnit(colorsTheme.height)};
    padding: ${() => getRatioUnit(1)};
    background: ${({ colorsTheme }) => colorsTheme.colorsColor.toString()};
    box-shadow: rgba(0, 0, 0, 0.1) 0 0 0 ${() => getRatioUnit(1)};
    cursor: pointer;
`

const ColorBoxEv = styled.div`
    width: 100%;
    height: 100%;
`

const ColorLabel = styled.div`
    margin-left: ${getRatioUnit(8)};
    font-size: ${getRatioUnit(14)};
`

const ColorSelect = styled.div`
    position: absolute;
    top: ${getRatioUnit(40)};
    .sketch {
        height: ${getRatioUnit(300)};
    }

    .chrome {
        height: ${getRatioUnit(240)};
    }

    .block {
        height: ${getRatioUnit(220)};
    }

    .github {
        height: ${getRatioUnit(60)};
    }
`

export default class Colors extends Component<IColorsProps, IState> {

    constructor(props: IColorsProps) {
        super(props)
        if (props.initColor) {
            this.state.color = props.initColor
        }
    }

    public static defaultProps: IColorsProps = {
        type: 'chrome'
    }

    public state: IState = {
        color: '#0693e3',
        visible: false,
        left: 0,
        top: 0
    }

    private colorNode: Element | null = null

    public render(): JSX.Element {
        const { className, style, theme } = this.props
        const { color, visible, left, top } = this.state
        return (
            <Consumer>
                {
                    (init) => (
                        <ColorView
                            className={getClassName('flex_justify', className)}
                            colorsTheme={theme || init.theme.colorsTheme}
                            style={style}
                        >
                            <div className="flex">
                                <ColorViewBox
                                    ref={(e) => this.colorNode = e}
                                    colorsTheme={theme || init.theme.colorsTheme}
                                    onClick={this.handleClick}
                                >
                                    <ColorBoxEv style={{ background: color }} />
                                </ColorViewBox>
                                <ColorLabel className="flex_justify">{color}</ColorLabel>
                            </div>
                            <Mask visible={visible} onClose={this.handleClose}>
                                <ColorSelect
                                    style={{ left, top }}
                                >
                                    {this.getColorNode()}
                                </ColorSelect>
                            </Mask>
                        </ColorView>
                    )
                }
            </Consumer>
        )

    }

    private handleClick = (e: MouseEvent<HTMLDivElement>) => {
        let left = 0
        let top = 0
        if (this.colorNode) {
            const obj = this.colorNode.getBoundingClientRect()
            left = obj.left
            top = obj.top + obj.height + 10
        }

        this.setState({
            visible: true,
            left,
            top
        })
    }

    private handleClose = (status: boolean) => {
        this.setState({
            visible: status
        })
    }

    private getColorNode() {
        const { width, height, type } = this.props
        const { color } = this.state
        const props: any = {
            className: type,
            width,
            height,
            onChange: this.handleChange,
            color
        }
        switch (type) {
            case 'github': if (!width) props.width = 212; break;
            case 'twitter': if (!height) props.width = 212; break;
        }
        switch (type) {
            case 'swatches': return <SwatchesPicker {...props} />
            case 'material': return <MaterialPicker {...props} />
            case 'compact': return <CompactPicker {...props} />
            case 'slider': return <SliderPicker {...props} />
            case 'circle': return <CirclePicker {...props} />
            case 'alpha': return <AlphaPicker {...props} />
            case 'hue': return <HuePicker {...props} />
            case 'twitter': return <TwitterPicker {...props} />
            case 'github': return <GithubPicker {...props} />
            case 'block': return <BlockPicker {...props} />
            case 'chrome': return <ChromePicker {...props} />
            default: return <SketchPicker {...props} />
        }
    }

    private handleChange = (color: ColorResult, event: ChangeEvent) => {
        const { onChange } = this.props
        this.setState({
            color: `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`
        })
        if (isFunction(onChange)) {
            onChange(color, event)
        }
    }
}
