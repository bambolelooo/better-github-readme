import { App, Button, notification, Popconfirm } from 'antd'
import { useState, useRef, useEffect } from 'react'
import styles from '../css/editorPage.module.css'
import TextEditor from '../components/TextEditor'
import useUndoableState from '../hooks/useUndoaleState'
import axios from 'axios'
import { debounce } from 'lodash'
export default function EditorPage(props) {
    const token = localStorage.getItem('user')
    const template = JSON.parse(localStorage.getItem('template'))
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const {
        state: textareaValue,
        setState: setTextareaValue,
        goBack: undo,
        goForward: redo,
    } = useUndoableState(localStorage.getItem('textareaValue') || '')
    useEffect(() => {
        const saveToLocalStorage = debounce(() => {
            localStorage.setItem('textareaValue', textareaValue)
        }, 1000)
        saveToLocalStorage()
    }, [textareaValue])

    const repositoryName = JSON.parse(localStorage.getItem('repo'))
    useEffect(() => {
        if (template === 'Existing') {
            axios
                .post(
                    `${process.env.REACT_APP_BACK_END_URL}/graphql`,
                    {
                        query: `query ($repositoryName: String!) { getReadmeContent(repositoryName: $repositoryName) }`,
                        variables: { repositoryName },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                )
                .then((response) => {
                    setTextareaValue(response.data.data.getReadmeContent)
                    localStorage.setItem('template', JSON.stringify('Edit'))
                })
                .catch((error) => {
                    console.error(error)
                    // Handle the error
                })
        } else if (template === 'Simple' || template === 'Advanced') {
            console.log('axios')
            axios
                .post(
                    `${process.env.REACT_APP_BACK_END_URL}/graphql`,
                    {
                        query: `query ($templateName: String!) { getTemplate(templateName: $templateName) }`,
                        variables: { templateName: template },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                )
                .then((response) => {
                    setTextareaValue(response.data.data.getTemplate)
                    localStorage.setItem('template', JSON.stringify('Edit'))
                })
                .catch((error) => {
                    console.error(error)
                    // Handle the error
                })
        }
    }, [])
    const [api, contextHolder] = notification.useNotification()

    const openNotificationWithIcon = (type, message, description) => {
        api[type]({
            message: message || 'Success',
            description:
                description || 'Successfully edited readme on your repository',
        })
    }

    const showPopconfirm = () => {
        setOpen(!open)
    }

    const { darkTheme } = props
    const textareaRef = useRef(null)

    async function handlePost() {
        if (token) {
            const text = textareaValue

            axios
                .post(
                    `${process.env.REACT_APP_BACK_END_URL}/graphql`,
                    {
                        query: `
                            mutation($text: String!, $repositoryName: String!) {
                            updateReadme(text: $text, repositoryName: $repositoryName)
                            }
                        `,
                        variables: { text, repositoryName },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // pass the user's access token in the Authorization header
                            'Content-Type': 'application/json',
                        },
                    }
                )
                .then((response) => {
                    console.log(response)
                    if (response.data.errors && response.data.errors[0]) {
                        openNotificationWithIcon(
                            'error',
                            'Error',
                            `Some problem occurred: ${response.data.errors[0].message}`
                        )
                    } else {
                        openNotificationWithIcon('success')
                        setTimeout(() => {
                            setOpen(false)
                        }, 500)
                    }
                })
                .catch((error) => {
                    console.log(error)
                    openNotificationWithIcon(
                        'error',
                        'Error',
                        `Some problem occurred\n${error}`
                    )
                })
        } else {
            console.log('JWT token not found in localStorage')
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
        <App>
            {contextHolder}
            <main className={styles.main}>
                <section className={styles.snippetSection}>
                    <Popconfirm
                        title="Confirmation"
                        description="Are you sure you want to post this ReadMe to GitHub?"
                        open={open}
                        onConfirm={handlePost}
                        onCancel={showPopconfirm}
                        okButtonProps={{ loading: confirmLoading }}
                        okText={'Yes!'}
                        cancelText={'Not yet'}
                    >
                        <Button onClick={showPopconfirm} loading={loading}>
                            Post to GitHub
                        </Button>
                    </Popconfirm>
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
        </App>
    )
}
