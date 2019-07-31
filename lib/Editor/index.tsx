import * as React from 'react'
import { getClassName } from '../utils'
import Icon from '../Icon'

export interface IEditorProps {
    className?: string
}

export default class Editor extends React.Component<IEditorProps, any> {

    public state = {
        value: '<p></p>'
    }

    private status: boolean = false

    public render(): JSX.Element {
        const { className } = this.props
        const { value } = this.state
        return (
            <div className={getClassName('editor', className)}>
                <div>
                    <Icon icon="ios-image" />
                </div>
                <div className={getClassName('editor_body')}>
                    <div
                        className={getClassName('editor_body_container')}
                        dangerouslySetInnerHTML={{ __html: value }}
                        contentEditable
                        onInput={this.handleChange}
                        onCompositionStart={() => { this.status = true }}
                        onCompositionEnd={() => { this.status = false }}
                    />
                    {/* <textarea className={getClassName('editor_box')} value={value} onChange={this.handleChange} /> */}
                </div>
            </div>
        )
    }

    private handleChange = (e: React.ChangeEvent<HTMLDivElement>) => {
        if (this.status) {
            return
        }
        const node = e.target
        let value = e.target.innerHTML.replace(/<[div>]*>/gm, '<p>')
        value = value.replace(/<\/[div>]*>/gm, '</p>')
        const selection = window.getSelection()
        if (selection) {
            const range = selection.getRangeAt(0)
            const textNode = range.startContainer
            const rangeStartOffset = range.startOffset
            let nodeNum = 1
            node.childNodes.forEach((item: Node, index: number) => {
                if (item === textNode.parentNode || node === textNode.parentNode) {
                    nodeNum = index + 1
                }
            })
            if (!value || value === '<p></p>') {
                value = `<p mark="mark$${(Math.random() * 100).toFixed(0)}"></p>`
            }
            this.setState(
                { value },
                () => {
                    const dom = (node.childNodes[nodeNum - 1] && node.childNodes[nodeNum - 1].childNodes[0]) || node.childNodes[nodeNum - 1] || node
                    range.setStart(dom, rangeStartOffset)
                    selection.addRange(range)
                }
            )
        }
    }

    // private getCursortPosition(textDom: HTMLDivElement) {
    //     let cursorPos = 0
    //     if (textDom.selectionStart || textDom.selectionStart === '0') {
    //         // Firefox support
    //         cursorPos = textDom.selectionStart
    //     }
    //     return cursorPos
    // }

    // private setCaretPosition(textDom: React.ChangeEvent<HTMLDivElement>, pos: number) {
    //     console.log(textDom.target)
    //     // if (textDom.setSelectionRange) {
    //     //     // IE Support
    //     //     textDom.focus()
    //     //     textDom.setSelectionRange(pos, pos)
    //     // } else if (textDom.createTextRange) {
    //     //     // Firefox support
    //     //     var range = textDom.createTextRange()
    //     //     range.collapse(true)
    //     //     range.moveEnd('character', pos)
    //     //     range.moveStart('character', pos)
    //     //     range.select()
    //     // }
    // }
}
