import styles from '../css/textEditor.module.css'
import { Button, Select } from 'antd'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
export default function TextEditor(props) {
    const { textareaValue, setTextareaValue, textareaRef, togglePreview } =
        props
    const [preview, setPreview] = useState(false)
    const [font, setFont] = useState('JetBrains Mono')
    function addSymbolsBeforeAndAfter(symbols) {
        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        console.log(start)
        console.log(end)
        const selectedText = textarea.value.substring(start, end)

        const symbolBefore = symbols
        const symbolAfter = symbols

        const newText =
            textareaValue.substring(0, start) +
            symbolBefore +
            selectedText +
            symbolAfter +
            textareaValue.substring(end)

        setTextareaValue(newText)

        const newStart = start + symbolBefore.length
        const newEnd = newStart + selectedText.length

        setTimeout(() => {
            textarea.setSelectionRange(newStart, newEnd)
            textarea.focus()
        }, 0)
    }
    function addSymbolsAtStart(symbols) {
        console.log('adding symbols')
        const textarea = document.getElementById('text-editor')
        const start = textarea.selectionStart
        // find the start and end positions of the current line
        let lineStart = start
        while (lineStart > 0 && textarea.value.charAt(lineStart - 1) !== '\n') {
            lineStart--
        }

        const newText =
            textareaValue.substring(0, lineStart) +
            symbols +
            textareaValue.substring(lineStart)

        setTextareaValue(newText)

        setTimeout(() => {
            textarea.setSelectionRange(lineStart, lineStart)
            textareaRef.current.focus()
        }, 0)
    }
    const onChange = (value) => {
        console.log(`selected ${value}`)
        setFont(value)
    }
    const onSearch = (value) => {
        console.log('search:', value)
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.buttonsWrapper}>
                <div className={styles.textButtonsWrapper}>
                    <Button
                        type={'primary'}
                        onClick={() => setPreview(!preview)}
                    >
                        Toggle preview
                    </Button>
                    {!preview && (
                        <Select
                            showSearch
                            className={styles.select}
                            defaultValue="JetBrains Mono"
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                                (option?.label ?? '')
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            options={[
                                {
                                    value: 'Roboto',
                                    label: 'Roboto',
                                },
                                {
                                    value: 'JetBrains Mono',
                                    label: 'JetBrains Mono',
                                },
                                {
                                    value: 'Montserrat',
                                    label: 'Montserrat',
                                },
                            ]}
                        />
                    )}
                </div>
                {!preview && (
                    <div className={styles.textButtonsWrapper}>
                        <Button
                            onClick={() => addSymbolsBeforeAndAfter('**')}
                            className={styles.button}
                            type={'primary'}
                        >
                            B
                        </Button>
                        <Button
                            className={styles.button}
                            type={'primary'}
                            onClick={() => addSymbolsBeforeAndAfter('*')}
                        >
                            I
                        </Button>
                        <Button
                            className={styles.button}
                            type={'primary'}
                            onClick={() => addSymbolsAtStart('# ')}
                        >
                            H
                        </Button>
                    </div>
                )}
            </div>
            {!preview ? (
                <textarea
                    rows={20}
                    id={'text-editor'}
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                    ref={textareaRef}
                    style={{
                        fontFamily: `${font}`,
                        fontSize: '18px',
                        padding: '10px',
                        borderRadius: '15px',
                        backgroundColor: '#484F58',
                        color: '#F7EDCF',
                    }}
                ></textarea>
            ) : (
                <div className={styles.markdownWrapper}>
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {textareaValue}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    )
}
