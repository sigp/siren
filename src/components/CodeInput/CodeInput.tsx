import CodeEditor from '@uiw/react-textarea-code-editor'
import { FC } from 'react'

export interface CodeInputProps {
  onChange: (value: string) => void
  value: string
  placeholder?: string
  onFocus?: () => void
}

const CodeInput: FC<CodeInputProps> = ({ onChange, value, placeholder, onFocus }) => {
  return (
    <div className='w-full max-h-48 overflow-scroll'>
      <CodeEditor
        rows={5}
        className='dark:bg-dark750'
        value={value}
        language='json'
        onFocus={onFocus}
        placeholder={placeholder}
        onChange={(evn) => onChange(evn.target.value)}
        padding={15}
        style={{
          fontSize: 12,
          fontFamily:
            'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}
      />
    </div>
  )
}

export default CodeInput
