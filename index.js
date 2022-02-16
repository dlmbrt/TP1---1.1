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
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=cec31c74c7f891dd48edbd521e9c3f88&query=${req.body.movie}`)
        .then(axiosResults => {
            
            let cnt = 0
            axiosResults.data.results.forEach(element => {
                movieArray[cnt] = element
                imageArray[cnt] = `https://image.tmdb.org/t/p/w600_and_h900_bestv2${element.poster_path}`
                cnt++
            });
            // console.log(axiosResults.data.total_results)
            // console.log(req.body.movie)
            if (axiosResults.data.total_results !== 0) {
                res.render('results.ejs',   { movieList: movieArray, 
                                            imageList: imageArray, 
                                            searchWords: req.body.movie,
                                            totalResults: axiosResults.data.total_results
                                            })
            } 
            else if (axiosResults.data.total_results === 0 || req.body.movie === ''){
                res.render('results.ejs', { totalResults: 0 })
            }
        })
        .catch(error => res.render('results.ejs', { totalResults: 0 }))
})


app.listen(3000)