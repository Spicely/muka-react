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
    }
    readonly createSlots = () => {
        this.setSlots()
        let children = this.props.children instanceof Array ? this.props.children : [this.props.children]
        children.map((item: JSX.Element) => {
            let slot = item && item.props.slot
            if (this.slotsNode.hasOwnProperty(slot) && slot) {
                this.slotsNode[slot].push(item)
            } else {
                this.slotsNode['default'].push(item)
            }
        })
    }
    className : string = ''
    static defaultProps = {
        className: ''
    }
    getClassName() {
        return `${this.className || ''} ${this.props.className || ''}`
    }
}
export {Component, React}
