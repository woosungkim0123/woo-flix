import { motion, useAnimation, useViewportScroll } from "framer-motion";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { searchState } from "../atom";

const NavWrap = styled(motion.header)`
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  height: 70px;
  padding: 0 50px;
  background-color: rgba(0, 0, 0, 0);
`;
const LeftNav = styled.div`
  display: flex;
  align-items: center;
  gap: 46px;
  svg {
    width: 94px;
  }
`;
const Nav = styled.nav`
  ul {
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 14px;
  }
`;
const NavMenu = styled(motion.li)`
  cursor: pointer;
`;

const RightNav = styled.div``;

const SearchForm = styled.form`
  position: relative;
`;
const SearchInput = styled(motion.input)`
  position: absolute;
  right: 0;
  top: -10px;
  background-color: transparent;
  border: solid 1px #fff;
  padding: 8px 12px;
  padding-left: 36px;
  width: 250px;
  transform-origin: right center;
`;
const SearchBtn = styled(motion.button)`
  font-size: 18px;
  cursor: pointer;
`;

interface ISearch {
  search: string;
}

function Header() {
  const navigate = useNavigate();
  const homeMatch = useMatch("");
  const tvMatch = useMatch("tv");
  const { register, handleSubmit, setValue } = useForm<ISearch>();
  const { scrollY } = useViewportScroll();
  const onSearchValid = ({ search }: ISearch) => {
    navigate(`/search/${search}`);
    setValue("search", "");
  };
  console.log(homeMatch)
  const [searchOpen, setSearchOpen] = useRecoilState(searchState);
  const navAnimation = useAnimation();
  const inputAnimation = useAnimation();
  const buttonAnimation = useAnimation();
  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
    if (searchOpen) {
      inputAnimation.start({ scaleX: 1 });
      buttonAnimation.start({ x: -213 });
    } else {
      inputAnimation.start({ scaleX: 0 });
      buttonAnimation.start({ x: 0 });
    }
  };
  useEffect(
    () =>
      scrollY.onChange(() => {
        if (scrollY.get() > 80) {
          navAnimation.start({ backgroundColor: "rgba(0,0,0,0.8)" });
        } else {
          navAnimation.start({ backgroundColor: "rgba(0,0,0,0)" });
        }
      }),
    [scrollY, navAnimation]
  );
  return (
    <NavWrap
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={navAnimation}
    >
      <LeftNav>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 276.742">
          <path
            d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
            fill="#d81f26"
          />
        </svg>
        <Nav>
          <ul>
            <NavMenu
              whileHover={{color: "#d81f26"}}
              style={{ fontWeight: homeMatch ? "bold" : "300"}}
              onClick={() => navigate("/")}
            >
              Home
            </NavMenu>
            <NavMenu
              whileHover={{color: "#d81f26"}}
              style={{ fontWeight: tvMatch ? "bold" : "300" }}
              onClick={() => navigate("/tv")}
            >
              TV Show
            </NavMenu>
          </ul>
        </Nav>
      </LeftNav>
      <RightNav>
        <SearchForm onSubmit={handleSubmit(onSearchValid)}>
          <SearchInput
            initial={{ scaleX: 0 }}
            animate={inputAnimation}
            transition={{ duration: 0.3 }}
            placeholder="SearchWord..."
            {...register("search", { required: true })}
          />
          <SearchBtn
            onClick={toggleSearch}
            initial={{ x: 0 }}
            animate={buttonAnimation}
            transition={{ duration: 0.3 }}
            className="fas fa-search"
          />
        </SearchForm>
      </RightNav>
    </NavWrap>
  );
}

export default Header;
