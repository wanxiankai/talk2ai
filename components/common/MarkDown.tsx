/* eslint-disable react/display-name */
'use client'
import { DetailedHTMLProps, HTMLAttributes, memo } from 'react'
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { codeLanguageSubset } from '@/constant/chat';
import { CodeProps, ReactMarkdownProps } from 'react-markdown/lib/ast-to-react';
import CodeBlock from './CodeBlock';
import ReactMarkdown from 'react-markdown';


const MarkDown = memo(({ content }: { content: string }) => {
    return (
        <div className='markdown prose break-words !text-sm'>
            <ReactMarkdown
                remarkPlugins={[
                    remarkGfm,
                    [remarkMath, { singleDollarTextMath: false }],
                ]}
                rehypePlugins={[
                    rehypeKatex,
                    [
                        rehypeHighlight,
                        {
                            detect: true,
                            ignoreMissing: true,
                            subset: codeLanguageSubset,
                        },
                    ],
                ]}
                linkTarget='_new'
                components={{
                    code,
                    p,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
)

const code = memo((props: CodeProps) => {
    const { inline, className, children } = props;
    const match = /language-(\w+)/.exec(className || '');
    const lang = match && match[1];

    if (inline) {
        return <code className={className}>{children}</code>;
    } else {
        return <CodeBlock lang={lang || 'text'} codeChildren={children} />;
    }
});

const p = memo(
    (
        props?: Omit<
            DetailedHTMLProps<
                HTMLAttributes<HTMLParagraphElement>,
                HTMLParagraphElement
            >,
            'ref'
        > &
            ReactMarkdownProps
    ) => {
        return <p className='whitespace-pre-wrap'>{props?.children}</p>;
    }
);

export default MarkDown