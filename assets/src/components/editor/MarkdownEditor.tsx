import {useRef, useEffect} from 'react';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import {getDefaultToolbarCommands} from 'react-mde';
import {EditorTab} from 'src/libs/types';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';
import Tex from '@matejmazur/react-katex';
import FileType from 'file-type/browser';

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

const supportedTypes = new Set(['jpg', 'jpeg', 'gif', 'png', 'xml']);
const initialEditorHeight = 128;

export default function Editor(props: Props) {
  const {content, setContent, selectedTab, setSelectedTab} = props;

  const save = async function* (data: any) {
    const fileType = await FileType.fromBuffer(data);
    if (!fileType || !supportedTypes.has(fileType.ext)) {
      return false;
    }
    // Treat xml as svg for now
    let ext = `${fileType.ext}`;
    let mime = `${fileType.mime}`;

    if (ext === 'xml') {
      ext = 'svg';
      mime = 'image/svg';
    }
    const file = new File([data], `image.${ext}`, {type: mime});
    try {
      const res = await API.uploadFile(file);
      yield res.file_path;
      return true;
    } catch (err) {
      logger.error(err);
      return false;
    }
  };

  const ref = useRef<ReactMde>(null);

  const fitContent = () => {
    const textArea = ref.current?.finalRefs.textarea?.current;
    if (textArea) {
      textArea.style.overflow = 'hidden';
      textArea.style.height = 'auto';
      textArea.style.height = `${Math.max(
        50 + textArea.scrollHeight,
        initialEditorHeight
      )}px`;
    }
  };

  const onTextChange = (text: string) => {
    fitContent();
    setContent(text);
  };

  useEffect(() => fitContent(), [selectedTab]);

  return (
    <ReactMde
      ref={ref}
      initialEditorHeight={initialEditorHeight}
      value={content}
      onChange={onTextChange}
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
          selectedTab === 'write'
            ? 'border-b rounded text-sm'
            : 'border rounded text-sm',
      }}
      l18n={{
        write: 'Write',
        preview: 'Done',
        uploadingImage: 'Uploading image...',
        pasteDropSelect:
          'Attach images by dragging & dropping, selecting or pasting them here.',
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
