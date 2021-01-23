import React, {useContext} from 'react';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';
import {SrsConfig} from 'src/libs/types';

export const SrsContext = React.createContext<{
  loading: boolean;
  sm2: any;
  error: any;
  loadSm2: (config?: SrsConfig) => void;
  config?: SrsConfig;
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
  config?: SrsConfig;
};

export class SrsProvider extends React.Component<Props, State> {
  state: State = {
    loading: true,
    sm2: null,
    error: null,
  };

  loadSm2 = async (srs_config?: SrsConfig) => {
    try {
      this.setState({loading: true});
      let config = srs_config;
      if (!config) {
        config = await API.fetchSrsConfig();
      }
      const wasm = await import('@repeatnotes/sm2');
      const sm2 = new wasm.Sm2(config);
      this.setState({sm2, config});
    } catch (error) {
      logger.error(error);
      this.setState({error});
    } finally {
      this.setState({loading: false});
    }
  };

  render() {
    const {sm2, loading, error, config} = this.state;

    return (
      <SrsContext.Provider
        value={{
          loading,
          error,
          sm2,
          config,

          loadSm2: this.loadSm2,
        }}
      >
        {this.props.children}
      </SrsContext.Provider>
    );
  }
}
