import React, {useContext} from 'react';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';
import {SrsConfig} from 'src/libs/types';

export const SrsContext = React.createContext<{
  loading: boolean;
  sm2: any;
  error: any;
  loadSm2: (config?: SrsConfig) => void;
}>({
  loading: false,
  sm2: null,
  error: null,
  loadSm2: () => Promise.resolve(),
});

export const useSrs = () => useContext(SrsContext);

type Props = React.PropsWithChildren<{}>;
type State = {
  loading: boolean;
  error: any;
  sm2: any;
};

export class SrsProvider extends React.Component<Props, State> {
  state: State = {
    loading: true,
    sm2: null,
    error: null,
  };

  loadSm2 = async (config?: SrsConfig) => {
    try {
      this.setState({loading: true});
      let conf = config;
      if (!config) {
        conf = await API.fetchSrsConfig();
      }
      const wasm = await import('@repeatnotes/sm2');
      const sm2 = new wasm.Sm2(conf);
      this.setState({sm2});
    } catch (error) {
      logger.error(error);
      this.setState({error});
    } finally {
      this.setState({loading: false});
    }
  };

  render() {
    const {sm2, loading, error} = this.state;

    return (
      <SrsContext.Provider
        value={{
          loading,
          error,
          sm2,

          loadSm2: this.loadSm2,
        }}
      >
        {this.props.children}
      </SrsContext.Provider>
    );
  }
}
