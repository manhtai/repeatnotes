import ReactMarkdown from 'react-markdown';
import Tex from '@matejmazur/react-katex';

import gfm from 'remark-gfm';
import math from 'remark-math';
import breaks from 'remark-breaks';

import 'katex/dist/katex.min.css';

const renderers = {
  inlineMath: ({value}: {value: string}) => <Tex math={value} />,
  math: ({value}: {value: string}) => <Tex block math={value} />,
};

type Props = {
  source: string;
};

export default function MarkdownRenderer(props: Props) {
  const {source} = props;

  return (
    <ReactMarkdown
      plugins={[gfm, math, breaks]}
      renderers={renderers}
      source={source}
    />
  );
}
