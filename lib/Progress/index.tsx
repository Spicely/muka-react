import * as React from 'react'
import { getClassName } from '../utils'
import 'hidpi-canvas/dist/hidpi-canvas.min.js'

interface IProps {
    className?: string
    type?: 'dashboard'
    size?: number
    lineWidth?: number
    bgColor?: string
    progColor?: string
    value: number
    extend?: string | JSX.Element | JSX.ElementClass
}

export default class Progress extends React.Component<IProps, any> {

    private canvas: HTMLCanvasElement | null = null

    private ctx: CanvasRenderingContext2D | null = null

    public render(): JSX.Element {
        const { className } = this.props
        return (
            <div className={getClassName('progress', className)}>
                {this.getTypeProgress()}
            </div>
        )
    }

    public componentDidMount() {
        const { type } = this.props
        if (type === 'dashboard') {
            this.initCanvas()
        }
    }

    public componentWillReceiveProps(nextProps: IProps) {
        const { size } = this.props
        if (nextProps.type === 'dashboard') {
            if (this.ctx) {
                this.ctx.clearRect(0, 0, size || 200, size || 200)
                this.createBgArc(this.ctx)
                this.createProArc(this.ctx)
            }
        }
    }

    private getTypeProgress(): JSX.Element {
        const { extend, type, size, lineWidth } = this.props
        switch (type) {
            case 'dashboard': return (
                <div className={getClassName('progress_dashboard')}>
                    <canvas ref={(e: HTMLCanvasElement) => { this.canvas = e }} width={size} height={size} />
                    <div className={getClassName('progress_dashboard__extend flex_center')} style={{ padding: lineWidth || 5 }}>
                        {extend}
                    </div>
                </div>

            )
            default: return <div />
        }
    }

    private initCanvas() {
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d')
            if (this.ctx) {
                this.createBgArc(this.ctx)
                this.createProArc(this.ctx)
                // 处理在移动端模糊问题
            }
        }
    }

    private createBgArc(ctx: CanvasRenderingContext2D) {
        const { size, lineWidth, bgColor } = this.props
        const x = size || 200
        const y = size || 200
        const lineW = lineWidth || 5
        ctx.fillStyle = 'rgba(255, 255, 255, 0)'
        ctx.strokeStyle = bgColor || '#ccc'
        ctx.lineWidth = lineW
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.arc(x / 2, y / 2, x / 2 - lineW, 0.7 * Math.PI, 2.3 * Math.PI, false)
        ctx.stroke()
    }

    private createProArc(ctx: CanvasRenderingContext2D) {
        const { size, lineWidth, progColor, value } = this.props
        const x = size || 200
        const y = size || 200
        const lineW = lineWidth || 5
        const val = value > 100 ? 100 : value < 0 ? 0 : value
        ctx.fillStyle = 'rgba(255, 255, 255, 0)'
        ctx.strokeStyle = progColor || '#40befa'
        ctx.lineWidth = lineW
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.arc(x / 2, y / 2, x / 2 - lineW, 0.7 * Math.PI, (0.7 + 0.016 * val) * Math.PI, false)
        ctx.stroke()
    }

}