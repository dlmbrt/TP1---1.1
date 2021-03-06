const express = require('express')
const app = express()
const axios = require('axios')
const path = require('path')

app.set('view engine', 'ejs')
app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.urlencoded( {extended: true} ))

app.get('/', (req, res) => {
    res.redirect('/search')
})

app.get('/search', (req, res) => {
    res.render('search.ejs')
})

app.post('/search', (req, res) => {
    let movieArray = []
    let imageArray = []
    let voteAverageArray = []
    let originalLanguageArray = []
    let searchBox = req.body.movie
    let searchBoxValue = req.body.movie.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=cec31c74c7f891dd48edbd521e9c3f88&query=${searchBoxValue}`)
        .then(axiosResults => {
            let cnt = 0
            console.log(axiosResults.data.results)
            axiosResults.data.results.forEach(element => {
                movieArray[cnt] = element
                if (element.poster_path === null) {imageArray[cnt] = '/img/noPreview.svg'} else {
                imageArray[cnt] = `https://image.tmdb.org/t/p/w600_and_h900_bestv2${element.poster_path}`}
                cnt++
            });
            if (axiosResults.data.total_results !== 0) {
                res.render('results.ejs',   { movieList: movieArray, 
                                            imageList: imageArray, 
                                            voteAverageList: voteAverageArray,
                                            originalLanguageList: originalLanguageArray,
                                            searchWords: searchBox,
                                            totalResults: axiosResults.data.total_results
                                            })
            } 
            else if (axiosResults.data.total_results === 0 || searchBoxValue === ''){
                res.render('results.ejs', { totalResults: 0 })
            }
        })
        .catch(error => res.render('results.ejs', { totalResults: 0 }))
})

app.listen(3000)