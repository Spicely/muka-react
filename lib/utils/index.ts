import * as React from 'react'
class Component extends React.Component<any, any> {
    slots : string[] = []
    protected slotsNode = {
        default: []
    }
    private setSlots(): void {
        this.slots.map((item) => {
            this.slotsNode[item] = []
        })
        this.slotsNode['default'] = []
    }
    readonly createSlots = () => {
        this.setSlots()
        let children = this.props.children instanceof Array ? this.props.children : [this.props.children]
        children.map((item: JSX.Element) => {
            let slot = item && item.props && item.props.slot
            if (slot && this.slotsNode.hasOwnProperty(slot)) {
                this.slotsNode[slot].push(item)
            } else {
                item && this.slotsNode['default'].push(item)
            }
        })
    }
    className : string = ''
    getClassName() {
        return `${this.className} ${this.props.className || ''}`
    }
}
export {Component, React}
