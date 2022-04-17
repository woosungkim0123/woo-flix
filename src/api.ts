const API_KEY = "924c00b9c0a3bdba58d89a96a13bca36";
const BASE_PATH = "https://api.themoviedb.org/3"

export interface IForm {
  keyword: string;
}

export interface IMoive {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMovieResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMoive[];
  total_pages: number;
  total_results: number;
}


export function getMovies(type:string) {
  return fetch(`${BASE_PATH}/movie/${type}?api_key=${API_KEY}`).then((res) => res.json());
}

export function searchMovie(word: any) {
  return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&language=en-US&query=${word}&page=1&include_adult=false`).then((res) => res.json());
}

