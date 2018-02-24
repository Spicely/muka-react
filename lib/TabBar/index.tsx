import { React, Component } from '../utils'

export default class TabBar extends Component {
    protected className: string = 'mk_tabbar'
    public render(): JSX.Element {
        return this.getRootNode(this.viewNode())
    }
    private viewNode(): JSX.Element {
        return (
            <div/>
        )
    }
}
