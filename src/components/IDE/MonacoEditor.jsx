import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function MonacoEditor({ code, setCode, theme }) {

  return (
    <Editor
      height="315px"
      defaultLanguage="python"
      theme={theme}
      value={code}
      onChange={(newValue) => setCode(newValue)}
      options={{ minimap: { enabled: false } }}
    />
  );
}
