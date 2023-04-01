import React from 'react'
import '../App.css'
import { Space, Card, Row, Col } from 'antd'
import { useNavigate } from 'react-router-dom'
import styles from '../css/templatesPage.module.css'
import Auth from '../utils/auth'

function Templates() {
    let navigate = useNavigate()
    const routeChange = (template) => {
        localStorage.setItem('template', JSON.stringify(template))
        localStorage.setItem('textareaValue', '')
        let path = '/editor'
        navigate(path)
    }

    return (
        <section className={styles.main}>
            {Auth.loggedIn() ? (
                <>
                    <h1>Choose a Template</h1>

                    <Row gutter={[0, 16]}>
                        <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={12}
                            xl={12}
                            className={styles.col}
                        >
                            <Card
                                hoverable={true}
                                className={styles.card}
                                onClick={() => routeChange('Simple')}
                            >
                                <h3>Simple</h3>
                                <ul className="">
                                    <li>Basic sections</li>
                                    <li>MD best practices</li>
                                    <li>Easy to maintain</li>
                                </ul>
                            </Card>
                        </Col>
                        <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={12}
                            xl={12}
                            className={styles.col}
                        >
                            <Card
                                hoverable={true}
                                onClick={() => routeChange('Advanced')}
                                className={styles.card}
                            >
                                <h3>Advanced</h3>
                                <ul className="">
                                    <li>Basic sections and badges</li>
                                    <li>Inline HTML</li>
                                    <li>Has a place for everything</li>
                                </ul>
                            </Card>
                        </Col>
                        <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={12}
                            xl={12}
                            className={styles.col}
                        >
                            <Card
                                hoverable={true}
                                onClick={() => routeChange('Empty')}
                                className={styles.card}
                            >
                                <h3>Empty</h3>
                                <ul className="">
                                    <li>Make a ReadMe yourself</li>
                                </ul>
                            </Card>
                        </Col>
                        <Col
                            xs={24}
                            sm={24}
                            md={12}
                            lg={12}
                            xl={12}
                            className={styles.col}
                        >
                            <Card
                                hoverable={true}
                                onClick={() => routeChange('Existing')}
                                className={styles.card}
                            >
                                <h3>Edit Existing</h3>
                                <ul className="">
                                    <li>Edit existing ReadMe file</li>
                                </ul>
                            </Card>
                        </Col>
                    </Row>
                </>
            ) : (
                <h1>Please login to use this feature</h1>
            )}
        </section>
    )
}

export default Templates
