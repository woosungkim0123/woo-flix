import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { IForm, searchMovie } from "../api";


function Search() {
  const location = useLocation()
  const keyword = new URLSearchParams(location.search).get("keyword")
  const { data, isLoading } = useQuery(["movie", "search"], () => (searchMovie(keyword)));
  console.log(data)
  return (
    <div>Search</div>
  )
}

export default Search;