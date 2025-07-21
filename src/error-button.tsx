import { Component } from 'react';

interface ErrorTestState {
  hasError: boolean;
}

export default class ErrorButton extends Component<object, ErrorTestState> {
  state: ErrorTestState = {
    hasError: false,
  };
  handleError = () => {
    this.setState({
      hasError: true,
    });
  };
  render() {
    if (this.state.hasError) throw new Error('Test Error');
    return (
      <div className="flex justify-end mr-5">
        <button
          onClick={this.handleError}
          className="inline-flex items-center gap-2 bg-violet-700 text-white text-lg font-semibold py-3 px-6 rounded-md"
        >
          Get Error
        </button>
      </div>
    );
  }
}
