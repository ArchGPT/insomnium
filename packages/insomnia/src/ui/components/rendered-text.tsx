import React, { FC, PureComponent } from 'react';

import { HandleRender } from '../../common/render';
import { useNunjucks } from '../context/nunjucks/use-nunjucks';

/**** ><> ↑ --------- Import Statements */
interface Props {
  children: string;
  render: HandleRender;
}
interface State {
  renderedText: string;
  error: string;
}
/**** ><> ↑ --------- Interfaces */

class RenderedTextInternal extends PureComponent<Props, State> {
  state: State = {
    renderedText: '',
    error: '',
  };

  async _render() {
    const { render, children } = this.props;

    if (!children) {
      return;
    }

    try {
      const renderedText = await render(children);
      this.setState({
        renderedText,
        error: '',
      });
    } catch (err) {
      this.setState({
        error: err.message,
      });
    }
  }

  componentDidMount() {
    this._render();
  }

  componentDidUpdate() {
    this._render();
  }

  render() {
    if (this.state.error) {
      return (
        <span
          className="font-error"
          style={{
            fontSize: '0.9em',
            fontStyle: 'italic',
          }}
        >
          {this.state.error || 'Unknown Error'}
        </span>
      );
    } else {
      return this.state.renderedText || '';
    }
  }
}
/**** ><> ↑ --------- Class Component */

export const RenderedText: FC<Omit<Props, 'render'>> = props => {
  const { handleRender } = useNunjucks();

  return <RenderedTextInternal {...props} render={handleRender}/>;
};
/**** ><> ↑ --------- Functional Component */
