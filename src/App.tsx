import React, { useRef, useState, useEffect, Suspense } from 'react'
import { useSpring, a } from '@react-spring/web'
import useMeasure from 'react-use-measure'
import { Container, Title, Frame, Content, toggle } from './styles'
import * as Icons from './Components/icons'
import About from './Components/about'
// import Projects from './Components/projects'

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
    <Frame>
      <Icon style={{ ...toggle, opacity: children ? 1 : 0.3 }} onClick={() => setOpen(!isOpen)} />
      <Title style={style}>{name}</Title>
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
export default function App() {
  
  const [viewCount, setViewCount] = useState('')

  const getViewcount = async () => {
    const response = await fetch('https://fnappt6c7s57cuv37w.azurewebsites.net/api/CosmosCRUD?code=ZqNwcLOkc3iNHTITf8-bVHgycjI0xIsOYuE-LDnODEboAzFuc4KXzg==')
    const result = await response.json()
    setViewCount(result.viewCount)
  }

  useEffect(() =>{
    getViewcount()
  }, [])
  return (
    <Container>
      <Tree name="src" defaultOpen>
        <Tree name="about">
          <About />
        </Tree>
        <Tree name="projects">
          {/* <Projects /> */}
        </Tree>
        <Tree name={<span>🙀 secrets</span>} />
        <Suspense fallback={<Tree name="retrieving views.." />}> 
          <Tree name={<span>page views: {viewCount} </span>} />
        </Suspense>
      </Tree>
    </Container>
  )
}
