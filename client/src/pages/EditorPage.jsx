import { Button } from 'antd'
import { useState, useRef } from 'react'
import styles from '../css/editorPage.module.css'
import TextEditor from '../components/TextEditor'
import useUndoableState from '../hooks/useUndoaleState'
export default function EditorPage(props) {
    const {
        state: textareaValue,
        setState: setTextareaValue,
        goBack: undo,
        goForward: redo,
    } = useUndoableState('')
    const { darkTheme } = props
    const textareaRef = useRef(null)

    const draggerProps = {
        name: 'file',
        multiple: false,

        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files)
        },
    }

    function handleUndo(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
            // Handle undo action
            console.log('undo')
            undo()
        }
    }
    function handleUndoRedo(event) {
        if (
            (event.ctrlKey || event.metaKey) &&
            event.key === 'z' &&
            event.shiftKey
        ) {
            // Handle redo action
            console.log('redo')
            redo()
        } else if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
            // Handle undo action
            console.log('undo')
            undo()
        }
    }
    function handleSnippet(snippet) {
        const textarea = textareaRef.current
        if (textarea) {
            const pos = textarea.selectionEnd
            const currentValue = textarea.value
            const newValue =
                currentValue.substring(0, pos) +
                '\n\n' +
                snippet +
                '\n' +
                currentValue.substring(pos)
            setTextareaValue(newValue)
            setTimeout(() => {
                textarea.setSelectionRange(
                    pos + snippet.length + 2,
                    pos + snippet.length + 2
                )
                textarea.focus()
            }, 0)
        }
    }
    const snippets = [
        { name: 'Description', value: '## Description' },
        { name: 'Installation', value: '## Installation' },
    ]

    return (
        <main className={styles.main}>
            <section className={styles.snippetSection}>
                <h3>Snippets</h3>
                {snippets.map((snippet, index) => (
                    <Button
                        type={'primary'}
                        key={index}
                        onClick={() => handleSnippet(snippet.value)}
                    >
                        {snippet.name}
                    </Button>
                ))}
            </section>
            <section className={styles.textSection}>
                <TextEditor
                    textareaValue={textareaValue}
                    setTextareaValue={setTextareaValue}
                    textareaRef={textareaRef}
                    darkTheme={darkTheme}
                    handleUndo={handleUndoRedo}
                />
            </section>
        </main>
    )
}
