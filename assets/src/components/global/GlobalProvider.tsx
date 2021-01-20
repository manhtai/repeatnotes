import React, {useContext} from 'react';
import {SyncStatus} from 'src/libs/types';

export const GlobalContext = React.createContext<{
  sync: SyncStatus;
  error: any;

  setSync: (...a: any) => void;
}>({
  sync: SyncStatus.Success,
  error: null,

  setSync: () => {},
});

export const useGlobal = () => useContext(GlobalContext);

type Props = React.PropsWithChildren<{}>;
type State = {
  sync: SyncStatus;
  error: string;
};

export class GlobalProvider extends React.Component<Props, State> {
  state: State = {
    sync: SyncStatus.Success,
    error: '',
  };

  setSync = (sync: SyncStatus, error: any) => {
    this.setState({sync, error});
  };

  render() {
    const {sync, error} = this.state;

    return (
      <GlobalContext.Provider
        value={{
          sync,
          error,

          setSync: this.setSync,
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}
