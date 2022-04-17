import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { makeImagePath } from "../utils"
import useWindowDimensions from "./useWidowDimensions"

const SliderName = styled.p`
margin-bottom: 5px;
font-size: 20px;
font-weight: bold;
margin-right: 10px;
`
const Slider = styled.div`
position: relative;
top: -100px;
`
const SliderWrap = styled.div`
display: flex;
align-items: center;
margin-bottom: 10px;
`
const SliderButton = styled.div`
font-size: 18px;
cursor: pointer;
font-weight: bold;
`

const Row = styled(motion.div)`
display: grid;
gap: 5px;
grid-template-columns: repeat(6, 1fr);
position: absolute;
width: 100%;
`

const Box = styled(motion.div)<{bgPhoto: string}>`
background-color: white;
height: 200px;
font-size: 66px;
background-image: url(${(props) => props.bgPhoto});
background-size: cover;
background-position: center center;
cursor: pointer;
&:first-child {
  transform-origin: center left;
}
&:last-child {
  transform-origin: center right;
}
`

const Info = styled(motion.div)`
padding: 10px;
background-color: ${(props) => props.theme.black.lighter };
opacity: 0;
position: absolute;
width: 100%;
bottom: 0;
h4 {
  text-align: center;
  font-size: 18px;
}
`

const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    zIndex:99,
    transition: {
      delay: 0.3,
      type:"twin",
    }
  }
}
const infoVariant = {
  hover : {
    opacity: 1,
    transition: {
      delay: 0.3,
      type:"twin",
    },
  }
}

const offset = 6;

function SilderComponent({data, name}:any) {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const width = useWindowDimensions();
  const increaseIndex = () => {
    if(data) {
      if(leaving) return;
      toggleLeaving();
      const totalMovie = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setIndex((prev) => prev === 0 ? maxIndex : prev - 1);
    }
  }
  const [leaving, setLeaving] = useState(false)
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`)
  }
  return (
    <>
      <Slider>
        <SliderWrap>
          <SliderName>{name}</SliderName>
          <SliderButton onClick={increaseIndex}>⏩</SliderButton>
        </SliderWrap>

        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row initial={{x: width + 10}} animate={{x: 0}} exit={{x: -width -10}} key={index} transition={{type:"tween", duration:1}}>
            
            {data?.results.slice(1).slice(offset*index, offset*index + offset).map((movie:any) => (
              <Box 
                layoutId={movie.id + ""}
                key={movie.id}
                initial="normal"
                whileHover="hover"
                onClick={() => onBoxClicked(movie.id)}
                transition={{type: "twin"}}
                variants={BoxVariants}
                bgPhoto={makeImagePath(movie.backdrop_path, "w500")} 
              >
                <Info variants={infoVariant}>
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
              
          </Row>
          
        </AnimatePresence>
      </Slider>
    </>
  )
}
export default SilderComponent;