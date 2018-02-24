import * as React from 'react'
class Component extends React.Component<any, any> {
    protected slots: string[] = []
    protected slotsNode: {default: JSX.Element[]} = {
        default: []
    }
    protected className: string = ''
    protected styles: object = {}
    protected getRootNode(viewNode: JSX.Element): JSX.Element {
        const style = Object.assign(this.styles, this.props.style)
        return (
            <div className={this.getClassName()} style={style}>
                {viewNode}
            </div>
        )
    }
    protected getClassName(): string {
        return `${this.className} ${this.props.className || ''}`
    }
    readonly createSlots = (): void => {
        this.setSlots()
        let children = this.props.children instanceof Array ? this.props.children : [this.props.children]
        children.map((item: JSX.Element) => {
            let slot = item && item.props && item.props.slot
            if (slot && this.slotsNode.hasOwnProperty(slot)) {
                this.slotsNode[slot].push(item)
            } else {
                if (item) {
                    this.slotsNode.default.push(item)
                }
            }
        })
    }
    private setSlots(): void {
        this.slots.map((item) => {
            this.slotsNode[item] = []
        })
        this.slotsNode.default = []
    }
}
export {Component, React}