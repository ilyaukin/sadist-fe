import React, { useRef } from 'react';
import { WiredInput } from '/wired-elements/lib/wired-input';
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

  return <>
    <div key="url" className="field">
      URL:
      <wired-input
          ref={inputRef}
          style={{ width: '100%' }}
          value={url}
          onchange={(_event: CustomEvent<any>) => {
            onChangeURL(inputRef.current?.value);
          }}
      />
      <span className="field-error">{urlError || ''}</span>
    </div>
    <div key="template" className="field">
      Script Template:
      <wired-combo-lazy
          style={{ width: '100%' }}
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
    </div>
  </>;
}
