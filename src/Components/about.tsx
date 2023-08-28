import * as React from 'react'
import { TreeContent } from '../styles'

const About: React.FC = () => {
    return (
        <>
            <TreeContent>
                <span>Howdy 🤠, I'm <strong>Hugh!</strong></span>
                <span>I'm a software developer based in Australia.</span>
                <span>I'm always tinkering with something.</span>
                <span>These days, I often lurk around <a href="https://www.reddit.com/r/selfhosted/" target="_blank">r/selfhosted</a>.</span>
            </TreeContent>
        </>
    )
}

export default About;