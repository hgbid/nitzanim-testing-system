import React from 'react';

import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import { Tooltip, Button } from '@nextui-org/react';
import { usePyodide } from './PyodideProvider.jsx';

function RunCodeButton({ code, setOutput, setInputCallback, setError }) {
  const pyodide = usePyodide();

  async function handleEvaluate() {
    setOutput('');
    setError('');
    try {
      pyodide.registerJsModule('customInput', {
        input: (prompt) => {
          setOutput((output) => output + prompt);
          return new Promise((resolve) => {
            setInputCallback(() => (value) => {
              setOutput((output) => output + '\n' + value + '\n');
              resolve(value);
            });
          });
        },
      });

      pyodide.runPython(`
      import customInput
      def input(prompt=""):
        return customInput.input(prompt)
    `);

      pyodide.runPython(`
      import io, sys
      sys.stdout = io.StringIO()
    `);

      const asyncCode = `async def main():\n${code
        .split('\n')
        .map((line) => {
          if (line.includes('input(')) {
            return '  ' + line.replace('input(', 'await input(');
          }
          return '  ' + line;
        })
        .join('\n')}\nawait main()`;
      await pyodide.runPythonAsync(asyncCode);
      const result = pyodide.runPython('sys.stdout.getvalue()');

      setOutput((output) => output + result);
    } catch (error) {
      try {
        const lines = error.message.split('\n');
        const tracebackHead = lines[0];
        const tracebackBody = lines.slice(10);
        setError(() => tracebackHead + '\n' + tracebackBody.join('\n') + '\n');
      } catch {
        console.log('incatch');
        setError(() => error.message + '\n');
      }
      console.error(error);
    }
  }

  return (
    <Tooltip content="הרץ" placement={'bottom'}>
      <Button isIconOnly variant="faded" onClick={() => handleEvaluate()}>
        <PlayCircleRoundedIcon />
      </Button>
    </Tooltip>
  );
}

export default RunCodeButton;