import React, {useContext} from 'react';
import {SyncStatus, Tag} from 'src/libs/types';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';

export const GlobalContext = React.createContext<{
  // Sync
  sync: SyncStatus;
  error: any;
  setSync: (...a: any) => void;

  // Tag
  tags: Tag[];
  fetchTags: () => void;
  createTag: (t: Tag) => Promise<Tag | void>;
  deleteTag: (t: Tag) => Promise<Boolean>;
  updateTag: (t: Tag) => Promise<Boolean>;
}>({
  sync: SyncStatus.Success,
  error: null,
  setSync: () => {},

  tags: [],
  fetchTags: () => {},
  createTag: () => Promise.resolve(),
  deleteTag: () => Promise.resolve(false),
  updateTag: () => Promise.resolve(false),
});

export const useGlobal = () => useContext(GlobalContext);

type Props = React.PropsWithChildren<{}>;
type State = {
  sync: SyncStatus;
  error: string;
  tags: Tag[];
};

export class GlobalProvider extends React.Component<Props, State> {
  state: State = {
    sync: SyncStatus.Success,
    error: '',
    tags: [],
  };

  setSync = (sync: SyncStatus, error: any) => {
    this.setState({sync, error});
  };

  setTags = (tags: Tag[]) => {
    this.setState({tags: tags.sort((a, b) => a.name.localeCompare(b.name))});
  };

  fetchTags = async (params = {}) => {
    try {
      const tags = await API.fetchAllTags(params);
      this.setState({tags});
      return tags;
    } catch (error) {
      this.setState({sync: SyncStatus.Error, error});
      logger.error(error);
    }
  };

  createTag = async (tag: Tag) => {
    try {
      const newTag = await API.createTag({tag});
      this.setTags([...this.state.tags, newTag]);
      return newTag;
    } catch (error) {
      this.setState({sync: SyncStatus.Error, error});
      logger.error(error);
    }
  };

  updateTag = async (tag: Tag) => {
    try {
      await API.updateTag(tag.id, {tag});
      const index = this.state.tags.findIndex((t) => t.id === tag.id);
      this.setTags([
        ...this.state.tags.slice(0, index),
        {...tag},
        ...this.state.tags.slice(index + 1),
      ]);
      return true;
    } catch (error) {
      this.setState({sync: SyncStatus.Error, error});
      logger.error(error);
      return false;
    }
  };

  deleteTag = async (tag: Tag) => {
    try {
      await API.deleteTag(tag.id);
      const index = this.state.tags.findIndex((t) => t.id === tag.id);
      this.setTags([
        ...this.state.tags.slice(0, index),
        ...this.state.tags.slice(index + 1),
      ]);
      return true;
    } catch (error) {
      this.setState({sync: SyncStatus.Error, error});
      logger.error(error);
      return false;
    }
  };

  render() {
    const {sync, error, tags} = this.state;

    return (
      <GlobalContext.Provider
        value={{
          sync,
          error,
          setSync: this.setSync,

          tags,
          fetchTags: this.fetchTags,
          createTag: this.createTag,
          updateTag: this.updateTag,
          deleteTag: this.deleteTag,
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}
