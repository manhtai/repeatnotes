import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import {getDefaultToolbarCommands} from 'react-mde';
import {EditorTab} from 'src/libs/types';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';
import Tex from '@matejmazur/react-katex';

import 'katex/dist/katex.min.css';

import 'src/css/editor.css';

import gfm from 'remark-gfm';
import math from 'remark-math';
import breaks from 'remark-breaks';

const renderers = {
  inlineMath: ({value}: {value: string}) => <Tex math={value} />,
  math: ({value}: {value: string}) => <Tex block math={value} />,
};

type Props = {
  content: string;
  setContent: (s: string) => void;
  selectedTab: EditorTab;
  setSelectedTab: (t: EditorTab) => void;
};

export default function Editor(props: Props) {
  const {content, setContent, selectedTab, setSelectedTab} = props;

  const save = async function* (data: any) {
    // FIXME: Change file name here
    const file = new File([data], 'image.jpg', {type: 'image/jpeg'});
    try {
      const res = await API.uploadFile(file);
      yield res.file_path;
      return true;
    } catch (err) {
      logger.error(err);
      return false;
    }
  };

  return (
    <ReactMde
      value={content}
      onChange={setContent}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      toolbarCommands={
        selectedTab === 'write' ? getDefaultToolbarCommands() : []
      }
      generateMarkdownPreview={(markdown) =>
        Promise.resolve(
          <ReactMarkdown
            plugins={[gfm, math, breaks]}
            renderers={renderers}
            source={markdown}
          />
        )
      }
      classes={{
        reactMde: selectedTab === 'write' ? 'border rounded' : '',
        toolbar:
          selectedTab === 'write' ? 'border-b rounded' : 'border rounded',
      }}
      l18n={{
        write: 'Write',
        preview: 'Preview',
        uploadingImage: 'Uploading image...',
        pasteDropSelect:
          'Attach files by dragging & dropping, selecting or pasting them.',
      }}
      childProps={{
        previewButton: {
          className: selectedTab === 'preview' ? 'hidden' : 'mde-tabs',
        },
        writeButton: {
          className: 'hidden',
        },
      }}
      paste={{
        saveImage: save,
      }}
    />
  );
}
