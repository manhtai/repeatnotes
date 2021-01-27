import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import {getDefaultToolbarCommands} from 'react-mde';
import {EditorTab} from 'src/libs/types';
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
    // Promise that waits for "time" milliseconds
    const wait = function (time: number) {
      return new Promise((a: any, r) => {
        setTimeout(() => a(), time);
      });
    };

    // Upload "data" to your server
    // Use XMLHttpRequest.send to send a FormData object containing
    // "data"
    // Check this question: https://stackoverflow.com/questions/18055422/how-to-receive-php-image-data-over-copy-n-paste-javascript-with-xmlhttprequest

    await wait(2000);
    // yields the URL that should be inserted in the markdown
    yield 'https://picsum.photos/300';
    await wait(2000);

    // returns true meaning that the save was successful
    return true;
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
        textArea: {
          onBlur: () => setSelectedTab('preview'),
        },
      }}
      paste={{
        saveImage: save,
      }}
    />
  );
}
