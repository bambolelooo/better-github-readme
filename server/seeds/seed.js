const Template = require('../models/Template')
const connection = require('../config/connection')
const fs = require('fs')
const path = require('path')

const seedTemplate = async (templateName, filePath) => {
    const fileContents = await fs.promises.readFile(filePath, 'utf-8')
    const newTemplate = new Template({
        templateName: templateName,
        templateContent: fileContents,
    })
    await newTemplate.save()
    console.log(`Seed successful for template "${templateName}"!`)
}

connection.once('open', () => {
    console.log('Connected to database!')
    seedTemplate('Advanced', path.join(__dirname, 'Advanced.md')).then(() => {
        seedTemplate('Simple', path.join(__dirname, 'Simple.md')).then(() => {
            process.exit()
        })
    })
})

connection.on('error', (error) => {
    console.log('Error connecting to database:', error.message)
})
