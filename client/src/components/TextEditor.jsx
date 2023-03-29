import styles from '../css/textEditor.module.css'
import { Button, Select } from 'antd'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
export default function TextEditor(props) {
    const {
        textareaValue,
        setTextareaValue,
        textareaRef,
        darkTheme,
        handleUndo,
    } = props
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => console.log(acceptedFiles),
    })
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
    const handleDrop = (event) => {
        event.preventDefault()
        const file = Array.from(event.dataTransfer.files)[0]
        const formData = new FormData()
        formData.append('image', file)
        axios
            .post('http://localhost:3001/api/image/upload', formData)
            .then((response) => {
                const { filename, url } = response.data
                const startPos = textareaRef.current.selectionStart
                const endPos = textareaRef.current.selectionEnd
                const newText =
                    textareaValue.substring(0, startPos) +
                    `![${filename}](${url})` +
                    textareaValue.substring(endPos, textareaValue.length)
                setTextareaValue(newText)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handlePaste = (event) => {
        const items = Array.from(event.clipboardData.items)
        const file = items.find((item) => item.kind === 'file')
        if (file) {
            const formData = new FormData()
            formData.append('image', file.getAsFile())
            axios
                .post('http://localhost:3001/api/image/upload', formData)
                .then((response) => {
                    console.log(response)
                    const { filename, url } = response.data
                    console.log(filename, url)
                    const startPos = textareaRef.current.selectionStart
                    const endPos = textareaRef.current.selectionEnd
                    const newText =
                        textareaValue.substring(0, startPos) +
                        `![${filename}](${url})` +
                        textareaValue.substring(endPos, textareaValue.length)
                    setTextareaValue(newText)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
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
                    className={styles.textareaWrapper}
                    rows={20}
                    id={'text-editor'}
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                    ref={textareaRef}
                    style={{
                        fontFamily: `${font}`,
                        fontSize: '16px',
                        padding: '10px',
                        borderRadius: '15px',
                        backgroundColor: `${darkTheme ? '#0D1117' : '#484F58'}`,
                        color: '#F7EDCF',
                    }}
                    onDrop={handleDrop}
                    onPaste={handlePaste}
                    onKeyDown={(e) => handleUndo(e)}
                ></textarea>
            ) : (
                <div className={styles.markdownWrapper}>
                    <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            h3: ({ node, ...props }) => {
                                const child = node.children[0]
                                console.log(node)
                                return (
                                    <h3
                                        id={`${child.value
                                            .toLowerCase()
                                            .replace(/ /g, '-')}`}
                                        {...props}
                                    />
                                )
                            },
                            h2: ({ node, ...props }) => {
                                const child = node.children[0]
                                return (
                                    <h2
                                        id={`${child.value
                                            .toLowerCase()
                                            .replace(/ /g, '-')}`}
                                        {...props}
                                    />
                                )
                            },
                            h1: ({ node, ...props }) => {
                                const child = node.children[0]
                                return (
                                    <h1
                                        id={`${child.value
                                            .toLowerCase()
                                            .replace(/ /g, '-')}`}
                                        {...props}
                                    />
                                )
                            },
                        }}
                    >
                        {textareaValue}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    )
}
