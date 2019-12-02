import React, { Component, createContext } from 'react'
import ThemeData from '../utils/ThemeData'

export const { Provider, Consumer } = createContext({
    theme: new ThemeData()
})

interface IThemeProviderProps {
    theme?: ThemeData
}

export default class ThemeProvider  extends Component<IThemeProviderProps, any> {
    public render(): JSX.Element {
        const { children, theme } = this.props
        return (
            <Provider
                value={{
                    theme: theme || new ThemeData()
                }}
            >
                {children}
            </Provider>
        )
    }
}