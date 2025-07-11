import React from 'react';
import { fetchPokemon } from './api/api';
import { ErrorBoundary } from './error-boundary';

const pokemon = await fetchPokemon(`1`);
console.log(pokemon);
export class App extends React.Component {
  render() {
    return (
      <ErrorBoundary>
        <h1 className="font-sans">Привет, {pokemon.name ?? 'max'}</h1>
      </ErrorBoundary>
    );
  }
}
