import { Component, type ChangeEvent } from 'react';

type Props = {
  onSearch: (term: string) => void;
};

type State = {
  value: string;
};

export default class Search extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const savedState = localStorage.getItem('searchState') || '';
    this.state = {
      value: savedState,
    };
  }

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });
  };

  handleSearchClick = () => {
    const trimmed = this.state.value.trim();
    localStorage.setItem('searchState', trimmed);
    this.props.onSearch(trimmed);
  };
  render() {
    return (
      <div className="flex justify-center mt-6 flex-col w-screen mb-3">
        <h1 className="text-center text-3xl mb-5">Pokewiki</h1>
        <div className="flex relative rounded-md w-full px-4 max-w-xl mx-auto">
          <input
            id="search"
            value={this.state.value}
            onChange={this.handleInputChange}
            className="w-full p-3 rounded-md border-2 border-r-white rounded-r-none border-gray-300 placeholder-gray-500"
            type="text"
          />
          <button
            onClick={this.handleSearchClick}
            className="inline-flex items-center gap-2 bg-violet-700 text-white text-lg font-semibold py-3 px-6 rounded-r-md"
          >
            <span>Search</span>
          </button>
        </div>
      </div>
    );
  }
}
