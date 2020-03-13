const PdfPrinter = require('pdfmake')

const fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Bold.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-BoldItalic.ttf'
    }
}

const express = require('express')
const app = express()

const lines = []
lines.push([
            { 
                text: 'Nome', 
                style: 'header',
             }, 
             'E-mail', 
             'Status'])

for(let i=0; i<300; i++){
    let ativo = 'Active'
    if(i%2==0){
        ativo = { text: 'Inactive', style: 'inativo'}
    }
    lines.push(['Alohas', 'alohas@dev.com', ativo])
}
const printer = new PdfPrinter(fonts)
const docDefinition = {
    content: [
        {
            image: 'images/logo.png',
            fit: [60, 60]
        },
        {text: 'Alohas'},
        {
            table: {
                widths: ['*', '*', 100],
                body: lines
            }
        }
    ],
    styles:{
        header: {
            fontSize: 18,
            bold: true
        },
    inativo: {
        fontSize: 18,
        bold: true
    }
    },
    footer: (page, pages) => {
        return {
            columns: [
                'That document is pdf',
                {
                    alignment: 'right',
                    text: [
                        { text: page.toString(), italics: true},
                        ' de ',
                        { text: pages.toString(), italics: true}
                    ]
                }
            ],
            margin: [40, 0]
        }
    }
}

app.get('/get/:name', (req, res)=> {
    const pdf = printer.createPdfKitDocument({
        content: 'Olá '+ req.params.name
    })
                                    //attachment made download automatically
    res.header('Content-disposition', 'inline; filename=my-pdf.pdf')
    res.header('Content-type', 'application/pdf')
    pdf.pipe(res)
    pdf.end()
})

// const pdf = printer.createPdfKitDocument(docDefinition)
// const fs = require('fs')
// pdf.pipe(fs.createWriteStream('doc.pdf'))
// pdf.end()

app.listen(3000, ()=> {
    console.log('pdf running....')
})
