import React, { lazy, Suspense, useEffect, useRef } from 'react';
import equal from 'deep-equal';
import type Editor from './Editor';
import Block from './Block';

interface ObjectEditorParams<T> extends React.HTMLProps<HTMLDivElement> {
  obj?: T;
  schema?: object;
  // TODO think of interface of Visual Editor
  visualEditor?: React.FC<{ obj: T }>;

  setRef?(ref: ObjectEditorRef): void;

  onChanged?(newObj: T): void;

  onUnchanged?(): void;
}

export interface ObjectEditorRef {
  underlying: Editor | null;

  save(): void;
}

/**
 * General-purpose editor of (almost) any object.
 */
const ObjectEditor = <T extends any>(params: ObjectEditorParams<T>) => {
  const _JsonEditor = lazy(() => import('./Editor')),
      jsonEditorRef = useRef<Editor | null>(null);

  const {
    id,
    obj,
    schema,
    visualEditor,
    setRef,
    onChanged,
    onUnchanged,
    ...divProps
  } = params;

  // Reference to show an error without re-rendering
  const errorElementRef = useRef<HTMLSpanElement | null>(null);

  function clearError() {
    const element = errorElementRef.current;
    if (element) {
      while (element.hasChildNodes()) {
        element.removeChild(element.lastChild!);
      }
    }
  }

  function setError(text: string) {
    const element = errorElementRef.current;
    if (element) {
      clearError();
      element.appendChild(document.createTextNode(text));
    }
  }

  // I prefer setRef over ExoticComponent...
  setRef?.({
    underlying: jsonEditorRef.current,

    save: function () {
      if (!jsonEditorRef.current) {
        // If editor ref isn't yet set, we can fairly conclude
        // that object isn't changed
        onUnchanged?.();
        return;
      }
      try {
        const text = jsonEditorRef.current!.getText();
        // validate newObj over schema
        jsonEditorRef.current!.validate();
        const newObj = JSON.parse(text);
        if (equal(obj, newObj)) {
          onUnchanged?.();
        } else {
          onChanged?.(newObj);
        }
      } catch (e: any) {
        setError(e.message);
        // monaco-style positioning. Not very good to stick to it, but let it be...
        if (typeof e.startLineNumber == 'number' && typeof e.startColumn == 'number') {
          jsonEditorRef.current!.setCursor([e.startLineNumber - 1, e.startColumn - 1]);
        }
      }
    }
  });

  useEffect(() => {
    clearError();
  });

  // If object is undefined, let a user start from the empty slate,
  // otherwise it must be non-empty JSON serialization.
  let text = obj == undefined ? '' : JSON.stringify(obj, undefined, 2);
  return <Suspense fallback="loading...">
    <Block className="block block-container-vertical">
      <_JsonEditor
          // @ts-ignore I honestly don't know why TS goes off here
          ref={jsonEditorRef}
          id={id || 'orphan-editor'}
          language="json"
          text={text}
          readonly={false}
          schema={schema}
          {...divProps}
      />
      <Block size="content">
        <span ref={errorElementRef} className="field-error"/>
      </Block>
    </Block>
  </Suspense>;
};

export default ObjectEditor;
