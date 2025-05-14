import React, { useRef } from 'react';
import { WiredInput } from '/wired-elements/lib/wired-input';
import Block from '../common/Block';
import { WebCrawlerScriptTemplate } from '../../webcrawler-model/webcrawler';

interface WebCrawlerSetupScreenProps {
  url?: string;
  template?: WebCrawlerScriptTemplate;
  templateList: WebCrawlerScriptTemplate[];
  onSelectTemplate: (template: WebCrawlerScriptTemplate | undefined) => any;
  onChangeURL: (url: string | undefined) => any;
  urlError?: string;
  templateError?: string;
}

export default function WebCrawlerSetupScreen(props: WebCrawlerSetupScreenProps) {
  const { url, template, templateList, onChangeURL, onSelectTemplate,
    urlError, templateError } = props;

  const inputRef = useRef<WiredInput | null>(null);

  return <div className="block-container-vertical" style={{ overflow: 'visible' }}>
    <Block key="url">
      <label htmlFor="webcrawler-provider-url">URL:</label>
      <wired-input
          ref={inputRef}
          style={{ width: 'calc(100% - 2 * var(--block-margin))' }}
          id="webcrawler-provider-url"
          name="webcrawler-provider-url"
          value={url}
          onchange={(_event: CustomEvent<any>) => {
            onChangeURL(inputRef.current?.value);
          }}
      />
      <span className="field-error">{urlError || ''}</span>
    </Block>
    <Block key="template" style={{ overflow: 'visible' }}>
      <label htmlFor="webcrawler-provider-template">Script Template:</label>
      <wired-combo-lazy
          style={{ width: 'calc(100% - 2 * var(--block-margin))' }}
          id="webcrawler-provider-template"
          name="webcrawler-provider-template"
          values={templateList.map(template => {
            return { value: template.name, text: template.name };
          })}
          selected={template?.name}
          onselected={(event: CustomEvent<any>) => {
            onSelectTemplate(templateList.find(t => t.name == event.detail.selected));
          }}
      >
      </wired-combo-lazy>
      <span className="field-error">{templateError || ''}</span>
    </Block>
  </div>;
}
