import React from 'react';
import { fetchPokemon } from './api/api';

const pokemon = await fetchPokemon(`1`);
console.log(pokemon);
export class App extends React.Component {
  render() {
    return <h1 className="font-sans">Привет, {pokemon.name}</h1>;
  }
}
