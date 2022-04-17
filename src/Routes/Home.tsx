import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMovieResult, IMoive } from "../api";
import useWindowDimensions from "../Components/useWidowDimensions";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 200px;
`
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Banner = styled.div<{bgPhoto: string}>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgPhoto});
  background-size: cover;
`
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`
const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`
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
const Slider1 = styled.div`
  position: relative;
  top: 130px;
`
const Slider2 = styled.div`
  position: relative;
  top: 360px;
`
const Slider3 = styled.div`
  position: relative;
  top: 590px;
`
const SliderWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`
const SliderButton = styled.div`
  font-size: 20px;
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
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)<{scrolly: number}>`
  position: absolute;
  width: 40vw;
  height: 80vh;
  top: ${(props) => props.scrolly + 100}px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: black;
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover = styled.div<{backImg: string}>`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.backImg});
`
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  text-align: center;
  font-size: 50px;
  margin: 20px 0;
`
const BigOverviewWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const BigOverview = styled.p`
  width: 80%;
  font-size: 20px;
`
const offset = 6;

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



function Home() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery<IGetMovieResult>(["movies", "nowPlaying"], ()=>(getMovies("now_playing")));
  const { data: data1 }  = useQuery<IGetMovieResult>(["movies", "popular"], ()=>(getMovies("popular")));
  const moviePathMatch: PathMatch<string> | null = useMatch("/movies/:id");
  const [index, setIndex] = useState(0)
  const width = useWindowDimensions();
  const { scrollY } = useViewportScroll();
  const [leaving, setLeaving] = useState(false)
  const clickMovie = moviePathMatch?.params.id && data?.results.find((movie) => String(movie.id) === moviePathMatch.params.id)
  
  const increaseIndex = () => {
    if(data) {
      if(leaving) return;
      toggleLeaving();
      const totalMovie = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovie / offset) - 1;
      setIndex((prev) => prev === 0 ? maxIndex : prev - 1);
    }
  }

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`)
  }
  
  const onOverlayClick = () => navigate("/");
  return (
    <Wrapper>
      {
        isLoading
          ? (
            <Loader>Loading</Loader> 
          ) : ( 
            <>
              <Banner  bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                <Title>{data?.results[0].title}</Title>
                <Overview>{data?.results[0].overview}</Overview>
              </Banner>
             
              <Slider>
                <SliderWrap>
                  <SliderName>Now Playing</SliderName>
                  <SliderButton onClick={increaseIndex}>⏩</SliderButton>
              
                </SliderWrap>              
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  <Row initial={{x: width + 10}} animate={{x: 0}} exit={{x: -width -10}} key={index} transition={{type:"tween", duration:1}}>
                    
                    {data?.results.slice(1).slice(offset*index, offset*index + offset).map((movie) => (
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
              <Slider1>
                <SliderWrap>
                  <SliderName>Popular</SliderName>
                  <SliderButton onClick={increaseIndex}>⏩</SliderButton>
              
                </SliderWrap>              
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  <Row initial={{x: width + 10}} animate={{x: 0}} exit={{x: -width -10}} key={index} transition={{type:"tween", duration:1}}>
                    
                    {data1?.results.slice(1).slice(offset*index, offset*index + offset).map((movie) => (
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
              </Slider1>
              <Slider2>
                <SliderWrap>
                  <SliderName>Now Playing</SliderName>
                  <SliderButton onClick={increaseIndex}>⏩</SliderButton>
              
                </SliderWrap>              
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  <Row initial={{x: width + 10}} animate={{x: 0}} exit={{x: -width -10}} key={index} transition={{type:"tween", duration:1}}>
                    
                    {data?.results.slice(1).slice(offset*index, offset*index + offset).map((movie) => (
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
              </Slider2>
              <Slider3>
                <SliderWrap>
                  <SliderName>Now Playing</SliderName>
                  <SliderButton onClick={increaseIndex}>⏩</SliderButton>
              
                </SliderWrap>              
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  <Row initial={{x: width + 10}} animate={{x: 0}} exit={{x: -width -10}} key={index} transition={{type:"tween", duration:1}}>
                    
                    {data?.results.slice(1).slice(offset*index, offset*index + offset).map((movie) => (
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
              </Slider3>
              <AnimatePresence>
                {
                  moviePathMatch 
                    ? (
                      <>
                      <Overlay
                        onClick={onOverlayClick}
                        exit={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                      <BigMovie
                        scrolly={scrollY.get()}
                        layoutId={moviePathMatch.params.id}
                      >
                        {clickMovie &&
                          <>
                            <BigCover backImg={makeImagePath(clickMovie.backdrop_path, "w500")} />
                            <BigTitle>{clickMovie.title}</BigTitle>
                            <BigOverviewWrap>
                              <BigOverview>{clickMovie.overview}</BigOverview>  
                            </BigOverviewWrap>
                            
                          </>
                        }
                      </BigMovie>
                    </>
                    ) : null
                }
              </AnimatePresence>
            </>
          )
      }
    </Wrapper>
    
  );
}
export default Home;