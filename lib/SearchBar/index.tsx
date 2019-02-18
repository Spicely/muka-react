import * as React from 'react'
import Button from '../Button'
import Icon from '../Icon'
import NavBar from '../NavBar'
import Search from '../Search'
import { getClassName } from '../utils'
import { omit } from 'muka'

interface IProps extends React.InputHTMLAttributes<any> {
    className?: string
    left?: string | JSX.Element | JSX.ElementClass
    right?: string | JSX.Element | JSX.ElementClass
    options?: string[]
    divider?: boolean
    onPress?: (e?: React.MouseEvent<HTMLDivElement>) => void
    fixed?: boolean
}

export default class SearchBar extends React.Component<IProps, any> {

    public static defaultProps = {
        divider: true,
        right: '搜索',
        options: []
    }

    public render(): JSX.Element {
        const { className, divider, left, right, fixed } = this.props
        return (
            <NavBar
                className={getClassName('search_bar', className)}
                left={left}
                divider={divider}
                title={this.getSearchNode()}
                right={right}
                fixed={fixed}
            />
        )
    }

    private getSearchNode(): JSX.Element {
        const { options } = this.props
        const otherProps = omit(this.props, ['className', 'left', 'right', 'options', 'divider', 'fixed'])
        let data: string[] = options || []
        return (
            <div className={getClassName('search_bar_search')}>
                <Search className={getClassName('search_bar__title')} {...otherProps} />
                {
                    data.map((item: string, index: number) => {
                        return (
                            <Button
                                className={getClassName('btn_close')}
                                tick={false}
                                key={index}
                            >
                                {item}
                                <Icon />
                            </Button>
                        )
                    })
                }
            </div>
        )
    }
}