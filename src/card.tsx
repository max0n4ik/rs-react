import { Component } from 'react';

type Props = {
  name: string;
  image: string;
  description: string;
};

export class Card extends Component<Props> {
  render() {
    const { name, description, image } = this.props;

    return (
      <div className="border p-4 rounded shadow bg-white hover:shadow-md transition">
        <img src={image} alt="" />
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    );
  }
}
