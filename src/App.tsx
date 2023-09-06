import React, { useRef, useState, useEffect, Suspense } from 'react'
import { useSpring, a } from '@react-spring/web'
import useMeasure from 'react-use-measure'
import { Container, Title, Frame, Content, toggle, Social, TreeContent } from './styles'
import * as Icons from './Components/icons'
import About from './Components/about'
import motorbikeImage from './assets/motorbike.PNG'
import pokemonImage from './assets/pokemon.PNG'

function usePrevious<T>(value: T) {
  const ref = useRef<T>()
  useEffect(() => void (ref.current = value), [value])
  return ref.current
}

const Tree = React.memo<
  React.HTMLAttributes<HTMLDivElement> & {
    defaultOpen?: boolean
    name: string | JSX.Element
  }
>(({ children, name, style, defaultOpen = false }) => {
  const [isOpen, setOpen] = useState(defaultOpen)
  const previous = usePrevious(isOpen)
  const [ref, { height: viewHeight }] = useMeasure()
  const { height, opacity, y } = useSpring({
    from: { height: 0, opacity: 0, y: 0 },
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
      y: isOpen ? 0 : 20,
    },
  })
  // @ts-ignore
  const Icon = Icons[`${children ? (isOpen ? 'Minus' : 'Plus') : 'Close'}SquareO`]
  return (
    <Frame style={{ ...style, paddingLeft: !isOpen && name === 'click me' ? 150 : 0 }}>
      <Icon style={{ ...toggle, opacity: children ? 1 : 0.3 }} onClick={() => setOpen(!isOpen)} />
      <Title style={{ ...style, fontWeight: isOpen ? 'bold' : 'normal' }} onClick={() => setOpen(!isOpen)}>{isOpen && name === 'click me' ? 'src' : name}</Title>
      <Content
        style={{
          opacity,
          height: isOpen && previous === isOpen ? 'auto' : height,
        }}>
        <a.div ref={ref} style={{ y }} children={children} />
      </Content>
    </Frame>
  )
})

interface MyWindow extends Window {
  openSesame: () => void;
}

declare var window: MyWindow;

export default function App() {
  const [viewCount, setViewCount] = useState('')
  const [secret, setSecret] = useState('')

  const getViewcount = async () => {
    const response = await fetch('https://fnappt6c7s57cuv37w.azurewebsites.net/api/CosmosCRUD?code=ZqNwcLOkc3iNHTITf8-bVHgycjI0xIsOYuE-LDnODEboAzFuc4KXzg==') //have this point to an api gateway endpoint if need more security
    const result = await response.json()
    setViewCount(result.viewCount)
  }

  useEffect(() => {
    window.openSesame = () => {
      setSecret('open sesame');
    };
  }, []);

  useEffect(() => {
    const message = secret === 'open sesame'
      ? `%c
           c(..)o   (
          \__(-)    __)
              /\   (
            /(_)___)
           / |

    It's open!`
      : `%c
           c(..)o   (
          \__(-)    __)
              /\   (
            /(_)___)
           / |

    Yo! try running openSesame() :)`;

    console.log(message, 'color: Green; font-size: 16px;');
  }, [secret]);

  useEffect(() => {
    getViewcount()
  }, [])
  return (
    <Container>
      <Tree name="click me" defaultOpen>
        <Tree name="about" defaultOpen>
          <About />
        </Tree>
        <Tree name="projects">
          <Tree name="motorbike-configurator">
            <TreeContent>
              <span><a href="https://hughdtt.github.io/motorbike-configurator/" target="_blank">Demo</a> | <a href="https://github.com/hughdtt/motorbike-configurator" target="_blank">Source</a></span>
              <div
                style={{
                  width: 175,
                  height: 90,
                  overflow: 'hidden',
                  borderRadius: 5,
                  paddingTop: 10
                }}
              ><img src={motorbikeImage} alt="motorbike" style={{ display: "block", width: '100%', height: "auto", borderRadius: 5 }} /></div>
            </TreeContent>
          </Tree>
          <Tree name="poke-profiles">
            <TreeContent>
              <span><a href="https://hughdtt.github.io/poke-profiles/" target="_blank">Demo</a> | <a href="https://github.com/hughdtt/poke-profiles" target="_blank">Source</a></span>
              <div
                style={{
                  width: 175,
                  height: 90,
                  overflow: 'hidden',
                  borderRadius: 5,
                  paddingTop: 10
                }}
              ><img src={pokemonImage} alt="pokemon" style={{ display: "block", width: '100%', height: "auto", borderRadius: 5 }} /></div>
            </TreeContent>
          </Tree>
        </Tree>
        <Tree name={<span>🙈 secrets</span>}>
          {secret === 'open sesame' ? <TreeContent><span><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">You're welcome</a></span></TreeContent> : ''}
        </Tree>
        <Suspense fallback={<Tree name="retrieving views.." />}>
          <Tree name={<span>page views: {viewCount} </span>} />
        </Suspense>
      </Tree>
      <Social><a href="https://github.com/hughdtt" target="_blank">Github</a> | <a href="https://www.linkedin.com/in/hughdtt/" target="_blank">LinkedIn</a></Social>
    </Container >
  )
}
