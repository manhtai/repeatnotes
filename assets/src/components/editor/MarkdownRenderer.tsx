import ReactMarkdown from 'react-markdown';
import Tex from '@matejmazur/react-katex';

import gfm from 'remark-gfm';
import math from 'remark-math';
import breaks from 'remark-breaks';

import 'katex/dist/katex.min.css';

// Prevent edit mode on links
const link = ({href, children}: {href: string; children: string}) => (
  <a
    onClick={(e) => e.stopPropagation()}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
);

const renderers = {
  inlineMath: ({value}: {value: string}) => <Tex math={value} />,
  math: ({value}: {value: string}) => <Tex block math={value} />,
  link,
};

type Props = {
  source: string;
};

export default function MarkdownRenderer(props: Props) {
  const {source} = props;

  return (
    <ReactMarkdown
      plugins={[gfm, breaks, math]}
      renderers={renderers}
      source={source}
    />
  );
}
