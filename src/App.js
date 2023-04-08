import { useEffect, useState } from "react";
import Card from "./components/Card/Card";
import "./App.css";
import { getAllPokemon, getPokemon } from "./utils/pokemon";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const initialUrl = "https://pokeapi.co/api/v2/pokemon/";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");
  useEffect(() => {
    const fetchPokemonData = async () => {
      //すべてのポケモンのデータを取得
      let res = await getAllPokemon(initialUrl);
      loadPokemon(res.results);
      setNextUrl(res.next);
      setPrevUrl(res.previous);
      setLoading(false);
      console.log(prevUrl);
    };
    fetchPokemonData();
  }, []);
  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  const handlePrevPage = async () => {
    setLoading(true);
    let data = await getAllPokemon(prevUrl);
    console.log(data);
    setPrevUrl(data.previous);
    setNextUrl(data.next);
    await loadPokemon(data.results);
    setLoading(false);
  };
  const handleNextPage = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextUrl);
    console.log(data);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    await loadPokemon(data.results);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>ロード中・・・</h1>
        ) : (
          <div className="pokemonCardContainer">
            {pokemonData.map((pokemon, i) => {
              return <Card key={i} pokemon={pokemon} />;
            })}
          </div>
        )}
        <div className="btn">
          {prevUrl && <button onClick={handlePrevPage}>前へ</button>}
          <button onClick={handleNextPage}>次へ</button>
        </div>
      </div>
    </>
  );
}

export default App;
